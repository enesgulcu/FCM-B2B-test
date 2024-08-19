"use client";
import Link from "next/link";
import { React, useState, useEffect } from "react";
import Image from "next/image";
import { FaPlus, FaMinus, FaCheck } from "react-icons/fa";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import ProductToggleButton from "./ProductToggleButton";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiShoppingBasketFill } from "react-icons/ri";
import useCartItemCount from "@/utils/useCartItemCount";

function ProdcutDetail({ product, img }) {
  const cartItemCount = useCartItemCount();
  const [cart, setCart] = useState([]); // Sepet ürünleri için state
  // Komponent yüklendiğinde local storage dan sepeti al
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);
  // Sepet durumu değiştiğinde local storegadaki sepeti güncelle
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(storedCart));
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);
  // Sepete ürün ekleme işlemi
  const handleAddToCart = async (values, urun) => {
    try {
      const updatedCart = [...cart];
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.STKKOD === urun.STKKOD
      );

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += values.quantity;
      } else {
        updatedCart.push({
          ...urun,
          quantity: values.quantity,
          imagePath:
            img ||
            "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp",
        });
      }

      setCart(updatedCart);

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      toast.success("Ürün sepete eklendi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Sepete ekleme hatası: ", error);
      toast.error("Ürün sepete eklenirken bir hata oluştu.");
    }
  };
  // Ürünün sepette olup olmadığını kontrol et
  const isInCart = (product) => {
    return cart.some((item) => item.STKKOD === product.STKKOD);
  };

  const isProductInPress = product.STKOZKOD1 === "2";
  const isProductOnSale = product.STKOZKOD1 === "A";
  // fiyat etiketi
  function PriceTag() {
    const originalPrice = parseFloat(product.STKOZKOD5);
    const discountedPrice = originalPrice;
    const inflatedPrice = (originalPrice * 2.5).toFixed(2);

    return (
      <div>
        <div className="flex relative justify-between bg-LightBlue/75 text-white min-w-40 w-[200px] my-4 h-10 p-1 pr-8">
          {isProductOnSale ? (
            <>
              <span className="font-medium mr-2 text-lg line-through">
                ₺{inflatedPrice}
              </span>
              <span className="font-medium text-lg">₺{discountedPrice}</span>
            </>
          ) : (
            <span className="font-medium text-lg">₺{originalPrice}</span>
          )}
          <span className="h-7 w-7 absolute top-1 right-[-14px] rotate-45 bg-gray-50"></span>
        </div>
        {isProductOnSale && (
          <div className="text-CustomRed font-bold">%60 İndirim</div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-center items-center bg-[url('/backgroundImage.webp')] bg-no-repeat   bg-contain bg-[#6bcdec]">
      <div className="bg-gray-50 min-h-screen-minus-50 ">
        <div className="px-5 xl:w-[1188px]   lg:px-14 pt-14 pb-3 mb-2  lg:mx-auto">
          <div className="flex p-1 mb-3 md:mb-0 justify-end ">
            <Link
              className="flex flex-col items-center justify-center hover:text-LightBlue hover:scale-110 transition-all duration-700 ease-in-out transform relative"
              href="/cart"
            >
              <span>
                <RiShoppingBasketFill
                  style={{ width: "25px", height: "25px" }}
                  className="text-CustomGray"
                />
              </span>
              {cartItemCount > 0 && (
                <div className="absolute -top-3 -right-4 bg-[#ff5b4b] rounded-full px-[5px]  flex items-center justify-center">
                  <span className="text-white font-extrabold text-[16px] w-[14px] h-[24px]">
                    {cartItemCount}
                  </span>
                </div>
              )}
            </Link>
          </div>
          <div className="grid grid-rows-2 ">
            <div
              className={`md:grid md:grid-cols-4 md:grid-flow-col ${
                product.desc && product.bookDetail ? "row-span-1" : "row-span-2"
              }`}
            >
              <div className="col-span-2 flex md:justify-center border border-dashed rounded-lg bg-white">
                <div className=" max-w-xl">
                  <Image
                    className="max-h-96"
                    src={img}
                    alt={img}
                    width={350}
                    height={350}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center col-span-2 md:ml-5  pt-5">
                <div className="font-bold text-3xl md:mt-0 mt-6 pb-3 px-3">
                  {product.STKCINSI}
                </div>
                <div className="px-3 mb-2">
                  {isProductInPress && (
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      BASKIDA
                    </span>
                  )}
                  {isProductOnSale && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      SATIŞA HAZIR
                    </span>
                  )}
                </div>
                <div className="flex flex-col   mt-5 px-3">
                  <div className="flex space-x-2">
                    <div className="flex flex-col space-y-4 justify-evenly   text-gray-500 ">
                      <div className="pb-[1px]">
                        {/** Yayınevi yazması gereken yer */}&nbsp;
                      </div>
                      <div className="pt-[1px]">Kategori:</div>
                    </div>
                    <div className="flex flex-col space-y-4  justify-evenly ">
                      <div className="text-LightBlue inline p-0 text-lg ">
                        {/** Yayınevi değerinin gelmesi gereken yer */}&nbsp;
                      </div>
                      <div className="text-LightBlue inline p-0 text-lg ">
                        {/** kategori */}
                        {product.STKOZKOD3 + " " + product.STKOZKOD2}
                      </div>
                    </div>
                  </div>
                  <PriceTag />
                </div>
                <div className="flex flex-row items-center mt-5 mb-5 px-3">
                  <Formik
                    initialValues={{ quantity: 1 }}
                    validationSchema={Yup.object().shape({
                      quantity: Yup.number()
                        .min(1, "En az 1 olmalı")
                        .required("Zorunlu alan"),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      handleAddToCart(values, product);
                      resetForm();
                    }}
                  >
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      errors,
                      touched,
                    }) => (
                      <Form>
                        <div className="flex flex-col items-center justify-center text-LightBlue">
                          <div className="flex flex-row items-center justify-center">
                            <div className="flex items-center mt-2  p-2 border border-LightBlue hover:border-CustomGray bg-white rounded-lg">
                              <button
                                type="button"
                                className="text-sm sm:text-md text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
                                onClick={() => {
                                  if (values.quantity > 1) {
                                    handleChange({
                                      target: {
                                        name: "quantity",
                                        value: values.quantity - 1,
                                      },
                                    });
                                  }
                                }}
                              >
                                <FaMinus />
                              </button>
                              <Field
                                min="1"
                                name="quantity"
                                className="w-6 text-center outline-none text-CustomGray"
                              />
                              <button
                                type="button"
                                className="text-LightBlue hover:scale-110 text-sm sm:text-md transition duration-500 ease-in-out transform"
                                onClick={() =>
                                  handleChange({
                                    target: {
                                      name: "quantity",
                                      value: values.quantity + 1,
                                    },
                                  })
                                }
                              >
                                <FaPlus />
                              </button>
                            </div>
                            {errors.quantity && touched.quantity && (
                              <div className="text-red-500 mt-1">
                                {errors.quantity}
                              </div>
                            )}
                            <button
                              type="submit"
                              className={`flex flex-row items-center justify-center gap-2 ml-2 sm:ml-4 lg:ml-2 text-white font-bold hover:scale-105 transition-all transform easy-in-out duration-500 cursor-pointer ${
                                isProductInPress
                                  ? "bg-gray-400"
                                  : "bg-LightBlue/75"
                              } pl-2 pr-9 py-2 rounded-full relative w-[130px] sm:w-[160px] h-[40px] text-[13px] sm:text-[15px]`}
                              onClick={handleSubmit}
                              disabled={
                                isProductInPress || product.addingToCart
                              }
                            >
                              {product.addingToCart ? (
                                <div className="flex flex-row items-center justify-center gap-1">
                                  <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                                  <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                                  <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                                </div>
                              ) : isProductInPress ? (
                                <>Baskıda</>
                              ) : (
                                <>Sepete Ekle</>
                              )}
                              <span
                                className={`absolute -top-1 -right-2 text-white bg-gradient-to-r ${
                                  isProductInPress
                                    ? "from-gray-500 to-gray-600"
                                    : "from-sky-600 to-cyan-700"
                                } p-3 border-4 border-white rounded-full transition-all duration-500 ease-out transform`}
                              >
                                {isInCart(product) ? (
                                  <FaCheck
                                    className={`transition-all duration-1000 ease-in-out transform ${
                                      isInCart(product)
                                        ? "scale-100"
                                        : "scale-0"
                                    }`}
                                  />
                                ) : (
                                  <FaPlus />
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${
              product.desc && product.bookDetail ? "row-span-1 " : "hidden"
            }`}
          >
            <ProductToggleButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProdcutDetail;
