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

import Loading from "../Loading";

const CustomerOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [isLoading, setIsLoading] = useState(true);
  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAPI("/allorders");
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
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  //for filter status
  const filteredProd = (status) => {
    if (status === "Tümü") {
      setFilteredOrders(orders);
      setSelectedStatus(status);
    } else {
      setFilteredOrders(orders.filter((order) => order.ORDERSTATUS === status));
      setSelectedStatus(status);
    }
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    filteredProd(status);
  };

  // for pagination process
  const handleChangePage = (direction) => {
    if (direction === "prev" && page > 0) {
      setPage(page - 1);
    } else if (direction === "next" && page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  //FİYAT SIRALAMA

  return (
    <>
      {isLoading && <Loading />}
      {/* <div className=" text-center pt-5 pb-7 text-3xl text-NavyBlue font[600]">Siparişler</div>*/}

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
        {/* Sıralama ve Sayfalama */}
        <div className="flex items-center gap-2 ">
          <p className="text-CustomGray">{rowsPerPage} öge</p>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              page === 0
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("prev")}
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
            onClick={() => handleChangePage("next")}
          >
            <MdKeyboardDoubleArrowRight />
          </div>
        </div>
      </div>
      <CustomerOrdersListTable orders={paginatedOrders} allOrders={orders} />
    </>
  );
};

export default CustomerOrdersList;
