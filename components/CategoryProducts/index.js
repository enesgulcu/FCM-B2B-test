"use client";
import SearchPanel from "@/components/SearchPanel";
import { getAPI } from "@/services/fetchAPI";
import useProductDetailStore from "@/utils/productDetailStore";
import useCartItemCount from "@/utils/useCartItemCount";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaCheck,
  FaMinus,
  FaPlus,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { RiShoppingBasketFill } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import Loading from "../Loading";
import { isValidPrice, parsePrice } from "@/utils/formatPrice";

function CategoryProducts({ showSearchAndCart = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [urunler, setUrunler] = useState([]);
  const [selectedClass, setSelectedClass] = useState("1.SINIF");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [cart, setCart] = useState([]);
  const [imageMap, setImageMap] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const { productDetail, changeProductDetail } = useProductDetailStore();
  const cartItemCount = useCartItemCount();

  // Sistemdeki sınıf kategorileri
  const classes = [
    "1.SINIF",
    "2.SINIF",
    "3.SINIF",
    "4.SINIF",
    "OKUL ÖNCESİ",
    "İNGİLİZCE",
    "HİKAYE",
    "SÖZLÜK"
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAPI("/products");
        setLoading(false);
        const filteredData = data.data;
        setUrunler(
          filteredData.map((urun) => ({
            ...urun,
            quantity: 0,
            addingToCart: false,
          }))
        );

        const imageResponse = await fetch("/data.json");
        const imageData = await imageResponse.json();

        const imgMap = {};
        imageData.forEach((item) => {
          imgMap[item.stkkod] = item.path;
        });
        setImageMap(imgMap);
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (typeof window !== "undefined") {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isMounted]);

  const toggleDropdown = (classType) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [classType]: !prevState[classType],
    }));
  };

  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Seçilen sınıf tipine göre kategorileri getir
  const getClassCategories = (classType) => {
    const filteredUrunler = urunler.filter(
      (urun) =>
        (urun.STKOZKOD3 === classType &&
          urun.STKOZKOD2.trim() !== "" &&
          // parseFloat(urun.STKOZKOD5) > 0) ||
          parsePrice(urun.STKOZKOD5, NaN) > 0) ||
        (urun.STKOZKOD3 === classType &&
          urun.STKOZKOD2.trim() !== "" &&
          urun.STKOZKOD1 === "2")
    );

   

    const categories = [
      ...new Set(filteredUrunler.map((urun) => urun.STKOZKOD2)),
    ].filter(Boolean);
    return categories;
  };

  // Sepete ürün ekleme işlemi
  const handleAddToCart = async (values, urun) => {
    if (urun.STKOZKOD1 === "2") {
      setIsModalOpen(true);
      return;
    }
    try {
      setUrunler((prevUrunler) =>
        prevUrunler.map((item) =>
          item.STKKOD === urun.STKKOD ? { ...item, addingToCart: true } : item
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUrunler = urunler.map((item) =>
        item.STKKOD === urun.STKKOD
          ? {
              ...item,
              quantity: item.quantity + values.quantity,
              addingToCart: false,
            }
          : item
      );

      setUrunler(updatedUrunler);

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
            imageMap[urun.STKKOD] ||
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
  const isInCart = (urun) => {
    return cart.some((item) => item.STKKOD === urun.STKKOD);
  };

  // Kitapları render et
  const renderBooks = () => {
    let filteredUrunler = urunler.filter(
      (urun) =>
        urun.STKOZKOD3 === selectedClass &&
        (selectedClass === "SÖZLÜK" ||
          // parseFloat(urun.STKOZKOD5))
          parsePrice(urun.STKOZKOD5, NaN) > 0)
    );

    filteredUrunler = filteredUrunler.filter(
      (urun) => urun.STKOZKOD1 === "A" || urun.STKOZKOD1 === "2"
    );

    if (
      selectedClass !== "OKUL ÖNCESİ" &&
      selectedClass !== "İNGİLİZCE" &&
      selectedClass !== "HİKAYE" &&
      selectedClass !== "SÖZLÜK"
    ) {
      if (selectedCategory === "hepsi") {
        // Tüm kategorileri göster
      } else if (selectedCategory) {
        filteredUrunler = filteredUrunler.filter(
          (urun) => urun.STKOZKOD2 === selectedCategory
        );
      }
    }

    if (selectedClass === "İNGİLİZCE") {
      filteredUrunler = urunler.filter(
        (urun) => urun.STKOZKOD2 === "İNGİLİZCE"
      );
    }

    if (selectedClass === "HİKAYE") {
      filteredUrunler = urunler.filter((urun) => urun.STKOZKOD2 === "HİKAYE");
    }

    return filteredUrunler.map((urun) => (
      <div
        key={urun.STKKOD}
        className="relative p-[10px] sm:p-[20px] border border-ProductsBorder rounded-md shadow-sm transition duration-300 ease-in-out transform hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-row sm:flex-col items-center sm:justify-center"
      >
        <p className="absolute flex flex-col items-center justify-center top-16 -right-12 transform origin-top-right rotate-45 text-[12px] sm:text-[16px] font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-600 px-2 w-40 shadow-md shadow-orange-200">
          {urun.STKOZKOD1 === "A" ? (
            <>
              %60
              <span>İNDİRİM</span>
            </>
          ) : null}

          {urun.STKOZKOD1 === "2" ? (
            <>
              <span className="mt-3 md:mt-4">BASKIDA</span>
            </>
          ) : null}
        </p>

        {isInCart(urun) && (
          <p className="absolute flex flex-row items-center gap-2 top-0 left-0 transform text-[12px] sm:text-[16px] font-bold text-CustomRed py-2 px-4 z-1000 bg-white rounded-md">
            <FaShoppingCart className="" />
            <span>Sepette</span>
          </p>
        )}

        <div className="w-2/5 sm:w-full mr-[10px] sm:mr-0">
          <span className="flex items-center justify-center">
            <Image
              src={imageMap[urun.STKKOD] || "/assets/images/resim-yok.jpg"}
              width={210}
              height={210}
              className="object-cover w-[140px] md:w-[210px] h-[140px] md:h-[210px]"
              alt={urun.STKCINSI || "Ürün resmi"}
            />
          </span>
        </div>
        <div className="w-3/5 sm:w-full flex flex-col justify-between">
          <div className="text-left md:pt-[15px] min-h-12 md:min-h-20">
            <Link
              onClick={() => changeProductDetail(urun.STKKOD, urun.STKOZKOD1)}
              href={`/products/productDetail`}
              className="font-bold text-[14px] md:text-[16px] text-CustomGray leading-tight"
            >
              <p>{urun.STKCINSI}</p>
              <p>{urun.STKKOD}</p>
            </Link>
          </div>
          <div className="mt-2">
            {urun.STKOZKOD1 === "2" ? (
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                BASKIDA
              </span>
            ) : urun.STKOZKOD1 === "A" ? (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                SATIŞA HAZIR
              </span>
            ) : null}
          </div>
          <div className="flex-none">
            <div>
              {urun.STKOZKOD5 &&
              urun.STKOZKOD5.trim() !== "" &&
              // !isNaN(parseFloat(urun.STKOZKOD5)) &&
              // parseFloat(urun.STKOZKOD5) > 0
              isValidPrice(urun.STKOZKOD5) &&
              parsePrice(urun.STKOZKOD5, NaN) > 0 ? (
                <>
                  <p className="line-through text-gray-500 text-[16px] md:text-[18px]">
                    {/* {parseFloat(urun.STKOZKOD5) * 2.5}₺ */}
                    {parsePrice(urun.STKOZKOD5) * 2.5}₺
                  </p>
                  <p className="italic text-LightBlue text-[20px] md:text-[23px] font-semibold">
                    {urun.STKOZKOD5}
                    <span>₺</span>
                  </p>
                </>
              ) : (
                <p className="italic text-LightBlue text-[20px] md:text-[23px] font-semibold">
                  Fiyat bilgisi yok.
                </p>
              )}
            </div>
          </div>
          <div className="flex mt-[20px]">
            <Formik
              initialValues={{ quantity: 1 }}
              validationSchema={Yup.object().shape({
                quantity: Yup.number()
                  .min(1, "En az 1 olmalı")
                  .required("Zorunlu alan"),
              })}
              onSubmit={(values, { resetForm }) => {
                handleAddToCart(values, urun);
                resetForm();
              }}
            >
              {({
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                setFieldValue,
              }) => (
                <Form>
                  <div className="flex flex-col items-center justify-center text-LightBlue">
                    <div className="flex flex-row items-center justify-center">
                      <div className="flex items-center mt-2">
                        <button
                          type="button"
                          className="text-sm sm:text-md text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
                          onClick={() => {
                            if (values.quantity > 1) {
                              setFieldValue("quantity", values.quantity - 1);
                            }
                          }}
                        >
                          <FaMinus />
                        </button>
                        <Field
                          type="number"
                          min="1"
                          name="quantity"
                          className="w-8 text-center outline-none text-CustomGray [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:m-0"
                        />
                        <button
                          type="button"
                          className="text-LightBlue hover:scale-110 text-sm sm:text-md transition duration-500 ease-in-out transform"
                          onClick={() =>
                            setFieldValue("quantity", values.quantity + 1)
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
                        className={`flex flex-row items-center justify-center gap-2 ml-2 sm:ml-4 lg:ml-2 text-white font-bold ${
                          urun.STKOZKOD1 === "2" || isDisabled
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-LightBlue/75 hover:scale-105 transition-all transform easy-in-out duration-500"
                        } pl-2 pr-9 py-2 rounded-full relative w-[130px] sm:w-[160px] h-[40px] text-[13px] sm:text-[15px]`}
                        onClick={(e) => {
                          if (urun.STKOZKOD1 !== "2") {
                            handleSubmit(e);
                          }
                        }}
                        disabled={urun.STKOZKOD1 === "2" || isDisabled}
                      >
                        {urun.addingToCart ? (
                          <div className="flex flex-row items-center justify-center gap-1">
                            <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                            <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                            <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                          </div>
                        ) : isDisabled ? (
                          <>Bakımda</>
                        ) : (
                          <>Sepete Ekle</>
                        )}
                        <span
                          className={`absolute -top-1 -right-2 text-white bg-gradient-to-r ${
                            urun.STKOZKOD1 === "2" || isDisabled
                              ? "from-gray-500 to-gray-600"
                              : "from-sky-600 to-cyan-700"
                          } p-3 border-4 border-white rounded-full transition-all duration-500 ease-out transform`}
                        >
                          {isInCart(urun) ? (
                            <FaCheck
                              className={`transition-all duration-1000 ease-in-out transform ${
                                isInCart(urun) ? "scale-100" : "scale-0"
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
    ));
  };

  if (!isMounted) return <Loading />;
  if (loading) return <Loading />;

  return (
    <div className="bg-white w-screen md:w-[600px] lg:w-[960px] xl:w-[1188px] pt-[10px] lg:pt-[30px]">
      <div className="mb-4 flex flex-col md:flex-row items-center justify-center gap-3">
        {classes.map((classType) => (
          <div
            key={classType}
            className="mb-4 relative flex items-center justify-center"
          >
            <button
              onClick={() => {
                setSelectedClass(classType);
                setSelectedCategory("");
              }}
              className={`flex flex-row gap-2 items-center justify-center text-[14px] md:text-[12px] lg:text-[14px] font-bold rounded-full py-[18px] px-4 tracking-[1px] h-[40px] mx-[6px] mb-[8px] hover:scale-105 transition-all duration-500 ease-in-out transform cursor-pointer ${
                selectedClass === classType
                  ? "border-[3px] border-LightBlue text-LightBlue"
                  : "border-[3px] border-CategoriesTitle text-CategoriesTitle"
              }`}
            >
              {classType}
              {classType !== "OKUL ÖNCESİ" &&
                classType !== "İNGİLİZCE" &&
                classType !== "HİKAYE" &&
                classType !== "SÖZLÜK" && (
                  <span
                    onClick={() => {
                      toggleDropdown(classType);
                    }}
                    className="cursor-pointer"
                  >
                    <IoIosArrowDown className="w-5 h-5 hover:scale-110 transition-all duration-500 ease-in-out transform cursor-pointer hover:text-cyan-700" />
                  </span>
                )}
            </button>
            {dropdownOpen[classType] &&
              classType !== "OKUL ÖNCESİ" &&
              classType !== "İNGİLİZCE" &&
              classType !== "HİKAYE" &&
              classType !== "SÖZLÜK" && (
                <div className="absolute top-10 mt-2 w-36 rounded-2xl bg-white shadow-lg border border-gray-300 z-[1000]">
                  <div
                    className="p-2 hover:bg-LightBlue/25 hover:rounded-2xl hover:text-LightBlue duration-300 ease-in-out transform cursor-pointer"
                    onClick={() => {
                      setSelectedCategory("hepsi");
                      toggleDropdown(classType);
                    }}
                  >
                    GENEL
                  </div>
                  {getClassCategories(classType).map((category) => (
                    <div
                      key={category}
                      className="p-2 hover:bg-LightBlue/25 hover:rounded-2xl hover:text-LightBlue duration-300 ease-in-out transform cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(category);
                        toggleDropdown(classType);
                      }}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
          </div>
        ))}
        {showSearchAndCart && (
          <div className="flex flex-row items-center justify-end gap-4 mb-4">
            <button
              onClick={toggleSearchPanel}
              className="flex flex-row items-center justify-center gap-2 text-[14px] font-bold text-CustomGray hover:text-LightBlue hover:scale-105 transition-all duration-500 ease-in-out transform cursor-pointer"
            >
              <FaSearch className="w-5 h-5" />
              Arama
            </button>
            <Link
              className="flex flex-col items-center justify-center hover:text-LightBlue hover:scale-110 transition-all duration-700 ease-in-out transform relative"
              href="/cart"
            >
              <span>
                <RiShoppingBasketFill className="w-6 h-6" />
              </span>
              <span className="absolute -top-2 -right-2 bg-CustomRed text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Link>
          </div>
        )}
      </div>
      {isSearchOpen && <SearchPanel toggleSearchPanel={toggleSearchPanel} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {renderBooks()}
      </div>
    </div>
  );
}

export default CategoryProducts;
