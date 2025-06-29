import { withRole } from "../../../backend/middleware/auth";
import { fetchSawtoothLogs } from "../../../lib/sawtooth";
import { NextResponse } from "next/server";

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withRole(
  ["admin"],
  async function handler(req: CustomRequest): Promise<void> {
    if (req.method !== "GET") {
      NextResponse.json({ error: "Method not allowed" }, { status: 405 });
      return;
    }

    try {
      const logs = await fetchSawtoothLogs();
      NextResponse.json({ logs: logs as unknown[] });
    } catch (error) {
      NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
);
