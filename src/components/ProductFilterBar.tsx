import { UniverseRow } from "@/context/AdminContext";
import { SortOption } from "@/hooks/useProductFilter";
import { useLang } from "@/context/LanguageContext";

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
  letter: string;
  setLetter: (v: string) => void;
  universesList?: UniverseRow[];
  uniqueMaterials?: string[];
  uniqueFinishes?: string[];
  availableLetters?: string[];
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
  letter,
  setLetter,
  universesList,
  uniqueMaterials = [],
  uniqueFinishes = [],
  availableLetters = [],
  tags = ["all"],
  showUniverseFilter = true,
  count,
  onReset,
}: ProductFilterBarProps) => {
  const { t } = useLang();

  return (
    <div className="space-y-4 mb-10">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="search"
          placeholder={t("search_placeholder")}
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
            <option value="all">{t("all_universes")}</option>
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
          <option value="default">{t("sort_by_relevance")}</option>
          <option value="price-asc">{t("price_ascending")}</option>
          <option value="price-desc">{t("price_descending")}</option>
          <option value="alpha-asc">{t("alpha_az")}</option>
          <option value="alpha-desc">{t("alpha_za")}</option>
        </select>
        <label className="flex items-center gap-2 bg-ivory border border-border px-4 py-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-bordeaux"
          />
          {t("in_stock")}
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        {tags.length > 1 && (
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="all">{t("all_tags")}</option>
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
            <option value="all">{t("all_materials")}</option>
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
            <option value="all">{t("all_finishes")}</option>
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
            {t("reset_filters")}
          </button>
        )}
      </div>

      {availableLetters.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-luxe text-bordeaux/50 mb-2">{t("filter_by_letter")}</p>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setLetter("")}
              className={`w-8 h-8 text-xs font-medium border transition-smooth ${
                letter === ""
                  ? "bg-bordeaux text-white border-bordeaux"
                  : "bg-ivory border-border text-bordeaux hover:border-gold"
              }`}
            >
              #
            </button>
            {availableLetters.map((l) => (
              <button
                key={l}
                onClick={() => setLetter(l)}
                className={`w-8 h-8 text-xs font-medium border transition-smooth ${
                  letter === l
                    ? "bg-bordeaux text-white border-bordeaux"
                    : "bg-ivory border-border text-bordeaux hover:border-gold"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs uppercase tracking-luxe text-bordeaux/50">
        {count} {count > 1 ? t("references_plural") : t("references_singular")}
      </p>
    </div>
  );
};

export default ProductFilterBar;
