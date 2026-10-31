// All data is illustrative. Replace this boundary with authenticated warehouse APIs.
export const services = {
  checkup: {
    name: "Lease Checkup",
    price: 999,
    tag: "Comprehensive review",
    description: "Uncover the questions you didn’t know to ask.",
  },
  rent: {
    name: "Market Rent Review",
    price: 399,
    tag: "Rent only",
    description:
      "Understand how your wireless rent compares with relevant lease comparables.",
    proposed: true,
  },
  relocation: {
    name: "Relocation Analysis",
    price: 499,
    tag: "Existing Wireless Sites Only",
    description:
      "Assess the credibility of a relocation threat or rent reduction request.",
  },
  question: {
    name: "Specific Question Review",
    price: 499,
    tag: "One question, one site",
    description:
      "Get clarity on a carrier request, proposal, or existing arrangement.",
    proposed: true,
  },
  scip: {
    name: "SCIP Marketing",
    price: 499,
    tag: "Recurring service",
    description:
      "Get your property in front of wireless infrastructure providers on a regular and consistent basis.",
  },
};
export type ServiceKey = keyof typeof services;
export const stages = ["Submitted", "AI analysis", "WRA review", "Completed"];
export const initialDocs = [
  { id: "lease", name: "Original Lease.pdf", type: "Lease / Amendment" },
  { id: "amendment", name: "First Amendment.pdf", type: "Lease / Amendment" },
  {
    id: "plan",
    name: "Site Plan.pdf",
    type: "Construction Drawing / Construction Plan",
  },
];
export const properties = [
  {
    id: "main",
    address: "123 Main Street",
    city: "Franklin, MA",
    roof: 18000,
    fiber: 150,
    utilities: 100,
    grid: true,
    friendly: true,
    type: "Commercial rooftop",
    area: "18,000 sq ft",
    tone: "sage",
  },
  {
    id: "summer",
    address: "9 Summer Street",
    city: "Franklin, MA",
    roof: 8500,
    fiber: 600,
    utilities: 200,
    grid: true,
    friendly: true,
    type: "Mixed-use rooftop",
    area: "8,500 sq ft",
    tone: "sand",
  },
  {
    id: "industrial",
    address: "48 Industrial Way",
    city: "Worcester, MA",
    roof: 32000,
    fiber: 1200,
    utilities: 500,
    grid: false,
    friendly: false,
    type: "Industrial property",
    area: "32,000 sq ft",
    tone: "blue",
  },
];
export type Criteria = {
  roof: string;
  fiber: string;
  utilities: string;
  grid: boolean;
};
export type Review = {
  id: string;
  service: ServiceKey;
  address: string;
  question: string;
  documents: string[];
  stage: number;
  billing: "annual" | "monthly";
  clarification?: string;
};
export type DemoState = {
  address: string;
  documents: typeof initialDocs;
  reviews: Review[];
  draft?: {
    service: ServiceKey;
    address: string;
    question: string;
    documents: string[];
    billing: "annual" | "monthly";
  };
  account?: { name: string; users: string; criteria: Criteria };
  criteria: Criteria;
  inquiries: { property: string; date: string; message?: string }[];
  access: "friendly" | "entire";
  interests: string[];
};
export const initialState: DemoState = {
  address: "123 Main Street",
  documents: initialDocs,
  reviews: [],
  criteria: { roof: "", fiber: "", utilities: "", grid: false },
  inquiries: [{ property: "123 Main Street", date: "2027-02-17" }],
  access: "friendly",
  interests: [],
};
export function matches(p: (typeof properties)[number], c: Criteria) {
  return (
    p.roof >= Number(c.roof || 0) &&
    (!c.fiber || p.fiber <= Number(c.fiber)) &&
    (!c.utilities || p.utilities <= Number(c.utilities)) &&
    (!c.grid || p.grid)
  );
}
