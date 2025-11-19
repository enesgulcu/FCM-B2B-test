import React, { useState } from "react";
import { RiShoppingCartLine } from "react-icons/ri";
import { AiOutlineWarning } from "react-icons/ai";
import { parsePrice } from "@/utils/formatPrice";

const OrderSummary = ({
  storedCart,
  totalPrice,
  handleConfirmOrder,
  isLoading,
}) => {
  const [requestMessage, setRequestMessage] = useState("");

  const handleRequestChange = (e) => {
    setRequestMessage(e.target.value);
  };

  const handleSubmit = () => {
    handleConfirmOrder(requestMessage);
  };
  return (
    <div className="flex flex-col items-center justify-center w-[400px] md:w-[600px] lg:w-[960px] mx-auto bg-slate-100 rounded-2xl shadow-lg p-10">
      <div className="flex items-center justify-center md:justify-end w-full">
        <h3 className="text-LightBlue">%60 Bayi indirimi uygulanmıştır.</h3>
      </div>
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
                {/* (parseFloat(item.STKOZKOD5) * item.quantity).toLocaleString("tr-TR", { ... }) */}
                {(parsePrice(item.STKOZKOD5) * item.quantity).toLocaleString(
                  "tr-TR",
                  { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}
                <span className="mx-1">₺</span>
              </span>
            </div>
          ))}
          {/* <div className="flex justify-between flex-row gap-12">
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
          </div> */}
        </div>
      </div>
      <div className="w-[400px] md:w-[600px] lg:w-[960px] flex justify-center md:justify-end items-center mb-12 px-8">
        <div className="flex items-center gap-4 text-[24px] bg-CustomGray p-2 rounded-xl shadow-xl">
          <p className="font-extrabold text-white ">Toplam</p>
          <p className="font-extrabold text-white">
            {totalPrice.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span className="mx-1">₺</span>
          </p>
        </div>
      </div>
      <div className="flex flex-col justify-center max-w-[1280px] w-[700px] mt-8 mx-auto">
        <form className="flex justify-center md:w-[700px] flex-col w-72">
          <h1 className="text-center text-xl text-NavyBlue mb-4">
            Sipariş Talep Formu
          </h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Talep Mesajı
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              rows="4"
              placeholder="Talebinizi buraya yazınız"
              value={requestMessage}
              onChange={handleRequestChange}
              required
            ></textarea>
          </div>
        </form>
      </div>

      <div className="flex flex-row items-center gap-5 mt-12 mb-8">
        <div className="group">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className={`shadow-lg hover:shadow-2xl flex flex-row items-center justify-center gap-2 ml-3 text-white font-bold hover:scale-105 transition-all transform ease-out duration-500 cursor-pointer bg-gradient-to-r from-LightBlue to-sky-700 pl-3 pr-11 py-2 rounded-full relative w-[260px] h-[58px] text-[18px] ${
              isLoading ? "cursor-not-allowed animate-bounce" : ""
            }`}
          >
            {isLoading ? "Siparişiniz alınıyor..." : "Sipariş Oluştur"}
            <span className="absolute -right-0 text-white bg-gradient-to-l from-sky-700 to-LightBlue p-4 rounded-full transition-all duration-500 transform ease-in-out">
              <RiShoppingCartLine className="w-6 h-6" />
            </span>
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center relative p-4 bg-LightBlue text-white font-bold text-lg rounded-lg shadow-lg animate-bounce">
          <AiOutlineWarning size={30} />{" "}
          <span className="mx-4 shadow-2xl">
            Lütfen sipariş alınırken bekleyin, bu işlem biraz zaman alabilir.
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
