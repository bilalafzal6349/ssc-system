// pages / api / alert / flag.ts;
import { withRole } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import Contribution from "../../../models/Contribution";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface FlagRequestBody {
  contributionId: string;
  reason: string;
}

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withRole(
  ["maintainer"],
  async function handler(req: CustomRequest): Promise<void> {
    if (req.method !== "POST") {
      NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      return;
    }

    try {
      await connectDB();
      const body = (await req.json()) as FlagRequestBody;
      const { contributionId, reason } = body;
      const contribution = await Contribution.findById(contributionId);

      if (!contribution) {
        NextResponse.json({ error: "Contribution not found" }, { status: 404 });
        return;
      }

      contribution.flags = contribution.flags || [];
      contribution.flags.push({ reason, flaggedBy: req.user!.id });
      await contribution.save();

      const transaction = await submitToSawtooth({
        action: "flag_contribution",
        contributionId,
        reason,
        flaggedBy: req.user!.id,
      });

      NextResponse.json({ contribution, transaction });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
