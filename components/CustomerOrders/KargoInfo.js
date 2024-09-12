import React from "react";

function KargoInfo({ orderKargoCompany, orderKargoTrackingNo }) {
  if (!orderKargoCompany && !orderKargoTrackingNo) return null;
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      {orderKargoCompany && orderKargoTrackingNo && (
        <div className="flex flex-col gap-2">
          <span className="text-[#295F98] text-2xl font-bold">
            Kargo Bilgileri
          </span>
          <span className="text-md">
            <span className="text-[#295F98] font-bold">Kargo Şirketi:</span>{" "}
            {orderKargoCompany}
          </span>
          <span className="text-md">
            <span className="text-[#295F98] font-bold">Kargo Takip No:</span>{" "}
            {orderKargoTrackingNo}
          </span>
        </div>
      )}
    </div>
  );
}

export default KargoInfo;
