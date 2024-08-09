"use client";
import React, { useState, useEffect } from "react";
import headerStore from "@/utils/headerStore";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../MobileMenu";
import FixedHeader from "../FixedHeader";
import { FaSearch } from "react-icons/fa";
import SearchPanel from "../SearchPanel";
import { RiShoppingBasketFill } from "react-icons/ri";
import useCartItemCount from "@/utils/useCartItemCount";
import { CiShop } from "react-icons/ci";
import { MdLogout } from "react-icons/md";

const NavbarHeader = () => {
  const { header } = headerStore();
  const [hoveredMenu, setHoveredMenu] = useState(null); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);  
  const cartItemCount = useCartItemCount();
  // const [hoveredMainMenu, setHoveredMainMenu] = useState(null);
  // const [hoveredIcon, setHoveredIcon] = useState(null);
  // const [hoveredSubMenu, setHoveredSubMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const menuItem = [
    {
        title:"Ürünler",
        link:"/products"
    },
    {
        title:"Siparişler",
        link:"/orders"
    },
    {
        title:"Müşteri Siparişleri",
        link:"/customer-orders"
    }
  ]


  return (
    <div>
      <div className="hidden lg:flex items-center justify-between  ">
        <div
          id="ustmenu"
          className="h-[45px] bg-DarkBlue flex justify-around items-center  w-full"
        >
        <div>logo</div>
          <div className="px-[15px] mx-[35px] text-white ">
            <div >
              <ul className="flex justify-center text-[14px] font-semibold ">
                {menuItem.map((menu, index) => (
                  <li
                    key={menu.id}
                    className="relative mr-[25px] leading-[45px] "
                    onMouseEnter={() => setHoveredMenu(index)}
                    onMouseLeave={() => setHoveredMenu(null)}
                  >
                    <Link
                      className="hover:text-LightBlue transition duration-300 ease-in-out transform"
                      href={menu.link}
                    >
                      {menu.title}
                    </Link>
                    
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
                  <div className="w-8 flex items-center space-x-3">
                    <Image src="/assets/images/avatarIcon.svg" width={50} height={50} alt="avatar" />
                    <div className="text-sm text-white flex flex-col">
                      <span className="whitespace-nowrap"> Emrah Eskibağcı</span>
                      <span className="text-xs">(user)</span>
                    </div>
                    <div className="text-white hover:text-red-500 text-2xl">
                      <MdLogout className="cursor-pointer"/>
                    </div>
                  </div>
          </div>
        </div>
      </div>

    
    
    </div>
  );
};

export default NavbarHeader;
