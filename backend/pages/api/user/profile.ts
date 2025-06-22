// pages / api / user / profile.ts;
import { withAuth } from "../../../middleware/auth";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ProfileRequestBody {
  githubHandle?: string;
  contactInfo?: string;
  role?: "user" | "admin" | "maintainer";
}

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export default withAuth(async function handler(
  req: CustomRequest
): Promise<void> {
  try {
    await connectDB();
    const userId = req.user!.id;

    if (req.method === "GET") {
      const user = await User.findById(userId).select("-password");
      NextResponse.json({ user });
    } else if (req.method === "PUT") {
      const body = (await req.json()) as ProfileRequestBody;
      const { githubHandle, contactInfo, role } = body;
      const updateData: Partial<ProfileRequestBody> = {
        githubHandle,
        contactInfo,
      };
      if (role && req.user!.role === "admin") {
        await clerkClient.users.updateUser(userId, {
          publicMetadata: { role },
        });
        updateData.role = role;
      }
      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");
      NextResponse.json({ user });
    } else {
      NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
