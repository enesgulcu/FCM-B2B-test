"use client";
import useFooterStore from "@/utils/footerStore"; // Assuming it's a hook
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { AiOutlinePhone } from "react-icons/ai";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { usePathname } from "next/navigation";

function Footer() {
  const { footerLogo } = useFooterStore();
  const currentUrl = usePathname()
  return (
    <footer id="footer" className={`bg-CustomGray max-w-screen w-full`}>
      <div className="container mx-auto px-4 md:py-10 py-5 text-gray-300 ">
        <div className={`flex flex-col md:flex-row  gap-10 md:justify-evenly justify-center items-center`}>
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-CustomGray w-24 h-24 flex items-center justify-center hover:bg-LightBlue transition duration-500 ease-in-out transform hover:scale-110">
              <Image
                src={footerLogo[0].logosrc}
                width={70}
                height={70}
                alt="Çalışkan Arı Mağaza"
              />
            </div>
            {/* İsim */}
            <div className="text-center mt-2">
              <div className="text-lg font-medium">Çalışkan Arı Yayınları</div>
            </div>
          </div>
          {/* Sayfalar */}
          <div className="flex flex-col items-center md:items-start gap-2 mb-4 md:mb-0">
            <Link
              className="hover:text-LightBlue/75 hover:underline underline-offset-3 transition-all duration-75"
              href="/"
            >
              Ana sayfa
            </Link>
            <Link
              className="hover:text-LightBlue/75 hover:underline underline-offset-3 transition-all duration-75"
              href="/shop"
            >
              Mağaza
            </Link>
          </div>
          {/* Sosyal Medya */}
          <div className="flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
            <div className="flex items-center gap-x-2 hover:text-green-600 transition-all duration-75">
              <AiOutlinePhone className="w-6 h-6" />
              <a
                className="hover:text-LightBlue/75 transition-all duration-75"
                href="tel:+902126393912"
              >
                (0212) 639 39 12
              </a>
            </div>
            <div className="flex items-center gap-x-2 hover:text-green-500 transition-all duration-75">
              <FaWhatsapp className="w-6 h-6" />
              <a
                className="hover:text-LightBlue/75 transition-all duration-75"
                href="https://wa.me/+905550013912"
              >
                Whatsapp
              </a>
            </div>
            <div className="flex items-center gap-x-2 hover:text-pink-500 transition-all duration-75">
              <FaInstagram className="w-6 h-6" />
              <a
                className="hover:text-LightBlue/75 transition-all duration-75"
                href="https://www.instagram.com/caliskanariyayincilik?igsh=MXFzODRzeDlnY3R2bg=="
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        {/* Adres */}
        <div className="justify-center items-center border-t border-gray-700 mt-8 pt-5 hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.955757648957!2d28.798848983261117!3d41.00434154581372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa3f696d37023%3A0x696073342d19d92e!2zw4dBTEnFnktBTiBBUsSwIFlBWUlOTEFSSQ!5e0!3m2!1str!2str!4v1723046034048!5m2!1str!2str"
            className="w-full md:w-3/5 lg:w-2/3 h-80 rounded-lg"
            style={{ border: "0" }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        {/* Not */}
        <div className="flex justify-center items-center text-center  mt-8 text-gray-400">
          Bu panel yalnızca Çalışkan Arı ve anlaşmalı olduğu bayiler tarafından
          kullanılmaktadır.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
