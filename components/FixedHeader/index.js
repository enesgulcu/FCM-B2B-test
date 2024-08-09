import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../MobileMenu";
import SearchPanel from "../SearchPanel";
import { FaSearch } from "react-icons/fa";
import { RiShoppingBasketFill } from "react-icons/ri";
import { signIn, signOut, useSession } from "next-auth/react";
import headerStore from "@/utils/headerStore";
import useCartItemCount from "@/utils/useCartItemCount";
import { CiShop } from "react-icons/ci";

// showShop = sadece mağaza sayfası gözükür.  /shop sayfasında kendine özgü biçimde gözükür
const FixedHeader = ({ showShop = true }) => {
  const [hoveredMainMenu, setHoveredMainMenu] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredSubMenu, setHoveredSubMenu] = useState(null);
  const { header } = headerStore();
  const cartItemCount = useCartItemCount();

  const { data } = useSession();
  const user = data?.user;

  // Arama yapmak için butonun açma/kapama işlevi
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Sayfa kaydırıldığında fixed header'ın görünürlüğünü kontrol eden işlev
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 260) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (showShop) {
    // eğer /shop ise çalışır
    return (
      <div>
        {user && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg h-[165px] lg:h-[78px]   ${
              isVisible
                ? " transition-all  opacity-100 transform translate-y-0 duration-1000"
                : "transition-all  opacity-0 transform -translate-y-full duration-1000"
            }`}
          >
            <div className="container mx-auto px-[80px] h-[78px] hidden lg:flex items-center justify-between">
              <div className="flex items-center">
                <div>
                  <Image
                    src={header.mainMenuLogo[0].logosrc}
                    width={45}
                    height={50}
                    alt="Çalışkan Arı Mağaza"
                  />
                </div>
              </div>
              <div className="flex-row items-center justify-center hidden lg:flex " id="mainmenuitem">
                <div className="flex-row flex ml-[2.20rem]  text-CustomGray items-center justify-center ">
                  <Link
                    className="flex flex-col items-center justify-center group"
                    href={"/shop"}
                  >
                    <span className="w-[60px] h-[60px] flex items-center justify-center group-hover:scale-105 group-hover:text-LightBlue transition-all duration-1000 ease-in-out transform">
                      <CiShop className="w-[40px] h-[40px]" />
                    </span>
                    {/* <span className="uppercase text-[12px] font-bold tracking-[1px] pb-[15px] hover:text-LightBlue transition-all duration-500 ease-in-out transform">
                      MAĞAZA
                    </span> */}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:flex items-center ">
                {header.mainMenuButtons.map((button) => (
                  <div
                    key={button.id}
                    className="flex flex-row items-center justify-center"
                  >
                    <button onClick={toggleSearchPanel}>
                      <FaSearch className="w-[20px] h-[20px] text-CustomGray hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform mr-2 sm:mr-[36px]" />
                    </button>
                    <Link
                      href="/cart"
                      className="flex flex-col items-center text-CustomGray justify-center hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform "
                    >
                      <span>
                        <RiShoppingBasketFill
                          style={{ width: "25px", height: "25px" }}
                        />
                      </span>
                      {cartItemCount > 0 && (
                        <div className="absolute -top-3 -right-4 bg-[#ff5b4b] rounded-full px-[5px]  flex items-center justify-center">
                          <span className="text-white font-extrabold text-[16px] w-[14px] h-[24px] flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex lg:hidden">
                <MobileMenu header={header} />
              </div>
            </div>

            <div
              id="altmenu"
              className="relative p-[23px]  lg:p-0 bg-white w-screen flex items-center justify-between lg:hidden "
            >
              <div>
                <Image
                  src={header.mainMenuLogo[0].logosrc}
                  width={93}
                  height={105}
                  alt="Çalışkan Arı Mağaza"
                />
              </div>

              <div className="flex flex-row items-center text-center justify-center text-CustomGray">
                {header.mainMenuButtons.map((mainMenuButtons) => (
                  <div
                    key={mainMenuButtons.id}
                    className="flex flex-row items-center"
                  >
                    <button onClick={toggleSearchPanel}>
                      <FaSearch className="w-[20px] h-[20px] hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform mr-2 sm:mr-[36px]" />
                    </button>
                    <Link
                      href="/cart"
                      className="flex flex-col items-center justify-center hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform "
                    >
                      <span>
                        <RiShoppingBasketFill
                          style={{ width: "25px", height: "25px" }}
                        />
                      </span>
                      {cartItemCount > 0 && (
                        <div className="absolute -top-3 -right-4 bg-[#ff5b4b] rounded-full px-[5px]  flex items-center justify-center">
                          <span className="text-white font-extrabold text-[16px] w-[14px] h-[24px] flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-32 lg:top-16 right-0 sm:right-12 md:right-24 lg:right-36 bg-white rounded-xl">
              {isSearchOpen && (
                <div>
                  <SearchPanel toggleSearchPanel={toggleSearchPanel} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {user && (
          <div
            className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-lg h-[165px] lg:h-[78px]   ${
              isVisible
                ? " transition-all  opacity-100 transform translate-y-0 duration-1000"
                : "transition-all  opacity-0 transform -translate-y-full duration-1000"
            }`}
          >
            <div className="container mx-auto px-[80px] h-[78px] hidden lg:flex items-center justify-between">
              <div className="flex items-center">
                <div>
                  <Image
                    src={header.mainMenuLogo[0].logosrc}
                    width={45}
                    height={50}
                    alt="Çalışkan Arı Mağaza"
                  />
                </div>
              </div>
              <div className="flex-row hidden lg:flex " id="mainmenuitem">
                <ul className="flex-row items-center text-center justify-center text-CustomGray hidden lg:flex ml-[8px] md:ml-[36px]">
                  {header.mainMenuItems.map((mainMenuItem, index) => (
                    <li
                      key={mainMenuItem.id}
                      className="relative mr-[25px] leading-[1.3] w-[117px] mx-2"
                      onMouseEnter={() => {
                        setHoveredMainMenu(index);
                        if (hoveredSubMenu !== null) {
                          setHoveredSubMenu(null);
                        }
                      }}
                      onMouseLeave={() => setHoveredMainMenu(null)}
                    >
                      <Link
                        className="flex flex-col items-center justify-center"
                        href={mainMenuItem.href}
                      >
                        <span
                          className="w-[60px] h-[60px] flex items-center justify-center
                      text-CustomGray/75 hover:text-LightBlue  hover:scale-105 transition-all duration-500 ease-in-out transform cursor-pointer"
                        >
                          <span className="w-[40px] h-[40px]">
                            {mainMenuItem.icon}
                          </span>
                        </span>
                      </Link>
                      {mainMenuItem.subMenus &&
                        mainMenuItem.subMenus.length > 0 && (
                          <div
                            className={`absolute top-22 -left-4 z-[1000] w-[215px] bg-LightBlue shadow-[0_5px_20px_rgba(0,0,0,0.3)] py-[15px] rounded-md text-white transition-all duration-1000 ease-in-out transform ${
                              hoveredMainMenu === index
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10 pointer-events-none"
                            }`}
                          >
                            <ul>
                              {mainMenuItem.subMenus.map((subMenu) => (
                                <li
                                  key={subMenu.id}
                                  className="mx-[20px] py-[11px] text-[15px] font-bold leading-[14px] cursor-pointer hover:text-HoverGray transition duration-300 ease-in-out transform text-left"
                                >
                                  <Link href={`/urun-kategori/${subMenu.id}`}>
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
              <div className="hidden lg:flex items-center ">
                {header.mainMenuButtons.map((button) => (
                  <div
                    key={button.id}
                    className="flex flex-row items-center justify-center"
                  >
                    <button onClick={toggleSearchPanel}>
                      <FaSearch className="w-[20px] h-[20px] text-CustomGray hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform mr-2 sm:mr-[36px]" />
                    </button>
                    <Link
                      href="/cart"
                      className="flex flex-col items-center text-CustomGray justify-center hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform "
                    >
                      <span>
                        <RiShoppingBasketFill
                          style={{ width: "25px", height: "25px" }}
                        />
                      </span>
                      {cartItemCount > 0 && (
                        <div className="absolute -top-3 -right-4 bg-[#ff5b4b] rounded-full px-[5px]  flex items-center justify-center">
                          <span className="text-white font-extrabold text-[16px] w-[14px] h-[24px] flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
              <div className="flex lg:hidden">
                <MobileMenu header={header} />
              </div>
            </div>

            <div
              id="altmenu"
              className="relative p-[23px]  lg:p-0 bg-white w-screen flex items-center justify-between lg:hidden "
            >
              <div>
                <Image
                  src={header.mainMenuLogo[0].logosrc}
                  width={93}
                  height={105}
                  alt="Çalışkan Arı Mağaza"
                />
              </div>

              <div className="flex flex-row items-center text-center justify-center text-CustomGray">
                {header.mainMenuButtons.map((mainMenuButtons) => (
                  <div
                    key={mainMenuButtons.id}
                    className="flex flex-row items-center"
                  >
                    <button onClick={toggleSearchPanel}>
                      <FaSearch className="w-[20px] h-[20px] hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform mr-2 sm:mr-[36px]" />
                    </button>
                    <Link
                      href="/cart"
                      className="flex flex-col items-center justify-center hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform "
                    >
                      <span>
                        <RiShoppingBasketFill
                          style={{ width: "25px", height: "25px" }}
                        />
                      </span>
                      {cartItemCount > 0 && (
                        <div className="absolute -top-3 -right-4 bg-[#ff5b4b] rounded-full px-[5px]  flex items-center justify-center">
                          <span className="text-white font-extrabold text-[16px] w-[14px] h-[24px] flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute top-32 lg:top-16 right-0 sm:right-12 md:right-24 lg:right-36 bg-white rounded-xl">
              {isSearchOpen && (
                <div>
                  <SearchPanel toggleSearchPanel={toggleSearchPanel} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default FixedHeader;
