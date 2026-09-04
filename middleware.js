import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { isMaintenanceModeEnabled } from "@/lib/maintenanceMode";

export default async function middleware(req) {
  const currentPath = req.nextUrl.pathname;

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  const maintenanceOn = isMaintenanceModeEnabled();

  if (maintenanceOn && currentPath !== "/maintenance") {
    return NextResponse.redirect(`${baseUrl}/maintenance`);
  }

  // Mode kapalıysa /maintenance'ta kalma — ana sayfaya dön
  if (!maintenanceOn && currentPath === "/maintenance") {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  if (
    currentPath === "/maintenance" ||
    currentPath === "/auth/login" ||
    currentPath === "/auth/forgot-password"
  ) {
    return NextResponse.next();
  }

  // Production/HTTPS'te cookie __Secure- prefix kullanır.
  // NEXTAUTH_URL yanlış (http/localhost) olsa bile isteğin kendisine göre çöz.
  const isSecure =
    process.env.VERCEL === "1" ||
    process.env.NODE_ENV === "production" ||
    req.nextUrl.protocol === "https:";

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });

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

export const config = {
  matcher: [
    /*
     * Auth gerektiren sayfalar. Statik dosyalar, uploads, data.json ve
     * auth API'leri hariç — aksi halde mağaza görselleri/login cookie kırılır.
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads/|data\\.json|api/shipping|api/auth|api/reset-password|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
