import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function middleware(req: NextRequest) {
  // Allow public routes
  const publicRoutes = [
    "/",
    "/api/public",
    "/sign-in",
    "/sign-up",
    "/api/auth/signin",
    "/api/auth/signup",
  ];
  console.log("Requested path:", req.nextUrl.pathname);
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
