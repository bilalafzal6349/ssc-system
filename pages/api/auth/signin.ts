import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    await connectDB();
    let user;
    if (email === "admin@demo.com") {
      user = await User.findOne({ id: email });
    } else {
      if (!role) {
        return res
          .status(400)
          .json({ error: "Role is required for non-admin users" });
      }
      const hashed = await bcrypt.hash(password, 10);
      user = await User.create({ id: email, password: hashed, role });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials or role" });
    }
    if (!user.password) {
      return res.status(401).json({ error: "Invalid credentials or role" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });
    res.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; Max-Age=604800`
    );
    return res
      .status(200)
      .json({ user: { email: user.id, role: user.role }, token });
  } catch (error) {
    console.error("Sign-in error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
