import { withAuth } from "../../../middleware/auth";
import { NextResponse } from "next/server";

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withAuth(async function handler(
  req: CustomRequest
): Promise<void> {
  try {
    NextResponse.json({ valid: true, user: req.user });
  } catch {
    NextResponse.json(
      { valid: false, error: "Invalid session" },
      { status: 401 }
    );
  }
});
