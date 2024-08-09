import orderInformationStore from "@/utils/orderInformationStore";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";

function OrderInformation() {
  const addressOptions = orderInformationStore((state) => state.address);
  const selectedAddress = orderInformationStore(
    (state) => state.address[state.selectedAddress - 1]
  );
  const [showOptions, setShowOptions] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("Adres Bilgileri");

  const handleTitleClick = (title) => {
    setSelectedTitle(title);
  };

  const handleOptionClick = (addressIndex) => {
    orderInformationStore.setState({ selectedAddress: addressIndex });
    setShowOptions(false);
  };

  return (
    <div >
      <div className="mx-12 sm:mx-0">
        <div className="address-selector text-CustomGray text-[14px] flex flex-row ">
          <button
            onClick={() => handleTitleClick("Adres Bilgileri")}
            className={`input-container flex flex-col   rounded-md w-full p-5  ${
              selectedTitle === "Adres Bilgileri"
                ? "border-2 border-sky-500"
                : "border border-slate-200 hover:border-LightBlue transition duration-500 ease-in-out transform"
            }`}
          >
            <div className="flex flex-row items-center justify-between">
              <p
                className={`text-[20px] md:text-[22px] font-bold text-CustomGray ${
                  selectedTitle === "Adres Bilgileri" ? "text-LightBlue" : ""
                }`}
              >
                Adres Bilgileri
              </p>
            </div>
            <div>
              <div
                className="cursor-pointer  py-5  outline-none flex justify-between items-center "
                onClick={() => handleOptionClick(selectedAddress.id)}
              >
                <div className="flex flex-col items-start gap-2">
                  <div className="flex flex-row items-center  gap-3">
                    <span className="rounded-full relative">
                      {selectedAddress.icon}
                    </span>
                    <span className="font-bold text-CustomGray">
                      {selectedAddress.name}
                    </span>
                  </div>
                  <span className="italic text-[12px] w-[220px] leading-relaxed  text-start ">
                    {selectedAddress.info}
                  </span>
                </div>
              </div>
            </div>
          </button>
          {showOptions && (
            <div>
              {addressOptions.map((address, index) => (
                <div
                  key={index}
                  className={`option cursor-pointer px-5 py-5 transition duration-500 ease-in-out transform outline-none flex justify-between items-center hover:bg-slate-100 rounded-md ${
                    selectedAddress.id === address.id
                      ? "border-2 border-sky-300 "
                      : ""
                  }`}
                  onClick={() => handleOptionClick(address.id)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-3">
                      <span className="p-2 border-2 border-cyan-400 rounded-full relative">
                        {address.icon}
                        <span>
                          {selectedAddress.id === address.id && (
                            <FaCheck className="absolute -top-1 right-0 text-white bg-cyan-400 rounded-full p-1" />
                          )}
                        </span>
                      </span>{" "}
                      <span
                        className={`font-bold ${
                          selectedAddress.id === address.id
                            ? "text-LightBlue"
                            : ""
                        }`}
                      >
                        {address.name}
                      </span>
                    </div>
                    <span className="italic text-[12px] w-[220px] leading-relaxed">
                      {address.info}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6">
        {selectedTitle === "Adres Bilgileri" && (
          <>
            <div className="options rounded-md flex flex-col border border-slate-200 h-[444px]  ">
              <h1 className="text-CustomGray font-bold text-[22px] p-5">
                Teslimat Adresi
              </h1>
              {addressOptions.map((address, index) => (
                <div
                  key={index}
                  className={`option cursor-pointer px-5 py-5 transition duration-500 ease-in-out transform outline-none flex justify-between items-center hover:bg-slate-100 rounded-md ${
                    selectedAddress.id === address.id ? "bg-slate-100 " : ""
                  }`}
                  onClick={() => handleOptionClick(address.id)}
                >
                  <div className="flex flex-col gap-2 ">
                    <div className="flex flex-row items-center gap-3 ">
                      <span className="p-2 border-2 border-cyan-400 rounded-full relative">
                        {address.icon}
                        <span>
                          {selectedAddress.id === address.id && (
                            <FaCheck className="absolute -top-1 right-0 text-white bg-cyan-400 rounded-full p-1" />
                          )}
                        </span>
                      </span>{" "}
                      <span
                        className={`font-bold ${
                          selectedAddress.id === address.id
                            ? "text-LightBlue"
                            : ""
                        }`}
                      >
                        {address.name}
                      </span>
                    </div>
                    <span className="italic text-[12px] w-[220px] leading-relaxed">
                      {address.info}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default OrderInformation;
