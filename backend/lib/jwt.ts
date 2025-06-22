// lib / jwt.ts;
import jwt from "jsonwebtoken";

interface JWTPayload {
  id: string;
  role: string;
}

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";

export function generateJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyJWT(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
