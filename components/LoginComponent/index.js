"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import Lottie from "lottie-react";
import WrongAnimation from "../../public/wronganimation.json";
import SuccessAnimation from "../../public/successanimation.json";

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
          <p>{message}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-CustomRed text-white font-bold rounded-md px-4 py-2 hover:bg-CustomRed/80"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

const LoginComponent = ({ pageRole }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("E-mail boş bırakılamaz.")
      .email("Geçerli bir e-mail adresi giriniz."),
    password: Yup.string().required("Parola zorunludur"),
  });

  const router = useRouter();

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: pageRole,
        callbackUrl: "/",
        redirect: false,
      });
      console.log("Sign in result error:", result.error);
      console.log("Sign in result:", result);
      if (
        result.error ===
        "Yeni şifreniz e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin."
      ) {
        setModalMessage(
          "Oluşturulan şifreniz mailinize gönderilmiştir. Lütfen kontrol ediniz."
        );
        setModalType("success");
        return setIsModalOpen(true);
      }
      if (result.error) {
        let response;
        try {
          response = JSON.parse(result.error);
        } catch {
          response = { success: false, message: result.error };
        }

        console.log("Parsed response:", response);

        if (response.success) {
          setModalMessage(
            "Oluşturulan şifreniz mailinize gönderilmiştir. Lütfen kontrol ediniz."
          );
          setModalType("success");
        } else {
          if (response.message.includes("Kullanıcı bulunamadı")) {
            setModalMessage("Kullanıcı bulunamadı. Lütfen tekrar deneyiniz.");
          } else if (response.message.includes("Şifre eşleşmesi başarısız")) {
            setModalMessage("Şifre eşleşmiyor. Lütfen tekrar deneyiniz.");
          } else {
            setModalMessage(
              response.message || "Bir hata oluştu. Lütfen tekrar deneyiniz."
            );
          }
          setModalType("error");
        }
        setIsModalOpen(true);
      } else if (result.ok) {
        setModalMessage("Başarıyla giriş yaptınız. Yönlendiriliyorsunuz.");
        setModalType("success");
        setIsModalOpen(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalMessage("Bir hata oluştu. Lütfen tekrar deneyiniz.");
      setModalType("error");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white flex items-center flex-col py-[35px] sm:py-[60px] w-screen lg:w-[1188px] h-screen">
      <h1 className="text-[48px] text-center font-semibold text-CustomGray italic mb-[40px]">
        Giriş Yap
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
                Kullanıcı adı veya e-posta adresi
                <span className="text-CustomRed ml-1">*</span>
              </label>
              <Field
                type="mail"
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
            <div className="mb-4 flex flex-col">
              <label className="text-[#9A9A9A] uppercase text-[11px] pt-[15px] pb-[10px] leading-[1px] tracking-[1px] font-bold">
                Parola <span className="text-CustomRed ">*</span>
              </label>
              <Field
                type="password"
                name="password"
                autoComplete="new-password"
                className="border border-[#d5e0ec] py-[5px] px-[12px] rounded-md bg-white outline-none"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>
            <div className="mb-4 flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2 justify-center">
                <Field type="checkbox" name="rememberMe" />
                <p className="text-[#9A9A9A] uppercase text-[11px] pt-[15px] pb-[10px] leading-[1px] tracking-[1px] font-bold mb-[1px]">
                  Beni hatırla
                </p>
              </div>

              <button
                type="submit"
                className="bg-CustomRed text-white font-bold rounded-md px-6 py-2 w-[200px] hover:scale-105 transition-all ease-in-out duration-700 transform"
              >
                Giriş Yap
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
      <div className="clear" />
      <p className="mt-4 text-CustomRed/75 text-[14px] hover:text-CustomRed  transition-all ease-in-out duration-700 transform ">
        <Link href="/auth/forgot-password">
          Yeni şifre talebi için buraya tıklayınız.
        </Link>
      </p>
    </div>
  );
};

export default LoginComponent;
