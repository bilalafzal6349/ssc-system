// pages / api / trust / view.ts;
import { withAuth } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import TrustHistory from "../../../models/TrustHistory";
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
    const user = await User.findById(userId).select("trustScore");
    const history = await TrustHistory.find({ user: userId }).sort({
      createdAt: -1,
    });
    NextResponse.json({ trustScore: user.trustScore, history });
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
