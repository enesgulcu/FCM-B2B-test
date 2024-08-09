"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { CiShop } from "react-icons/ci";
import Image from "next/image";

const MobileMenu = ({ header, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedMainMenu, setSelectedMainMenu] = useState(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  const toggleMainMenu = (index) => {
    if (selectedMainMenu === index) {
      setSelectedMainMenu(null);
    } else {
      setSelectedMainMenu(index);
    }
    setSelectedSubMenu(null);
  };

  const toggleSubMenu = (index) => {
    if (selectedSubMenu === index) {
      setSelectedSubMenu(null);
    } else {
      setSelectedSubMenu(index);
    }
  };

  const handleBackButtonClick = () => {
    if (selectedSubMenu !== null) {
      setSelectedSubMenu(null);
    } else if (selectedMainMenu !== null) {
      setSelectedMainMenu(null);
    }
  };

  return (
    <div className="flex xl:hidden justify-between items-center px-4">
      <button
        className="w-[70px] h-[70px] "
        onClick={() => setIsMenuOpen(true)}
      >
        <GiHamburgerMenu className=" w-[20px] h-[20px] text-white transition-all transform duration-700 ease-in-out hover:text-LightBlue hover:scale-105 " />
      </button>{" "}
      <Link href="/" className="ml-5">
        <Image
          src={header.mainMenuLogo[0].logosrc}
          width={70}
          height={70}
          alt="Çalışkan Arı Mağaza"
          className="p-2"
        />
      </Link>
      {user ? (
        <div className="text-white hover:text-red-500 text-2xl">
          {/* signOut */}
          <Link href="/auth/login" onClick={() => signOut()}>
            <Image
              src="/assets/images/cikisyap.svg"
              width={100}
              height={100}
              alt=""
              className="mx-4 w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
            />
          </Link>
        </div>
      ) : null}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div
            className={`absolute left-0 top-0 h-full  bg-white w-[300px] overflow-y-auto
            `}
          >
            {" "}
            <div className="flex items-center px-4 py-4 relative">
              <Link href="/">
                <Image
                  src={header.mainMenuLogo[0].logosrc}
                  width={90}
                  height={90}
                  alt="Çalışkan Arı Mağaza"
                  className="p-2"
                />
              </Link>
            </div>
            <div className=" mt-2 mr-4 h-[70px] flex justify-end absolute top-0 right-0">
              <button onClick={() => setIsMenuOpen(false)}>
                <FaTimes className=" w-[20px] h-[20px] text-[#555555] hover:text-red-600 hover:scale-110 transition duration-300 ease-in-out transform " />
              </button>
            </div>
            <div id="mainmenuitem">
              <ul className="flex flex-col text-CustomGray">
                {header.mainMenuItems.map((mainMenuItem, index) => (
                  <li
                    key={mainMenuItem.id}
                    className="relative mr-[25px] leading-[1.3] mx-2 "
                  >
                    <div className="flex-row hidden lg:flex pt-4 text-CustomGray">
                      <Link
                        className="flex flex-col items-center justify-center group"
                        href={
                          !user
                            ? "/auth/login"
                            : "https://caliskanari.com/shop/"
                        }
                      >
                        <span className="w-[60px] h-[60px] flex items-center justify-center group-hover:scale-105 group-hover:text-LightBlue transition-all duration-1000 ease-in-out transform">
                          <CiShop className="w-[40px] h-[40px]" />
                        </span>
                        <span className="uppercase text-[12px] font-bold tracking-[1px] pb-[15px] hover:text-LightBlue transition-all duration-500 ease-in-out transform">
                          MAĞAZA
                        </span>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={` ${
                selectedMainMenu == null && selectedSubMenu == null
                  ? "my-[30px]"
                  : ""
              }`}
            >
              <ul>
                {header.menus.map((menu, index) => (
                  <li
                    className={`flex flex-row items-center text-LightBlue px-[30px] text-[13px] font-extrabold uppercase  ${
                      selectedMainMenu == null && selectedSubMenu == null
                        ? "py-[15px]  "
                        : "py-0"
                    }`}
                    key={menu.id}
                  >
                    {selectedMainMenu == null && selectedSubMenu == null && (
                      <div className="flex flex-row items-center justify-between w-full group">
                        <Link
                          className="transition-all duration-500 transform ease-in-out group-hover:text-DarkBlue "
                          href={menu.href}
                        >
                          {menu.text}
                        </Link>
                        {menu.subMenus.length > 0 && (
                          <div
                            onClick={() => toggleSubMenu(index)}
                            className="cursor-pointer"
                          >
                            <IoIosArrowForward className="w-4 h-4 text-black fill-LightBlue transition-all duration-500 transform ease-in-out group-hover:fill-DarkBlue " />
                          </div>
                        )}
                      </div>
                    )}
                    {selectedSubMenu === index && (
                      <div>
                        <button
                          className="absolute top-9 text-[15px]  flex flex-row items-center justify-center hover:scale-105 transition duration-300 ease-in-out transform "
                          onClick={handleBackButtonClick}
                        >
                          <IoIosArrowBack />
                          <span className="pl-1">Back</span>
                        </button>
                        <ul>
                          {menu.subMenus.map((subMenu) => (
                            <li key={subMenu.id} className="py-[25px]">
                              <Link className="text-[13px]" href={subMenu.href}>
                                {subMenu.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {!user ? (
              <div className=" flex justify-center">
                <Link
                  href="/auth/login"
                  className="hover:scale-105 transition-all duration-700 ease-in-out transform"
                >
                  <Image
                    src="/assets/images/giris.svg"
                    alt=""
                    width={50}
                    height={50}
                    className="w-32"
                  />
                </Link>
              </div>
            ) : (
              <div className="text-white hover:text-red-500 text-2xl flex justify-center">
                {/* signOut */}
                <Link href="/auth/login" onClick={() => signOut()}>
                  <Image
                    src="/assets/images/cikisyap.svg"
                    width={100}
                    height={100}
                    alt=""
                    className="mx-4 w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
