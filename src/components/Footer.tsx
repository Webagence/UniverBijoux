import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useLang } from "@/context/LanguageContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { t } = useLang();

  const columns = [
    {
      title: t("footer.catalog"),
      links: [
        { to: "/nouveautes", label: t("nav.new") },
        { to: "/boutique/colliers", label: t("nav.necklaces") },
        { to: "/boutique/boucles", label: t("nav.earrings") },
        { to: "/boutique/bagues", label: t("nav.rings") },
        { to: "/boutique/bracelets", label: t("nav.bracelets") },
      ],
    },
    {
      title: t("footer.maison"),
      links: [
        { to: "/atelier", label: t("footer.atelierLink") },
        { to: "/inscription", label: t("footer.becomeReseller") },
        { to: "/contact", label: t("footer.contact") },
        { to: "/faq", label: t("footer.faq") },
      ],
    },
    {
      title: t("footer.proInfo"),
      links: [
        { to: "/livraison", label: t("footer.shipping") },
        { to: "/cgv", label: t("footer.cgv") },
        { to: "/mentions-legales", label: t("footer.legal") },
        { to: "/confidentialite", label: t("footer.privacy") },
      ],
    },
  ];

  return (
    <footer className="bg-bordeaux text-ivory">
      <div className="container py-16 md:py-20 border-b border-ivory/10">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-gold text-xs tracking-luxe uppercase">{t("footer.newsletterTitle")}</div>
          <h3 className="font-serif text-3xl md:text-4xl">
            {t("footer.newsletterHeading")}
          </h3>
          <p className="text-ivory/70 text-sm">
            {t("footer.newsletterText")}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast({ title: "Merci !", description: `${email}` });
              setEmail("");
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.emailPlaceholder")}
              className="flex-1 bg-transparent border border-ivory/30 px-5 py-3.5 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-smooth"
            />
            <button
              type="submit"
              className="bg-gold text-bordeaux px-8 py-3.5 text-xs tracking-luxe uppercase hover:bg-ivory transition-smooth"
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>

      <div className="container py-14 grid md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link to="/" className="font-serif text-2xl tracking-luxe">MAISON LUNE</Link>
          <p className="text-ivory/60 text-sm leading-relaxed">
            {t("footer.tagline")}
          </p>
          <div className="flex gap-4 pt-2 text-ivory/60">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold transition-smooth"><Instagram className="h-4 w-4" /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold transition-smooth"><Facebook className="h-4 w-4" /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-gold transition-smooth"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-serif text-base mb-4 text-gold">{col.title}</h4>
            <ul className="space-y-2.5 text-sm text-ivory/70">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-ivory transition-smooth">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ivory/10">
        <div className="container py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-ivory/50">
          <p>© 2026 Maison Lune · Grossiste B2B · SIRET 123 456 789 00012</p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-ivory transition-smooth">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-ivory transition-smooth">CGV</Link>
            <Link to="/confidentialite" className="hover:text-ivory transition-smooth">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
