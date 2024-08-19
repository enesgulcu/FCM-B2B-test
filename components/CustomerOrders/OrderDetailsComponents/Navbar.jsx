import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Modal from "../Modal";

export default function Navbar({ orderNo, orderStatus }) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderCancelled, setIsOrderCancelled] = useState(false);

  useEffect(() => {
    setIsOrderCancelled(orderStatus === "İptal");
  }, [orderStatus]);

  const handleCancelOrder = () => {
    setIsModalOpen(true);
  };

  const confirmCancelOrder = async (cancelReason) => {
    setIsLoading(true);
    try {
      // Önce TALEP alanını güncelle
      const sendRequestResponse = await fetch("/api/sendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNo, talep: cancelReason }),
      });

      if (!sendRequestResponse.ok) {
        throw new Error("TALEP alanı güncellenemedi");
      }

      // Sonra siparişi iptal et
      const cancelOrderResponse = await fetch("/api/cancel-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNo }),
      });

      if (!cancelOrderResponse.ok) {
        throw new Error("Sipariş iptal edilemedi");
      }

      alert("Sipariş başarıyla iptal edildi");
      setIsOrderCancelled(true);
      window.location.reload();
    } catch (error) {
      console.error("Sipariş iptal edilirken hata oluştu:", error);
      alert("Sipariş iptal edilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  const isButtonDisabled =
    isLoading || isOrderCancelled || orderStatus === "İptal";

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
            className="bg-red-500 text-white rounded-xl px-2 py-1 w-36 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform md:py-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            onClick={handleCancelOrder}
            disabled={isButtonDisabled}
          >
            {isLoading
              ? "İPTAL EDİLİYOR..."
              : isOrderCancelled
              ? "İPTAL EDİLDİ"
              : "IPTAL ET"}
          </button>
        )}
        <Link
          href={`${
            session?.user?.role === "Admin"
              ? "/customer-orders-admin"
              : "/customer-orders"
          }`}
        >
          <button className="bg-blue-600 text-white rounded-xl px-2 py-1 w-46 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform md:px-3 md:py-2">
            SİPARİŞLERE GERİ DÖN
          </button>
        </Link>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmCancelOrder}
        title="Siparişi İptal Et"
        content="Bu siparişi iptal etmek istediğinizden emin misiniz? Lütfen iptal sebebini belirtin."
      />
    </>
  );
}
