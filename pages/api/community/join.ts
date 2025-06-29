import { withAuth } from "../../../backend/middleware/auth";
import { connectDB } from "../../../lib/db";
import Community from "../../../models/Community";
import User from "../../../models/User";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface JoinRequestBody {
  communityId: string;
  credentials?: {
    preTrust: number;
    legalAgreements: number;
    communityType: number;
    capabilities: number;
  };
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
    const body = (await req.json()) as JoinRequestBody;
    const { communityId, credentials } = body;
    const userId = req.user!.id;
    const community = await Community.findById(communityId);

    if (!community) {
      NextResponse.json({ error: "Community not found" }, { status: 404 });
      return;
    }

    if (community.type === "public") {
      const transaction = await submitToSawtooth({
        action: "join_community",
        userId,
        communityId,
        trust: 0,
      });
      await User.updateOne(
        { _id: userId },
        { $push: { communities: communityId } }
      );
      await Community.updateOne(
        { _id: communityId },
        { $push: { members: userId } }
      );
      NextResponse.json({ message: "Joined public community", transaction });
    } else {
      await Community.updateOne(
        { _id: communityId },
        { $push: { joinRequests: { userId, credentials } } }
      );
      NextResponse.json({ message: "Join request submitted for approval" });
    }
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
