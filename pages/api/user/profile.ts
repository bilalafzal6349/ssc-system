// pages / api / user / profile.ts;
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface ProfileRequestBody {
  githubHandle?: string;
  contactInfo?: string;
  role?: "user" | "admin" | "maintainer";
}

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
    await connectDB();
    const userId = payload.id;
    if (req.method === "GET") {
      const user = await User.findOne({ id: userId }).select("-password");
      return NextResponse.json({ user });
    } else if (req.method === "PUT") {
      const body = (await req.json()) as ProfileRequestBody;
      const { githubHandle, contactInfo, role } = body;
      const updateData: Partial<ProfileRequestBody> = {
        githubHandle,
        contactInfo,
      };
      if (role && payload.role === "admin") {
        updateData.role = role;
      }
      const user = await User.findOneAndUpdate({ id: userId }, updateData, {
        new: true,
      }).select("-password");
      return NextResponse.json({ user });
    } else {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
