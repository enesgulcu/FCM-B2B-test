import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const currentPath = req.nextUrl.pathname;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  if (!session) {
    return NextResponse.redirect(`${baseUrl}/auth/login`);
  }

  if (
    session.role === "Admin" &&
    currentPath.startsWith("/customer-orders-admin")
  ) {
    return NextResponse.next();
  }

  if (
    session.role === "partner" &&
    currentPath.startsWith("/customer-orders-admin")
  ) {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  return NextResponse.next();
});

// ✅ Sadece shipping, auth ve reset-password dışlanır, diğer her şey korunur
export const config = {
  // auth/forgot-password sayfasını ve login'i koruma dışına al
  matcher: [
    "/((?!api/shipping|api/auth|api/reset-password|auth/login|auth/forgot-password).*)",
  ],
};
