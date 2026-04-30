import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useAdmin } from "@/context/AdminContext";

const NewByUniverse = () => {
  const { products, universesList } = useAdmin();

  if (!universesList || universesList.length === 0) return null;

  return (
    <section className="container py-20 md:py-28 space-y-20">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="text-gold text-xs tracking-luxe uppercase">Nouveautés par univers</div>
        <h2 className="font-serif text-4xl md:text-5xl text-bordeaux">
          Les <em>nouvelles pièces</em> de la saison
        </h2>
        <p className="text-bordeaux/60">
          Les 4 dernières références référencées dans chacun de nos univers.
        </p>
      </div>

      {universesList.map((u) => {
        const items = products
          .filter((p) => p.universe === u.slug && p.isNew)
          .slice(0, 4);
        if (!items.length) return null;
        return (
          <div key={u.id} className="space-y-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[11px] tracking-luxe uppercase text-gold mb-2">Univers</div>
                <h3 className="font-serif text-2xl md:text-3xl text-bordeaux">{u.name}</h3>
              </div>
              <Link
                to={`/boutique/${u.slug}`}
                className="text-xs tracking-luxe uppercase text-bordeaux border-b border-gold pb-1 hover:text-gold transition-smooth whitespace-nowrap"
              >
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default NewByUniverse;
