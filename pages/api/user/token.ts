import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(req: Request) {
  try {
    const token = req.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("token="))
      ?.split("=")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    if (req.method !== "GET") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
    // Issue a new JWT for the user
    const newToken = jwt.sign(
      { id: payload.id, role: payload.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return NextResponse.json({ token: newToken });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
