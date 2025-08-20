import React from "react";
import { IoClose } from "react-icons/io5";

function RequestModal({ isOpen, setIsOpen, order }) {
  if (!isOpen) return null;

  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50">
      <div className="bg-white w-[40%] rounded-sm p-4">
        <div className="flex justify-end text-xl ">
          <div
            className="cursor-pointer hover:bg-LightBlue hover:text-white hover:rounded-2xl hover:duration-500 p-1 border-2 rounded border-NavyBlue "
            onClick={() => setIsOpen(false)}
          >
            <IoClose />
          </div>
        </div>

        <h1 className="text-center text-xl text-NavyBlue mb-4">
          Sipariş Talep Formu{" "}
        </h1>

        <div className="text-center mb-4">
          <p>
            <strong>Sipariş Numarası:</strong> {order.ORDERNO}
          </p>
          <p>
            <strong>Tarih:</strong> {order.ORDERGUN}.{order.ORDERAY}.
            {order.ORDERYIL}
          </p>
          <p>
            <strong>Total Değer:</strong> {order.STKBIRIMFIYATTOPLAM} TL
          </p>
        </div>

        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              İsim
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="İsminiz"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="surname"
            >
              Soyisim
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="surname"
              type="text"
              placeholder="Soyisminiz"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Talep Mesajı
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="message"
              rows="4"
              placeholder="Talebinizi buraya yazınız"
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-LightBlue/80 hover:bg-LightBlue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequestModal;
