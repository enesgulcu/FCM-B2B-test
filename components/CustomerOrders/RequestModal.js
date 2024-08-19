import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

function RequestModal({ isOpen, setIsOpen, order }) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(order.ORDERNO, formData);
      alert("Talebiniz başarıyla gönderildi.");
      setIsOpen(false);
    } catch (error) {
      console.error("Talep gönderilirken bir hata oluştu:", error);
      alert("Talep gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  const sendRequest = async (orderNo, data) => {
    const response = await fetch("/api/sendRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNo,
        talep: `${data.name} ${data.surname}: ${data.message}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Talep gönderilemedi");
    }

    return await response.json();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-black bg-opacity-60">
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

        <form onSubmit={handleSubmit}>
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
              value={formData.name}
              onChange={handleChange}
              required
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
              value={formData.surname}
              onChange={handleChange}
              required
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
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              className="bg-LightBlue/80 hover:bg-LightBlue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
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
