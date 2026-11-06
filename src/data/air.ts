import type {
  Property,
  Provenance,
  InfrastructureSite,
  IntelligenceArticle,
  MarketActivity,
  Vertical,
} from "@/lib/air/types";
export const synthetic: Provenance = {
  sourceName: "AIR synthetic prototype dataset — not independently verified",
  observedAt: "2026-11-06",
  isSynthetic: true,
};
export const verticalNames: Record<Vertical, string> = {
  wireless: "Wireless",
  solar: "Solar",
  bess: "Battery Storage",
  ev: "EV Charging",
  ooh: "Outdoor Advertising",
};
const towns: [string, number, number][] = [
  ["Boston", 42.36, -71.06],
  ["Cambridge", 42.37, -71.11],
  ["Somerville", 42.39, -71.1],
  ["Worcester", 42.26, -71.8],
  ["Springfield", 42.1, -72.59],
  ["Lowell", 42.63, -71.32],
  ["Quincy", 42.25, -71.0],
  ["Waltham", 42.38, -71.24],
  ["Framingham", 42.28, -71.42],
];
const kinds = [
  "office",
  "industrial",
  "multifamily",
  "retail",
  "land",
] as const;
export const properties: Property[] = Array.from({ length: 18 }, (_, i) => {
  const [city, lat, lng] = towns[i % towns.length];
  return {
    id: `ma-${i + 1}`,
    address: `${city} demo property ${i < 9 ? "A" : "B"}`,
    city,
    state: "MA",
    lat: lat + (i < 9 ? 0.012 : -0.018),
    lng: lng + (i < 9 ? -0.017 : 0.023),
    propertyType: kinds[i % kinds.length],
    claimedStatus: "unverified",
    signals: [
      {
        label: "Roof type",
        value: i % 3 === 0 ? "Flat roof (illustrative)" : null,
        provenance: synthetic,
      },
      {
        label: "Building category",
        value: kinds[i % kinds.length],
        provenance: synthetic,
      },
      {
        label: "Data completeness",
        value: "Partial — site survey required",
        provenance: synthetic,
      },
    ],
    isDemo: true,
  };
});
export const infrastructure: InfrastructureSite[] = Array.from(
  { length: 21 },
  (_, i) => {
    const [city, lat, lng] = towns[i % towns.length];
    return {
      id: `wireless-${i}`,
      vertical: "wireless",
      lat: lat + 0.025 + (i % 3) * 0.008,
      lng: lng - 0.035 + (i % 4) * 0.012,
      label: `${city} illustrative wireless structure ${i + 1}`,
      status: i < 15 ? "operational" : "proposed",
      provenance: synthetic,
    };
  },
);
const titles = [
  "Satellite-to-cellular: questions property owners should ask",
  "Network densification and the role of real estate",
  "Rooftops as infrastructure: a landlord’s field guide",
  "What belongs in a Site Candidate Information Packet?",
  "Wireless leasing: evidence before expectations",
  "Massachusetts wireless: start with the property facts",
  "Starlink Mobile and the changing connectivity conversation",
  "From map browsing to an informed site discussion",
];
const deks = [
  "New architectures raise useful questions. Site requirements and demand still need evidence.",
  "A practical look at how buildings and local context inform site discovery.",
  "Access, structure, power and consent matter before a rooftop is marketed.",
  "Organize the known facts, identify gaps, and keep owner approval explicit.",
  "Separate a property’s characteristics from a promise of carrier demand.",
  "A clear starting point for exploring connectivity infrastructure in the Commonwealth.",
  "Independent editorial commentary on satellite-to-cellular concepts, not a deployment announcement.",
  "Use local intelligence to ask better questions about your real estate.",
];
export const articles: IntelligenceArticle[] = titles.map((title, i) => ({
  id: `article-${i}`,
  slug: [
    "satellite-to-cellular",
    "network-densification",
    "rooftop-infrastructure",
    "scip-guide",
    "wireless-leasing",
    "massachusetts-wireless",
    "starlink-mobile",
    "informed-site-discussion",
  ][i],
  title,
  dek: deks[i],
  type: i % 3 === 0 ? "brief" : "analysis",
  verticals: ["wireless"],
  geographies: ["Massachusetts"],
  publishedAt: "2026-11-06",
  author: "AIR editorial prototype",
  body: `${deks[i]} This sample article illustrates AIR’s editorial approach; it does not report a verified project, carrier requirement, transaction or lease. Property-level research should begin with documented building characteristics, access arrangements, available utilities and owner consent.\n\nSatellite and terrestrial networks can have different requirements. A change in technology does not establish demand at a particular property. Structural suitability, zoning and commercial terms require independent review.\n\nWhat this means for landlords: organize your property facts, record what remains unknown, and seek qualified advice before making commitments. A SCIP presents information for discussion; it does not establish eligibility or guarantee a tenant.`,
  sources: [synthetic],
  isDemo: true,
}));
const regions: [string, string, string, number, number][] = [
  ["Massachusetts", "Boston", "MA", 42.36, -71.06],
  ["Pennsylvania", "Philadelphia", "PA", 39.95, -75.17],
  ["New York", "Albany", "NY", 42.65, -73.75],
  ["California", "Sacramento", "CA", 38.58, -121.49],
  ["Texas", "Austin", "TX", 30.27, -97.74],
];
export const visionProperties: Property[] = Array.from(
  { length: 50 },
  (_, i) => {
    const [, city, state, lat, lng] = regions[i % 5];
    return {
      ...properties[i % 18],
      id: `vision-${i + 1}`,
      address: `${city} demo property ${Math.floor(i / 5) + 1}`,
      city,
      state,
      lat: lat + Math.floor(i / 5) * 0.018,
      lng: lng + Math.floor(i / 5) * 0.023,
    };
  },
);
export const activities: MarketActivity[] = Array.from(
  { length: 30 },
  (_, i) => {
    const [geography, , , lat, lng] = regions[Math.floor(i / 5) % 5];
    const vertical = (Object.keys(verticalNames) as Vertical[])[i % 5];
    return {
      id: `activity-${i}`,
      title: `${verticalNames[vertical]} site study ${i + 1}`,
      vertical,
      geography,
      status: (
        [
          "proposed",
          "approved",
          "under_construction",
          "operational",
          "unknown",
        ] as const
      )[Math.floor(i / 5) % 5],
      date: "2026-11-06",
      lat,
      lng,
      relatedArticleIds: [`vision-article-${i % 20}`],
      provenance: synthetic,
    };
  },
);
export const visionArticles: IntelligenceArticle[] = Array.from(
  { length: 20 },
  (_, i) => ({
    ...articles[i % 8],
    id: `vision-article-${i}`,
    slug: `vision-research-${i}`,
    title: `${verticalNames[(Object.keys(verticalNames) as Vertical[])[i % 5]]}: illustrative market notebook ${i + 1}`,
    verticals: [(Object.keys(verticalNames) as Vertical[])[i % 5]],
    geographies: [regions[Math.floor(i / 5) % 5][0]],
    type: (
      ["analysis", "brief", "development", "transaction", "regulatory"] as const
    )[Math.floor(i / 4) % 5],
  }),
);

// Shared national property coverage: assignments are illustrative research lenses.
export const visionCatalog = visionProperties.map((property, i) => ({
  property,
  verticals: [
    (Object.keys(verticalNames) as Vertical[])[Math.floor(i / 5) % 5],
  ],
  geographies: [
    (
      {
        MA: "Massachusetts",
        PA: "Pennsylvania",
        NY: "New York",
        CA: "California",
        TX: "Texas",
      } as Record<string, string>
    )[property.state],
  ],
}));
