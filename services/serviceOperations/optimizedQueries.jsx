import { Prisma } from "@prisma/client";
import { prisma, prisma2024 } from "@/lib/prisma";

const DEFAULT_ROWS_PER_PAGE = 10;

const buildQueryConditions = (
  { filterBy, searchCarkod, searchUnvan },
  { applyStatusFilter = true } = {}
) => {
  const rowConditions = [];

  const normalizedFilterRaw = filterBy?.toString();
  const normalizedFilter =
    normalizedFilterRaw && normalizedFilterRaw.trim().length > 0
      ? normalizedFilterRaw.trim()
      : null;
  const effectiveFilter =
    normalizedFilter && normalizedFilter !== "Tümü" ? normalizedFilter : null;

  const normalizedCarkod = searchCarkod?.toString().trim();
  const normalizedUnvan = searchUnvan?.toString().trim();

  if (normalizedCarkod) {
    const rawPattern = `%${normalizedCarkod}%`;
    const sanitizedSearch = normalizedCarkod.replace(/[^a-zA-Z0-9]/g, "");
    const sanitizedPattern = `%${sanitizedSearch}%`;

    if (sanitizedSearch.length > 0) {
      rowConditions.push(
        Prisma.sql`(
          CARKOD COLLATE Turkish_CI_AI LIKE ${rawPattern}
          OR REPLACE(REPLACE(REPLACE(REPLACE(CARKOD, ' ', ''), '-', ''), '.', ''), '/', '') COLLATE Turkish_CI_AI LIKE ${sanitizedPattern}
        )`
      );
    } else {
      rowConditions.push(
        Prisma.sql`CARKOD COLLATE Turkish_CI_AI LIKE ${rawPattern}`
      );
    }
  }

  if (normalizedUnvan) {
    const unvanPattern = `%${normalizedUnvan}%`;
    rowConditions.push(
      Prisma.sql`CARUNVAN COLLATE Turkish_CI_AI LIKE ${unvanPattern}`
    );
  }

  const statusCondition =
    applyStatusFilter && effectiveFilter
      ? Prisma.sql`ORDERSTATUS_NORMALIZED COLLATE Turkish_CI_AI = ${effectiveFilter}`
      : null;

  return { rowConditions, statusCondition };
};

const buildWhereClause = (conditions) => {
  if (!conditions || conditions.length === 0) {
    return Prisma.sql``;
  }

  return Prisma.sql`WHERE ${Prisma.join(conditions, Prisma.sql` AND `)}`;
};

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return Number.isNaN(num) ? 0 : num;
};

const toTrimmedString = (value) =>
  typeof value === "string" ? value.trim() : value;

