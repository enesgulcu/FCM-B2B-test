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
import Loading from "@/components/Loading";
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

  const [totalPages, setTotalPages] = useState(0);

  // Cache için ref kullanıyoruz (component re-render olsa bile cache korunur)
  const cacheRef = useRef({});

  // Status counts'u ref'te tut - sadece ilk yüklemede ve filtre değişikliğinde güncelle
  const statusCountsRef = useRef({});

  // Total pages'i de ref'te tut - her sayfada kullanmak için
  const totalPagesRef = useRef(0);

  // Son filtre değerini takip et - filtre değiştiğinde status counts'u yeniden çek
  const lastFilterRef = useRef(activeFilter);

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
    const fetch = async () => {
      try {
        // Filtre değişti mi kontrol et
        const filterChanged = lastFilterRef.current !== activeFilter;
        if (filterChanged) {
          lastFilterRef.current = activeFilter;
        }

        // Search var mı kontrol et
        const hasSearch = !!(activeSearchCarkod || activeSearchUnvan);

        // Status counts'u sadece ilk yüklemede, filtre değiştiğinde güncelle
        const shouldFetchStatusCounts =
          Object.keys(statusCountsRef.current).length === 0 || filterChanged;

        // Cache key oluştur (sayfa + filtre + search kombinasyonu)
        const cacheKey = `page_${activePage}_filter_${
          activeFilter || "all"
        }_carkod_${activeSearchCarkod}_unvan_${activeSearchUnvan}`;
        const now = Date.now();

        // Cache'de var mı ve süresi dolmamış mı kontrol et
        if (
          cacheRef.current[cacheKey] &&
          now - cacheRef.current[cacheKey].timestamp < CACHE_DURATION
        ) {
          // Cache'den veriyi al
          const cachedData = cacheRef.current[cacheKey].data;
          setOrders(cachedData.orders || []);
          setAllOrders(cachedData.orders || []);
          setFilteredOrders(cachedData.orders || []);

          // Pagination bilgisini güncelle
          if (
            cachedData.pagination &&
            cachedData.pagination.totalPages !== null
          ) {
            totalPagesRef.current = cachedData.pagination.totalPages;
            setTotalPages(cachedData.pagination.totalPages);
          } else if (totalPagesRef.current) {
            // Cache'de yoksa ama ref'te varsa onu kullan
            setTotalPages(totalPagesRef.current);
          }

          // Status counts cache'den alınabiliyorsa al
          if (
            cachedData.statusCounts &&
            Object.keys(cachedData.statusCounts).length > 0
          ) {
            statusCountsRef.current = cachedData.statusCounts;
            setStatusCounts(cachedData.statusCounts);
          } else if (Object.keys(statusCountsRef.current).length > 0) {
            // Cache'de yoksa ama ref'te varsa onu kullan
            setStatusCounts(statusCountsRef.current);
          }

          if (activeFilter) {
            setSelectedStatus(activeFilter);
          } else {
            setSelectedStatus("Tümü");
          }

          setIsLoading(false);
          return; // Cache'den aldık, API'ye istek atmaya gerek yok
        }

        // Cache'de yoksa veya süresi dolmuşsa API'ye istek at
        setIsLoading(true);
        const params = new URLSearchParams();
        params.append("page", activePage);
        if (activeFilter && activeFilter !== "Tümü") {
          params.append("filterBy", activeFilter);
        }

        // Search parametrelerini ekle
        if (activeSearchCarkod) {
          params.append("searchCarkod", activeSearchCarkod);
        }
        if (activeSearchUnvan) {
          params.append("searchUnvan", activeSearchUnvan);
        }

        // Status counts'u sadece gerektiğinde iste
        // Search varsa veya shouldFetchStatusCounts true ise iste
        if (shouldFetchStatusCounts || hasSearch) {
          params.append("includeStatusCounts", "true");
        }

        const response = await getAPI(`/adminorders?${params.toString()}`);

        // Pagination bilgisini her zaman güncelle
        if (response.pagination && response.pagination.totalPages !== null) {
          totalPagesRef.current = response.pagination.totalPages;
          setTotalPages(response.pagination.totalPages);
        } else if (totalPagesRef.current) {
          // Response'da yoksa ama ref'te varsa onu kullan
          setTotalPages(totalPagesRef.current);
        }

        // Status counts geldi mi kontrol et ve kaydet
        if (
          response.statusCounts &&
          Object.keys(response.statusCounts).length > 0
        ) {
          statusCountsRef.current = response.statusCounts;
          setStatusCounts(response.statusCounts);
        } else {
          // Status counts gelmedi, ref'teki değeri kullan
          setStatusCounts(statusCountsRef.current);
        }

        // Cache'e kaydet
        cacheRef.current[cacheKey] = {
          data: response,
          timestamp: now,
        };

        setOrders(response.orders || []);
        setAllOrders(response.orders || []); // allOrders'ı da güncelle
        setFilteredOrders(response.orders || []);

        // activeFilter varsa selectedStatus'u güncelle
        if (activeFilter) {
          setSelectedStatus(activeFilter);
        } else {
          setSelectedStatus("Tümü");
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setIsLoading(false);
      }
    };
    fetch();
  }, [activePage, activeFilter, activeSearchCarkod, activeSearchUnvan]);

  const filteredProd = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    filteredProd(status);
  };

  const updateOrderStatus = (orderno, newStatus) => {
    // Cache'i temizle (veri değiştiği için)
    cacheRef.current = {};

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

    router.replace(pathname + "?" + params.toString());
  }, 300); // 300ms debounce

  const handleSearch = (e, type) => {
    const value = e.target.value;

    // State'i hemen güncelle (UI responsiveness için)
    if (type === "carkod") {
      setSearchTerm(value);
    } else if (type === "unvan") {
      setSearchTermUnvan(value);
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
