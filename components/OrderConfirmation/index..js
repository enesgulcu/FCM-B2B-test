import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { FaArrowRight, FaCheckCircle, FaTimes } from "react-icons/fa";

const OrderConfirmation = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
        <button className="absolute top-1 md:top-2 right-2 " onClick={onClose}>
          <FaTimes className="w-[20px] h-[20px] text-[#555555] hover:text-red-600 hover:scale-110 transition-all duration-500 ease-in-out transform" />{" "}
        </button>
        <FaCheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Siparişiniz Alındı!</h2>
        <p className="mb-4">Siparişiniz başarıyla alındı.</p>
        <div className="flex justify-center  gap-16 mt-10">
          <Link href="/">
            <button
              onClick={onClose}
              className="bg-LightBlue/75 text-white px-4 py-2 rounded-full font-bold text-md flex flex-row items-center gap-2  hover:bg-LightBlue hover:scale-105 transition-all duration-500 ease-in-out transform"
            >
              <span>
                <AiFillHome />
              </span>
              Anasayfa
            </button>
          </Link>
          <Link href="/customer-orders">
            <button
              onClick={onClose}
              className="bg-green-500/75 text-white px-4 py-2 rounded-full font-bold text-md flex flex-row items-center gap-2 hover:bg-green-500 hover:scale-105 transition-all duration-500 ease-in-out transform"
            >
              Siparişlerim
              <span>
                <FaArrowRight />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
