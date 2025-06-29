import { withAuth } from "../../../backend/middleware/auth";
import { connectDB } from "../../../lib/db";
import Contribution from "../../../models/Contribution";
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
    const url = new URL(req.url);
    const contributionId = url.searchParams.get("contributionId");
    if (!contributionId) {
      NextResponse.json({ error: "Contribution ID required" }, { status: 400 });
      return;
    }
    const contribution = await Contribution.findById(contributionId);
    if (!contribution) {
      NextResponse.json({ error: "Contribution not found" }, { status: 404 });
      return;
    }
    NextResponse.json({ contribution });
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
