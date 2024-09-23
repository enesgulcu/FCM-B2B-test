"use client";
import React, { useState, useEffect } from "react";
import CustomerOrdersListTable from "./CustomerOrdersListTable";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { getAPI } from "@/services/fetchAPI";
import { statusList } from "./data";
import Loading from "@/components/Loading";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const CustomerOrdersList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermUnvan, setSearchTermUnvan] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [isLoading, setIsLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    const storedPage = localStorage.getItem("currentOrderPage");
    const currentPage = storedPage ? parseInt(storedPage, 10) : 0;
    setPage(currentPage);

    const fetch = async () => {
      try {
        const data = await getAPI("/adminorders");
        // Group orders by ORDERNO
        const groupedOrders = data.reduce((acc, order) => {
          if (!acc[order.ORDERNO]) {
            acc[order.ORDERNO] = [];
          }
          acc[order.ORDERNO].push(order);
          return acc;
        }, {});
        const uniqueOrders = Object.values(groupedOrders)
          .filter((orders) => orders.length > 0)
          .map((orders) => ({
            ORDERNO: orders[0].ORDERNO,
            CARKOD: orders[0].CARKOD,
            STKNAME: orders[0].STKNAME,
            REFNO: orders[0].REFNO,
            CARUNVAN: orders[0].CARUNVAN,
            ACIKLAMA: orders[0].ACIKLAMA,
            STKADET: orders.reduce((total, order) => total + order.STKADET, 0),
            STKBIRIMFIYAT: orders[0].STKBIRIMFIYAT,
            STKBIRIMFIYATTOPLAM: orders.reduce(
              (total, order) => total + order.STKBIRIMFIYATTOPLAM,
              0
            ),
            ORDERSTATUS: orders[0].ORDERSTATUS,
            ORDERGUN: orders[0].ORDERGUN,
            ORDERAY: orders[0].ORDERAY,
            ORDERYIL: orders[0].ORDERYIL,
            ORDERSAAT: orders[0].ORDERSAAT,
            TALEP: orders[0].TALEP,
            KARGO: orders[0].KARGO,
            KARGOTAKIPNO: orders[0].KARGOTAKIPNO,
            ID: orders[0].ID,
          }));
        uniqueOrders.sort((a, b) => {
          const dateA = new Date(
            a.ORDERYIL,
            a.ORDERAY - 1,
            a.ORDERGUN,
            ...a.ORDERSAAT.split(":")
          );
          const dateB = new Date(
            b.ORDERYIL,
            b.ORDERAY - 1,
            b.ORDERGUN,
            ...b.ORDERSAAT.split(":")
          );
          return dateB - dateA; // En yeniden en eskiye sıralama
        });
        setOrders(uniqueOrders);
        setFilteredOrders(uniqueOrders);
        const counts = uniqueOrders.reduce((acc, order) => {
          acc[order.ORDERSTATUS] = (acc[order.ORDERSTATUS] || 0) + 1;
          return acc;
        }, {});
        counts["Tümü"] = uniqueOrders.length;
        setStatusCounts(counts);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      }
    };
    fetch();
  }, [searchParams]);

  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "");
  };

  useEffect(() => {
    const filteredResults = orders.filter((order) => {
      const normalizedCARKOD = normalizeText(order.CARKOD);
      const normalizedCARUNVAN = normalizeText(order.CARUNVAN);
      const normalizedSearchTerm = normalizeText(searchTerm);
      const normalizedSearchTermUnvan = normalizeText(searchTermUnvan);

      const carkodMatch = normalizedCARKOD.includes(normalizedSearchTerm);
      const carunvanMatch = normalizedCARUNVAN.includes(
        normalizedSearchTermUnvan
      );

      return carkodMatch && carunvanMatch;
    });

    setFilteredOrders(filteredResults);
  }, [searchTerm, searchTermUnvan, orders]);

  const filteredProd = (status) => {
    if (status === "Tümü") {
      setFilteredOrders(orders);
      setSelectedStatus(status);
    } else {
      setFilteredOrders(orders.filter((order) => order.ORDERSTATUS === status));
      setSelectedStatus(status);
    }
    // Reset to first page when changing filters
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.delete("returnPage");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    filteredProd(status);
  };

  const updateOrderStatus = (orderno, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.ORDERNO === orderno ? { ...order, ORDERSTATUS: newStatus } : order
      )
    );
    setFilteredOrders((prevFiltered) =>
      prevFiltered.map((order) =>
        order.ORDERNO === orderno ? { ...order, ORDERSTATUS: newStatus } : order
      )
    );
  };

  const handleChangePage = (direction) => {
    let newPage = page;
    switch (direction) {
      case "first":
        newPage = 0;
        break;
      case "prev":
        newPage = Math.max(0, page - 1);
        break;
      case "next":
        newPage = Math.min(totalPages - 1, page + 1);
        break;
      case "last":
        newPage = totalPages - 1;
        break;
    }
    setPage(newPage);
    localStorage.setItem("currentOrderPage", newPage.toString());
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
    localStorage.setItem("currentOrderPage", "0");
  };

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-wrap justify-center md:justify-between items-center py-3">
        <div className="justify-between items-center flex flex-wrap">
          <div className="flex gap-2 text-LightBlue flex-wrap mb-4 md:mb-0">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="p-2 border rounded-md text-BaseDark"
            >
              {statusList.map((status) => (
                <option key={status.name} value={status.name}>
                  {status.name} ({statusCounts[status.name] || 0} adet)
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center text-LightBlue flex-wrap mb-4 md:mb-0">
          <input
            type="number"
            placeholder="Cari Koda Göre Filtrele.."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded-md border-NavyBlue text-BaseDark focus:outline-none focus:border-NavyBlue focus:ring-1 focus:ring-NavyBlue"
          />
          <input
            type="text"
            placeholder="Cari Unvana Göre Filtrele.."
            value={searchTermUnvan}
            onChange={(e) => setSearchTermUnvan(e.target.value)}
            className="p-2 border rounded-md border-NavyBlue text-BaseDark focus:outline-none focus:border-NavyBlue focus:ring-1 focus:ring-NavyBlue"
          />
        </div>
        <div className="flex items-center gap-2 ">
          <p className="text-CustomGray">{rowsPerPage} öge</p>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              page === 0
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("first")}
          >
            <MdKeyboardDoubleArrowLeft />
          </div>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              page === 0
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("prev")}
          >
            <MdKeyboardArrowLeft />
          </div>
          <span className="border  md:px-4 md:py-2 py-1 px-3 rounded-full bg-NavyBlue text-white">
            {page + 1}
          </span>
          <span>/ {totalPages}</span>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              page === totalPages - 1
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("next")}
          >
            <MdKeyboardArrowRight />
          </div>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              page === totalPages - 1
                ? "cursor-not-allowed text-gray-300 "
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("last")}
          >
            <MdKeyboardDoubleArrowRight />
          </div>
        </div>
      </div>
      <CustomerOrdersListTable
        orders={paginatedOrders}
        allOrders={orders}
        updateOrderStatus={updateOrderStatus}
      />
    </>
  );
};

export default CustomerOrdersList;
