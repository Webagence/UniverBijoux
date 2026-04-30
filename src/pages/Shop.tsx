import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { useAdmin } from "@/context/AdminContext";

const Shop = () => {
  const { products, universesList } = useAdmin();
  const [query, setQuery] = useState("");
  const [univ, setUniv] = useState<string>("all");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");

  const filtered = useMemo(() => {
    let list = [...products];
    if (univ !== "all") list = list.filter((p) => p.universe === univ);
    if (query.trim())
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.reference.toLowerCase().includes(query.toLowerCase())
      );
    if (sort === "asc") list.sort((a, b) => a.priceHT - b.priceHT);
    if (sort === "desc") list.sort((a, b) => b.priceHT - a.priceHT);
    return list;
  }, [query, univ, sort, products]);

  return (
    <Layout>
      <PageHeader
        eyebrow="Catalogue B2B"
        title="Le catalogue complet"
        subtitle="Toutes les références Maison Lune disponibles pour les revendeurs professionnels."
        crumbs={[{ label: "Boutique" }]}
      />
      <section className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="search"
            placeholder="Rechercher un nom, une référence..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          />
          <select
            value={univ}
            onChange={(e) => setUniv(e.target.value)}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="all">Tous les univers</option>
            {universesList?.map((u) => (
              <option key={u.slug} value={u.slug}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "default" | "asc" | "desc")}
            className="bg-ivory border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
          >
            <option value="default">Trier par : pertinence</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
          </select>
        </div>
        <p className="text-xs uppercase tracking-luxe text-bordeaux/50 mb-6">
          {filtered.length} référence{filtered.length > 1 ? "s" : ""}
        </p>
        {filtered.length === 0 ? (
          <p className="text-bordeaux/60 text-center py-20">Aucun résultat pour votre recherche.</p>
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
