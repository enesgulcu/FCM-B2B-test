import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export default withAuth(async function middleware(req) {
  // Kullanıcının bilgisi alınır.
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Sayfanın URL'ini alıyoruz, ve izin verdiğimiz path ile eşleşip eşleşmediğini kontrol ediyoruz.
  const currentPath = req.nextUrl.pathname;

  // NextAuth API isteklerini hariç tutmak için kontrol ediyoruz.
  if (
    currentPath.startsWith("/api/auth") ||
    currentPath.startsWith("/api/reset-password")
  ) {
    return NextResponse.next(); // İşlemi geçmesine izin veriyoruz.
  }
  if (
    session &&
    session.email === "caliskanariyayinlari@gmail.com" &&
    currentPath.startsWith("/customer-orders-admin")
  ) {
    return NextResponse.next();
  }
  if (
    session.email !== "caliskanariyayinlari@gmail.com" &&
    currentPath.startsWith("/customer-orders-admin")
  ) {
    return NextResponse.redirect(`http://localhost:3000/`);
  }

  if (!session) {
    // Kullanıcının giriş yapıp yapmadığını kontrol ediyoruz.
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login`);
  }
});

//https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
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
