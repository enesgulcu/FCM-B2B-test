import React, { useState, useEffect } from "react";
import { statusList } from "./CustomerOrders/data";
import { putAPI } from "@/services/fetchAPI";
import { useSession } from "next-auth/react";

const UpdateStatusModal = ({ isOpen, setIsOpen, order, updateOrderStatus }) => {
  const [newStatus, setNewStatus] = useState(order.ORDERSTATUS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const [hasIrsaliyeRecord, setHasIrsaliyeRecord] = useState(true);
  const [irsaliyeMessage, setIrsaliyeMessage] = useState("");
  const [checkingIrsaliye, setCheckingIrsaliye] = useState(false);

  // İrsaliye kaydı kontrolü
  useEffect(() => {
    const checkIrsaliye = async () => {
      if (!order.REFNO) return;

      setCheckingIrsaliye(true);
      try {
        const response = await fetch(
          `/api/check-irsaliye?refNo=${order.REFNO}`
        );
        const data = await response.json();

        setHasIrsaliyeRecord(data.exists && !data.isCancelled);
        setIrsaliyeMessage(data.message || "");
      } catch (error) {
        console.error("İrsaliye kontrol hatası:", error);
        setHasIrsaliyeRecord(false);
        setIrsaliyeMessage("İrsaliye kontrolü yapılamadı");
      } finally {
        setCheckingIrsaliye(false);
      }
    };

    if (isOpen) {
      checkIrsaliye();
    }
  }, [isOpen, order.REFNO]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!order.REFNO) {
        throw new Error("REFNO is missing from the order object");
      }

      const response = await putAPI("/update-order-status", {
        ORDERNO: order.ORDERNO,
        newStatus: newStatus,
        REFNO: order.REFNO,
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

  // Kullanıcı rolüne ve irsaliye durumuna göre durum listesini filtrele
  const filteredStatusList = statusList.filter((status) => {
    // Employee ise "İptal" gösterme
    if (session?.user?.role === "employee" && status.name === "İptal") {
      return false;
    }
    // İrsaliye kaydı yoksa "İptal" gösterme
    if (!hasIrsaliyeRecord && status.name === "İptal") {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Sipariş Durumunu Güncelle
        </h3>

        {checkingIrsaliye && (
          <p className="text-blue-500 mb-4">
            İrsaliye kaydı kontrol ediliyor...
          </p>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* İrsaliye uyarısı - sadece irsaliye yoksa göster */}
        {!hasIrsaliyeRecord && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  ⚠️ {irsaliyeMessage}. İptal seçeneği kullanılamaz.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {filteredStatusList.map((status) => (
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
              Kapat
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || checkingIrsaliye}
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
