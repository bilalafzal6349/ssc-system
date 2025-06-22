import { withRole } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import Contribution from "../../../models/Contribution";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface ValidateRequestBody {
  contributionId: string;
  status: "approved" | "rejected";
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
      const body = (await req.json()) as ValidateRequestBody;
      const { contributionId, status, feedback } = body;
      const contribution = await Contribution.findById(contributionId).populate(
        "user"
      );

      if (!contribution) {
        NextResponse.json({ error: "Contribution not found" }, { status: 404 });
        return;
      }

      contribution.status = status;
      contribution.feedback = feedback;
      await contribution.save();

      const transaction = await submitToSawtooth({
        action: "update_trust",
        userId: contribution.user._id,
        status,
        feedback,
      });

      NextResponse.json({ contribution, transaction });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
