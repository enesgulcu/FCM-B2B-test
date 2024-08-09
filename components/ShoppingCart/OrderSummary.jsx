import React from "react";
import { RiShoppingCartLine } from "react-icons/ri";

const OrderSummary = ({
  storedCart,
  totalPrice,
  handleConfirmOrder,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-[400px] md:w-[600px] lg:w-[960px] mx-auto bg-slate-100 rounded-2xl shadow-lg p-10">
      <div className="flex items-center justify-end">
        <h1 className="text-[20px] md:text-[32px] font-bold text-CustomGray">
          Sipariş Özeti
        </h1>
      </div>
      <div className="flex justify-center sm:justify-end my-8 text-[16px] w-full">
        <div className="flex flex-col gap-3 w-full">
          {storedCart.map((item, index) => (
            <div
              key={index}
              className="flex flex-row justify-between border-b border-slate-200 py-2"
            >
              <span className="text-CustomGray">
                {item.STKCINSI} (x{item.quantity})
              </span>
              <span className="font-bold text-CustomGray">
                ₺{parseFloat(item.STKOZKOD5) * item.quantity}
              </span>
            </div>
          ))}
          <div className="flex justify-between flex-row gap-12 border-b border-slate-200 py-4">
            <p className="flex justify-between font-bold text-CustomGray">
              <span className="">Ara Toplam</span>
            </p>
            <p className="flex justify-between font-bold text-CustomGray">
              <span className="">₺{totalPrice}</span>
            </p>
          </div>
          <div className="flex justify-between flex-row gap-12">
            <p className="flex font-medium text-slate-400">
              <span className="">İndirim</span>
            </p>
            <p className="flex justify-between font-medium text-slate-400">
              <span className="">₺0</span>
            </p>
          </div>
          <div className="flex justify-between flex-row gap-12 ">
            <p className="flex justify-between font-medium text-slate-400">
              <span className="">KDV</span>
            </p>
            <p className="flex justify-end font-medium text-slate-400">
              <span className="">₺0,00 </span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-[400px] md:w-[600px] lg:w-[960px] flex justify-center md:justify-end items-center mb-12 px-8">
        <div className="flex items-center gap-4 text-[24px]">
          <p className="font-extrabold text-CustomGray">Toplam</p>
          <p className="font-extrabold text-CustomGray">₺{totalPrice}</p>
        </div>
      </div>
      <div className="flex flex-row items-center gap-5 mt-12 mb-8">
        <div className="group">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirmOrder}
            className={`flex flex-row items-center justify-center gap-2 ml-3 text-white font-bold hover:scale-105 transition-all transform ease-out duration-500 cursor-pointer bg-gradient-to-r from-LightBlue
             to-sky-700 pl-3 pr-11 py-2 rounded-full relative w-[250px] h-[58px] text-[18px] ${
               isLoading ? "cursor-not-allowed animate-bounce" : ""
             }`}
          >
            {isLoading ? "Siparişiniz alınıyor..." : "Sipariş Oluştur"}
            <span className="absolute -right-2 text-white bg-gradient-to-r from-sky-700 to-LightBlue p-4  rounded-full group-hover:scale-110 transition-all duration-500 transform ease-in-out">
              <RiShoppingCartLine className="w-6 h-6" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
