import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { isMaintenanceModeEnabled } from "@/lib/maintenanceMode";

export default async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const currentPath = req.nextUrl.pathname;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  if (isMaintenanceModeEnabled() && currentPath !== "/maintenance") {
    return NextResponse.redirect(`${baseUrl}/maintenance`);
  }

  if (
    currentPath === "/maintenance" ||
    currentPath === "/auth/login" ||
    currentPath === "/auth/forgot-password"
  ) {
    return NextResponse.next();
  }

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
}

// ✅ Sadece shipping, auth ve reset-password dışlanır, diğer her şey korunur
export const config = {
  // auth/forgot-password sayfasını ve login'i koruma dışına al
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/shipping|api/auth|api/reset-password).*)",
  ],
};
