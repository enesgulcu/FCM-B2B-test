import React from "react";
import Link from "next/link";

const CargoInfoModal = ({ showCargoInfo, setShowCargoInfo, cargoInfo }) => {
  if (!showCargoInfo) return null;

  return (
    <div
      onClick={() => setShowCargoInfo(false)}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end items-center mb-1">
          <button
            onClick={() => setShowCargoInfo(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {cargoInfo?.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">
              Kargo bilgileri getiriliyor...
            </p>
          </div>
        ) : cargoInfo?.error ? (
          <div className="text-center py-4">
            <div className="text-red-600 mb-2">❌ Hata</div>
            <p className="text-gray-600 whitespace-pre-line">{cargoInfo.message}</p>
          </div>
        ) : cargoInfo?.success ? (
          <div className="text-center py-4">
            <div className="text-green-600 mb-2">✅ Başarılı</div>
            <p className="text-gray-600 whitespace-pre-line">{cargoInfo.message}</p>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-semibold text-green-800 text-base md:text-lg">
                Kargo Bilgileri
              </span>
            </div>

            <div className="space-y-1 text-sm md:text-base">
              <div>
                <strong>Durum:</strong> {cargoInfo?.status}
              </div>
              <div>
                <strong>Teslim Tarihi:</strong>{" "}
                {cargoInfo?.deliveryDate && cargoInfo.deliveryDate !== "Tarih bilgisi yok"
                  ? new Date(
                      cargoInfo.deliveryDate.slice(0, 4) +
                        "-" +
                        cargoInfo.deliveryDate.slice(4, 6) +
                        "-" +
                        cargoInfo.deliveryDate.slice(6, 8)
                    ).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Tarih bilgisi yok"}
              </div>
            </div>

            <button className="w-full mt-3">
              <Link
                href={cargoInfo?.trackingUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-2 border border-transparent text-sm md:text-lg leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 mt-3"
              >
                Yurtiçi Kargo&apos;da Takip Et
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargoInfoModal;
