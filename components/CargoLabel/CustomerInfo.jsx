import { useEffect, useState } from "react";

const CustomerInfo = ({ order }) => {
  const [adresData, setAdresData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Adres verisi çekme
  useEffect(() => {
    const fetchAdresData = async () => {
      if (!order.CARKOD) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/adresler?adrKod1=${order.CARKOD}`);
        if (response.ok) {
          const data = await response.json();
          setAdresData(data[0]); // İlk kaydı al
        }
      } catch (error) {
        console.error("Adres verisi alınamadı:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdresData();
  }, [order.CARKOD]);

  // Alıcı bilgileri - ADRESLER tablosundan gelen veriler öncelikli
  const receiverName =
    order.CARUNVAN || order.CARKART?.CARUNVAN || "Müşteri Adı";

  const receiverPhone = adresData
    ? adresData.ADRTEL1?.trim() ||
      adresData.ADRTEL2?.trim() ||
      "Telefon bilgisi eksik"
    : order.TEL1 ||
      order.TEL2 ||
      order.CARKART?.CARTEL1 ||
      order.CARKART?.CARTEL2 ||
      "Telefon bilgisi eksik";

  // Adres bilgisini ADRESLER tablosundan kullan
  const receiverAddress = adresData
    ? `${adresData.ADRADRES1?.trim() || ""} ${
        adresData.ADRADRES2?.trim() || ""
      } ${adresData.ADRADRES3?.trim() || ""}`.trim()
    : `${order.ADRES || order.CARKART?.CARADRES || ""} ${
        order.ILCE || order.CARKART?.CARILCE || ""
      } / ${order.SEHIR || order.CARKART?.CARIL || ""}`;

  console.log("ORDER", order);
  console.log("ADRES DATA", adresData);

  return (
    <>
      {/* Alıcı Bilgileri */}
      <div className="mb-2 border border-black p-1.5">
        <div className="font-bold text-xs mb-1.5 text-left">
          Alıcı Bilgileri:
        </div>
        <div className="text-[9px] mb-0.5">
          <strong>CARKOD:</strong> {order.CARKOD}
        </div>
        <div className="text-[9px] mb-0.5">
          <strong>Ad Soyad:</strong> {receiverName}
        </div>
        <div className="text-[9px] mb-0.5">
          <strong>Adres:</strong>
        </div>
        <div className="text-[9px] leading-tight ml-2.5">
          {receiverAddress || "Adres bilgisi eksik"}
        </div>
        <div className="text-[9px] mt-0.5">
          <strong>Telefon:</strong> {receiverPhone}
        </div>
      </div>

      {/* Gönderici Bilgileri */}
      <div className="mb-2 border border-black p-1.5">
        <div className="font-bold text-xs mb-1.5 text-left">
          Gönderici Bilgileri:
        </div>
        <div className="text-[9px] mb-0.5">
          <strong>Ad Soyad:</strong> Murat Müftüoğlu, İstanbul Murat Yayıncılık Dağ. Paz. San. Tic. Ltd. Şti.
        </div>
        <div className="text-[9px] mb-0.5">
          <strong>Adres:</strong> Sefaköy Küçükçekmece /İstanbul Kartaltepe mahallesi 5.şirin sokak no 6-8 
        </div>
        <div className="text-[9px] mt-0.5">
          <strong>Telefon:</strong> +90 555 001 39 12
        </div>
      </div>
    </>
  );
};

export default CustomerInfo;
