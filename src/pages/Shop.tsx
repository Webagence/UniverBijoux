import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import ProductFilterBar from "@/components/ProductFilterBar";
import { useAdmin } from "@/context/AdminContext";
import { useLang } from "@/context/LanguageContext";
import { useProductFilter } from "@/hooks/useProductFilter";

const Shop = () => {
  const { products, universesList } = useAdmin();
  const { t } = useLang();
  const {
    filters,
    setters,
    filtered,
    uniqueMaterials,
    uniqueFinishes,
    availableLetters,
    tags,
    resetFilters,
  } = useProductFilter({ products });

  return (
    <Layout>
      <PageHeader
        eyebrow={t("shop.catalog_b2b")}
        title={t("shop.full_catalog")}
        subtitle={t("shop.catalog_subtitle")}
        crumbs={[{ label: t("shop.shop") }]}
      />
      <section className="container py-12 md:py-16">
        <ProductFilterBar
          query={filters.query}
          setQuery={setters.setQuery}
          univ={filters.univ}
          setUniv={setters.setUniv}
          sort={filters.sort}
          setSort={setters.setSort}
          inStockOnly={filters.inStockOnly}
          setInStockOnly={setters.setInStockOnly}
          tag={filters.tag}
          setTag={setters.setTag}
          material={filters.material}
          setMaterial={setters.setMaterial}
          finish={filters.finish}
          setFinish={setters.setFinish}
          letter={filters.letter}
          setLetter={setters.setLetter}
          universesList={universesList}
          uniqueMaterials={uniqueMaterials}
          uniqueFinishes={uniqueFinishes}
          availableLetters={availableLetters}
          tags={tags}
          showUniverseFilter
          count={filtered.length}
          onReset={resetFilters}
        />
        {filtered.length === 0 ? (
          <p className="text-bordeaux/60 text-center py-20">{t("shop.no_results")}</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Shop;
