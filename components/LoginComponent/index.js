"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import SuccessAnimation from "../../public/successanimation.json";
import WrongAnimation from "../../public/wronganimation.json";
import Loading from "../Loading";

// Lottie'yi client-side'da yükle
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => <div className="w-60 h-60" />,
});

// Modal bileşeni
const Modal = ({ isOpen, onClose, message, type }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    if (type === "success") {
      setAnimationData(SuccessAnimation);
    } else {
      setAnimationData(WrongAnimation);
    }
  }, [type]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-6 flex items-center justify-center rounded-lg shadow-lg">
        <div>
          {animationData && (
            <Lottie
              animationData={animationData}
              className="w-60"
              loop={false}
              autoplay={true}
            />
          )}
        </div>
        <div className="flex flex-col items-left">
          <h2
            className={`text-xl font-bold mb-4 ${
              type === "success" ? "text-green-600" : "text-red-600"
            }`}>
            {type === "success" ? "Başarılı" : "Hata"}
          </h2>
          <p>{message}</p>
          <button
            onClick={onClose}
            className="mt-4 bg-CustomRed text-white font-bold rounded-md px-4 py-2 hover:bg-CustomRed/80">
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
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (status === "authenticated" && shouldRedirect) {
      const redirectPath =
        session.user.role === "employee" ? "/customer-orders-admin" : "/";
      router.push(redirectPath);
    }
  }, [status, session, router, shouldRedirect, isMounted]);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("E-mail boş bırakılamaz.")
      .email("Geçerli bir e-mail adresi giriniz."),
    password: Yup.string().required("Parola zorunludur"),
  });

  const handleSubmit = async (values) => {
    if (!isMounted) return;

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: pageRole || "partner",
        redirect: false,
      });

      console.log("Login result:", result);

      if (
        result.error ===
        "Yeni şifreniz e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin."
      ) {
        setModalMessage(
          "Oluşturulan şifreniz mailinize gönderilmiştir. Lütfen kontrol ediniz."
        );
        setModalType("success");
        setIsModalOpen(true);
        setTimeout(() => setIsModalOpen(false), 3000);
        return;
      }
      if (result.error) {
        console.error("Login error:", result.error);
        let response;
        try {
          response = JSON.parse(result.error);
        } catch {
          response = { success: false, message: result.error };
        }

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
        setTimeout(() => setIsModalOpen(false), 3000);
      } else if (result.ok) {
        setModalMessage("Başarıyla giriş yaptınız. Yönlendiriliyorsunuz.");
        setModalType("success");
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setShouldRedirect(true);
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalMessage("Bir hata oluştu. Lütfen tekrar deneyiniz.");
      setModalType("error");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return <Loading />;

  return (
    <div className="bg-white flex items-center flex-col py-[35px] sm:py-[60px] w-screen lg:w-[1188px] h-screen">
      <h1 className="text-[48px] text-center font-semibold text-CustomGray italic mb-[40px]">
        Giriş Yap
      </h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
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
            <div className="flex flex-row items-center justify-center">
              <button
                type="submit"
                className="bg-CustomRed text-white font-bold rounded-md px-6 py-2 w-[200px] hover:scale-105 transition-all ease-in-out duration-700 transform">
                Giriş Yap
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {isLoading && <Loading />}
      {isMounted && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          message={modalMessage}
          type={modalType}
        />
      )}
      <div className="clear" />
      <p className="mt-4 text-CustomRed/75 text-[14px] hover:text-CustomRed  transition-all ease-in-out duration-700 transform hover:scale-105">
        <Link href="/auth/forgot-password">
          Yeni şifre talebi için buraya tıklayınız.
        </Link>
      </p>
    </div>
  );
};

export default LoginComponent;
