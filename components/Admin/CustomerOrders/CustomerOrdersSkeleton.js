import React from "react";

const CustomerOrdersSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Tablo Skeleton */}
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white rounded-lg shadow">
          {/* Tablo Başlığı Skeleton */}
          <div className="bg-gray-100 border-b">
            <div className="grid grid-cols-8 gap-4 p-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="h-6 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>

          {/* Tablo Satırları Skeleton */}
          {[...Array(10)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <div className="grid grid-cols-8 gap-4 p-4 items-center">
                {/* Sipariş No */}
                <div className="h-5 bg-gray-200 rounded w-20"></div>

                {/* Cari Kod */}
                <div className="h-5 bg-gray-200 rounded w-16"></div>

                {/* Cari Ünvan */}
                <div className="h-5 bg-gray-200 rounded w-32"></div>

                {/* Tarih */}
                <div className="h-5 bg-gray-200 rounded w-24"></div>

                {/* Tutar */}
                <div className="h-5 bg-gray-200 rounded w-20"></div>

                {/* Durum */}
                <div className="h-8 bg-gray-200 rounded-full w-24"></div>

                {/* Kargo */}
                <div className="h-5 bg-gray-200 rounded w-20"></div>

                {/* İşlemler */}
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersSkeleton;
