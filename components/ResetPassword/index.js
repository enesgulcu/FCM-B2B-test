"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loading from "@/components/Loading";
import Lottie from "lottie-react";
import SuccessAnimation from "../../public/successanimation.json";
import WrongAnimation from "../../public/wronganimation.json";
import Link from "next/link";

// Modal bileşeni
const Modal = ({ isOpen, onClose, message, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-6 flex items-center justify-center rounded-lg shadow-lg">
        <div>
          <Lottie
            animationData={
              type === "success" ? SuccessAnimation : WrongAnimation
            }
            className="w-60"
            loop={false}
          />
        </div>
        <div className="flex flex-col items-left">
          <h2
            className={`text-xl font-bold mb-4 ${
              type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {type === "success" ? "Başarılı" : "Hata"}
          </h2>
          <div className="flex flex-col items-left justify-center">
            <p>{message}</p>
            <Link href="/auth/login">
            <button
              onClick={onClose}
              className="mt-4 bg-CustomRed text-white w-1/2 font-bold rounded-md px-4 py-2 hover:bg-CustomRed/80"
            >
              Kapat
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("E-mail boş bırakılamaz.")
      .email("Geçerli bir e-mail adresi giriniz."),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage(
          "Yeni şifreniz e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin."
        );
        setModalType("success");
      } else {
        setModalMessage(
          result.error || "Bir hata oluştu. Lütfen tekrar deneyiniz."
        );
        setModalType("error");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setModalMessage("Bir hata oluştu. Lütfen tekrar deneyiniz.");
      setModalType("error");
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="bg-white flex items-center flex-col py-[35px] sm:py-[60px] w-screen lg:w-[1188px] h-screen">
      <h1 className="text-[48px] text-center font-semibold text-CustomGray italic mb-[40px]">
        Yeni Şifreyi Maile Gönder
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex flex-col">
            <div className="mb-4 flex flex-col w-[400px]">
              <label className="text-[#9A9A9A] uppercase text-[11px] pt-[15px] pb-[10px] leading-[1px] tracking-[1px] font-bold">
                E-posta adresi
                <span className="text-CustomRed ml-1">*</span>
              </label>
              <Field
                type="email"
                name="email"
                autoComplete="off"
                className="border border-[#d5e0ec] py-[5px] px-[12px] rounded-md bg-white outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div className="mb-4 flex flex-col md:flex-row gap-4 items-center justify-end">
              <button
                type="submit"
                className="bg-CustomRed text-white w-[175px] text-xs md:text-base font-bold rounded-md px-6 py-2 md:w-[225px] hover:scale-105 transition-all ease-in-out duration-700 transform"
              >
                Şifremi Maile gönder
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {isLoading && <Loading />}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
    </div>
  );
};

export default ResetPassword;
