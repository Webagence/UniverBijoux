import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { TestimonialsSkeleton } from "./Skeletons";

const perPage = () => (typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 3);

const Testimonials = () => {
  const { testimonials, testimonialsSection } = useAdmin();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(3);

  useEffect(() => {
    const update = () => setCount(perPage());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = testimonials ? Math.ceil(testimonials.length / count) : 0;

  const next = useCallback(() => setCurrent((c) => (c + 1) % pages), [pages]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + pages) % pages), [pages]);

  useEffect(() => {
    if (pages <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, pages]);

  if (!testimonials || !testimonialsSection) return <TestimonialsSkeleton />;
  if (testimonials.length === 0) return null;

  const visible = testimonials.slice(current * count, current * count + count);

  return (
    <section className="bg-gradient-blush py-20 md:py-28">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="text-gold text-xs tracking-luxe uppercase">{testimonialsSection.eyebrow}</div>
          <h2 className="font-serif text-4xl md:text-5xl text-bordeaux">
            <em>{testimonialsSection.heading}</em> {testimonialsSection.headingEm}
          </h2>
        </div>

        <div className="relative">
          <div
            className="grid gap-6 transition-all duration-500"
            style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}
          >
            {visible.map((t) => (
              <figure key={t.id} className="bg-ivory p-5 sm:p-6 md:p-8 shadow-soft space-y-4">
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

          {pages > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-ivory shadow-soft flex items-center justify-center text-bordeaux hover:text-gold transition-smooth hidden md:flex"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-ivory shadow-soft flex items-center justify-center text-bordeaux hover:text-gold transition-smooth hidden md:flex"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-smooth ${
                  i === current ? "bg-gold" : "bg-bordeaux/20 hover:bg-bordeaux/40"
                }`}
                aria-label={`Aller à la page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
