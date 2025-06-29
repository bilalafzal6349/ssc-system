// middleware/auth.ts
import { NextResponse } from "next/server";
import { NextMiddleware } from "next/server";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function withAuth(
  handler: (req: CustomRequest, res: NextResponse) => Promise<void>
): NextMiddleware {
  return async (req) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role: string;
      };
      (req as CustomRequest).user = { id: payload.id, role: payload.role };
      return handler(req as CustomRequest, new NextResponse());
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}

export function withRole(
  roles: string[],
  handler: (req: CustomRequest, res: NextResponse) => Promise<void>
): NextMiddleware {
  return async (req) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role: string;
      };
      if (!roles.includes(payload.role)) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }
      (req as CustomRequest).user = { id: payload.id, role: payload.role };
      return handler(req as CustomRequest, new NextResponse());
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
