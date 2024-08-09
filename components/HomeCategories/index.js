"use client";
import React from "react";

import CategoryProducts from "../CategoryProducts";

function HomeCategories() {


  return (
    <div className="bg-white w-screen xl:w-[1188px] pt-[20px]  ">
      <div className="flex items-center justify-center ">
      <CategoryProducts />
      </div>
    </div>
  );
}

export default HomeCategories;