const getTimeParts = (timeString) => {
  if (!timeString) return [0, 0, 0];
  const parts = timeString.split(":").map((part) => parseInt(part, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
};

const toUtcTimestamp = (order) => {
  if (!order) return 0;
  const year = toNumber(order.ORDERYIL) || 0;
  const monthIndex = (toNumber(order.ORDERAY) || 1) - 1;
  const day = toNumber(order.ORDERGUN) || 1;
  const [hour, minute, second] = getTimeParts(order.ORDERSAAT);
  return Date.UTC(year, monthIndex, day, hour, minute, second);
};

const compareOrderDates = (a, b) => {
  const valueA = toUtcTimestamp(a);
  const valueB = toUtcTimestamp(b);

  if (valueA === valueB) return 0;
  return valueA > valueB ? 1 : -1;
};

const normalizeAggregatedOrder = (order) => ({
  ORDERNO: order.ORDERNO,
  CARKOD: toTrimmedString(order.CARKOD),
  CARUNVAN: toTrimmedString(order.CARUNVAN),
  REFNO: toTrimmedString(order.REFNO),
  STKNAME: toTrimmedString(order.STKNAME),
  STKADET: toNumber(order.STKADET),
  STKBIRIMFIYAT: toNumber(order.STKBIRIMFIYAT),
  STKBIRIMFIYATTOPLAM: toNumber(order.STKBIRIMFIYATTOPLAM),
  ORDERSTATUS: toTrimmedString(order.ORDERSTATUS),
  ORDERGUN: toNumber(order.ORDERGUN),
  ORDERAY: toNumber(order.ORDERAY),
  ORDERYIL: toNumber(order.ORDERYIL),
  ORDERSAAT: toTrimmedString(order.ORDERSAAT),
  TALEP: toTrimmedString(order.TALEP),
  KARGO: toTrimmedString(order.KARGO),
  KARGOTAKIPNO: toTrimmedString(order.KARGOTAKIPNO),
  ID: order.ID ? toNumber(order.ID) : order.ID,
});

const mergeOrderGroup = (orders) => {
  if (!orders || orders.length === 0) {
    return null;
  }

  const latestOrder = orders.reduce((latest, current) => {
    if (!latest) return current;
    return compareOrderDates(current, latest) > 0 ? current : latest;
  }, null);

  const totalQuantity = orders.reduce(
    (total, order) => total + toNumber(order.STKADET),
    0
  );
  const totalAmount = orders.reduce(
    (total, order) => total + toNumber(order.STKBIRIMFIYATTOPLAM),
    0
  );

  return {
    ...latestOrder,
    STKADET: totalQuantity,
    STKBIRIMFIYATTOPLAM: totalAmount,
    STKBIRIMFIYAT: toNumber(latestOrder?.STKBIRIMFIYAT),
  };
};

const fetchAggregatedOrders = async (
  client,
  { rowConditions, statusCondition, fetchLimit }
) => {
  const whereClause = buildWhereClause(rowConditions);
  const statusClause = statusCondition
    ? Prisma.sql`WHERE ${statusCondition}`
    : Prisma.sql``;

  const rows = await client.$queryRaw`
    WITH AggregatedOrders AS (
      SELECT
        ORDERNO,
        MAX(CARKOD) AS CARKOD,
        MAX(CARUNVAN) AS CARUNVAN,
        MAX(REFNO) AS REFNO,
        MAX(STKNAME) AS STKNAME,
        SUM(STKADET) AS STKADET,
        MAX(STKBIRIMFIYAT) AS STKBIRIMFIYAT,
        SUM(STKBIRIMFIYATTOPLAM) AS STKBIRIMFIYATTOPLAM,
        MAX(LTRIM(RTRIM(ORDERSTATUS))) AS ORDERSTATUS_NORMALIZED,
        MAX(ORDERGUN) AS ORDERGUN,
        MAX(ORDERAY) AS ORDERAY,
        MAX(ORDERYIL) AS ORDERYIL,
        MAX(ORDERSAAT) AS ORDERSAAT,
        MAX(TALEP) AS TALEP,
        MAX(KARGO) AS KARGO,
        MAX(KARGOTAKIPNO) AS KARGOTAKIPNO,
        MAX(ID) AS ID
      FROM ALLORDERS
      ${whereClause}
      GROUP BY ORDERNO
    ),
    FilteredOrders AS (
      SELECT *,
        ROW_NUMBER() OVER (
          ORDER BY ORDERYIL DESC, ORDERAY DESC, ORDERGUN DESC, ORDERSAAT DESC, ORDERNO DESC
        ) AS rn
      FROM AggregatedOrders
      ${statusClause}
    )
    SELECT
      ORDERNO,
      CARKOD,
      CARUNVAN,
      REFNO,
      STKNAME,
      STKADET,
      STKBIRIMFIYAT,
      STKBIRIMFIYATTOPLAM,
      ORDERSTATUS_NORMALIZED AS ORDERSTATUS,
      ORDERGUN,
      ORDERAY,
      ORDERYIL,
      ORDERSAAT,
      TALEP,
      KARGO,
      KARGOTAKIPNO,
      ID,
      rn
    FROM FilteredOrders
    WHERE rn <= ${fetchLimit}
    ORDER BY rn;
  `;

  return rows.map((row) => {
    const { rn, ...rest } = row;
    return normalizeAggregatedOrder(rest);
  });
};

const fetchOrderSummaries = async (
  client,
  { rowConditions, statusCondition }
) => {
  const whereClause = buildWhereClause(rowConditions);
  const statusClause = statusCondition
    ? Prisma.sql`WHERE ${statusCondition}`
    : Prisma.sql``;

  return client.$queryRaw`
    WITH AggregatedSummary AS (
      SELECT
        ORDERNO,
        MAX(LTRIM(RTRIM(ORDERSTATUS))) AS ORDERSTATUS_NORMALIZED,
        MAX(ORDERYIL) AS ORDERYIL,
        MAX(ORDERAY) AS ORDERAY,
        MAX(ORDERGUN) AS ORDERGUN,
        MAX(ORDERSAAT) AS ORDERSAAT
      FROM ALLORDERS
      ${whereClause}
      GROUP BY ORDERNO
    )
    SELECT
      ORDERNO,
      ORDERSTATUS_NORMALIZED AS ORDERSTATUS,
      ORDERYIL,
      ORDERAY,
      ORDERGUN,
      ORDERSAAT
    FROM AggregatedSummary
    ${statusClause};
  `;
};

const aggregateOrdersAcrossSources = (orders) => {
  const grouped = new Map();

  orders.forEach((order) => {
    const orderNo = order.ORDERNO;
    if (!grouped.has(orderNo)) {
      grouped.set(orderNo, []);
    }
    grouped.get(orderNo).push(order);
  });

  const aggregated = [];
  grouped.forEach((group) => {
    const merged = mergeOrderGroup(group);
    if (merged) {
      aggregated.push(merged);
    }
  });

  aggregated.sort((a, b) => compareOrderDates(b, a));
  return aggregated;
};

const mergeSummaries = (summaryA = [], summaryB = []) => {
  const combined = new Map();

  const upsert = (rows) => {
    rows.forEach((row) => {
      const orderNo = row.ORDERNO;
      if (!orderNo) return;

      const existing = combined.get(orderNo);
      if (!existing || compareOrderDates(row, existing) > 0) {
        combined.set(orderNo, row);
      }
    });
  };

  upsert(summaryA);
  upsert(summaryB);

  return combined;
};

/**
 * Admin orders için optimize edilmiş sorgu
 * Bu fonksiyon iki veritabanından veri çekerken performans için optimize edilmiştir
 */
export async function getAdminOrdersOptimized(options = {}) {
  const {
    page = 1,
    rowsPerPage = DEFAULT_ROWS_PER_PAGE,
    filterBy,
    includeStatusCounts = false,
    searchCarkod,
    searchUnvan,
  } = options;

  const safePage = Math.max(1, toNumber(page));
  const safeRowsPerPage = Math.max(1, toNumber(rowsPerPage));
  const queryConditions = buildQueryConditions(
    {
      filterBy,
      searchCarkod,
      searchUnvan,
    },
    { applyStatusFilter: true }
  );

  try {
    const startIndex = (safePage - 1) * safeRowsPerPage;
    const fetchLimit = startIndex + safeRowsPerPage;

    const [orders2025, orders2024] = await Promise.all([
      fetchAggregatedOrders(prisma, {
        rowConditions: queryConditions.rowConditions,
        statusCondition: queryConditions.statusCondition,
        fetchLimit,
      }),
      fetchAggregatedOrders(prisma2024, {
        rowConditions: queryConditions.rowConditions,
        statusCondition: queryConditions.statusCondition,
        fetchLimit,
      }),
    ]);

    const aggregatedOrders = aggregateOrdersAcrossSources([
      ...orders2025,
      ...orders2024,
    ]);

    const paginatedOrders = aggregatedOrders.slice(
      startIndex,
      startIndex + safeRowsPerPage
    );

    let metrics = null;

    if (includeStatusCounts) {
      metrics = await getAdminOrdersMetrics({
        filterBy,
        searchCarkod,
        searchUnvan,
        rowsPerPage: safeRowsPerPage,
      });
    }

    return {
      orders: paginatedOrders,
      pagination: {
        currentPage: safePage,
        rowsPerPage: safeRowsPerPage,
        totalItems: metrics?.totalItems ?? null,
        totalPages: metrics?.totalPages ?? null,
      },
      statusCounts: metrics?.statusCounts,
    };
  } catch (error) {
    console.error("Error in getAdminOrdersOptimized:", error);
    throw error;
  }
}

export async function getAdminOrdersMetrics(options = {}) {
  const {
    filterBy,
    searchCarkod,
    searchUnvan,
    rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  } = options;

  const safeRowsPerPage = Math.max(1, toNumber(rowsPerPage));
  const paginationConditions = buildQueryConditions(
    {
      filterBy,
      searchCarkod,
      searchUnvan,
    },
    { applyStatusFilter: true }
  );
  const countConditions = buildQueryConditions(
    {
      filterBy,
      searchCarkod,
      searchUnvan,
    },
    { applyStatusFilter: false }
  );

  try {
    const [
      [filteredSummary2025, filteredSummary2024],
      [countSummary2025, countSummary2024],
    ] = await Promise.all([
      Promise.all([
        fetchOrderSummaries(prisma, paginationConditions),
        fetchOrderSummaries(prisma2024, paginationConditions),
      ]),
      Promise.all([
        fetchOrderSummaries(prisma, countConditions),
        fetchOrderSummaries(prisma2024, countConditions),
      ]),
    ]);

    const filteredCombined = mergeSummaries(
      filteredSummary2025,
      filteredSummary2024
    );

    const totalItems = filteredCombined.size;
    const totalPages =
      totalItems > 0 ? Math.ceil(totalItems / safeRowsPerPage) : 1;

    const statusCombined = mergeSummaries(countSummary2025, countSummary2024);

    const statusCounts = {};

    statusCombined.forEach((value) => {
      const rawStatus = toTrimmedString(value.ORDERSTATUS);
      const status =
        rawStatus && rawStatus.length > 0 ? rawStatus : "Bilinmiyor";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    statusCounts["Tümü"] = statusCombined.size;

    return {
      totalItems,
      totalPages,
      statusCounts,
    };
  } catch (error) {
    console.error("Error in getAdminOrdersMetrics:", error);
    throw error;
  }
}

export async function getOrderStatusCounts(options = {}) {
  const metrics = await getAdminOrdersMetrics(options);
  return metrics.statusCounts;
}
