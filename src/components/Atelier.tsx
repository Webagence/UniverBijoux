import { useAdmin } from "@/context/AdminContext";
import { AtelierSkeleton } from "./Skeletons";

const Atelier = () => {
  const { atelier: a } = useAdmin();

  if (!a) return <AtelierSkeleton />;

  return (
    <section id="atelier" className="container py-20 md:py-28">
      <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative">
          {a.image ? (
            <img
              src={a.image}
              alt="Artisan travaillant un bijou en or dans l'atelier"
              loading="lazy"
              width={1200}
              height={900}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover shadow-elegant"
            />
          ) : (
            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] bg-bordeaux/5" />
          )}
          {a.badgeNumber && (
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-ivory p-6 shadow-elegant max-w-[200px] hidden sm:block">
              <div className="font-serif text-4xl text-gold mb-1">{a.badgeNumber}</div>
              <p className="text-xs uppercase tracking-luxe text-bordeaux/70">{a.badgeLabel}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="text-gold text-xs tracking-luxe uppercase">{a.eyebrow}</div>
          <h2 className="font-serif text-4xl md:text-5xl text-bordeaux leading-tight">
            {a.title}<br /><em>{a.titleEm}</em>
          </h2>
          <p className="text-bordeaux/70 leading-relaxed">{a.paragraph1}</p>
          <p className="text-bordeaux/70 leading-relaxed">{a.paragraph2}</p>
        </div>
      </div>
    </section>
  );
};

export default Atelier;
