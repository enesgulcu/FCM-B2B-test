export function isMaintenanceModeEnabled() {
  const value =
    process.env.MAINTENANCE_MODE ?? process.env.NEXT_PUBLIC_MAINTENANCE_MODE;

  return value === "true" || value === "1";
}
