"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaCheck, FaPlus } from "react-icons/fa";

const ProductCard = ({
  product,
  calculateDiscountedPrice,
  addToCart,
  isItemInCart,
}) => {
  return (
    <div
      key={product.id}
      className="relative p-[10px] sm:p-[25px] border border-ProductsBorder rounded-md shadow-sm transition duration-300 ease-in-out transform hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-row sm:flex-col  items-center sm:justify-center "
    >
      {product.discount && (
        <p className="absolute flex flex-col items-center justify-center top-16 -right-12 transform origin-top-right rotate-45 text-[12px] sm:text-[16px] font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-600 px-2 w-40 shadow-md shadow-orange-200">
          %{product.discount}
          <span>İNDİRİM</span>
        </p>
      )}
      <div className="w-2/5 sm:w-full mr-[10px] sm:mr-0">
        <Link href={product.link}>
          <Image
            src={product.imagesrc}
            alt={product.name}
            className="object-cover w-[140px] md:w-[210px] h-[140px] md:h-[210px]"
            width={210}
            height={210}
          />
        </Link>
      </div>

      <div className="w-3/5 sm:w-full flex flex-col  justify-between">
        <div
          className={`text-left md:pt-[15px] min-h-12 md:min-h-20 ${
            product.discount ? "mr-12 sm:mr-0" : ""
          }`}
        >
          <Link
            href={product.link}
            className="font-bold text-[14px] md:text-[16px] text-CustomGray leading-tight"
          >
            <p>{product.name}</p>
          </Link>
        </div>
        <div className="flex-none">
          <div>
            {product.price && (
              <p className="italic text-LightBlue text-[20px] md:text-[23px] sm:pt-[20px] font-semibold">
                <span>₺</span>
                {calculateDiscountedPrice(
                  product.price.replace(",", "."),
                  product.discount
                )}
              </p>
            )}
          </div>
          {product.status ? (
            <p className="text-CustomRed pt-[8px] md:pt-[20px] flex items-center justify-center font-bold">
              {product.status}
            </p>
          ) : (
            <>
              <div className="flex justify-center items-center mt-[20px]">
                <Formik
                  initialValues={{ quantity: 1 }}
                  validationSchema={Yup.object({
                    quantity: Yup.number()
                      .min(1, "En az 1 adet girebilirsiniz")
                      .required("Bir miktar girin"),
                  })}
                  onSubmit={(values) => {
                    addToCart(product, values.quantity);
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <div className="flex flex-col items-center justify-center text-LightBlue ">
                        <div className="flex flex-row items-center justify-center ">
                          <Field
                            type="number"
                            min="1"
                            name="quantity"
                            className="text-center pr-2 sm:pr-0 w-14 md:w-16 h-8 border-2 border-LightBlue hover:border-CustomGray  hover:text-CustomGray transition duration-300 ease-in-out transform outline-none rounded-md  text-LightBlue "
                          />
                          <button
                            type="submit"
                            className="flex flex-row items-center justify-center gap-2 ml-3 text-white font-bold hover:scale-105 transition-all transform seasy-im-out duration-500 cursor-pointer bg-LightBlue/75 pl-3 pr-11 py-2 rounded-full relative"
                          >
                            Sepete Ekle
                            <span className="absolute -top-1 -right-2 text-white bg-gradient-to-r from-sky-600 to-cyan-700 p-3 border-4 border-white rounded-full transition duration-300 ease-in-out transform hover:scale-110">
                              {isItemInCart(product.id) ? (
                                <FaCheck />
                              ) : (
                                <FaPlus />
                              )}{" "}
                            </span>
                          </button>
                        </div>
                        {errors.quantity && touched.quantity && (
                          <div className="text-red-500">{errors.quantity}</div>
                        )}
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
