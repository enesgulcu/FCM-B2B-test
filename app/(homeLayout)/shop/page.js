"use client";

import React, { useState } from "react";
import CategoryProducts from "@/components/CategoryProducts";
import useCartItemCount from "@/utils/useCartItemCount";
import FixedHeader from "@/components/FixedHeader";
import Loading from "@/components/Loading";

function Page() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading,setLoading] = useState(false);
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const cartItemCount = useCartItemCount();
  if(loading) return <Loading />
  return (
    <div className="bg-white w-screen xl:w-[1188px] pt-[10px]  ">
      <div className="flex items-center mt-[3.15rem] justify-center text-[35px] md:text-[48px] text-CustomGray leading-[41px] font-bold italic mb-[60px]">
        Mağaza
      </div>
      <FixedHeader showShop={true} />
      <div className="flex flex-col items-end  justify-center ">
        <CategoryProducts showSearchAndCart={true} />
      </div>
    </div>
  );
}

export default Page;
