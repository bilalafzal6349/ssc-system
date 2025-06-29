// Fix for missing bcrypt types
declare module "bcrypt";

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
  if (req.method !== "POST") return res.status(405).end();
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }
  await connectDB();
  const existing = await User.findOne({ id: email });
  if (existing) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ id: email, password: hashed, role });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=604800`
  );
  return res
    .status(201)
    .json({ user: { email: user.id, role: user.role }, token });
}
