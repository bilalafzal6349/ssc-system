import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { isValidRole } from "../../../lib/roles";

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
    if (payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
    await connectDB();
    const body = await req.json();
    const { userId, role } = body;
    if (!isValidRole(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    const user = await User.findOneAndUpdate(
      { id: userId },
      { role },
      { new: true }
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      message: "Role updated successfully",
      userId,
      role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
