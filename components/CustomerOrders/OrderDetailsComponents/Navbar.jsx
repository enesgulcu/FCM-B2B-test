import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Modal from "../Modal";

export default function Navbar({ orderNo, orderStatus, refNo }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(orderStatus);

  const handleCancelOrder = async () => {
    if (!confirm("Bu siparişi iptal etmek istediğinizden emin misiniz?")) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ORDERNO: orderNo, REFNO: refNo }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Bir hata oluştu.");
      }
      alert("Sipariş başarıyla iptal edildi.");
      setCurrentStatus("İptal");
    } catch (error) {
      console.error("Sipariş iptal hatası:", error);
      alert(`Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getReturnLink = () => {
    if (session?.user?.role === "Admin" || session?.user?.role === "employee") {
      return "/customer-orders-admin";
    } else {
      return "/customer-orders";
    }
  };

  const isCancellable = !["Fiş Çıkartıldı", "Tamamlandı", "İptal"].includes(
    currentStatus
  );
  const isButtonDisabled = isLoading || !isCancellable;

  return (
    <>
      <div className="flex justify-between items-center bg-gray-50 p-3 md:mx-8 xl:mx-32">
        <div
          id="order-number"
          className="flex flex-col justify-center items-center md:flex-row gap-2"
        >
          <h1 className="font-bold text-xl">Sipariş Numarası: </h1>
          <span className="tracking-wider text-lg">#{orderNo}</span>
        </div>
        {session?.user?.role === "partner" && (
          <button
            className={`rounded-xl px-2 py-1 w-36 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform md:py-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed ${
              isButtonDisabled
                ? "bg-gray-400 text-gray-700"
                : "bg-red-500 text-white"
            }`}
            onClick={handleCancelOrder}
            disabled={isButtonDisabled}
            title={!isCancellable ? "Bu sipariş iptal edilemez." : ""}
          >
            {isLoading
              ? "İPTAL EDİLİYOR..."
              : currentStatus === "İptal"
              ? "İPTAL EDİLDİ"
              : "İPTAL ET"}
          </button>
        )}
        <Link href={getReturnLink()}>
          <button className="bg-blue-600 text-white rounded-xl px-2 py-1 w-46 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform md:px-3 md:py-2">
            SİPARİŞLERE GERİ DÖN
          </button>
        </Link>
      </div>
    </>
  );
}
