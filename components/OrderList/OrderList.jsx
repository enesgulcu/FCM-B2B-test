"use client";
import React, { useState, useEffect } from "react";
import OrderListTable from "./OrderListTable";
import { orders, statuses } from "./data";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const OrderList = () => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [orderDate, setOrderDate] = useState("Tüm Tarihler");
  const [uniqueDates, setUniqueDates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState("Toplu İşlemler");
  const [priceSortType, setPriceSortType] = useState("Fiyata Göre Sırala");
  const [dateSortType, setDateSortType] = useState("Tarihe Göre Sırala");
  const [anyFilterSelected, setAnyFilterSelected] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAPI("/allorders");
        setProducts(data);
      } catch (err) {}
    };
    fetch();
  }, []);

  useEffect(() => {
    const dates = [...new Set(filteredOrders.map((order) => order.date))];
    setUniqueDates(dates);
  }, [filteredOrders]);

  useEffect(() => {
    const counts = {};
    statuses.forEach((status) => {
      counts[status] = orders.filter((order) => order.status === status).length;
    });
    setOrderCounts(counts);
  }, []); // ✅ Uyarı kalkar, çünkü 'orders' değişmiyor ve sabit

  const filterOrders = (searchValue, status, date) => {
    let filteredOrders = orders;

    if (searchValue) {
      filteredOrders = filteredOrders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (status !== "Tümü") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    if (date !== "Tüm Tarihler") {
      filteredOrders = filteredOrders.filter((order) => order.date === date);
    }

    filteredOrders.forEach((order) => {
      if (order.status === "Tamamlandı") {
        order.status = "Tamamlandı";
      } else if (order.status === "İptal edildi") {
        order.status = "İptal edildi";
      } else if (order.status === "Başarısız") {
        order.status = "Başarısız";
      }
    });
    setFilteredOrders(filteredOrders);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    filterOrders(value, selectedStatus, orderDate);
  };

  const filterStatus = (status) => {
    setSelectedStatus(status);
    filterOrders(searchValue, status, orderDate, uniqueDates);
  };

  const handleChangePage = (direction) => {
    if (direction === "prev" && page > 0) {
      setPage(page - 1);
    } else if (
      direction === "next" &&
      (page + 1) * rowsPerPage < filteredOrders.length
    ) {
      setPage(page + 1);
    }
  };

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const sortOrders = (priceSortType, dateSortType) => {
    let sortedOrders = [...filteredOrders];
    if (priceSortType === "Önce en yüksek") {
      sortedOrders.sort((a, b) => b.total - a.total);
    } else if (priceSortType === "Önce en düşük") {
      sortedOrders.sort((a, b) => a.total - b.total);
    }

    if (dateSortType === "Önce en yeni") {
      sortedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (dateSortType === "Önce en eski") {
      sortedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredOrders(sortedOrders);
  };

  const handlePriceSortChange = (event) => {
    const sortType = event.target.value;
    setPriceSortType(sortType);
    sortOrders(sortType, dateSortType);
    setAnyFilterSelected(true);
  };

  const handleDateSortChange = (event) => {
    const sortType = event.target.value;
    setDateSortType(sortType);

    const sortedProducts = ([...products].sort = (a, b) => {
      const dateA = new Date(a.ORDERYIL, a.ORDERAY - 1, a.ORDERGUN);
      const dateB = new Date(b.ORDERYIL, b.ORDERAY - 1, b.ORDERGUN);
      if (sortType === "Önce en yeni") {
        return dateB - dateA;
      } else if (sortType === "Önce en eski") {
        return dateA - dateB;
      } else {
        return 0;
      }
    });
    setProducts(sortedProducts);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSelectedStatus("Tümü");
    setOrderDate("Tüm Tarihler");
    setPriceSortType("Fiyata Göre Sırala");
    setDateSortType("Tarihe Göre Sırala");
    setSelectAll("Toplu İşlemler");
    setAnyFilterSelected(false);
    setFilteredOrders(orders);
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.value);
  };

  const handleBulkUpdate = () => {
    let newStatus = "";
    switch (selectAll) {
      case "Hazırlanıyor":
        newStatus = "Hazırlanıyor";
        break;
      case "Kargoya verildi":
        newStatus = "Kargoya Verildi";
        break;
      case "Ödeme bekleniyor":
        newStatus = "Ödeme bekleniyor";
        break;
      case "Tamamlandı":
        newStatus = "Tamamlandı";
        break;
      case "İptal edildi":
        newStatus = "İptal edildi";
        break;
      default:
        break;
    }

    if (newStatus) {
      const updatedOrders = orders.map((order) => {
        if (selectedOrders.includes(order)) {
          return { ...order, status: newStatus };
        }
        return order;
      });

      setFilteredOrders(updatedOrders);
      setSelectedOrders([]);
      setSelectAll("Toplu İşlemler");
    }
  };

  const handleAllOrders = () => {
    setSelectedStatus("Tümü");
    setFilteredOrders(orders);
  };

  return (
    <>
      <div className="justify-between flex flex-wrap ">
        <div className="flex  gap-2 text-LightBlue flex-wrap text-base ">
          <span
            onClick={handleAllOrders}
            className={
              selectedStatus === "Tümü"
                ? "text-BaseDark cursor-pointer"
                : "cursor-pointer"
            }
          >
            <span>Tümü</span>
            <span>({orders.length})</span>
            <span className="text-CustomGray ml-1">|</span>
          </span>
          {statuses.map((status, index) => (
            <React.Fragment key={index}>
              <span
                onClick={() => filterStatus(status)}
                className={
                  selectedStatus === status
                    ? "text-BaseDark cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {status}
              </span>
              <span className="text-CustomGray">
                {" "}
                ({orderCounts[status] || 0})
              </span>
              {index !== statuses.length - 1 && (
                <span className="text-CustomGray">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex">
          <form action="" className="flex gap-2 w-72 ">
            <input
              value={searchValue}
              onChange={handleSearchChange}
              type="text"
              className="p-2 border  rounded-md w-full"
              placeholder="Sipariş ara"
            />
          </form>
        </div>
      </div>
      <div className="flex justify-between items-center py-3 flex-wrap">
        <div className="flex gap-4 flex-wrap">
          <div className="flex gap-2 mr-6">
            <select
              className={`p-1 border rounded-md text-CustomGray w-36 ${
                selectAll !== "Toplu İşlemler" ? "bg-NavyBlue text-white" : ""
              } ${
                selectedOrders.length === 0
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
              name="filterActions"
              value={selectAll}
              onChange={handleSelectAll}
            >
              <option hidden>Toplu İşlemler</option>
              <option>Toplu İşlemler</option>
              <option>Hazırlanıyor</option>
              <option>Kargoya verildi</option>
              <option>Ödeme bekleniyor</option>
              <option>Tamamlandı</option>
              <option>İptal edildi</option>
            </select>
            <button
              onClick={handleBulkUpdate}
              className={`px-1  text-NavyBlue border text-sm border-NavyBlue rounded-md ${
                selectAll === "Toplu İşlemler"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-NavyBlue hover:text-white"
              }`}
              disabled={selectAll === "Toplu İşlemler"}
            >
              Uygula
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              className={`p-1 border rounded-md text-BaseDark w-32 font-medium ${
                orderDate !== "Tüm Tarihler" ? "bg-NavyBlue text-white" : ""
              }`}
              name="filterDates"
              onChange={(e) => {
                const selectedDate = e.target.value;
                setOrderDate(selectedDate);
                filterOrders(searchValue, selectedStatus, selectedDate);
              }}
              value={orderDate}
            >
              <option>Tüm Tarihler</option>
              {uniqueDates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>

            <select className="" name="filterUsers">
              <option hidden>Kayıtlı Kullanıcılara göre Filtrele</option>
              <option>Kayıtlı Kullanıcılara göre Filtrele</option>
            </select>
            <select
              className={`${
                priceSortType === "Fiyata Göre Sırala"
                  ? ""
                  : "bg-NavyBlue text-white"
              }`}
              name="filterUsers"
              onChange={handlePriceSortChange}
              value={priceSortType}
            >
              <option hidden>Fiyata Göre Sırala</option>
              <option>Önce en yüksek</option>
              <option>Önce en düşük</option>
            </select>
            <select
              className={`${
                dateSortType === "Tarihe Göre Sırala"
                  ? ""
                  : "bg-NavyBlue text-white"
              }`}
              name="filterUsers"
              onChange={handleDateSortChange}
              value={dateSortType}
            >
              <option hidden>Tarihe Göre Sırala</option>
              <option>Önce en yeni</option>
              <option>Önce en eski</option>
            </select>
            <button
              onClick={handleClearFilters}
              className={`p-[6px]  font-[500] border text-NavyBlue  rounded-md text-sm whitespace-nowrap ${
                anyFilterSelected
                  ? "border-NavyBlue cursor-pointer hover:bg-NavyBlue hover:text-white"
                  : "text-NavyBlue opacity-50 border-gray-400 cursor-not-allowed"
              }`}
            >
              Filtre Temizle
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 ">
          <p className="text-CustomGray">{products.length} öge</p>
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
          <span className="border md:px-4 md:py-2 py-1 px-3 rounded-full bg-NavyBlue text-white">
            {page + 1}
          </span>
          <span>/ {Math.ceil(filteredOrders.length / rowsPerPage)}</span>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              (page + 1) * rowsPerPage >= filteredOrders.length
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("next")}
          >
            <MdKeyboardArrowRight />
          </div>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              (page + 1) * rowsPerPage >= filteredOrders.length
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("next")}
          >
            <MdKeyboardDoubleArrowRight />
          </div>
        </div>
      </div>
      <OrderListTable
        orders={paginatedOrders}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
      />
    </>
  );
};

export default OrderList;
