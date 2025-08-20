import React, { useRef, useState } from "react";
import BarcodeSection from "./BarcodeSection";
import CustomerInfo from "./CustomerInfo";
import LabelHeader from "./LabelHeader";
import { downloadPDF, cleanCargoKey } from "./utils/pdfUtils";

const CargoLabel = ({ order, onClose }) => {
  const labelRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // PDF indirme handler (aşağıda hesaplanan anahtar ile)
  const [currentKey, setCurrentKey] = useState(null);

  if (!order || !order.KARGOTAKIPNO) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <p className="text-red-600 mb-4">
            ⚠️ Etiket oluşturmak için sipariş ve KARGOTAKIPNO gerekli!
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Kapat
          </button>
        </div>
      </div>
    );
  }

  // Doğrudan KARGOTAKIPNO kullan
  const primaryKey = order.KARGOTAKIPNO;
  const rawKey = (primaryKey ?? "")
    .toString()
    .toUpperCase()
    .replace(/[^0-9A-Z]/g, "")
    .slice(0, 12);
  const displayCargoKey = cleanCargoKey(rawKey);
  if (currentKey !== displayCargoKey) {
    setCurrentKey(displayCargoKey);
  }

  const handleDownloadPDF = () => {
    downloadPDF(labelRef, displayCargoKey, setIsGeneratingPDF);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col overflow-y-auto">
        {/* Modal Header */}
        <div className="relative border-b bg-gray-50">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 w-8 h-8 bg-gray-300 text-white rounded-full hover:bg-gray-600 flex items-center justify-center text-lg font-bold"
          >
            ✕
          </button>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
              <h2 className="text-base sm:text-xl font-bold text-gray-800 flex items-center gap-2 text-center">
                🏷️ Yurtiçi Kargo Etiketi
              </h2>
              <p className="text-sm text-gray-500">({displayCargoKey})</p>
            </div>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-6 py-2 text-center bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium disabled:opacity-50 w-full sm:w-auto"
            >
              <span className="text-sm">
                {isGeneratingPDF ? "⏳ Oluşturuluyor..." : "📄 PDF İndir"}
              </span>
            </button>
          </div>
        </div>

        {/* Etiket Önizleme */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
          <div
            ref={labelRef}
            className="label-container"
            style={{
              width: "10cm",
              height: "15cm",
              border: "2px solid #000",
              padding: "10px",
              backgroundColor: "white",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <LabelHeader />
            <BarcodeSection cargoKey={displayCargoKey} />
            <CustomerInfo order={order} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoLabel;
