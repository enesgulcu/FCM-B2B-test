import React from "react";
import Link from "next/link";
import { BiLogInCircle } from "react-icons/bi";
import { BiSolidBookContent } from "react-icons/bi";
import { ImPriceTags } from "react-icons/im";
import { TbTruckDelivery } from "react-icons/tb";

const WelcomeSection = () => {
  return (
    <div className="welcome-section text-center  flex flex-col  lg:w-[1188px] my-0 lg:my-12 w-full ">
      <div className="w-full mx-auto ">
        <div>
          <div className="w-full flex flex-col items-center gap-6 text-white bg-[#394C69] p-4">
            <div className="flex max-w-[700px]">
              <p className="text-paragraphlight text-2xl leading-loose font-medium">
                Bayi Panelinize giriş yaparak sipariş verebilirsiniz.
              </p>
            </div>
            <div className="flex items-center pb-2">
              <Link href="/auth/login">
                <div className="group">
                  <button
                    type="button"
                    className="flex flex-row items-center justify-between gap-2 ml-3 text-white font-bold hover:scale-105 transition-all transform ease-out duration-500 cursor-pointer bg-CustomRed px-3 py-2 rounded-full relative  text-[18px] border-2 border-white ring-[4px]  ring-CustomRed w-[200px]"
                  >
                    <span className="ml-2 ">Giriş Yap</span>
                    <BiLogInCircle className="w-10 h-10" />
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10 mx-4 lg:mx-24 text-CustomGray mt-12">
          <div className="py-[50px] border rounded-2xl w-full md:w-1/3 flex flex-col items-center justify-center px-[60px] hover:scale-105  transition duration-700 ease-in-out transform">
            <div>
              <BiSolidBookContent className="w-[50px] h-[50px] text-LightBlue mb-[35px]" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[20px] font-bold">Kaliteli İçerik</p>
              <p className="text-[16px] text-paragraphlight text-center mt-[25px]">
                Her kitap özenle hazırlanmış içerikler sunar.
              </p>
            </div>
          </div>
          <div className="py-[50px] border rounded-2xl w-full md:w-1/3 flex flex-col items-center justify-center px-[60px] hover:scale-105  transition duration-700 ease-in-out transform">
            <div>
              <ImPriceTags className="w-[50px] h-[50px] text-LightBlue mb-[35px]" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[20px] font-bold">Uygun Fiyat</p>
              <p className="text-[16px] text-paragraphlight text-center mt-[25px]">
                Bütçenize uygun harika kitaplar.
              </p>
            </div>
          </div>
          <div className="py-[50px] border rounded-2xl w-full md:w-1/3 flex flex-col items-center justify-center px-[60px] hover:scale-105  transition duration-700 ease-in-out transform">
            <div>
              <TbTruckDelivery className="w-[50px] h-[50px] text-LightBlue mb-[35px]" />
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[20px] font-bold text-">Hızlı Teslimat</p>
              <p className="text-[16px] text-paragraphlight text-center mt-[25px]">
                Kitaplarınız kapınıza kadar gelir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
