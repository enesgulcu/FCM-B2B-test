import React, { useState, useEffect } from "react";
import { putAPI, postAPI } from "@/services/fetchAPI";
import CargoInfoModal from "../CustomerOrders/CargoInfoModal";

// 12 haneli alfa-numerik (A-Z,0-9) deterministik anahtar (client-safe, salt/hash yok)
const derive12CharKey = (seed) => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const s = ((seed || "") + "|YK").toString();
  // Seeded LCG
  let x = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    x = (x ^ s.charCodeAt(i)) >>> 0;
    x = Math.imul(x, 16777619) >>> 0; // FNV-1a benzeri
  }
  let out = "";
  for (let i = 0; i < 12; i++) {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0; // LCG
    out += alphabet[x % alphabet.length];
  }
  return out;
};

const kargoFirmalari = [
  "Aras Kargo",
  "Yurtiçi Kargo",
  "MNG Kargo",
  "Ptt Kargo",
];

const KargoUpdateModal = ({ isOpen, setIsOpen, order, updateOrderStatus }) => {
  const [kargoFirmasi, setKargoFirmasi] = useState("");
  const [kargoTakipNo, setKargoTakipNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdCargoKey, setCreatedCargoKey] = useState(null);
  const [addressInfo, setAddressInfo] = useState(null);
  const [emailInfo, setEmailInfo] = useState(null);
  const [showCargoInfo, setShowCargoInfo] = useState(false);
  const [cargoInfo, setCargoInfo] = useState(null);

  useEffect(() => {
    if (isOpen && order?.CARKOD) {
      // Adres bilgilerini çek
      getAddressData(order.CARKOD).then((data) => {
        setAddressInfo(data);
      });

      // E-mail bilgilerini çek
      getEmailData(order.CARKOD).then((data) => {
        setEmailInfo(data);
      });
    }
  }, [isOpen, order?.CARKOD]);

  // Adres bilgilerini CARKOD ile çek
  const getAddressData = async (carkod) => {
    try {
      const response = await fetch(`/api/adresler?adrKod1=${carkod}`);
      if (response.ok) {
        const addressData = await response.json();
        return addressData && addressData.length > 0 ? addressData[0] : null;
      } else {
        console.error("❌ Address API error:", response.status);
        return null;
      }
    } catch (error) {
      console.error("❌ Address query error:", error);
      return null;
    }
  };

  // E-mail bilgilerini CARKART tablosundan çek
  const getEmailData = async (carkod) => {
    try {
      const url = `/api/carkart?carkod=${encodeURIComponent(carkod)}`;

      const response = await fetch(url);
      if (response.ok) {
        const emailData = await response.json();
        console.log("📧 CARKART API response:", emailData);
        return emailData && emailData.length > 0 ? emailData[0] : null;
      } else {
        const errorText = await response.text();
        console.error("❌ CARKART API error:", response.status, errorText);
        return null;
      }
    } catch (error) {
      console.error("❌ E-mail query error:", error);
      return null;
    }
  };

  // Yurtiçi Kargo'da kargo oluştur
  const handleCreateShipment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let receiverAddress = order.ADRES || "";
      if (addressInfo) {
        // ADRESLER tablosundaki field'ları kullan
        const fullAddress = `${addressInfo.ADRADRES1?.trim() || ""} ${
          addressInfo.ADRADRES2?.trim() || ""
        } ${addressInfo.ADRADRES3?.trim() || ""}`.trim();
        if (fullAddress) {
          receiverAddress = fullAddress;
        }
      }

      // Adres validasyonu - min 10, max 500 karakter
      if (receiverAddress.length < 10) {
        receiverAddress = receiverAddress + " - Tam adres bilgisi eksik";
      }
      if (receiverAddress.length > 500) {
        receiverAddress = receiverAddress.substring(0, 497) + "...";
      }

      // ADRESLER tablosundaki field'ları kullan
      const finalReceiverPhone =
        order.TEL1 ||
        addressInfo?.ADRTEL1?.trim() ||
        addressInfo?.ADRTEL2?.trim() ||
        "Telefon bilgisi eksik";

      const finalCityName =
        order.SEHIR || addressInfo?.ADRIL || "İl bilgisi eksik";

      const finalTownName =
        order.ILCE || addressInfo?.ADRILCE || "İlçe bilgisi eksik";

      const finalEmailAddress =
        order.EMAIL ||
        emailInfo?.EMAIL?.trim() ||
        addressInfo?.ADREMAIL ||
        "test@example.com";

      console.log("📧 Final Email:", finalEmailAddress);

      // 12 haneli uniq cargoKey: öncelik sipariş anında üretilen KARGOTAKIPNO; yoksa deterministik üret
      const shortCargoKey = order.KARGOTAKIPNO
        ? String(order.KARGOTAKIPNO)
            .toUpperCase()
            .replace(/[^0-9A-Z]/g, "")
            .slice(0, 12)
        : derive12CharKey(order.ORDERNO);

      const createData = {
        cargoKey: shortCargoKey,
        invoiceKey: shortCargoKey,
        receiverCustName: order.CARUNVAN,
        receiverAddress: receiverAddress,
        receiverPhone1: finalReceiverPhone,
        emailAddress: finalEmailAddress,
        cityName: finalCityName,
        townName: finalTownName,
        cargoCount: 1,
      };

      console.log("📋 Create data hazırlandı:", createData);
      const createResponse = await postAPI("/shipping", createData);
      console.log("📡 createShipment API yanıtı:", createResponse);

      if (createResponse.success) {
        // CargoKey'i kaydet
        const cargoKey = createResponse.cargoKey || shortCargoKey;
        setCreatedCargoKey(cargoKey);

        setCargoInfo({
          loading: false,
          success: true,
          message: `Kargo başarıyla oluşturuldu!\n\nCargoKey: ${cargoKey}\nDurum: ${createResponse.outResult}\n\n🏷️ Etiket butonuna tıklayarak barkod etiketini yazdırabilirsiniz!`,
        });
        setShowCargoInfo(true);

        // Kargo durumunu güncelle
        const updateResponse = await putAPI("/update-kargo-status", {
          ORDERNO: order.ORDERNO,
          KARGO: "Yurtiçi Kargo",
          KARGOTAKIPNO: cargoKey,
          ORDERSTATUS: "Kargoya Verildi",
        });

        if (updateResponse.success) {
          updateOrderStatus(order.ORDERNO, "Kargoya Verildi");
          // Modal'ı kapatmıyoruz, etiket oluşturmak için açık kalacak
        }
      } else {
        // Hata detaylarını göster
        const errorMsg = createResponse.errorMessage
          ? `❌ Hata: ${createResponse.errorMessage}\nKod: ${createResponse.errorCode}\nDetay: ${createResponse.outResult}`
          : `❌ Hata: ${createResponse.outResult}`;

        setCargoInfo({
          loading: false,
          error: true,
          message: errorMsg,
        });
        setShowCargoInfo(true);
        throw new Error(
          createResponse.errorMessage ||
            createResponse.outResult ||
            "Kargo oluşturulamadı"
        );
      }
    } catch (error) {
      console.error("❌ Create shipment hatası:", error);
      setError(error.message || "Kargo oluşturma başarısız oldu.");
    } finally {
      setIsLoading(false);
    }
  };

  // Kargo durumu sorgula
  const handleQueryShipment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("🔍 Kargo durumu sorgulama başlatılıyor...");
      console.log("📦 Order bilgileri:", order);

      const shortCargoKey = order.KARGOTAKIPNO
        ? String(order.KARGOTAKIPNO)
            .toUpperCase()
            .replace(/[^0-9A-Z]/g, "")
            .slice(0, 12)
        : derive12CharKey(order.ORDERNO);

      const queryData = {
        cargoKey: shortCargoKey,
        invCustId: (order.CARKOD || "").toString().replace(/\s+/g, ""), // Fatura müşteri kodu (boşluklar temizlendi)
        senderCustId: "312852446", // Gerçek müşteri kodu (canlı ortam)
        receiverCustId: (order.CARKOD || "").toString().replace(/\s+/g, ""), // Alıcı müşteri kodu (boşluklar temizlendi)
      };

      console.log("📋 Query data hazırlandı:", queryData);
      const queryResponse = await postAPI("/shipping/track", queryData);
      console.log("📡 trackShipment API yanıtı:", queryResponse);

      if (queryResponse.success) {
        setCargoInfo({
          loading: false,
          trackingNo: shortCargoKey,
          company: "Yurtiçi Kargo",
          status: queryResponse.status || "Durum bilgisi yok",
          deliveryDate: queryResponse.deliveryDate || "Tarih bilgisi yok",
          receiverName: queryResponse.receiverName || "Bilgi yok",
          trackingUrl: queryResponse.trackingUrl || "Takip linki yok",
        });
        setShowCargoInfo(true);
      } else {
        // Test ortamında bu normal bir durum
        setCargoInfo({
          loading: false,
          error: true,
          message: `Sorgu Sonucu: ${queryResponse.outResult}\n\n`,
        });
        setShowCargoInfo(true);
      }
    } catch (error) {
      console.error("❌ Query shipment hatası:", error);
      setError(error.message || "Kargo sorgulama başarısız oldu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleYurticiKargo = async () => {
    // Bu fonksiyon artık sadece create işlemi yapacak
    await handleCreateShipment();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (kargoFirmasi === "Yurtiçi Kargo") {
      await handleYurticiKargo();
    } else {
      // Mevcut manuel güncelleme mantığı
      setIsLoading(true);
      setError(null);
      try {
        const response = await putAPI("/update-kargo-status", {
          ORDERNO: order.ORDERNO,
          KARGO: kargoFirmasi,
          KARGOTAKIPNO: kargoTakipNo,
          ORDERSTATUS: "Kargoya Verildi",
        });

        if (response.success) {
          updateOrderStatus(order.ORDERNO, "Kargoya Verildi");
          setCargoInfo({
            loading: false,
            success: true,
            message: "Kargo bilgileri başarıyla güncellendi.",
          });
          setShowCargoInfo(true);
          setIsOpen(false);
        } else {
          setError(response.message || "Bir hata oluştu");
        }
      } catch (error) {
        console.error("Error updating kargo status:", error);
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Kargo Bilgilerini Güncelle
        </h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={kargoFirmasi}
            onChange={(e) => setKargoFirmasi(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Kargo Firması Seçin</option>
            {kargoFirmalari.map((firma) => (
              <option key={firma} value={firma}>
                {firma}
              </option>
            ))}
          </select>
          {kargoFirmasi !== "Yurtiçi Kargo" && (
            <input
              type="text"
              value={kargoTakipNo}
              onChange={(e) => setKargoTakipNo(e.target.value)}
              placeholder="Kargo Takip No"
              className="mt-4 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          )}
          {/* Yurtiçi Kargo için özel buton dizilimi */}
          {kargoFirmasi === "Yurtiçi Kargo" ? (
            <div className="mt-6 space-y-3">
              {/* Yurtiçi Kargo butonları - 2 adet */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center py-2.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  onClick={handleQueryShipment}
                  disabled={isLoading}
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {isLoading ? "Sorgulanıyor" : "Kargo Sorgula"}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center py-2.5 px-3 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  disabled={isLoading}
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  {isLoading ? "Oluşturuluyor" : "Kargo Oluştur"}
                </button>
              </div>

              {/* Alt sıra - İptal butonu */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-8 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            /* Diğer kargo firmaları için normal düzen */
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                İptal
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? "Güncelleniyor..." : "Güncelle"}
              </button>
            </div>
          )}
        </form>
      </div>

      <CargoInfoModal
        showCargoInfo={showCargoInfo}
        setShowCargoInfo={setShowCargoInfo}
        cargoInfo={cargoInfo}
      />
    </div>
  );
};

export default KargoUpdateModal;
