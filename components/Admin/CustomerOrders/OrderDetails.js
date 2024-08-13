"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./OrderDetailsComponents/Navbar";
import TopSection from "./OrderDetailsComponents/TopSection";
import ProductSummary from "./OrderDetailsComponents/ProductSummary";
import { getAPI } from "@/services/fetchAPI";
import Loading from "@/components/Loading";

function OrderDetails() {
  const searchParams = useSearchParams();
  const orderno = searchParams.get("orderno");
  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getAPI("/allorders");
        const filteredOrders = data.filter(
          (order) => order.ORDERNO === orderno
        );
        setOrderDetails(filteredOrders);
      } catch (err) {}
    };
    fetchOrderDetails();
  }, [orderno]);

  const calculateTotals = (orders) => {
    return orders.reduce(
      (acc, order) => {
        return {
          totalPrice:
            acc.totalPrice + (parseFloat(order.STKBIRIMFIYATTOPLAM) || 0),
          totalQuantity: acc.totalQuantity + (parseInt(order.STKADET) || 0),
        };
      },
      { totalPrice: 0, totalQuantity: 0 }
    );
  };
  const { totalPrice, totalQuantity } = calculateTotals(orderDetails);
  if (orderDetails.length === 0) {
    return <Loading />;
  }
  return (
    <>
      <div className="bg-[url('/backgroundImage.webp')] bg-no-repeat bg-contain bg-[#6bcdec]">
        <div className="min-h-screen-minus-50 bg-gray-50 w-screen xl:w-[1188px] pt-[10px] mx-auto ">
          <div className="flex items-center mt-[3.15rem] justify-center text-[35px] md:text-[48px] text-CustomGray leading-[41px] font-bold italic mb-[60px]">
            Sipariş Detay Sayfası
          </div>
          <Navbar id={orderDetails[0].CARKOD} />
          <div className="flex flex-col md:gap-4 md:mt-4 md:mx-8 xl:mx-32">
            <TopSection
              day={orderDetails[0].ORDERGUN}
              month={orderDetails[0].ORDERAY}
              year={orderDetails[0].ORDERYIL}
              time={orderDetails[0].ORDERSAAT}
              totalPrice={totalPrice + "₺"}
              totalQuantity={totalQuantity}
              orderStatus={orderDetails[0].ORDERSTATUS}
            />
            <ProductSummary orders={orderDetails} />
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
