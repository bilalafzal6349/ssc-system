// middleware/auth.ts
import { authMiddleware, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { NextMiddleware } from "next/server";

interface CustomRequest extends Request {
  user?: { id: string; role: string };
}

export function withAuth(
  handler: (req: CustomRequest, res: NextResponse) => Promise<void>
): NextMiddleware {
  return authMiddleware({
    async afterAuth(auth, req) {
      if (!auth.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await clerkClient.users.getUser(auth.userId);
      (req as CustomRequest).user = {
        id: auth.userId,
        role: (user.publicMetadata.role as string) || "user",
      };

      return handler(req as CustomRequest, new NextResponse());
    },
  });
}

export function withRole(
  roles: string[],
  handler: (req: CustomRequest, res: NextResponse) => Promise<void>
): NextMiddleware {
  return authMiddleware({
    async afterAuth(auth, req) {
      if (!auth.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await clerkClient.users.getUser(auth.userId);
      const role = (user.publicMetadata.role as string) || "user";
      if (!roles.includes(role)) {
        return NextResponse.json(
          { error: "Insufficient permissions" },
          { status: 403 }
        );
      }

      (req as CustomRequest).user = { id: auth.userId, role };
      return handler(req as CustomRequest, new NextResponse());
    },
  });
}
