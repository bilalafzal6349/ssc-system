// pages / api / alert / vote.ts;
import { withRole } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface VoteRequestBody {
  userId: string;
  vote: "approve" | "reject";
  reason: string;
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
      const body = (await req.json()) as VoteRequestBody;
      const { userId, vote, reason } = body;

      if (!["approve", "reject"].includes(vote)) {
        NextResponse.json({ error: "Invalid vote" }, { status: 400 });
        return;
      }

      const user = await User.findById(userId);
      user.votes = user.votes || [];
      user.votes.push({ vote, reason, voter: req.user!.id });
      await user.save();

      const transaction = await submitToSawtooth({
        action: "vote_malicious",
        userId,
        vote,
        voter: req.user!.id,
      });

      NextResponse.json({ user, transaction });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
