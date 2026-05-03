import atelier from "@/assets/atelier.jpg";
import { useAdmin } from "@/context/AdminContext";

const defaultStats = [
  ["Or recyclé", "100%"],
  ["Garantie", "À vie"],
  ["Made in", "France"],
];

const Atelier = () => {
  const { atelier: a } = useAdmin();
  const stats = a.stats && Array.isArray(a.stats) ? a.stats : defaultStats;
  return (
    <section id="atelier" className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative">
          <img
            src={a.image || atelier}
            alt="Artisan travaillant un bijou en or dans l'atelier"
            loading="lazy"
            width={1200}
            height={900}
            className="w-full h-[500px] object-cover shadow-elegant"
          />
          <div className="absolute -bottom-8 -right-4 md:-right-8 bg-ivory p-6 shadow-elegant max-w-[200px] hidden sm:block">
            <div className="font-serif text-4xl text-gold mb-1">{a.badgeNumber}</div>
            <p className="text-xs uppercase tracking-luxe text-bordeaux/70">{a.badgeLabel}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-gold text-xs tracking-luxe uppercase">{a.eyebrow}</div>
          <h2 className="font-serif text-4xl md:text-5xl text-bordeaux leading-tight">
            {a.title}<br /><em>{a.titleEm}</em>
          </h2>
          <p className="text-bordeaux/70 leading-relaxed">{a.paragraph1}</p>
          <p className="text-bordeaux/70 leading-relaxed">{a.paragraph2}</p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
            {stats.map(([label, val], i) => (
              <div key={i}>
                <div className="font-serif text-2xl text-bordeaux">{val}</div>
                <div className="text-xs tracking-luxe uppercase text-bordeaux/50 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Atelier;
