import { withAuth } from "../../../middleware/auth";
import { generateJWT } from "../../../lib/jwt";
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
    const token = generateJWT({ id: req.user!.id, role: req.user!.role });
    NextResponse.json({ token });
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
