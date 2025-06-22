import { withAuth } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import Community from "../../../models/Community";
import { NextResponse } from "next/server";

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withAuth(async function handler(
  req: CustomRequest
): Promise<void> {
  if (req.method !== "GET") {
    NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    return;
  }

  try {
    await connectDB();
    const userId = req.user!.id;
    const communities = await Community.find({
      $or: [
        { type: "public" },
        { members: userId },
        { "joinRequests.userId": userId },
      ],
    });
    NextResponse.json({ communities });
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
