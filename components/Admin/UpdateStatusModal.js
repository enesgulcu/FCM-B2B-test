import React, { useState } from "react";
import { statusList } from "./CustomerOrders/data";
import { putAPI } from "@/services/fetchAPI";

const UpdateStatusModal = ({ isOpen, setIsOpen, order, updateOrderStatus }) => {
  const [newStatus, setNewStatus] = useState(order.ORDERSTATUS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await putAPI("/update-order-status", {
        ORDERNO: order.ORDERNO,
        newStatus: newStatus,
      });

      if (response.success) {
        updateOrderStatus(order.ORDERNO, newStatus);
        alert("Sipariş durumu başarıyla güncellendi.");
        setIsOpen(false);
      } else {
        setError(response.message || "Bir hata oluştu");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Sipariş Durumunu Güncelle
        </h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {statusList.map((status) => (
              <option key={status.name} value={status.name}>
                {status.name}
              </option>
            ))}
          </select>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Güncelleniyor..." : "Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
