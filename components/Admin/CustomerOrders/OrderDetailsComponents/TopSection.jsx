export default function TopSection({
  day,
  month,
  year,
  time,
  totalQuantity,
  totalPrice,
  orderStatus,
}) {
  const statusColors = {
    Beklemede: "bg-[#e5e5e5] text-[#80808b]",
    Hazırlanıyor: "bg-[#c7d8e2] text-[#324356]",
    "Ödeme Bekleniyor": "bg-[#f8dda5] text-[#876b17]",
    "Sipariş Oluşturuldu": "bg-[#f8dda5] text-[#876b17]",
    Tamamlandı: "bg-[#c7e1c7] text-[#5d7b45]",
    İptal: "bg-[#e3e5e3] text-[#7a7a7c]",
    Başarısız: "bg-[#eaa4a4] text-[#762024]",
  };
  return (
    <>
      <div id="top-section" className="w-full">
        <div id="categories" className="flex rounded-t-xl border-b xl:py-2.5">
          <a
            href="#"
            className="text-xs md:text-base text-left ms-2 p-0.5 py-2 border-b-2 border-blue-600"
          >
            SİPARİŞ DETAYLARI
          </a>
        </div>
        <div
          id="content"
          className="flex justify-between items-center p-3 xl:py-6 shadow-md rounded-xl"
        >
          <div>
            <h1 className="font-bold text-sm md:text-sm mb-3">GENEL BAKIŞ</h1>
            <ul className="flex flex-col gap-3">
              <li className="text-sm">
                <span className="font-semibold">Sipariş Tarihi: </span> {day}/
                {month}/{year}
              </li>
              <li className="text-sm">
                <span className="font-semibold">Sipariş Saati: </span> {time}
              </li>
              <li className="text-sm">
                <span className="font-semibold">Toplam Ürün Adedi: </span>
                {totalQuantity}
              </li>
              <li className="text-sm">
                <span className="font-semibold">Toplam Tutar: </span>
                {totalPrice}
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 justify-center items-center ml-2 mr-8 md:mr-36">
            <span>Sipariş Durumu</span>
            <span
              className={`rounded-lg px-8 py-3 md:px-16 md:py-4 ${statusColors[orderStatus]}`}
            >
              {orderStatus}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
