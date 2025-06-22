import { withRole } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import TrustHistory from "../../../models/TrustHistory";
import { calculateInitialTrust } from "../../../lib/trust";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface InitializeRequestBody {
  userId: string;
  preTrust: number;
  legalAgreements: number;
  communityType: number;
  capabilities: number;
}

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withRole(
  ["admin"],
  async function handler(req: CustomRequest): Promise<void> {
    if (req.method !== "POST") {
      NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      return;
    }

    try {
      await connectDB();
      const body = (await req.json()) as InitializeRequestBody;
      const { userId, preTrust, legalAgreements, communityType, capabilities } =
        body;

      if (
        [preTrust, legalAgreements, communityType, capabilities].some(
          (v) => v < 0 || v > 1
        )
      ) {
        NextResponse.json({ error: "Invalid input values" }, { status: 400 });
        return;
      }

      const trustScore = calculateInitialTrust({
        Tpi: preTrust,
        Tai: legalAgreements,
        Tci: communityType,
        Ci: capabilities,
        beta: 0.05,
      });

      await User.updateOne({ _id: userId }, { trustScore });

      const trustHistory = new TrustHistory({
        user: userId,
        score: trustScore,
        reason: "Initial trust score",
      });
      await trustHistory.save();

      const transaction = await submitToSawtooth({
        action: "initialize_trust",
        userId,
        trustScore,
      });

      NextResponse.json({ trustScore, transaction });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
