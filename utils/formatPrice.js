// /**
//  * Formats a number to Turkish number format
//  * Example: 34543.6 -> "34.543,6"
//  *
//  * @param {number|string} value - The value to format
//  * @returns {string} Formatted number string
//  */
// export const formatPrice = (value) => {
//   // Convert to number if it's a string
//   const numValue = typeof value === "string" ? parseFloat(value) : value;
//
//   // Handle invalid values
//   if (isNaN(numValue) || numValue === null || numValue === undefined) {
//    return "0";
//   }
//
//   // Format the number with Turkish locale
//   const formatted = new Intl.NumberFormat("tr-TR", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   }).format(numValue);
//
//   return formatted;
// };

/**
 * Türkçe formatlı fiyatları tek noktadan normalize eden yardımcı fonksiyonlar
 * eski implementasyonu yorumda tutup yeni yaklaşımı aşağıda kullanıyorum
 */
const toNumericValue = (value) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return NaN;

  const trimmed = value.trim();
  if (trimmed.length === 0) return NaN;

  // virgülü noktaya çeviriyoruz
  const normalized = trimmed.includes(",")
    ? trimmed.replace(/\./g, "").replace(",", ".")
    : trimmed;

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? NaN : parsed;
};

export const parsePrice = (value, fallback = 0) => {
  const parsed = toNumericValue(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const isValidPrice = (value) => !Number.isNaN(toNumericValue(value));

export const formatPrice = (value, options = {}) => {
  const numValue = parsePrice(value, NaN);

  if (!Number.isFinite(numValue)) {
    return "0";
  }

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numValue);
};
