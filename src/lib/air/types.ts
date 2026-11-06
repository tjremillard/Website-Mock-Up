export type Vertical = "wireless" | "solar" | "bess" | "ev" | "ooh";
export type ActivityStatus =
  "proposed" | "approved" | "under_construction" | "operational" | "unknown";
export type VerificationStatus = "unverified" | "pending" | "verified";
export type Provenance = {
  sourceName: string;
  sourceUrl?: string;
  observedAt?: string;
  isSynthetic: boolean;
};
export type Property = {
  id: string;
  address: string;
  city: string;
  state: string;
  postalCode?: string;
  lat: number;
  lng: number;
  propertyType:
    "industrial" | "office" | "retail" | "multifamily" | "land" | "other";
  ownerDisplayName?: string;
  claimedStatus: VerificationStatus;
  signals: { label: string; value: string | null; provenance: Provenance }[];
  isDemo: boolean;
};
export type InfrastructureSite = {
  id: string;
  vertical: Vertical;
  lat: number;
  lng: number;
  label: string;
  status: ActivityStatus;
  provenance: Provenance;
};
export type IntelligenceArticle = {
  id: string;
  slug: string;
  title: string;
  dek: string;
  type: "analysis" | "brief" | "development" | "transaction" | "regulatory";
  verticals: Vertical[];
  geographies: string[];
  publishedAt: string;
  author: string;
  body: string;
  sources: Provenance[];
  isDemo: boolean;
};
export type MarketActivity = {
  id: string;
  title: string;
  vertical: Vertical;
  geography: string;
  status: ActivityStatus;
  date: string;
  lat?: number;
  lng?: number;
  relatedArticleIds: string[];
  provenance: Provenance;
};
export type SCIP = {
  id: string;
  propertyId: string;
  status: "draft" | "pending_verification" | "published";
  ownerApproved: boolean;
  sections: { title: string; fields: Record<string, string | null> }[];
};
