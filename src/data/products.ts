import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import rings from "@/assets/product-rings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

export type Universe = "colliers" | "boucles" | "bagues" | "bracelets";

export interface Product {
  id: string;
  slug: string;
  name: string;
  universe: Universe;
  universeLabel: string;
  priceHT: number; // prix unitaire HT grossiste
  retailTTC: number; // prix public conseillé TTC
  moq: number; // quantité minimale de commande
  packSize: number; // conditionnement
  reference: string;
  material: string;
  finish: string;
  description: string;
  images: string[];
  tag?: "Nouveauté" | "Best-seller" | "Réassort" | "Édition limitée";
  isNew?: boolean;
  stock: number;
}

const IMG: Record<Universe, string> = {
  colliers: necklace,
  boucles: earrings,
  bagues: rings,
  bracelets: bracelet,
};

const UNIVERSE_LABEL: Record<Universe, string> = {
  colliers: "Colliers",
  boucles: "Boucles d'oreilles",
  bagues: "Bagues",
  bracelets: "Bracelets",
};

const mk = (
  id: string,
  name: string,
  universe: Universe,
  priceHT: number,
  opts: Partial<Product> = {}
): Product => ({
  id,
  slug: `${universe}-${id}`,
  name,
  universe,
  universeLabel: UNIVERSE_LABEL[universe],
  priceHT,
  retailTTC: Math.round(priceHT * 2.8 * 1.2),
  moq: 3,
  packSize: 3,
  reference: `ML-${universe.slice(0, 3).toUpperCase()}-${id.padStart(4, "0")}`,
  material: "Laiton doré à l'or fin 3 microns",
  finish: "Finition mate & brillante",
  description:
    "Pièce signature fabriquée à la main dans notre atelier parisien. Or recyclé, pierres éthiques, finitions soignées. Livré en écrin Maison Lune.",
  images: [IMG[universe], IMG[universe], IMG[universe]],
  stock: 120,
  ...opts,
});

export const products: Product[] = [
  // Colliers — 4 nouveautés + autres
  mk("101", "Collier Solène", "colliers", 18, { tag: "Nouveauté", isNew: true }),
  mk("102", "Collier Céleste", "colliers", 22, { tag: "Nouveauté", isNew: true }),
  mk("103", "Sautoir Héloïse", "colliers", 26, { tag: "Nouveauté", isNew: true }),
  mk("104", "Ras-de-cou Lila", "colliers", 19, { tag: "Nouveauté", isNew: true }),
  mk("105", "Collier Margot", "colliers", 21, { tag: "Best-seller" }),
  mk("106", "Collier Inès", "colliers", 24),
  mk("107", "Collier Aria", "colliers", 20),
  mk("108", "Collier Jade", "colliers", 23, { tag: "Réassort" }),

  // Boucles
  mk("201", "Créoles Aurore", "boucles", 14, { tag: "Nouveauté", isNew: true }),
  mk("202", "Puces Étoile", "boucles", 11, { tag: "Nouveauté", isNew: true }),
  mk("203", "Pendantes Mila", "boucles", 17, { tag: "Nouveauté", isNew: true }),
  mk("204", "Créoles Jo", "boucles", 13, { tag: "Nouveauté", isNew: true }),
  mk("205", "Boucles Noor", "boucles", 15, { tag: "Best-seller" }),
  mk("206", "Puces Perla", "boucles", 12),
  mk("207", "Créoles Nina", "boucles", 16),
  mk("208", "Pendantes Rêve", "boucles", 18, { tag: "Édition limitée" }),

  // Bagues
  mk("301", "Trio Étoile", "bagues", 20, { tag: "Nouveauté", isNew: true }),
  mk("302", "Bague Signet Léa", "bagues", 23, { tag: "Nouveauté", isNew: true }),
  mk("303", "Bague Jonc Or", "bagues", 17, { tag: "Nouveauté", isNew: true }),
  mk("304", "Bague Pierre Iris", "bagues", 25, { tag: "Nouveauté", isNew: true }),
  mk("305", "Bague Ondine", "bagues", 19, { tag: "Best-seller" }),
  mk("306", "Bague Ciel", "bagues", 22),
  mk("307", "Bague Plume", "bagues", 18),
  mk("308", "Bague Soleil", "bagues", 21),

  // Bracelets
  mk("401", "Bracelet Perle", "bracelets", 16, { tag: "Nouveauté", isNew: true }),
  mk("402", "Jonc Clara", "bracelets", 19, { tag: "Nouveauté", isNew: true }),
  mk("403", "Chaîne Romy", "bracelets", 17, { tag: "Nouveauté", isNew: true }),
  mk("404", "Gourmette Juno", "bracelets", 22, { tag: "Nouveauté", isNew: true }),
  mk("405", "Bracelet Sorel", "bracelets", 18, { tag: "Best-seller" }),
  mk("406", "Jonc Nacre", "bracelets", 20),
  mk("407", "Bracelet Sable", "bracelets", 15),
  mk("408", "Bracelet Lune", "bracelets", 23, { tag: "Édition limitée" }),
];

export const universes: { key: Universe; label: string; count: number }[] = (
  ["colliers", "boucles", "bagues", "bracelets"] as Universe[]
).map((u) => ({
  key: u,
  label: UNIVERSE_LABEL[u],
  count: products.filter((p) => p.universe === u).length,
}));

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getByUniverse = (u: Universe) => products.filter((p) => p.universe === u);
export const getNewByUniverse = (u: Universe, limit = 4) =>
  products.filter((p) => p.universe === u && p.isNew).slice(0, limit);
export const getBestsellers = (limit = 8) =>
  products.filter((p) => p.tag === "Best-seller").slice(0, limit);
export const getNewArrivals = (limit = 12) => products.filter((p) => p.isNew).slice(0, limit);

export const formatEUR = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
