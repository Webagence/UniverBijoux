import heroImg from "@/assets/hero-jewelry.jpg";
import { Link } from "react-router-dom";
import { MapPin, Truck, Clock, Phone } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const Hero = () => {
  const { hero } = useAdmin();
  return (
    <section className="relative bg-gradient-hero overflow-hidden">
      <div className="container grid md:grid-cols-2 gap-12 items-center py-16 md:py-24">
        <div className="space-y-8 animate-fade-up order-2 md:order-1">
          <div className="flex items-center gap-3 text-gold text-xs tracking-luxe uppercase">
            <span className="h-px w-10 bg-gold" />
            {hero.eyebrow}
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-bordeaux leading-[1.05]">
            {hero.titleLine1}<br />
            <em className="text-gold">{hero.titleEm}</em> {hero.titleLine2 ? <><br />{hero.titleLine2}</> : null}
          </h1>
          <p className="text-bordeaux/70 text-lg max-w-md leading-relaxed">{hero.paragraph}</p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/boutique"
              className="inline-flex items-center justify-center bg-bordeaux text-ivory px-10 py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              to="/inscription"
              className="inline-flex items-center justify-center border border-bordeaux text-bordeaux px-10 py-4 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
          <div className="flex items-center gap-8 pt-4 text-xs text-bordeaux/60 tracking-wide">
            <div>
              <span className="block font-serif text-2xl text-gold">{hero.stat1Value}</span>
              {hero.stat1Label}
            </div>
            <div className="h-10 w-px bg-bordeaux/20" />
            <div>
              <span className="block font-serif text-2xl text-gold">{hero.stat2Value}</span>
              {hero.stat2Label}
            </div>
          </div>
          {(hero.address || hero.shipping || hero.hours || hero.phone) && (
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-bordeaux/10">
              {hero.address && (
                <div className="flex items-start gap-2 text-bordeaux/70">
                  <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{hero.address}</span>
                </div>
              )}
              {hero.shipping && (
                <div className="flex items-start gap-2 text-bordeaux/70">
                  <Truck className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{hero.shipping}</span>
                </div>
              )}
              {hero.hours && (
                <div className="flex items-start gap-2 text-bordeaux/70">
                  <Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{hero.hours}</span>
                </div>
              )}
              {hero.phone && (
                <div className="flex items-start gap-2 text-bordeaux/70">
                  <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">{hero.phone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative order-1 md:order-2 animate-fade-up">
          <div className="absolute -top-6 -left-6 w-24 h-24 border border-gold/40 rounded-full" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blush/60 rounded-full -z-10" />
          <img
            src={hero.image || heroImg}
            alt="Collection de bijoux Maison Lune"
            width={1600}
            height={1024}
            className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[640px] object-cover shadow-elegant"
          />
          <div className="absolute bottom-6 left-6 bg-ivory/90 backdrop-blur-sm px-5 py-3 shadow-soft">
            <p className="font-serif italic text-sm text-bordeaux">"{hero.quote}"</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
