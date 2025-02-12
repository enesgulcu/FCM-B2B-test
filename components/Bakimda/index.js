"use client";
import { useState, useEffect } from "react";
import useFooterStore from "@/utils/footerStore"; // Assuming it's a hook
import Image from "next/image";
function Bakimda() {
    const { footerLogo } = useFooterStore();

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-650 to-purple-900 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 animate-ping bg-red-500 rounded-full opacity-75"></div>
              <div className="relative text-white rounded-full w-20 h-20 flex items-center justify-center">
                <div className="rounded-full  w-24 h-24 flex items-center justify-center transition duration-500 ease-in-out transform hover:scale-110">
                              <Image
                                src={footerLogo[0].logosrc}
                                width={100}
                                height={100}
                                alt="Çalışkan Arı Mağaza"
                              />
                            </div>
              </div>
            </div>
            <a
              href="https://www.caliskanari.com.tr"
              className="inline-block text-red-600 font-semibold underline hover:text-red-800 transition-colors"
            >
              www.caliskanari.com.tr
            </a>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">B2B Bakımda!</h2>
            <p className="text-lg text-gray-600">
              Web sitemiz şu anda yenileniyor. Size daha iyi bir deneyim sunmak için
              çalışıyoruz.
            </p>
            <div className="mt-8">
              <p className="text-sm text-gray-500">
                Lütfen daha sonra tekrar ziyaret edin. 
              </p>
              <p className="text-sm text-gray-500">Anlayışınız için teşekkür ederiz.</p>
            </div>
          </div>
        </div>
      );
}

export default Bakimda;