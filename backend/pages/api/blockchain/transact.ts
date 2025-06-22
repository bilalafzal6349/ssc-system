// pages / api / blockchain / transact.ts;
import { withAuth } from "../../../middleware/auth";
import { submitToSawtooth } from "../../../lib/sawtooth";
import { encryptPayload } from "../../../lib/crypto";
import { NextResponse } from "next/server";

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
    const payload = await req.json();
    const encryptedPayload = encryptPayload(payload);
    const transaction = await submitToSawtooth(encryptedPayload);
    NextResponse.json({ transaction });
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
