import { properties } from "./demo";

export const developerTypes = {
  wireless: {
    label: "Wireless",
    layers: [
      "FCC Database",
      "Proprietary Cell Site Structures",
      "Deadzone Complaints",
    ],
  },
  solar: { label: "Solar", layers: ["Existing Solar Deployments"] },
  battery: {
    label: "Battery Energy Storage Systems",
    layers: ["Existing BESS Deployments"],
  },
  advertising: {
    label: "Outdoor Advertising",
    layers: ["Existing billboard locations"],
  },
} as const;
export type DeveloperType = keyof typeof developerTypes;
export type BuildingType = "Multifamily" | "Office" | "Mixed-use" | "Warehouse";
export type DeveloperProperty = (typeof properties)[number] & {
  buildingType: BuildingType;
  name: string;
};

const wirelessProperties: DeveloperProperty[] = [
  {
    ...properties[0],
    type: "Multifamily building",
    buildingType: "Multifamily",
    name: "Main Street Residences",
  },
  {
    ...properties[1],
    type: "Mixed-use building",
    buildingType: "Mixed-use",
    name: "Summer Street Exchange",
  },
  {
    ...properties[2],
    type: "Warehouse",
    buildingType: "Warehouse",
    name: "Industrial Logistics Center",
  },
  {
    ...properties[1],
    id: "office",
    address: "25 Commerce Avenue",
    type: "Office building",
    buildingType: "Office",
    name: "Commerce Offices",
    roof: 9000,
    area: "9,000 sq ft",
    utilities: 250,
    grid: false,
    tone: "blue",
  },
  {
    ...properties[1],
    id: "warehouse",
    address: "60 Distribution Drive",
    type: "Warehouse",
    buildingType: "Warehouse",
    name: "Distribution Works",
    roof: 8000,
    area: "8,000 sq ft",
    utilities: 300,
    grid: false,
    tone: "sand",
  },
];
const sampleStreets = {
  solar: [
    "14 Sunfield Avenue",
    "82 Market Street",
    "120 Industrial Parkway",
    "35 Park Avenue",
    "96 Freight Road",
  ],
  battery: [
    "210 River Street",
    "44 Central Avenue",
    "71 Logistics Way",
    "16 Technology Drive",
    "88 Depot Road",
  ],
  advertising: [
    "18 Avenue Square",
    "63 Station Street",
    "310 Commerce Road",
    "47 Boulevard Plaza",
    "52 Transit Way",
  ],
};

// Fabricated catalogs and map positions only; no verified sites or external data.
export function getDeveloperProperties(
  type: DeveloperType,
): DeveloperProperty[] {
  if (type === "wireless") return wirelessProperties;
  return wirelessProperties.map((property, index) => ({
    ...property,
    id: `${type}-${property.id}`,
    address: sampleStreets[type][index],
    name: `${property.buildingType} · ${sampleStreets[type][index]}`,
  }));
}
