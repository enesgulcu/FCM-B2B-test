"use client";
import React from "react";
import useBannerStore from "@/utils/bannerStore";
import Link from "next/link";

function Banner() {
  const { content, isBannerVisible, hideBanner, buttonText, buttonLink } =
    useBannerStore();

  if (!isBannerVisible) return null; // Banner görünür değilse null döndür

  return (
    <div className="w-full bg-LightBlue text-white py-[10px] px-[15px] flex items-center justify-center shadow-[0_5px_20px_rgba(0,0,0,0.3)] z-10 fixed bottom-0">
      <div className="flex flex-row items-center justify-center gap-4 ">
        <p className="text-[15px] font-bold">
          {content}
          {buttonText ? (
            <Link className=" text-[15px] font-bold" href={buttonLink}>
              <button>{buttonText}</button>
            </Link>
          ) : null}
          <button
            className="text-LightBlue bg-white rounded-md py-[3px] px-[12px] ml-[10px] text-[14px] hover:bg-CustomGray hover:text-white transition duration-300 ease-in-out transform font-bold"
            onClick={hideBanner}
          >
            Kapat
          </button>
        </p>
      </div>
    </div>
  );
}

export default Banner;
