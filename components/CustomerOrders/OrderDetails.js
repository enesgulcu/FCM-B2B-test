"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./OrderDetailsComponents/Navbar";
import TopSection from "./OrderDetailsComponents/TopSection";
import ProductSummary from "./OrderDetailsComponents/ProductSummary";
import { getAPI } from "@/services/fetchAPI";
import Loading from "../Loading";
import RequestInfo from "./RequestInfo";
import KargoInfo from "./KargoInfo";

function OrderDetails() {
  const searchParams = useSearchParams();
  const orderno = searchParams.get("orderno");
  const [orderDetails, setOrderDetails] = useState([]);
  const [requestInfo, setRequestInfo] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getAPI("/adminorders");
        const filteredOrders = data.filter(
          (order) => order.ORDERNO === orderno
        );
        setOrderDetails(filteredOrders);
        // Talep bilgisini al (ilk siparişin TALEP alanını kullanıyoruz)
        if (filteredOrders.length > 0) {
          setRequestInfo(filteredOrders[0].TALEP || "");
        }
      } catch (err) {
        console.error("Sipariş detayları alınırken hata oluştu:", err);
      }
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
          <Navbar
            orderNo={orderDetails[0].ORDERNO}
            orderStatus={orderDetails[0].ORDERSTATUS}
            refNo={orderDetails[0].REFNO}
          />
          <div className="flex flex-col md:gap-4 md:mt-4 md:mx-8 xl:mx-32">
            <TopSection
              day={orderDetails[0].ORDERGUN}
              month={orderDetails[0].ORDERAY}
              year={orderDetails[0].ORDERYIL}
              time={orderDetails[0].ORDERSAAT}
              totalPrice={totalPrice + "₺"}
              totalQuantity={totalQuantity}
              orderStatus={orderDetails[0].ORDERSTATUS}
              orderKargoCompany={orderDetails[0].KARGO}
              orderKargoTrackingNo={orderDetails[0].KARGOTAKIPNO}
            />
            <RequestInfo
              requestInfo={requestInfo}
              orderStatus={orderDetails[0].ORDERSTATUS}
            />
            <KargoInfo
              orderKargoCompany={orderDetails[0].KARGO}
              orderKargoTrackingNo={orderDetails[0].KARGOTAKIPNO}
            />
            <ProductSummary orders={orderDetails} />
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetails;
