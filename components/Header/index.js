"use client";
import React, { useState, useEffect } from "react";
import headerStore from "@/utils/headerStore";
import Link from "next/link";
import Image from "next/image";
import MobileMenu from "../MobileMenu";
import useCartItemCount from "@/utils/useCartItemCount";
import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const { header } = headerStore();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemCount = useCartItemCount();

  const { data: session } = useSession();
  const user = session?.user;
  console.log(user);

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <div id="header">
      <div className="hidden lg:flex items-center justify-between ">
        <div
          id="ustmenu"
          className="h-[50px] bg-DarkBlue max-w-[1200px] flex container mx-auto px-5 justify-between items-center"
        >
          <div className="px-[15px]  text-white">
            <div className="">
              <ul className="flex flex-row text-[14px] font-semibold ">
                {header.menus.map((menu, index) => {
                  // Menü, isLoginRule true ise ve kullanıcı giriş yapmışsa veya isLoginRule false ise gösterilir.
                  if ((menu.isLoginRule && user) || !menu.isLoginRule) {
                    // Siparişler menüsü için özel kontrol
                    if (menu.text === "Siparişlerim") {
                      const isAdmin = user?.role === "Admin";
                      const menuText = isAdmin ? "Siparişler" : "Siparişlerim";
                      const menuHref = isAdmin
                        ? "/customer-orders-admin"
                        : menu.href;

                      return (
                        <li
                          key={menu.id}
                          className="relative mr-[25px] leading-[45px]"
                          onMouseEnter={() => setHoveredMenu(index)}
                          onMouseLeave={() => setHoveredMenu(null)}
                        >
                          <Link
                            className="hover:text-HoverGray transition duration-300 ease-in-out transform"
                            href={menuHref}
                          >
                            {menuText}
                          </Link>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={menu.id}
                        className="relative mr-[25px] leading-[45px]"
                        onMouseEnter={() => setHoveredMenu(index)}
                        onMouseLeave={() => setHoveredMenu(null)}
                      >
                        <Link
                          className="hover:text-HoverGray transition duration-300 ease-in-out transform"
                          href={menu.href}
                        >
                          {menu.text}
                        </Link>

                        {/* Alt menüler */}
                        {hoveredMenu === index && menu.subMenus.length > 0 && (
                          <div className="absolute top-11 -left-4 z-10 w-[250px] bg-DarkBlue shadow-[0_5px_20px_rgba(0,0,0,0.3)] py-[15px] rounded-b-md">
                            {menu.subMenus.map((subMenu) => (
                              <ul key={subMenu.id}>
                                <li className="px-[15px] py-[10px] text-[14px] font-semibold leading-[14px] cursor-pointer hover:text-LightBlue transition duration-300 ease-in-out transform">
                                  <Link href={subMenu.href}>
                                    {subMenu.text}
                                  </Link>
                                </li>
                              </ul>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          </div>
          {user ? (
            <div className=" flex items-center space-x-3   ">
              <Image
                src="/assets/images/avatarIcon.svg"
                alt="avatar"
                className="w-8"
                width={50}
                height={50}
              />

              <div className="text-sm text-white flex flex-col">
                <span className="whitespace-nowrap">
                  {user.name.slice(0, 25)}...
                </span>
                <span className="text-xs">({user.role})</span>
              </div>
              <div className="text-white hover:text-red-500 text-2xl">
                {/* signOut */}
                <Link href="#" onClick={() => signOut({ callbackUrl: "/" })}>
                  <Image
                    src="/assets/images/cikisyap.svg"
                    width={100}
                    height={100}
                    alt=""
                    className="mx-4 w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
                  />
                </Link>
              </div>
            </div>
          ) : (
            currentPath === "/" && (
              <div className="flex justify-center items-center mr-4">
                <Link href="/auth/login" onClick={() => signIn()}>
                  <Image
                    src="/assets/images/giris.svg"
                    width={100}
                    height={100}
                    alt=""
                    className=" w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
                  />
                </Link>
              </div>
            )
          )}
        </div>
      </div>
      <div className="md:hidden block bg-[#394C69] w-full">
        <MobileMenu header={header} user={user} />
      </div>
    </div>
  );
};

export default Header;
