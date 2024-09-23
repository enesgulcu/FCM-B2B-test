import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default withAuth(async function middleware(req) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const currentPath = req.nextUrl.pathname;

  // Geliştirme ortamı için HTTP, üretim için HTTPS kullan
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = req.headers.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;

  // NextAuth API isteklerini hariç tutmak için kontrol
  if (
    currentPath.startsWith("/api/auth") ||
    currentPath.startsWith("/api/reset-password")
  ) {
    return NextResponse.next();
  }

  if (!session) {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  // Admin ve employee rolleri için "/customer-orders-admin" erişimi
  if (
    (session.role === "admin" || session.role === "employee") &&
    currentPath.startsWith("/customer-orders-admin")
  ) {
    return NextResponse.next();
  }

  // Employee rolü için özel yönlendirmeler
  if (session.role === "employee") {
    if (!currentPath.startsWith("/customer-orders-admin")) {
      // Employee'nin gitmemesi gereken routelar için kontrol
      if (
        currentPath === "/" ||
        currentPath.startsWith("/cart") ||
        currentPath.startsWith("/shop") ||
        currentPath.startsWith("/billings")
      ) {
        return NextResponse.redirect(`${baseUrl}/customer-orders-admin`);
      }
    }
    return NextResponse.next();
  }

  // Partner rolü için "/customer-orders-admin" erişim engeli
  if (
    session.role === "partner" &&
    currentPath.startsWith("/customer-orders-admin")
  ) {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  // Diğer durumlar için normal akışa devam et
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/cart/:path*",
    "/shop/:path*",
    "/urun-kategori/:path*",
    "/billings/:path*",
    "/customer-orders/:path*",
    "/customer-orders-admin/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/api/:path*",
  ],
};
