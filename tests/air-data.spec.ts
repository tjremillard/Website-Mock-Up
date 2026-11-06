import { test, expect } from "@playwright/test";
import {
  distanceKm,
  searchProperties,
  filterMarket,
} from "../src/lib/air/selectors";
import {
  properties,
  infrastructure,
  visionProperties,
  visionArticles,
  activities,
} from "../src/data/air";
test("distance uses geographic coordinates and selectors preserve evidence", () => {
  expect(distanceKm({ lat: 42, lng: -71 }, { lat: 42, lng: -71 })).toBe(0);
  expect(distanceKm({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(
    111.195,
    2,
  );
  expect(searchProperties(properties, " BOSTON ")).toHaveLength(2);
  expect(searchProperties(properties, "unseeded-address")).toHaveLength(0);
  expect(properties).toHaveLength(18);
  expect(infrastructure).toHaveLength(21);
  expect(visionProperties).toHaveLength(50);
  expect(activities).toHaveLength(30);
  expect(visionArticles).toHaveLength(20);
  expect(
    properties.every(
      (p) => p.isDemo && p.signals.every((s) => s.provenance.isSynthetic),
    ),
  ).toBeTruthy();
  expect(infrastructure.every((p) => p.provenance.isSynthetic)).toBeTruthy();
  expect(
    filterMarket(visionArticles, "solar", "Massachusetts").every(
      (a) =>
        a.verticals.includes("solar") &&
        a.geographies.includes("Massachusetts"),
    ),
  ).toBeTruthy();
  expect(filterMarket(visionArticles, "solar", "Texas")).toHaveLength(0);
});
