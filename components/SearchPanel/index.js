import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaSearch, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { getAPI } from "@/services/fetchAPI";
import Link from "next/link";
import useProductDetailStore from "@/utils/productDetailStore"; // ürün detayına gitmek için

function SearchPanel({ toggleSearchPanel }) {
  const [searchResults, setSearchResults] = useState([]); // Arama sonuçları state'i
  const [searchNoResults, setSearchNoResults] = useState(null); // Arama sonuçları yoksa durumu
  const [searchInput, setSearchInput] = useState(""); // Arama input değeri
  const [products, setProducts] = useState([]); // Ürünlerin tutulduğu state
  const [imageMap, setImageMap] = useState({}); // Resim eşleştirmeleri için state
  const { productDetail, changeProductDetail } = useProductDetailStore(); // productDetail STKKOD değeri alır,changeProductDetail productDetail'i değiştirir

  // Formik validasyon şeması
  const validationSchema = Yup.object().shape({
    searchinput: Yup.string().required(""), // Arama inputunun zorunlu olması
  });

  // API'den ürünleri getiren fonksiyon
  const fetchProducts = async () => {
    try {
      const responseData = await getAPI("/products"); // getAPI fonksiyonunu kullanarak veri çekme

      // API'den gelen verinin dizi olup olmadığını kontrol etme
      if (Array.isArray(responseData.data)) {
        // STKOZKOD1 değeri "A" olan ürünleri filtreleme
        const filteredProducts = responseData.data.filter(
          (product) => product.STKOZKOD1 === "A"
        );
        setProducts(filteredProducts); // Filtrelenmiş ürünleri state'e set etme
      } else {
        console.error("Fetched data is not an array:", responseData); // Hata durumunda konsola bilgi yazdırma
      }
    } catch (error) {
      console.error("Error fetching products:", error); // Hata durumunda konsola hata mesajı yazdırma
    }
  };

  const fetchImages = async () => {
    try {
      const imageResponse = await fetch("/data.json");
      const imageData = await imageResponse.json();

      // Resim eşleştirmelerini oluştur
      const imgMap = {};
      imageData.forEach((item) => {
        imgMap[item.stkkod] = item.path;
      });
      setImageMap(imgMap);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Component yüklendiğinde ürünleri getirme işlemi
    fetchImages(); // Component yüklendiğinde resimleri getirme işlemi
  }, []);

  // Türkçe karakterleri normalize eden fonksiyon
  const normalizeTurkishChars = (str) => {
    return str
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/\s+/g, ""); // boşlukları kaldırma
  };

  // Arama işlemi
  const handleSearch = useCallback(
    (searchTerm) => {
      const normalizedSearchTerm = normalizeTurkishChars(
        searchTerm.toLowerCase()
      ); // Arama terimini küçük harfe çevirip normalize etme

      // Ürünler dizisi varsa
      if (Array.isArray(products)) {
        // Arama terimine göre ürünleri filtreleme
        const results = products.filter((product) =>
          normalizeTurkishChars(product.STKCINSI.toLowerCase()).includes(
            normalizedSearchTerm
          )
        );

        setSearchResults(results); // Filtrelenmiş ürünleri state'e set etme
        setSearchNoResults(results.length === 0); // Sonuç yoksa durumunu güncelleme
      } else {
        console.error("Products is not an array:", products); // Ürünler dizi değilse hata mesajı yazdırma
      }
    },
    [products]
  );

  // Input değeri değiştiğinde çalışan fonksiyon
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value); // Input değerini state'e set etme
    setSearchNoResults(null); // Arama sonucu yoksa durumu sıfırlama
    handleSearch(value); // Arama işlemini başlatma
  };

  return (
    <div className="w-full flex flex-col items-center justify-center transition-transform duration-500 ease-in-out shadow-[0_5px_20px_rgba(0,0,0,0.3)] py-[15px] z-[1000] rounded-xl">
      {/* Formik form bileşeni */}
      <Formik
        initialValues={{ searchinput: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSearch(values.searchinput)} // Form submit işlemi
      >
        {({ errors, touched, setFieldValue }) => (
          <div className="bg-white w-[310px] sm:w-[400px]  flex items-center justify-center flex-col">
            {/* Form bileşeni */}
            <Form
              id="ajax-search"
              className="container mx-auto px-3 sm:px-[30px] md:px-[15px]"
            >
              <div>
                <div className="relative text-[10px] uppercase text-[#555555] pt-10 flex items-center ">
                  {/* Kapatma butonu */}
                  <button
                    className="absolute top-1 md:top-0 right-0 "
                    type="button"
                    onClick={toggleSearchPanel}
                  >
                    <FaTimes className="w-[20px] h-[20px] text-[#555555] hover:text-red-600 hover:scale-110 transition duration-300 ease-in-out transform" />
                  </button>
                </div>

                {/* Arama inputu ve butonu */}
                <div className="relative border-2 border-LightBlue rounded-full  py-2 pr-2 hover:border-DarkBlue transition duration-300 ease-in-out transform pl-4">
                  <Field
                    name="searchinput"
                    placeholder="Ürün arama..."
                    className={`form-control text-[15px] w-[250px] sm:w-[310px] flex items-start font-bold lowercase outline-none ${
                      errors.searchinput && touched.searchinput
                        ? "is-invalid"
                        : ""
                    }`}
                    value={searchInput}
                    onChange={(e) => {
                      setFieldValue("searchinput", e.target.value); // Formik değeri set etme
                      handleInputChange(e); // Input değişikliğini işleme alma
                    }}
                  />
                  {/* Arama butonu */}
                  <button
                    type="submit"
                    className="search absolute right-3 top-2"
                  >
                    <FaSearch className="w-[19px] h-[19px]  text-[#555555] hover:text-LightBlue hover:scale-110 transition duration-300 ease-in-out transform " />
                  </button>
                </div>
              </div>
              {/* Form hataları */}
              {errors.searchinput && touched.searchinput && (
                <div>{errors.searchinput}</div>
              )}
            </Form>
          </div>
        )}
      </Formik>
      {/* Arama sonuçları gösterimi */}
      <div>
        {searchResults.length > 0 && (
          <div className="w-[310px] sm:w-[400px] mt-4 overflow-y-auto max-h-80">
            <ul>
              {/* Her bir ürün için liste elemanı */}
              {searchResults.map((product, index) => (
                <Link
                  onClick={() => changeProductDetail(product.STKKOD)}
                  href={`/products/productDetail`}
                  key={index} // Add key prop with unique value
                >
                  <li
                    className="p-5 shadow-b shadow-sm flex flex-row justify-start gap-4"
                    key={index} // Add key prop with unique value
                  >
                    {/* Ürün resmi */}
                    <Image
                      src={
                        imageMap[product.STKKOD]
                          ? imageMap[product.STKKOD]
                          : "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp"
                      }
                      alt={"image"}
                      width={70}
                      height={70}
                    />
                    {/* Ürün bilgileri */}
                    <div className="flex items-center">
                      <span className="flex text-start">
                        <p className="font-bold text-[16px] text-CustomGray hover:scale-105 hover:text-LightBlue transition-all transform easy-in-out duration-500">
                          {product.STKCINSI} {/* Ürün ismi */}
                        </p>
                      </span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
        {/* Arama sonucu bulunamadı durumu */}
        {searchNoResults === true && (
          <div className="w-[400px] mt-4 flex items-center justify-center">
            <p className="text-red-500 font-bold">Ürün bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPanel;
