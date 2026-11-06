import type { Property, Vertical } from "./types";
export function searchProperties(items: Property[], query: string) {
  const q = query.trim().toLowerCase();
  return items.filter((p) =>
    `${p.address} ${p.city} ${p.propertyType}`.toLowerCase().includes(q),
  );
}
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const rad = (v: number) => (v * Math.PI) / 180;
  const dlat = rad(b.lat - a.lat),
    dlng = rad(b.lng - a.lng);
  const h =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dlng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export function inGeography(geographies: string[], geography: string) {
  if (geography === "US") return true;
  if (geography === "Northeast")
    return geographies.some((g) => ["Massachusetts", "New York"].includes(g));
  if (geography === "Mid-Atlantic")
    return geographies.some((g) => ["Pennsylvania", "New York"].includes(g));
  return geographies.includes(geography);
}
export function filterMarket<
  T extends { verticals: Vertical[]; geographies: string[] },
>(items: T[], vertical: Vertical, geography: string) {
  return items.filter(
    (item) =>
      item.verticals.includes(vertical) &&
      inGeography(item.geographies, geography),
  );
}
