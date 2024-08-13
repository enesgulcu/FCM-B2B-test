import React from "react";
import { FaTimes } from "react-icons/fa";

function OrderEditModal({ isOpen, setIsOpen, order }) {
  if (!isOpen) return null;
  return (
    <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full bg-black bg-opacity-60">
      <div className="bg-white md:w-[40%] w-[90%] rounded-md p-7">
        <div className="flex justify-end text-xl">
          <div onClick={() => setIsOpen(false)}>
            <FaTimes className="w-[20px] cursor-pointer h-[20px] text-[#555555] hover:text-red-600 hover:scale-110 transition duration-300 ease-in-out transform" />
          </div>
        </div>

        <h1 className="text-center text-xl text-NavyBlue font-semibold mb-4">
          Sipariş Detayları
        </h1>

        <table className="border w-full mb-5 text-[10px] md:text-base  ">
          <thead className="text-left ">
            <th className="p-2">Ürün Adı</th>
            <th className="pl-3">Adedi</th>
            <th>Fiyatı</th>
            <th>Stok Bilgisi</th>
          </thead>
          <tbody className="border text-center">
            {order.products.map((product, index) => (
              <tr key={index} className="text-left ">
                <td className="p-2 text-LightBlue hover:underline cursor-pointer">
                  {product.name}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    className="border rounded-md p-2 w-20 text-center my-1 "
                    value={product.productCount}
                  />
                </td>
                <td>{product.price}₺</td>
                <td
                  className={`${
                    product.isStock ? "text-green-500" : "text-red-500"
                  } `}
                >
                  {product.isStock === true ? "Stokta Var" : "Stokta Yok"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="  grid grid-cols-3  my-5">
          <div className=" flex items-center">
            <h1 className="text-NavyBlue font-[600] text-xs md:text-base ">
              Sipariş Durumu :
            </h1>
          </div>
          <div className="col-span-2">
            <select
              className={`p-1 border rounded-md text-CustomGray w-36 `}
              name="filterActions"
              value={order.status}
            >
              <option hidden>Toplu İşlemler</option>
              <option>Toplu İşlemler</option>
              <option>Hazırlanıyor</option>
              <option>Kargoya verildi</option>
              <option>Ödeme bekleniyor</option>
              <option>Tamamlandı</option>
              <option>İptal edildi</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 mb-5 text-xs md:text-base ">
          <div className=" flex items-center">
            <h1 className="text-NavyBlue font-[600]">Sipariş Tarihi :</h1>
          </div>

          <div>
            <p className=" p-2 ">{order.date}</p>
          </div>
        </div>
        <hr />
        <div className="space-y-5 mt-5 ">
          <h1 className="text-LightBlue font-bold">Müşteri Bilgileri</h1>
          <div className="grid grid-cols-3 ">
            <div className=" space-y-10 ">
              <h2 className="text-NavyBlue font-[600]">Bayi Adı:</h2>
              <h2 className="text-NavyBlue font-[600]">Bayi Telefonu:</h2>
              <h2 className="text-NavyBlue font-[600]">Bayi Adresi:</h2>
            </div>
            <div className="space-y-4 col-span-2">
              <input
                type="text"
                className="border rounded-md p-2 w-full"
                value={order.dealerName}
              />

              <input
                type="text"
                className="border rounded-md p-2 w-full"
                value={order.phone}
              />

              <input
                type="text"
                className="border rounded-md p-2 w-full"
                value={order.dealerAddress}
              />
            </div>
          </div>
        </div>
        <div className=" mt-5 flex justify-center items-center">
          <button className="border p-2 rounded-md bg-LightBlue/90 hover:bg-LightBlue text-white">
            Güncelle
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderEditModal;
