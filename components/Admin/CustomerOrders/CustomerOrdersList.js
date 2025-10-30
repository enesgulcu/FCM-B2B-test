"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import CustomerOrdersListTable from "./CustomerOrdersListTable";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { getAPI } from "@/services/fetchAPI";
import { statusList } from "./data";
import CustomerOrdersSkeleton from "./CustomerOrdersSkeleton";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

// Cache için 10 dakikalık süre (milisaniye cinsinden)
const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika

const CustomerOrdersList = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activePage = parseInt(searchParams.get("page") || "1", 10);
  const activeFilter = searchParams.get("filterBy") || null;
  const activeSearchCarkod = searchParams.get("searchCarkod") || "";
  const activeSearchUnvan = searchParams.get("searchUnvan") || "";

  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // Tüm siparişler için ayrı state

  const [filteredOrders, setFilteredOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState(activeSearchCarkod);
  const [searchTermUnvan, setSearchTermUnvan] = useState(activeSearchUnvan);

  const rowsPerPage = 10;

  const [selectedStatus, setSelectedStatus] = useState("Tümü");

  const [isLoading, setIsLoading] = useState(true);

  const [statusCounts, setStatusCounts] = useState({});

  const [totalPages, setTotalPages] = useState(1);

  // Cache için ref kullanıyoruz (component re-render olsa bile cache korunur)
  const cacheRef = useRef({});
  const metricsCacheRef = useRef({});

  // Status counts'u ref'te tut - sadece ilk yüklemede ve filtre değişikliğinde güncelle
  const statusCountsRef = useRef({});

  // Total pages'i de ref'te tut - her sayfada kullanmak için
  const totalPagesRef = useRef(0);

  const createPageString = useCallback(
    (page) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      return params.toString();
    },
    [searchParams]
  );

  function handlePageChange(page) {
    if (page === activePage) return; // No need to change if the same page is clicked

    const newParams = createPageString(page);
    router.replace(pathname + "?" + newParams, {
      scroll: false,
    });
  }

  const handleFilter = (filter) => {
    const params = new URLSearchParams(searchParams.toString());

    if (filter) {
      if (filter === activeFilter) {
        params.delete("filterBy");
      } else {
        params.set("filterBy", filter);
      }
    } else {
      params.delete("filterBy");
    }

    // Filtre değiştiğinde sayfayı 1'e sıfırla
    params.delete("page");

    router.replace(pathname + "?" + params.toString());
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchOrders = async () => {
      try {
        const cacheKey = `orders_page_${activePage}_filter_${
          activeFilter || "all"
        }_carkod_${activeSearchCarkod}_unvan_${activeSearchUnvan}`;
        const now = Date.now();

        if (
          cacheRef.current[cacheKey] &&
          now - cacheRef.current[cacheKey].timestamp < CACHE_DURATION
        ) {
          const cachedData = cacheRef.current[cacheKey].data;
          if (!isCancelled) {
            setOrders(cachedData.orders || []);
            setAllOrders(cachedData.orders || []);
            setFilteredOrders(cachedData.orders || []);
            setSelectedStatus(activeFilter || "Tümü");
            setTotalPages(totalPagesRef.current || 1);
            setIsLoading(false);
          }
          return;
        }

        setIsLoading(true);

        const params = new URLSearchParams();
        params.append("page", activePage);
        if (activeFilter && activeFilter !== "Tümü") {
          params.append("filterBy", activeFilter);
        }
        if (activeSearchCarkod) {
          params.append("searchCarkod", activeSearchCarkod);
        }
        if (activeSearchUnvan) {
          params.append("searchUnvan", activeSearchUnvan);
        }

        const response = await getAPI(`/adminorders?${params.toString()}`);

        if (isCancelled) {
          return;
        }

        cacheRef.current[cacheKey] = {
          data: response,
          timestamp: now,
        };

        setOrders(response.orders || []);
        setAllOrders(response.orders || []);
        setFilteredOrders(response.orders || []);

        if (response.pagination && response.pagination.totalPages !== null) {
          const safeTotalPages = Math.max(
            response.pagination.totalPages || 1,
            1
          );
          totalPagesRef.current = safeTotalPages;
          setTotalPages(safeTotalPages);
        } else {
          setTotalPages(totalPagesRef.current || 1);
        }

        setSelectedStatus(activeFilter || "Tümü");
        setIsLoading(false);
      } catch (err) {
        if (!isCancelled) {
          console.error("Error fetching data:", err);
          setIsLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      isCancelled = true;
    };
  }, [activePage, activeFilter, activeSearchCarkod, activeSearchUnvan]);

  useEffect(() => {
    let isCancelled = false;

    const fetchMetrics = async () => {
      try {
        const cacheKey = `metrics_filter_${
          activeFilter || "all"
        }_carkod_${activeSearchCarkod}_unvan_${activeSearchUnvan}`;
        const now = Date.now();

        if (
          metricsCacheRef.current[cacheKey] &&
          now - metricsCacheRef.current[cacheKey].timestamp < CACHE_DURATION
        ) {
          const cachedMetrics = metricsCacheRef.current[cacheKey].data;
          if (!isCancelled) {
            const safeTotalPages = Math.max(cachedMetrics.totalPages || 1, 1);
            statusCountsRef.current = cachedMetrics.statusCounts || {};
            setStatusCounts(cachedMetrics.statusCounts || {});
            totalPagesRef.current = safeTotalPages;
            setTotalPages(safeTotalPages);
          }
          return;
        }

        const params = new URLSearchParams();
        params.append("rowsPerPage", rowsPerPage.toString());
        if (activeFilter && activeFilter !== "Tümü") {
          params.append("filterBy", activeFilter);
        }
        if (activeSearchCarkod) {
          params.append("searchCarkod", activeSearchCarkod);
        }
        if (activeSearchUnvan) {
          params.append("searchUnvan", activeSearchUnvan);
        }

        const response = await getAPI(
          `/adminorders/metrics?${params.toString()}`
        );

        if (isCancelled) {
          return;
        }

        const safeTotalPages = Math.max(response?.totalPages || 1, 1);
        const nextStatusCounts = response?.statusCounts || {};

        statusCountsRef.current = nextStatusCounts;
        setStatusCounts(nextStatusCounts);

        totalPagesRef.current = safeTotalPages;
        setTotalPages(safeTotalPages);

        metricsCacheRef.current[cacheKey] = {
          data: {
            ...response,
            totalPages: safeTotalPages,
          },
          timestamp: now,
        };
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching metrics:", error);
        }
      }
    };

    fetchMetrics();

    return () => {
      isCancelled = true;
    };
  }, [activeFilter, activeSearchCarkod, activeSearchUnvan, rowsPerPage]);

  const filteredProd = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    filteredProd(status);
  };

  const updateOrderStatus = (orderno, newStatus) => {
    const existingOrder = orders.find((order) => order.ORDERNO === orderno);
    const previousStatus = existingOrder?.ORDERSTATUS;

    // Cache'i temizle (veri değiştiği için)
    cacheRef.current = {};
    metricsCacheRef.current = {};

    const updateOrders = (orderList) =>
      orderList.map((order) =>
        order.ORDERNO === orderno ? { ...order, ORDERSTATUS: newStatus } : order
      );

    setOrders((prevOrders) => updateOrders(prevOrders));
    setFilteredOrders((prevFiltered) => updateOrders(prevFiltered));
    setAllOrders((prevAll) => updateOrders(prevAll));

    if (previousStatus && previousStatus !== newStatus) {
      setStatusCounts((prevCounts) => {
        const nextCounts = { ...prevCounts };
        if (nextCounts[previousStatus]) {
          nextCounts[previousStatus] = Math.max(
            nextCounts[previousStatus] - 1,
            0
          );
        }
        nextCounts[newStatus] = (nextCounts[newStatus] || 0) + 1;
        statusCountsRef.current = nextCounts;
        return nextCounts;
      });
    }
  };

  // Pagination is driven by the `page` query param (activePage).
  // Navigation is done by `handlePageChange`, which updates the URL.

  // Debounced search function - 300ms delay
  const debouncedSearch = useDebouncedCallback((value, type) => {
    const params = new URLSearchParams(searchParams.toString());

    if (type === "carkod") {
      if (value) {
        params.set("searchCarkod", value);
      } else {
        params.delete("searchCarkod");
      }
    } else if (type === "unvan") {
      if (value) {
        params.set("searchUnvan", value);
      } else {
        params.delete("searchUnvan");
      }
    }

    // Search değiştiğinde sayfayı 1'e sıfırla
    params.delete("page");

    // Cache'i temizle (search değiştiği için)
    cacheRef.current = {};
    metricsCacheRef.current = {};

    router.replace(pathname + "?" + params.toString());
  }, 300); // 300ms debounce

  const handleSearch = (e, type) => {
    const value = e.target.value;

    // State'i hemen güncelle (UI responsiveness için)
    if (type === "carkod") {
      setSearchTerm(value);
      // Unvan inputunu sıfırla
      if (value) {
        setSearchTermUnvan("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("searchUnvan");
        params.delete("page");
        if (value) {
          params.set("searchCarkod", value);
        }
        // Cache'i temizle
        cacheRef.current = {};
        metricsCacheRef.current = {};
        router.replace(pathname + "?" + params.toString());
        return;
      }
    } else if (type === "unvan") {
      setSearchTermUnvan(value);
      // Carkod inputunu sıfırla
      if (value) {
        setSearchTerm("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("searchCarkod");
        params.delete("page");
        if (value) {
          params.set("searchUnvan", value);
        }
        // Cache'i temizle
        cacheRef.current = {};
        metricsCacheRef.current = {};
        router.replace(pathname + "?" + params.toString());
        return;
      }
    }

    // Debounced URL update
    debouncedSearch(value, type);
  };

  // Backend'den gelen veriyi direkt kullanıyoruz
  const paginatedOrders = filteredOrders;

  return (
    <>
      <div className="flex flex-wrap justify-center md:justify-between items-center py-3">
        <div className="justify-between items-center flex flex-wrap">
          <div className="flex gap-2 text-LightBlue flex-wrap mb-4 md:mb-0">
            <select
              value={selectedStatus}
              onChange={(e) => {
                handleStatusChange(e);

                handleFilter(e.target.value === "Tümü" ? null : e.target.value);
              }}
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
            onChange={(e) => handleSearch(e, "carkod")}
            className="p-2 border rounded-md border-NavyBlue text-BaseDark focus:outline-none focus:border-NavyBlue focus:ring-1 focus:ring-NavyBlue"
          />
          <input
            type="text"
            placeholder="Cari Unvana Göre Filtrele.."
            value={searchTermUnvan}
            onChange={(e) => handleSearch(e, "unvan")}
            className="p-2 border rounded-md border-NavyBlue text-BaseDark focus:outline-none focus:border-NavyBlue focus:ring-1 focus:ring-NavyBlue"
          />
        </div>
        <div className="flex items-center gap-2 ">
          <p className="text-CustomGray">{rowsPerPage} öge</p>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              activePage === 1
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => {
              handlePageChange(1);
            }}
          >
            <MdKeyboardDoubleArrowLeft />
          </div>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              activePage === 1
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => {
              handlePageChange(Math.max(activePage - 1, 1));
            }}
          >
            <MdKeyboardArrowLeft />
          </div>
          <span className="border  md:px-4 md:py-2 py-1 px-3 rounded-full bg-NavyBlue text-white">
            {activePage}
          </span>
          <span>/ {totalPages}</span>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              activePage === totalPages
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => {
              handlePageChange(Math.min(activePage + 1, totalPages));
            }}
          >
            <MdKeyboardArrowRight />
          </div>
          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              activePage === totalPages
                ? "cursor-not-allowed text-gray-300 "
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => {
              handlePageChange(totalPages);
            }}
          >
            <MdKeyboardDoubleArrowRight />
          </div>
        </div>
      </div>
      {isLoading ? (
        <CustomerOrdersSkeleton />
      ) : (
        <CustomerOrdersListTable
          orders={paginatedOrders}
          allOrders={allOrders}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </>
  );
};

export default CustomerOrdersList;
