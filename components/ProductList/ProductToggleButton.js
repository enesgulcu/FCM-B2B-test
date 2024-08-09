"use client";
import { useState } from "react";

// kullanılacak amaç için modifiye edilmelidir
// items prop olarak ta verilebilir/gelebilir?
export default function ProductToggleButton({ product }) {
  const [items, setItems] = useState(["Ürün açıklaması", "Ürün özellikleri"]);
  const [currentValue, setCurrentValue] = useState(0);

  // ürün detayı
  function DisplayProductDetail() {
    return (
      <div className="text-gray-500 w-full max-h-[80%] overflow-auto rounded-lg shadow-lg md:p-5">
        <span>{product.desc}</span>
      </div>
    );
  }
  // ürün özellikleri
  function DisplayProductProps() {
    return (
      <div className="grid grid-cols-2 rounded-lg text-xs md:text-base">
        <div className="space-y-2 font-[600]">
          {product?.bookDetail?.printingLang && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              Basım Dili
            </div>
          )}
          {product?.bookDetail?.numberOfPages && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              Sayfa Sayısı
            </div>
          )}
          {product?.bookDetail?.coverType && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              Kapak Türü
            </div>
          )}
          {product?.bookDetail?.paperType && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              Kağıt Türü
            </div>
          )}
          {product?.bookDetail?.placeOfPublication && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              Basım Yeri
            </div>
          )}
          {product?.bookDetail?.width && product?.bookDetail?.height && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              En / Boy
            </div>
          )}
        </div>
        <div className="space-y-2 text-gray-600">
          {product?.bookDetail?.printingLang && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              {product.bookDetail.printingLang}
            </div>
          )}
          {product?.bookDetail?.numberOfPages && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              {product.bookDetail.numberOfPages}
            </div>
          )}
          {product?.bookDetail?.coverType && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              {product.bookDetail.coverType}
            </div>
          )}
          {product?.bookDetail?.paperType && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              {product.bookDetail.paperType}
            </div>
          )}
          {product?.bookDetail?.placeOfPublication && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              {product.bookDetail.placeOfPublication}
            </div>
          )}
          {product?.bookDetail?.width && product?.bookDetail?.height && (
            <div className="border border-l-4 border-l-LightBlue p-2 shadow-md">
              {product.bookDetail.width} / {product.bookDetail.height} cm
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-10 overflow-hidden">
      <div className="relative flex justify-center">
        {items.map((e, i) => (
          <button
            className={`mb-1 w-1/2 max-w-32 ${
              currentValue === i
                ? " text-cyan-700 border-b-2 border-cyan-600"
                : "text-gray-400"
            }`}
            key={i}
            onClick={() => setCurrentValue(i)}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-1 md:p-2 shadow-LightBlue/15">
        <div className="transition-all ">
          {currentValue === 0 ? (
            <DisplayProductDetail />
          ) : (
            <DisplayProductProps />
          )}
        </div>
      </div>
    </div>
  );
}
