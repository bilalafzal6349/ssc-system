import { withAuth } from "../../../backend/middleware/auth";
import { connectDB } from "../../../lib/db";
import Contribution from "../../../models/Contribution";
import User from "../../../models/User";
import { submitMergeRequest } from "../../../lib/gitlab";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface ContributionRequestBody {
  repositoryId: string;
  code: string;
  description: string;
}

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withAuth(async function handler(
  req: CustomRequest
): Promise<void> {
  if (req.method !== "POST") {
    NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    return;
  }

  try {
    await connectDB();
    const body = (await req.json()) as ContributionRequestBody;
    const { repositoryId, code, description } = body;
    const userId = req.user!.id;

    const user = await User.findById(userId);
    const trustScore = user.trustScore || 0;
    if (trustScore < 0.5) {
      NextResponse.json(
        { error: "Insufficient trust score for contribution" },
        { status: 403 }
      );
      return;
    }

    const mergeRequest = await submitMergeRequest(
      repositoryId,
      code,
      description,
      userId
    );
    const contribution = new Contribution({
      user: userId,
      repository: repositoryId,
      mergeRequestId: mergeRequest.id,
      status: "pending",
      description,
    });
    await contribution.save();

    const transaction = await submitToSawtooth({
      action: "submit_contribution",
      contributionId: contribution._id,
      userId,
      repositoryId,
    });

    NextResponse.json({ contribution, transaction });
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
