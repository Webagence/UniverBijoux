import { Link } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";

const FALLBACK_IMG = "/placeholder.svg";

const Categories = () => {
  const { universesList } = useAdmin();

  if (!universesList || universesList.length === 0) return null;

  return (
    <section id="univers" className="bg-cream py-20 md:py-28">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="text-gold text-xs tracking-luxe uppercase">Univers</div>
            <h2 className="font-serif text-4xl md:text-5xl text-bordeaux max-w-xl">
              Explorez nos <em>collections</em>
            </h2>
          </div>
          <p className="text-bordeaux/60 max-w-sm">
            Chaque pièce est dessinée et fabriquée dans nos ateliers français.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {universesList.map((u, i) => (
            <Link
              key={u.id}
              to={`/boutique/${u.slug}`}
              className="group relative block aspect-[3/4] overflow-hidden bg-bordeaux"
              style={{ marginTop: i % 2 ? "2rem" : "0" }}
            >
              <img
                src={u.image_url || FALLBACK_IMG}
                alt={u.name}
                loading="lazy"
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-smooth"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bordeaux/80 via-bordeaux/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                <h3 className="font-serif text-2xl mb-1">{u.name}</h3>
                <p className="text-xs tracking-luxe uppercase opacity-80">{u.products_count || 0} pièces</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
