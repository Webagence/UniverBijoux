export type Universe = "colliers" | "boucles" | "bagues" | "bracelets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  universe: Universe;
  universeLabel: string;
  priceHT: number;
  salePriceHT?: number;
  retailTTC: number;
  moq: number;
  packSize: number;
  reference: string;
  material: string;
  finish: string;
  qualityGrade?: string;
  description: string;
  images: string[];
  tag?: "Nouveauté" | "Best-seller" | "Réassort" | "Édition limitée";
  variations?: Array<{ name: string; options: string[] }>;
  isNew?: boolean;
  stock: number;
}

export const formatEUR = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
