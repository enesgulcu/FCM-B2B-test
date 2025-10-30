"use client";

import dynamic from "next/dynamic";
import React from "react";

// SSR devre dışı bırakılmış ShoppingCart
const ShoppingCart = dynamic(() => import("@/components/ShoppingCart"), {
  ssr: false,
});

function CartContainer() {
  return (
    <div className="bg-white">
      <ShoppingCart />
    </div>
  );
}

export default CartContainer;
