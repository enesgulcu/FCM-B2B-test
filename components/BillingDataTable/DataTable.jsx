"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPrint, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponents";
import "./printdata.css";
import Loading from "../Loading";
import { getAPI } from "../../services/fetchAPI/index";
import ScrollButtons from "../ScrollButtons/ScrollButtons";
import ExpandedTable from "./ExpandedTable";

// DataTable bileşeni: Kullanıcının cari hesap bilgilerini ve işlem geçmişini gösteren ana bileşen
export default function DataTable() {
  // NextAuth oturumu kullanarak kullanıcı bilgilerini alma
  const { data: session } = useSession();

  // State tanımlamaları
  const [data, setData] = useState([]); // Ana tablo verisi
  const [detailedData, setDetailedData] = useState([]); // Detaylı tablo verisi
  const [userCarBakiye, setUserCarBakiye] = useState(null); // Kullanıcı cari bakiyesi
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu
  const [borcToplam, setBorcToplam] = useState(0); // Toplam borç
  const [alacakToplam, setAlacakToplam] = useState(0); // Toplam alacak
  const [carBorcToplam, setCarBorcToplam] = useState(0); // Cari borç toplamı
  const [expandedRows, setExpandedRows] = useState([]); // Genişletilmiş satırlar
  const [allExpanded, setAllExpanded] = useState(false); // Tüm satırların genişletilme durumu

  // Kullanıcı oturumu başladığında verileri çekme
  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  // Verileri API'den çeken asenkron fonksiyon
  async function fetchData() {
    try {
      // Birden fazla API çağrısını paralel olarak yapma
      const [billingData, tableCartData, detailedBillings, fatfis] =
        await Promise.all([
          getAPI("/billings"),
          getAPI("/table-cart"),
          getAPI("/detailed-billings"),
          getAPI("/fatfis"),
        ]);

      // API yanıtlarının geçerliliğini kontrol etme
      if (!billingData || !tableCartData || !detailedBillings || !fatfis) {
        throw new Error("API hatası: Bir veya daha fazla API yanıt vermedi");
      }

      // Kullanıcıya ait verileri filtreleme
      const filteredData = billingData.data.filter(
        (item) => item.CARHARCARKOD === session.user.id
      );

      // Verileri tarih sırasına göre sıralama (eskiden yeniye)
      const sortedData = filteredData.sort((a, b) => {
        const dateA = new Date(a.CARHARTAR);
        const dateB = new Date(b.CARHARTAR);
        return dateA - dateB;
      });

      // Sıralanmış verileri state'e atama
      setData(sortedData);

      // Detaylı fatura verilerini işleme
      const enhancedDetailedData = enhanceBillingData(
        detailedBillings.data,
        fatfis.data,
        billingData.data
      );
      // Kullanıcıya ait detaylı verileri filtreleme ve state'e atama
      setDetailedData(
        enhancedDetailedData.filter(
          (item) => item.FATHARCARKOD === session.user.id
        )
      );

      // Kullanıcının cari kart bilgilerini bulma
      const userTableCartData = tableCartData.data.find(
        (item) => item.CARKOD === session.user.id
      );
      if (userTableCartData) {
        // Kullanıcı cari bilgilerini state'e atama
        setUserCarBakiye(userTableCartData.CARBAKIYE);
        setAlacakToplam(userTableCartData.CARALACAKTOP);
        setCarBorcToplam(userTableCartData.CARBORCTOP);
        setBorcToplam(
          userTableCartData.CARBORCTOP - userTableCartData.CARALACAKTOP
        );
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      // Yükleme durumunu sonlandırma
      setIsLoading(false);
    }
  }

  // Detaylı fatura verilerini işleyen yardımcı fonksiyon
  // Bu fonksiyon, farklı API'lerden gelen verileri birleştirerek daha kapsamlı bir veri seti oluşturur
  function enhanceBillingData(detailedBillings, fatfisData, billingsData) {
    return detailedBillings.reduce((acc, billing) => {
      // Eşleşen fatura fişini bulma
      const matchingFatfis = fatfisData.find(
        (ff) => ff.FATFISREFNO === billing.FATHARREFNO
      );
      if (matchingFatfis) {
        // Eşleşen fatura kaydını bulma
        const matchingBilling = billingsData.find(
          (b) => b.CARHARREFNO === matchingFatfis.FATFISCARREFNO
        );
        if (matchingBilling) {
          // Eşleşen verileri birleştirip yeni nesne oluşturma
          acc.push({
            ...billing,
            CARHARREFNO: matchingBilling.CARHARREFNO,
            CARHARACIKLAMA: matchingBilling.CARHARACIKLAMA,
            CARHARACIKLAMA1: matchingBilling.CARHARACIKLAMA1,
            CARHARISTIPKOD: matchingBilling.CARHARISTIPKOD,
          });
        }
      }
      return acc;
    }, []);
  }

  // Tarih formatını düzenleyen yardımcı fonksiyon
  // Gelen tarih string'ini Türkiye tarih formatına çevirir
  function formatDate(dateString) {
    return dateString ? new Date(dateString).toLocaleDateString("tr-TR") : "-";
  }

  // Para birimini formatlayan yardımcı fonksiyon
  // Sayısal değeri Türk Lirası formatında bir string'e çevirir
  function formatCurrency(amount) {
    return (
      amount?.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
      }) || "N/A"
    );
  }

  // Yazdırma işlemini başlatan fonksiyon
  function handlePrint() {
    window.print();
  }

  // Satır genişletme/daraltma işlemini yöneten fonksiyon
  // Tıklanan satırın genişletilme durumunu tersine çevirir
  function handleRowClick(carharRefNo) {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(carharRefNo)) {
        return prevExpandedRows.filter((refNo) => refNo !== carharRefNo);
      } else {
        return [...prevExpandedRows, carharRefNo];
      }
    });
  }

  // Tüm satırları açma/kapatma işlemini yöneten fonksiyon
  // Tüm satırların genişletilme durumunu tersine çevirir
  function handleToggleAllRows() {
    if (allExpanded) {
      setExpandedRows([]);
      setAllExpanded(false);
    } else {
      const allRefNos = data
        .filter((item) =>
          detailedData.some(
            (detailItem) => detailItem.CARHARREFNO === item.CARHARREFNO
          )
        )
        .map((item) => item.CARHARREFNO);
      setExpandedRows(allRefNos);
      setAllExpanded(true);
    }
  }

  // Yükleme durumunda Loading bileşenini gösterme
  if (isLoading) return <Loading />;

  // Ana bileşen render'ı
  return (
    <div className="print-section  min-h-screen pt-4 bg-[#dbdbdb]">
      {/* Üst bilgi bölümü */}
      <div className="max-w-[80%] mx-auto flex flex-col justify-between bg-white rounded-xl border-2 border-dashed border-[#1e3b606e] items-center px-8 gap-4 md:flex-row p-4">
        <div className="flex flex-col w-full md:w-auto">
          <div>
            <h1 className="text-xl lg:text-2xl text-blue-600">Cari Bilgisi</h1>
          </div>
          <div className="flex justify-between gap-8 items-center max-w-[100%]">
            <div className="flex lg:text-base text-sm flex-col text-center md:text-left">
              <div>
                <div className="font-normal">
                  <span className="font-bold text-NavyBlue">Cari Kodu:</span>{" "}
                  <span>{session?.user?.id}</span>
                </div>
              </div>
              <div>
                <div className="font-normal">
                  <span className="font-bold text-NavyBlue">Cari Unvanı:</span>{" "}
                  <span>{session?.user?.name}</span>
                </div>
              </div>
              <div>
                <div className="font-normal flex-col">
                  <span className="font-bold text-NavyBlue">Bakiye:</span>{" "}
                  <span>{formatCurrency(-userCarBakiye)} </span>
                  <span
                    className={`${
                      borcToplam > 0 ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {borcToplam < 0 ? "(ALACAK)" : "(BORÇ)"}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col text-sm text-center lg:text-base md:text-left">
              <div className="font-normal">
                <span className="font-bold text-NavyBlue">Borç Toplam:</span>
                <span className="ml-2 text-red-500">
                  {formatCurrency(carBorcToplam)}
                </span>
              </div>
              <div className="font-normal">
                <span className="font-bold text-NavyBlue">Alacak Toplam:</span>
                <span className="ml-2 text-green-500">
                  {formatCurrency(alacakToplam)}
                </span>
              </div>
              <div className="font-normal">
                <span className="font-bold text-NavyBlue">Genel Toplam:</span>
                <span
                  className={`ml-2 ${
                    borcToplam > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatCurrency(Math.abs(borcToplam))}
                  {borcToplam > 0 ? " (B)" : " (A)"}
                </span>
              </div>
            </div> */}
          </div>
        </div>

        {/* İşlem butonları */}
        <div className="flex gap-2 text-sm md:text-base">
          <button
            onClick={handleToggleAllRows}
            className="bg-NavyBlue text-white text-sm w-[90px] lg:w-auto px-2 lg:px-4 py-1 lg:py-2 rounded-full hover:bg-LightBlue transition duration-300 flex items-center no-print"
          >
            {allExpanded ? "Hepsini Kapat" : "Hepsini Aç"}
          </button>
          <button
            onClick={handlePrint}
            className="bg-NavyBlue text-white text-sm px-2 lg:px-4 py-1 lg:py-2 rounded-full hover:bg-LightBlue transition duration-300 flex items-center no-print"
          >
            <FaPrint className="mr-2" /> Yazdır
          </button>
        </div>
      </div>

      {/* Ana tablo bölümü */}
      <div className="max-w-[1880px] mx-auto mt-4 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-10">Tarih</TableHead>
              <TableHead className="py-4">İşlem</TableHead>
              <TableHead className="py-4">Vade Tarihi</TableHead>
              <TableHead className="py-4">Ek Açıklama</TableHead>
              <TableHead className="py-4">Açıklama</TableHead>
              <TableHead className="py-4">Borç</TableHead>
              <TableHead className="py-4">Alacak</TableHead>
              <TableHead className="py-4">Bakiye</TableHead>
              <TableHead className="py-4">Detaylar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .reduce((acc, item) => {
                // Borç ve alacak hesaplamaları
                const isBorc = item.CARHARGCFLAG === 1;
                const isAlacak = item.CARHARGCFLAG === 2;
                const borcAmount = isBorc ? item.CARHARTUTAR : 0;
                const alacakAmount = isAlacak ? item.CARHARTUTAR : 0;
                const previousBalance =
                  acc.length > 0 ? acc[acc.length - 1].balance : 0;
                const balance = previousBalance + borcAmount - alacakAmount;

                // Hesaplanan değerlerle yeni nesne oluşturma
                acc.push({
                  ...item,
                  borcAmount,
                  alacakAmount,
                  balance,
                });

                return acc;
              }, [])
              .map((item, index) => {
                const hasDetailedData = detailedData.some(
                  (detailItem) => detailItem.CARHARREFNO === item.CARHARREFNO
                );
                const isExpanded = expandedRows.includes(item.CARHARREFNO);
                return (
                  <React.Fragment key={item.CARHARREFNO}>
                    <TableRow
                      className={`${
                        isExpanded
                          ? "bg-blue-50 border-2 border-NavyBlue"
                          : index % 2 === 0
                          ? "bg-gray-100 hover:bg-gray-200"
                          : "bg-white hover:bg-gray-200"
                      } ${
                        hasDetailedData
                          ? "cursor-pointer"
                          : "cursor-not-allowed"
                      } transition-all duration-300`}
                      onClick={() =>
                        hasDetailedData && handleRowClick(item.CARHARREFNO)
                      }
                    >
                      <TableCell className="py-4 pl-4">
                        {formatDate(item.CARHARTAR)}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        {item.CARHARISTIPKOD}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        {formatDate(item.CARHARVADETAR) === "01.01.1900"
                          ? "-"
                          : formatDate(item.CARHARVADETAR)}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        {item.CARHARACIKLAMA1}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        {item.CARHARACIKLAMA}
                      </TableCell>
                      <TableCell
                        className={`py-4 pl-4 ${
                          item.borcAmount > 0 ? "text-red-500" : ""
                        }`}
                      >
                        {formatCurrency(item.borcAmount)}
                      </TableCell>
                      <TableCell
                        className={`py-4 pl-4 ${
                          item.alacakAmount > 0 ? "text-green-500" : ""
                        }`}
                      >
                        {formatCurrency(item.alacakAmount)}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        {formatCurrency(Math.abs(item.balance))}
                        {item.balance > 0
                          ? " (B)"
                          : item.balance < 0
                          ? " (A)"
                          : ""}
                      </TableCell>
                      <TableCell className="py-4 pl-4">
                        {hasDetailedData ? (
                          <div className="flex items-center">
                            {isExpanded ? (
                              <FaChevronUp className="text-blue-500" />
                            ) : (
                              <FaChevronDown />
                            )}
                            <span className="ml-2">
                              {isExpanded ? "Kapat" : "Stok Bilgisi"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Detay Yok</span>
                        )}
                      </TableCell>
                    </TableRow>
                    {isExpanded && hasDetailedData && (
                      <TableRow className="bg-white border-2 border-b-2 border-t-0 border-NavyBlue">
                        <TableCell colSpan={9} className="p-0">
                          <ExpandedTable
                            detailedData={detailedData.filter(
                              (fathar) =>
                                fathar.CARHARREFNO === item.CARHARREFNO
                            )}
                            formatDate={formatDate}
                            formatCurrency={formatCurrency}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
          </TableBody>
        </Table>
        <div className="text-right lg:max-w-[1880px] flex items-center justify-end py-8 px-4 gap-4 no-print"></div>
        <div className="flex justify-end no-print">
          <ScrollButtons />
        </div>
      </div>
    </div>
  );
}
