import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED_PREFIXES = [
  "/applicant",
  "/application-admin",
  "/super-admin",
  "/vehicle",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (!isProtected) {
    return NextResponse.next();
  }
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );
  return response;
}

export const config = {
  matcher: [
    "/applicant/:path*",
    "/application-admin/:path*",
    "/super-admin/:path*",
    "/vehicle/:path*",
  ],
};
