import { Star } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const Testimonials = () => {
  const { testimonials, testimonialsSection } = useAdmin();
  return (
    <section className="bg-gradient-blush py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-gold text-xs tracking-luxe uppercase">{testimonialsSection.eyebrow || "Nos revendeurs en parlent"}</div>
          <h2 className="font-serif text-4xl md:text-5xl text-bordeaux">
            <em>{testimonialsSection.heading || "850 partenaires nous"}</em> {testimonialsSection.headingEm || "font confiance"}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure key={t.id} className="bg-ivory p-8 shadow-soft space-y-4">
              <div className="flex gap-0.5 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="font-serif italic text-lg text-bordeaux leading-relaxed">
                "{t.text}"
              </blockquote>
              <figcaption className="pt-4 border-t border-border">
                <div className="text-bordeaux font-medium text-sm">{t.name}</div>
                <div className="text-xs uppercase tracking-luxe text-bordeaux/50 mt-0.5">
                  {t.shop}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
