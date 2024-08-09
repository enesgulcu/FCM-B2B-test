"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

const AdminLogin = ({ pageRole }) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("e mail boş bırakılamaz.")
      .email("Geçerli bir e mail adresi giriniz."),
    password: Yup.string().required("Parola zorunludur"),
  });

  const handleSubmit = (values) => {
    setIsLoading(true);

    // signIn içine hangi provider ile giriş yapılacağı ve giriş bilgileri gönderilir.
    const result = signIn("credentials", {
      email: values.email,
      password: values.password,
      role: pageRole,
      callbackUrl: "/",
      redirect: false,
    }).then((res) => {
      setIsLoading(false);
      // console.log("RES: ", res);
      if (!res) {
        // toast.error('Bir hata oluştu. Lütfen tekrar deneyiniz.');
        console.log("Bir hata oluştu. Lütfen tekrar deneyiniz.");
        // setIsloading(false);
      } else if (!res.ok) {
        // toast.error(res.error);
        console.log(res.error);
        // setIsloading(false);
      } else {
        // BİR PROBLEM YOKSA GİRİŞ BAŞARILI BİLGİSİ VERİRİZ.
        // setIsAccessing(true);
        // setIsloading(false);
        // toast.success('Giriş Başarılı (Yönlendiriliyorsunuz...)');
        console.log("Giriş Başarılı Yönlendiriliyorsunuz...");

        const timeOut = setInterval(() => {
          router.push("/");
          clearInterval(timeOut);
        }, 2000);
      }
    });
  };

  const router = useRouter();

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
      <div className="clear" />
      <p className="mt-4 text-CustomRed/75 text-[14px] hover:text-CustomRed  transition-all ease-in-out duration-700 transform ">
        <Link href="https://caliskanari.com/my-account/lost-password/">
          Parolanızı mı unuttunuz?
        </Link>
      </p>
    </div>
  );
};

export default AdminLogin;
