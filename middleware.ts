import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

  const auth = req.cookies.get("admin_auth")?.value;
  if (auth === ADMIN_PASSWORD) return NextResponse.next();

  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
