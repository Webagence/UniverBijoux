import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "fr" | "en";

const dict = {
  fr: {
    "nav.new": "Nouveautés",
    "nav.necklaces": "Colliers",
    "nav.earrings": "Boucles",
    "nav.rings": "Bagues",
    "nav.bracelets": "Bracelets",
    "nav.atelier": "L'Atelier",
    "nav.proSpace": "Espace pro",
    "nav.account": "Mon compte",
    "nav.orders": "Mes commandes",
    "nav.logout": "Déconnexion",
    "nav.login": "Connexion pro",
    "nav.register": "Créer un compte pro",
    "common.search": "Recherche",
    "common.cart": "Panier",
    "common.menu": "Menu",
    "common.close": "Fermer",
    "footer.catalog": "Catalogue",
    "footer.maison": "Maison",
    "footer.proInfo": "Infos pro",
    "footer.shipping": "Livraison & retours",
    "footer.atelierLink": "L'atelier",
    "footer.becomeReseller": "Devenir revendeur",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.cgv": "CGV",
    "footer.legal": "Mentions légales",
    "footer.privacy": "Confidentialité",
    "footer.newsletterTitle": "Newsletter B2B",
    "footer.newsletterHeading": "Les nouveautés en avant-première",
    "footer.newsletterText": "Catalogues, fiches produit, offres revendeurs : tout directement dans votre boîte pro.",
    "footer.emailPlaceholder": "Votre email professionnel",
    "footer.subscribe": "S'inscrire",
    "footer.tagline": "Grossiste de bijoux faits main à Paris depuis 2016. Réservé aux professionnels.",
  },
  en: {
    "nav.new": "New",
    "nav.necklaces": "Necklaces",
    "nav.earrings": "Earrings",
    "nav.rings": "Rings",
    "nav.bracelets": "Bracelets",
    "nav.atelier": "Atelier",
    "nav.proSpace": "Pro space",
    "nav.account": "My account",
    "nav.orders": "My orders",
    "nav.logout": "Sign out",
    "nav.login": "Pro sign in",
    "nav.register": "Create a pro account",
    "common.search": "Search",
    "common.cart": "Cart",
    "common.menu": "Menu",
    "common.close": "Close",
    "footer.catalog": "Catalog",
    "footer.maison": "Maison",
    "footer.proInfo": "Pro info",
    "footer.shipping": "Shipping & returns",
    "footer.atelierLink": "The atelier",
    "footer.becomeReseller": "Become a reseller",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.cgv": "Terms",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy",
    "footer.newsletterTitle": "B2B Newsletter",
    "footer.newsletterHeading": "New arrivals in preview",
    "footer.newsletterText": "Catalogs, product sheets, reseller offers: directly in your pro inbox.",
    "footer.emailPlaceholder": "Your professional email",
    "footer.subscribe": "Subscribe",
    "footer.tagline": "Handmade jewelry wholesaler from Paris since 2016. Reserved for professionals.",
  },
} as const;

type Key = keyof (typeof dict)["fr"];

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
}

const LanguageCtx = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    return saved === "en" || saved === "fr" ? saved : "fr";
  });
  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => setLangState(l);
  const t = (k: Key) => (dict[lang] as any)[k] ?? (dict.fr as any)[k] ?? k;
  return <LanguageCtx.Provider value={{ lang, setLang, t }}>{children}</LanguageCtx.Provider>;
};

export const useLang = () => {
  const c = useContext(LanguageCtx);
  if (!c) throw new Error("useLang must be used inside LanguageProvider");
  return c;
};
