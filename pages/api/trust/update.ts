import { withRole } from "../../../backend/middleware/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import TrustHistory from "../../../models/TrustHistory";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface UpdateRequestBody {
  userId: string;
  contributionStatus: "approved" | "rejected";
  feedback: {
    quality: number;
    compliance: number;
    reason?: string;
  };
}

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withRole(
  ["maintainer", "admin"],
  async function handler(req: CustomRequest): Promise<void> {
    if (req.method !== "POST") {
      NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      return;
    }

    try {
      await connectDB();
      const body = (await req.json()) as UpdateRequestBody;
      const { userId, contributionStatus, feedback } = body;

      if (!["approved", "rejected"].includes(contributionStatus)) {
        NextResponse.json(
          { error: "Invalid contribution status" },
          { status: 400 }
        );
        return;
      }

      const transaction = await submitToSawtooth({
        action: "update_trust",
        userId,
        status: contributionStatus,
        feedback,
      });

      const newScore = (transaction as { newScore: number }).newScore;
      await User.updateOne({ id: userId }, { trustScore: newScore });

      const trustHistory = new TrustHistory({
        user: userId,
        score: newScore,
        reason: `Contribution ${contributionStatus}: ${feedback.reason || ""}`,
      });
      await trustHistory.save();

      NextResponse.json({ trustScore: newScore, transaction });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
