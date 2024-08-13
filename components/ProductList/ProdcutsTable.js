import React, { useState, useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { PiCaretUpDownFill } from "react-icons/pi";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import ProductModal from "./ProductModal";
import Link from "next/link";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import Loading from "../Loading";
import Image from "next/image";
import useProductDetailStore from "@/utils/productDetailStore"; // ürün detayına gitmek için

function ProdcutsTable({ currentProducts, loading, img }) {
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [productStkkod, setProductStkkod] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const { productDetail, changeProductDetail } = useProductDetailStore(); // productDetail STKKOD değeri alır,changeProductDetail productDetail'i değiştirir

  const handleOpenModal = (product, stkkod) => {
    setIsOpenModal(true);
    setProductImage(product);
    setProductStkkod(stkkod);
  };
  const handleSort = (column) => {
    if (sortedColumn === column) {
      // Sıralama sırasını tersine çevir
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Yeni bir sütuna tıklandığında sıralama sırasını varsayılan olarak ayarla
      setSortedColumn(column);
      setSortOrder("asc");
    }
  };

  let sortedProducts = [...currentProducts];

  if (sortedColumn === "STKCINSI") {
    sortedProducts = [...currentProducts].sort((a, b) => {
      const STKCINSIA = a.STKCINSI.toUpperCase();
      const STKCINSIB = b.STKCINSI.toUpperCase();
      let comparison = 0;
      if (STKCINSIA > STKCINSIB) comparison = 1;
      else if (STKCINSIA < STKCINSIB) comparison = -1;
      return sortOrder === "desc" ? comparison * -1 : comparison;
    });
  } else if (sortedColumn === "STKOZKOD5") {
    sortedProducts = [...currentProducts].sort((a, b) => {
      const STKOZKOD5A = a.STKOZKOD5;
      const STKOZKOD5B = b.STKOZKOD5;
      let comparison = 0;
      if (STKOZKOD5A > STKOZKOD5B) comparison = 1;
      else if (STKOZKOD5A < STKOZKOD5B) comparison = -1;
      return sortOrder === "desc" ? comparison * -1 : comparison;
    });
  }

  return (
    <div className="overflow-x-auto border">
      {loading ? (
        <Loading />
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-NavyBlue text-white ">
            <tr>
              <th
                scope="col"
                className="px-10 py-3 text-left text-base font-medium "
              >
                <FaImage />
              </th>
              <th
                scope="col"
                className="px-6 flex items-center cursor-pointer  py-3 text-left text-base font-medium"
                onClick={() => handleSort("STKCINSI")}
              >
                İsim
                {sortedColumn === "STKCINSI" ? (
                  <span>
                    {sortOrder === "asc" ? <FaCaretUp /> : <FaCaretDown />}
                  </span>
                ) : (
                  <PiCaretUpDownFill />
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-base font-medium  "
              >
                Stok Kodu
              </th>
              <th
                scope="col"
                className="px-6 flex items-center cursor-pointer py-3 text-left text-base font-medium  "
                onClick={() => handleSort("STKOZKOD5")}
              >
                Fiyat
                {sortedColumn === "STKOZKOD5" ? (
                  <span>
                    {sortOrder === "asc" ? <FaCaretUp /> : <FaCaretDown />}
                  </span>
                ) : (
                  <PiCaretUpDownFill />
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-base font-medium "
              >
                Kategori
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-base font-medium "
              >
                Sınıf
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-base font-medium "
              >
                Ürün Durumu
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product, index) => (
              <tr
                key={product.id}
                className={`${index % 2 === 1 ? "bg-white" : "bg-gray-50"} `}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap cursor-pointer"
                  onClick={() => {
                    handleOpenModal(img[product.STKKOD], product.STKKOD);
                  }}
                >
                  <Image
                    width={40}
                    height={40}
                    src={img[product.STKKOD]}
                    alt="image"
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap  ">
                  <Link
                    onClick={() => changeProductDetail(product.STKKOD)}
                    href={`/products/productDetail`}
                    className="cursor-pointer hover:text-[#0284c7]  "
                  >
                    {product.STKCINSI}
                  </Link>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-BaseDark ">
                  {product.STKKOD}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-BaseDark">
                  ₺{product.STKOZKOD5}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-BaseDark">
                  {product.STKOZKOD2}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-BaseDark">
                  {product.STKOZKOD3}
                </td>

                <td className=" p-2">
                  {product?.STKOZKOD1 === "A" ? (
                    <span className="p-2  flex items-center justify-center space-x-1   rounded-xl text-sm bg-green-400 text-white">
                      {" "}
                      <FaCheckCircle className="text-xl" />
                      <span>Satışa uygun </span>{" "}
                    </span>
                  ) : (
                    <span className="p-2  flex items-center space-x-1   rounded-xl text-sm bg-red-400 text-white">
                      {" "}
                      <IoIosCloseCircle className="text-xl" />
                      <span>Satışa uygun değil</span>{" "}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isOpenModal && (
        <ProductModal
          setIsOpenModal={setIsOpenModal}
          productImage={productImage}
          productStkkod={productStkkod}
        />
      )}
    </div>
  );
}

export default ProdcutsTable;
