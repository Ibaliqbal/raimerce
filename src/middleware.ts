import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({
    secret: process.env.AUTH_SECRET,
    req,
  });

  if (token) {
    if (["/signin", "/signup"].includes(pathname))
      return NextResponse.redirect(new URL("/", req.url));

    if (token.role === "member" && pathname.startsWith("/admin")) {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }

    if (
      token.role === "admin" &&
      (pathname.startsWith("/my") || pathname === "/settings")
    ) {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  } else {
    if (
      ["/settings", "/my", "/admin"].some((route) => pathname.startsWith(route))
    ) {
      const url = new URL("/signin", req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    if (["/signin", "/signup"].includes(pathname)) return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // "/settings",
    // "/my/:path*",
    // "/signin",
    // "/signup",
    // "/admin/:path*",
  ],
};
