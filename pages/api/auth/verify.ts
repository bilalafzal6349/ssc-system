import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.token;
  if (!token) return res.status(200).json({ user: null });
  try {
    await connectDB();
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    const user = await User.findOne({ id: payload.id, role: payload.role });
    if (!user) return res.status(200).json({ user: null });
    return res.status(200).json({ user: { email: user.id, role: user.role } });
  } catch {
    return res.status(200).json({ user: null });
  }
}
