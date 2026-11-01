// Prototype boundary: replace this generator with the future feasibility model.
export const feasibilityCategories = [
  "Wireless Infrastructure Feasibility",
  "Solar Feasibility",
  "Battery Energy Storage Feasibility",
  "Outdoor Advertising Feasibility",
] as const;

export type FeasibilityScore = {
  category: (typeof feasibilityCategories)[number];
  percentage: number;
};

export function generatePrototypeScores(): FeasibilityScore[] {
  return feasibilityCategories.map((category) => ({
    category,
    percentage: Math.floor(Math.random() * 101),
  }));
}
