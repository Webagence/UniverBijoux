import { UniverseRow } from "@/context/AdminContext";
import { SortOption } from "@/hooks/useProductFilter";

interface ProductFilterBarProps {
  query: string;
  setQuery: (v: string) => void;
  univ: string;
  setUniv: (v: string) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  tag: string;
  setTag: (v: string) => void;
  material: string;
  setMaterial: (v: string) => void;
  finish: string;
  setFinish: (v: string) => void;
  universesList?: UniverseRow[];
  uniqueMaterials?: string[];
  uniqueFinishes?: string[];
  tags?: string[];
  showUniverseFilter?: boolean;
  count: number;
  onReset?: () => void;
}

const ProductFilterBar = ({
  query,
  setQuery,
  univ,
  setUniv,
  sort,
  setSort,
  inStockOnly,
  setInStockOnly,
  tag,
  setTag,
  material,
  setMaterial,
  finish,
  setFinish,
  universesList,
  uniqueMaterials = [],
  uniqueFinishes = [],
  tags = ["all"],
  showUniverseFilter = true,
  count,
  onReset,
}: ProductFilterBarProps) => {
  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="search"
          placeholder="Rechercher un nom, une référence, une description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
        />
        {showUniverseFilter && universesList && universesList.length > 0 && (
          <select
            value={univ}
            onChange={(e) => setUniv(e.target.value)}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="all">Tous les univers</option>
            {universesList.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
        )}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
        >
          <option value="default">Trier par : pertinence</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="alpha-asc">Alphabétique A-Z</option>
          <option value="alpha-desc">Alphabétique Z-A</option>
        </select>
        <label className="flex items-center gap-2 bg-ivory border border-border px-4 py-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-bordeaux"
          />
          En stock
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        {tags.length > 1 && (
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="all">Tous les tags</option>
            {tags.filter((t) => t !== "all").map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
        {uniqueMaterials.length > 0 && (
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="all">Tous les matériaux</option>
            {uniqueMaterials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        )}
        {uniqueFinishes.length > 0 && (
          <select
            value={finish}
            onChange={(e) => setFinish(e.target.value)}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="all">Toutes les finitions</option>
            {uniqueFinishes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        )}
        {onReset && (
          <button
            onClick={onReset}
            className="bg-bordeaux text-white px-4 py-3 text-sm hover:bg-bordeaux/90 transition-smooth"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      <p className="text-xs uppercase tracking-luxe text-bordeaux/50">
        {count} référence{count > 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default ProductFilterBar;
