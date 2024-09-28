import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@/providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";
import { ToastContainer } from "react-toastify";
// import { SpeedInsights } from "@vercel/speed-insights/next"
// import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Çalışkan Arı Bayi Portalı",
  description: "Online Sipariş Sistemi",
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* SessionProvider ile sarmallarız ki tüm route lara erişebilelim diye / yukarıda "use client" tanımlamayı unutma! */}
        <Providers session={session}>
          {/* <Navbar links={links}/> */}
          {/* <SpeedInsights />
          <Analytics /> */}
          <div className="bg-white">
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="bg-white rounded-3xl shadow-lg p-8 max-w-lg text-center transform transition hover:scale-105 duration-300 ease-in-out">
                <div className="mb-6">
                  <svg
                    className="w-20 h-20 mx-auto text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m2 0h1v4m-1 0h1m4-5H7m4 0v2m0 0v2m0-2H7m5 0h5"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">
                  BAKIM SÜRECİNDEDİR
                </h2>
                <p className="text-gray-600 mb-6">
                  Panelimiz şuan bakıma girmiştir. En kısa sürede tekrar
                  hizmetinizde olacağız. Anlayışınız için teşekkür ederiz.
                </p>
              </div>
            </div>
          </div>
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
