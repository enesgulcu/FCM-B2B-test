"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ id }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleBackClick = (e) => {
    e.preventDefault();
    const storedPage = localStorage.getItem("currentOrderPage") || "0";
    router.push(`/customer-orders-admin?page=${parseInt(storedPage, 10) + 1}`);
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gray-50 p-3 md:mx-8 xl:mx-32">
        <div id="order-number" className="flex flex-col md:flex-row gap-2">
          <h1 className="font-bold text-xl">Sipariş</h1>
          <span className="tracking-wider text-xl">#{id}</span>
        </div>
        <Link href="/customer-orders">
          <button
            onClick={handleBackClick}
            className="bg-blue-600 text-white rounded-xl px-2 py-1 w-46 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform md:px-3 md:py-2"
          >
            SİPARİŞLERE GERİ DÖN
          </button>
        </Link>
      </div>
    </>
  );
}
