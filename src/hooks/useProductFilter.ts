import { useEffect, useMemo, useState } from "react";
import { Product } from "@/types/product";

export type SortOption = "default" | "price-asc" | "price-desc" | "alpha-asc" | "alpha-desc";

export interface FilterState {
  query: string;
  universe: string;
  sort: SortOption;
  inStockOnly: boolean;
  tag: string;
  material: string;
  finish: string;
  letter: string;
}

export interface UseProductFilterOptions {
  products: Product[];
  initialUniverse?: string;
  initialFilters?: Partial<FilterState>;
}

export const useProductFilter = ({ products, initialUniverse = "all", initialFilters = {} }: UseProductFilterOptions) => {
  const [query, setQuery] = useState(initialFilters.query ?? "");
  const [univ, setUniv] = useState(initialUniverse);
  const [sort, setSort] = useState<SortOption>(initialFilters.sort ?? "default");
  const [inStockOnly, setInStockOnly] = useState(initialFilters.inStockOnly ?? false);
  const [tag, setTag] = useState(initialFilters.tag ?? "all");
  const [material, setMaterial] = useState(initialFilters.material ?? "all");
  const [finish, setFinish] = useState(initialFilters.finish ?? "all");
  const [letter, setLetter] = useState(initialFilters.letter ?? "");

  useEffect(() => {
    setUniv(initialUniverse);
    setQuery("");
    setSort("default");
    setInStockOnly(false);
    setTag("all");
    setMaterial("all");
    setFinish("all");
    setLetter("");
  }, [initialUniverse]);

  const uniqueMaterials = useMemo(() => {
    const materials = new Set(products.map((p) => p.material).filter(Boolean));
    return Array.from(materials).sort();
  }, [products]);

  const uniqueFinishes = useMemo(() => {
    const finishes = new Set(products.map((p) => p.finish).filter(Boolean));
    return Array.from(finishes).sort();
  }, [products]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    products.forEach((p) => {
      const firstChar = p.name.charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        letters.add(firstChar);
      }
    });
    return Array.from(letters).sort();
  }, [products]);

  const tags = ["all", "Nouveauté", "Best-seller", "Réassort", "Édition limitée"];

  const filtered = useMemo(() => {
    let list = [...products];

    if (univ !== "all") list = list.filter((p) => p.universe === univ);
    if (tag !== "all") list = list.filter((p) => p.tag === tag);
    if (material !== "all") list = list.filter((p) => p.material === material);
    if (finish !== "all") list = list.filter((p) => p.finish === finish);
    if (letter) list = list.filter((p) => p.name.charAt(0).toUpperCase() === letter);
    if (inStockOnly) list = list.filter((p) => p.stock > 0);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reference.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.priceHT - b.priceHT);
        break;
      case "price-desc":
        list.sort((a, b) => b.priceHT - a.priceHT);
        break;
      case "alpha-asc":
        list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
        break;
      case "alpha-desc":
        list.sort((a, b) => b.name.localeCompare(a.name, "fr"));
        break;
    }

    return list;
  }, [query, univ, sort, inStockOnly, tag, material, finish, letter, products]);

  const resetFilters = () => {
    setQuery("");
    setUniv(initialUniverse);
    setSort("default");
    setInStockOnly(false);
    setTag("all");
    setMaterial("all");
    setFinish("all");
    setLetter("");
  };

  const hasActiveFilters = query !== "" || univ !== "all" || sort !== "default" || inStockOnly || tag !== "all" || material !== "all" || finish !== "all" || letter !== "";

  return {
    filters: { query, univ, sort, inStockOnly, tag, material, finish, letter },
    setters: { setQuery, setUniv, setSort, setInStockOnly, setTag, setMaterial, setFinish, setLetter },
    filtered,
    uniqueMaterials,
    uniqueFinishes,
    availableLetters,
    tags,
    resetFilters,
    hasActiveFilters,
  };
};
