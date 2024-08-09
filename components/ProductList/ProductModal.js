import Link from 'next/link';
import React from 'react';
import useProductDetailStore from "@/utils/productDetailStore"; // ürün detayına gitmek için
import Image from "next/image";

function ProductModal({ setIsOpenModal, productImage, productStkkod }) {
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const {productDetail,changeProductDetail} = useProductDetailStore() // productDetail STKKOD değeri alır,changeProductDetail productDetail'i değiştirir
  console.log(productImage);
  
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-500 bg-opacity-75">
      <div className="flex items-center justify-center min-h-screen border  ">
        

        

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white  pt-5 pb-4 ">
            <div className="flex justify-center items-center">
              <div className="mx-auto flex-shrink-0  flex items-center justify-center  max-h-96 overflow-hidden  sm:mx-0">
                {/* Product Image */}
                <Image src={productImage} alt="Product" className='max-h-80' width={100} height={100} />
              </div>
              
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
          <button
              onClick={handleCloseModal}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-NavyBlue text-base font-medium text-white hover:bg-LightBlue duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-NavyBlue sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
            <Link href={`/products/productDetail`} onClick={()=>changeProductDetail(productStkkod)}>
              <button
            
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-NavyBlue text-base font-medium text-white hover:bg-LightBlue duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-NavyBlue sm:ml-3 sm:w-auto sm:text-sm"
            >
              Ürüne Git
            </button>
            </Link>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
