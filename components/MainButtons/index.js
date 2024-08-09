"use client";
import React, { useState } from "react";
import headerStore from "@/utils/headerStore";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import SearchPanel from "../SearchPanel";
import { RiShoppingBasketFill } from "react-icons/ri";
import useCartItemCount from "@/utils/useCartItemCount";
import { CiShop } from "react-icons/ci";

function MainButtonsComponent() {
  const { header } = headerStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemCount = useCartItemCount();

  //search butonuna tıklama
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  return (
    <div className="w-full px-8 relative">
      <div id="altmenu">
        <div className=" flex flex-row items-center justify-center">
          <div className="flex-row flex pt-4 text-CustomGray items-center justify-center ">
            <Link
              className="flex flex-col items-center justify-center group"
              href={"/shop"}
            >
              <span className="w-[60px] h-[60px] flex items-center justify-center group-hover:scale-105 group-hover:text-LightBlue transition-all duration-1000 ease-in-out transform">
                <CiShop className="w-[40px] h-[40px]" />
              </span>
              <span className="uppercase text-[12px] font-bold tracking-[1px] pb-[15px] hover:text-LightBlue transition-all duration-500 ease-in-out transform">
                MAĞAZA
              </span>
            </Link>
          </div>

          <div className="flex flex-row items-center text-center justify-center text-CustomGray absolute right-12 bottom-6">
            {header.mainMenuButtons.map((mainMenuButtons) => (
              <div
                key={mainMenuButtons.id}
                className="flex flex-row items-center"
              >
                <button className="relative" onClick={toggleSearchPanel}>
                  <FaSearch className="w-[20px] h-[20px] hover:text-LightBlue hover:scale-110 transition-all duration-700 ease-in-out transform mr-2 sm:mr-[36px]" />
                </button>
                {isSearchOpen && (
                  <div className="absolute top-10 rounded-xl  right-0 md:right-0 z-[1000]	bg-white">
                    <SearchPanel toggleSearchPanel={toggleSearchPanel} />
                  </div>
                )}
                <Link
                  className="flex flex-col items-center justify-center  hover:text-LightBlue hover:scale-110 transition-all duration-700 ease-in-out transform relative"
                  href="/cart"
                >
                  <span>
                    <RiShoppingBasketFill
                      style={{ width: "25px", height: "25px" }}
                    />
                  </span>
                  {cartItemCount > 0 && (
                    <div className="absolute -top-3 -right-4 bg-[#ff5b4b] rounded-full px-[5px]  flex items-center justify-center">
                      <span className="text-white font-extrabold text-[16px] w-[14px] h-[24px]">
                        {cartItemCount}
                      </span>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainButtonsComponent;
