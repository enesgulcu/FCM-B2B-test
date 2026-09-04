/**
 * Maintenance flag — only MAINTENANCE_MODE (server/edge).
 * Do not use NEXT_PUBLIC_*: it is inlined at build time and ignores later env updates.
 * Bracket access avoids Next.js static env replacement in the Edge middleware bundle.
 */
export function isMaintenanceModeEnabled() {
  const raw = process.env["MAINTENANCE_MODE"];
  if (raw == null) return false;

  const value = String(raw).trim().toLowerCase();
  return value === "true" || value === "1" || value === "yes" || value === "on";
}
