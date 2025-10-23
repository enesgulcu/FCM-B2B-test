import { prisma, prisma2024 } from "@/lib/prisma";

/**
 * Türkçe karakterleri normalize eder
 */
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]/g, "");
};

/**
 * Admin orders için optimize edilmiş sorgu
 * Bu fonksiyon iki veritabanından veri çekerken performans için optimize edilmiştir
 */
export async function getAdminOrdersOptimized(options = {}) {
  const {
    page = 1,
    rowsPerPage = 10,
    filterBy,
    includeStatusCounts = true,
    searchCarkod,
    searchUnvan,
  } = options;

  try {
    // WHERE koşulu (sadece status filtresi burada)
    const whereClause =
      filterBy && filterBy !== "Tümü" ? { ORDERSTATUS: filterBy } : {};

    // Search terimleri normalize edilecek (client-side filtering için)
    const normalizedSearchCarkod = searchCarkod
      ? normalizeText(searchCarkod)
      : null;
    const normalizedSearchUnvan = searchUnvan
      ? normalizeText(searchUnvan)
      : null;

    // Sadece gerekli alanları seç
    const selectFields = {
      ORDERNO: true,
      CARKOD: true,
      STKNAME: true,
      REFNO: true,
      CARUNVAN: true,
      ACIKLAMA: true,
      STKADET: true,
      STKBIRIMFIYAT: true,
      STKBIRIMFIYATTOPLAM: true,
      ORDERSTATUS: true,
      ORDERGUN: true,
      ORDERAY: true,
      ORDERYIL: true,
      ORDERSAAT: true,
      TALEP: true,
      KARGO: true,
      KARGOTAKIPNO: true,
      ID: true,
    };

    // Tarihe göre sıralama (veritabanı seviyesinde)
    const orderBy = [
      { ORDERYIL: "desc" },
      { ORDERAY: "desc" },
      { ORDERGUN: "desc" },
      { ORDERSAAT: "desc" },
    ];

    // Status counts hesaplama (her zaman paralel çalışsın)
    let statusCounts = {};
    let statusCountsPromise = null;

    if (includeStatusCounts) {
      // Status counts'u paralel olarak başlat (hafif sorgu - sadece ORDERNO ve ORDERSTATUS)
      statusCountsPromise = Promise.all([
        prisma.ALLORDERS.findMany({
          select: {
            ORDERNO: true,
            ORDERSTATUS: true,
          },
        }),
        prisma2024.ALLORDERS.findMany({
          select: {
            ORDERNO: true,
            ORDERSTATUS: true,
          },
        }),
      ]);
    }

    // Ana veri çekme: Her iki DB'den de filtrelenmiş veriyi al
    const [data2025, data2024] = await Promise.all([
      prisma.ALLORDERS.findMany({
        where: whereClause,
        select: selectFields,
        orderBy: orderBy,
      }),
      prisma2024.ALLORDERS.findMany({
        where: whereClause,
        select: selectFields,
        orderBy: orderBy,
      }),
    ]);

    // Verileri birleştir
    const allData = [...data2025, ...data2024];

    // ORDERNO'ya göre grupla ve unique orders oluştur
    const groupedOrders = allData.reduce((acc, order) => {
      if (!acc[order.ORDERNO]) {
        acc[order.ORDERNO] = [];
      }
      acc[order.ORDERNO].push(order);
      return acc;
    }, {});

    // Unique orders oluştur (aynı ORDERNO'daki kayıtları birleştir)
    let uniqueOrders = Object.values(groupedOrders)
      .filter((orders) => orders.length > 0)
      .map((orders) => ({
        ORDERNO: orders[0].ORDERNO,
        CARKOD: orders[0].CARKOD,
        STKNAME: orders[0].STKNAME,
        REFNO: orders[0].REFNO,
        CARUNVAN: orders[0].CARUNVAN,
        ACIKLAMA: orders[0].ACIKLAMA,
        STKADET: orders.reduce((total, order) => total + order.STKADET, 0),
        STKBIRIMFIYAT: orders[0].STKBIRIMFIYAT,
        STKBIRIMFIYATTOPLAM: orders.reduce(
          (total, order) => total + order.STKBIRIMFIYATTOPLAM,
          0
        ),
        ORDERSTATUS: orders[0].ORDERSTATUS,
        ORDERGUN: orders[0].ORDERGUN,
        ORDERAY: orders[0].ORDERAY,
        ORDERYIL: orders[0].ORDERYIL,
        ORDERSAAT: orders[0].ORDERSAAT,
        TALEP: orders[0].TALEP,
        KARGO: orders[0].KARGO,
        KARGOTAKIPNO: orders[0].KARGOTAKIPNO,
        ID: orders[0].ID,
      }));

    // Search filtrelemesi (Türkçe karakter normalizasyonu ile)
    if (normalizedSearchCarkod || normalizedSearchUnvan) {
      uniqueOrders = uniqueOrders.filter((order) => {
        let matches = true;

        if (normalizedSearchCarkod) {
          const normalizedCarkod = normalizeText(order.CARKOD || "");
          matches =
            matches && normalizedCarkod.includes(normalizedSearchCarkod);
        }

        if (normalizedSearchUnvan) {
          const normalizedCarunvan = normalizeText(order.CARUNVAN || "");
          matches =
            matches && normalizedCarunvan.includes(normalizedSearchUnvan);
        }

        return matches;
      });
    }

    // Tarihe göre sırala (birleştirme sonrası - en yakın tarihten en uzak tarihe)
    uniqueOrders.sort((a, b) => {
      const dateA = new Date(
        a.ORDERYIL,
        a.ORDERAY - 1,
        a.ORDERGUN,
        ...a.ORDERSAAT.split(":")
      );
      const dateB = new Date(
        b.ORDERYIL,
        b.ORDERAY - 1,
        b.ORDERGUN,
        ...b.ORDERSAAT.split(":")
      );
      return dateB - dateA; // desc order (newest first)
    });

    // Status counts hesaplama bitir (eğer başlatılmışsa)
    if (statusCountsPromise) {
      const [allOrders2025, allOrders2024] = await statusCountsPromise;
      const allOrdersForCount = [...allOrders2025, ...allOrders2024];
      const uniqueOrdersForCount = new Map();

      allOrdersForCount.forEach((order) => {
        if (!uniqueOrdersForCount.has(order.ORDERNO)) {
          uniqueOrdersForCount.set(order.ORDERNO, order.ORDERSTATUS);
        }
      });

      // Status counts hesapla - UNIQUE ORDERNO'lardan
      uniqueOrdersForCount.forEach((status) => {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      // Toplam hesapla
      statusCounts["Tümü"] = uniqueOrdersForCount.size;
    }

    // Toplam item sayısı: Filtrelenmiş ve unique'lenmiş siparişlerin sayısı
    const totalItems = uniqueOrders.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Pagination uygula (slice ile)
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedOrders = uniqueOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        rowsPerPage,
      },
      statusCounts,
    };
  } catch (error) {
    console.error("Error in getAdminOrdersOptimized:", error);
    throw error;
  }
}

/**
 * Sadece status counts almak için optimize edilmiş sorgu
 */
export async function getOrderStatusCounts() {
  try {
    const [statusGroups2025, statusGroups2024] = await Promise.all([
      prisma.ALLORDERS.groupBy({
        by: ["ORDERSTATUS"],
        _count: {
          ORDERSTATUS: true,
        },
      }),
      prisma2024.ALLORDERS.groupBy({
        by: ["ORDERSTATUS"],
        _count: {
          ORDERSTATUS: true,
        },
      }),
    ]);

    // Birleştir ve topla
    const statusCounts = {};
    [...statusGroups2025, ...statusGroups2024].forEach((group) => {
      statusCounts[group.ORDERSTATUS] =
        (statusCounts[group.ORDERSTATUS] || 0) + group._count.ORDERSTATUS;
    });

    // Toplam hesapla
    statusCounts["Tümü"] = Object.values(statusCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    return statusCounts;
  } catch (error) {
    console.error("Error in getOrderStatusCounts:", error);
    throw error;
  }
}
