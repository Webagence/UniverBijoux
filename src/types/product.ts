export type Universe = "colliers" | "boucles" | "bagues" | "bracelets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  universe: Universe;
  universeLabel: string;
  priceHT: number;
  retailTTC: number;
  moq: number;
  packSize: number;
  reference: string;
  material: string;
  finish: string;
  description: string;
  images: string[];
  tag?: "Nouveauté" | "Best-seller" | "Réassort" | "Édition limitée";
  isNew?: boolean;
  stock: number;
}

export const formatEUR = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
