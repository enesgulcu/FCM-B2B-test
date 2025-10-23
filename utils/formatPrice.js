/**
 * Formats a number to Turkish number format
 * Example: 34543.6 -> "34.543,6"
 *
 * @param {number|string} value - The value to format
 * @returns {string} Formatted number string
 */
export const formatPrice = (value) => {
  // Convert to number if it's a string
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  // Handle invalid values
  if (isNaN(numValue) || numValue === null || numValue === undefined) {
    return "0";
  }

  // Format the number with Turkish locale
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numValue);

  return formatted;
};
