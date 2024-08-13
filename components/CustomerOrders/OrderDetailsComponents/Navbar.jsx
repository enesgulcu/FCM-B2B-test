import Link from "next/link";
import { useSession } from "next-auth/react";
export default function Navbar({ orderNo }) {
  const { data: session } = useSession();

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
    </>
  );
}
