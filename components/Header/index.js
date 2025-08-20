"use client";
import headerStore from "@/utils/headerStore";
import useCartItemCount from "@/utils/useCartItemCount";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenu from "../MobileMenu";

const Header = () => {
  const { header } = headerStore();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartItemCount = useCartItemCount();

  const { data: session } = useSession();
  const user = session?.user;
  // console.log(user);
  console.log("User Role:", user?.role);

  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const renderMenuItems = () => {
    if (user?.role === "employee") {
      // Sadece "Siparişler" menüsünü göster
      const ordersMenu = header.menus.find(
        (menu) => menu.text === "Siparişlerim"
      );
      if (ordersMenu) {
        return (
          <li
            key={ordersMenu.id}
            className="relative mr-[25px] leading-[45px]"
            onMouseEnter={() => setHoveredMenu(ordersMenu.id)}
            onMouseLeave={() => setHoveredMenu(null)}>
            <Link
              className="hover:text-HoverGray transition duration-300 ease-in-out transform"
              href="/customer-orders">
              Siparişler
            </Link>
          </li>
        );
      }
      return null;
    }

    // Diğer roller için tüm menüleri göster
    return header.menus.map((menu, index) => {
      if ((menu.isLoginRule && user) || !menu.isLoginRule) {
        // Siparişler menüsü için özel kontrol
        if (menu.text === "Siparişlerim") {
          const isAdmin = user?.role === "Admin";
          const menuText = isAdmin ? "Siparişler" : "Siparişlerim";
          const menuHref = isAdmin ? "/customer-orders-admin" : menu.href;

          return (
            <li
              key={menu.id}
              className="relative mr-[25px] leading-[45px]"
              onMouseEnter={() => setHoveredMenu(index)}
              onMouseLeave={() => setHoveredMenu(null)}>
              <Link
                className="hover:text-HoverGray transition duration-300 ease-in-out transform"
                href={menuHref}>
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
            onMouseLeave={() => setHoveredMenu(null)}>
            <Link
              className="hover:text-HoverGray transition duration-300 ease-in-out transform"
              href={menu.href}>
              {menu.text}
            </Link>

            {/* Alt menüler */}
            {hoveredMenu === index && menu.subMenus.length > 0 && (
              <div className="absolute top-11 -left-4 z-10 w-[250px] bg-DarkBlue shadow-[0_5px_20px_rgba(0,0,0,0.3)] py-[15px] rounded-b-md">
                {menu.subMenus.map((subMenu) => (
                  <ul key={subMenu.id}>
                    <li className="px-[15px] py-[10px] text-[14px] font-semibold leading-[14px] cursor-pointer hover:text-LightBlue transition duration-300 ease-in-out transform">
                      <Link href={subMenu.href}>{subMenu.text}</Link>
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </li>
        );
      }
      return null;
    });
  };

  return (
    <div id="header">
      <div className="hidden lg:flex items-center justify-between ">
        <div
          id="ustmenu"
          className="h-[50px] bg-DarkBlue max-w-[1200px] flex container mx-auto px-5 justify-between items-center">
          <div className="px-[15px] text-white">
            <div className="">
              <ul className="flex flex-row text-[14px] font-semibold ">
                {renderMenuItems()}
              </ul>
            </div>
          </div>
          {user ? (
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/images/avatarIcon.svg"
                alt="avatar"
                className="w-8"
                width={50}
                height={50}
              />

              <div className="text-sm text-white flex flex-col">
                {user?.name && (
                  <span className="whitespace-nowrap">
                    {user.name.slice(0, 25)}...
                  </span>
                )}
                <span className="text-xs">({user.role})</span>
              </div>

              <div className="text-white hover:text-red-500 text-2xl">
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
                    className="w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
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
