// pages / api / penalty / apply.ts;
import { withRole } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import TrustHistory from "../../../models/TrustHistory";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface PenaltyRequestBody {
  userId: string;
  penalty: number;
  reason: string;
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
      const body = (await req.json()) as PenaltyRequestBody;
      const { userId, penalty, reason } = body;

      if (penalty < 0 || penalty > 1) {
        NextResponse.json({ error: "Invalid penalty value" }, { status: 400 });
        return;
      }

      const user = await User.findById(userId);
      const newTrustScore = Math.max(0, user.trustScore - penalty);
      await User.updateOne({ _id: userId }, { trustScore: newTrustScore });

      const trustHistory = new TrustHistory({
        user: userId,
        score: newTrustScore,
        reason: `Penalty: ${reason}`,
      });
      await trustHistory.save();

      const transaction = await submitToSawtooth({
        action: "apply_penalty",
        userId,
        penalty,
        trustScore: newTrustScore,
      });

      NextResponse.json({ trustScore: newTrustScore, transaction });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
