import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import api from "@/services/api";

export type Lang = "fr" | "en";

export const announcementTranslations: Record<string, string> = {
  "Réservé aux professionnels": "Reserved for professionals",
  "Prix HT — TVA 20%": "Prices excl. VAT — 20% VAT",
  "Franco de port dès 300€ HT": "Free shipping from €300 excl. VAT",
  "Fabrication française": "Made in France",
  "Tarifs dégressifs": "Volume discounts",
  "Livraison 48h": "48h delivery",
};

export interface LocaleInfo {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  is_default: boolean;
  direction: string;
}

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
    "common.addToCart": "Ajouter au panier",
    "common.seeAllCatalog": "Voir tout le catalogue →",
    "common.seeAll": "Voir tout →",
    "common.pieces": "pièces",
    "common.new": "Nouveauté",
    "common.ref": "Réf.",
    "common.min": "Min.",
    "common.recommendedPrice": "PVC conseillé",
    "common.stock": "Stock",
    "common.pcs": "pcs",
    "bestsellers.eyebrow": "Best-sellers",
    "bestsellers.heading": "Les pièces que vos clients",
    "bestsellers.headingEm": "adorent",
    "bestsellers.description": "Les références les plus commandées par notre réseau de revendeurs.",
    "categories.eyebrow": "Univers",
    "categories.heading": "Explorez nos",
    "categories.headingEm": "collections",
    "categories.description": "Chaque pièce est dessinée et fabriquée dans nos ateliers français.",
    "newArrivals.heading": "Les",
    "newArrivals.headingEm": "nouvelles pièces",
    "newArrivals.description": "Les 4 dernières références dans chacun de nos univers.",
    "footer.tagline": "Grossiste de bijoux faits main à Paris depuis 2016. Réservé aux professionnels.",
    "footer.copyright": "© 2026 MAISON LUNE · Grossiste B2B",
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
    "common.addToCart": "Add to cart",
    "common.seeAllCatalog": "View full catalog →",
    "common.seeAll": "View all →",
    "common.pieces": "pieces",
    "common.new": "New",
    "common.ref": "Ref.",
    "common.min": "Min.",
    "common.recommendedPrice": "RRP",
    "common.stock": "Stock",
    "common.pcs": "pcs",
    "bestsellers.eyebrow": "Best-sellers",
    "bestsellers.heading": "The pieces your customers",
    "bestsellers.headingEm": "love",
    "bestsellers.description": "The most ordered references by our reseller network.",
    "categories.eyebrow": "Universes",
    "categories.heading": "Explore our",
    "categories.headingEm": "collections",
    "categories.description": "Each piece is designed and made in our French workshops.",
    "newArrivals.heading": "The",
    "newArrivals.headingEm": "new pieces",
    "newArrivals.description": "The 4 latest references in each of our universes.",
    "footer.tagline": "Handmade jewelry wholesaler from Paris since 2016. Reserved for professionals.",
    "footer.copyright": "© 2026 MAISON LUNE · B2B Wholesaler",
    "footer.catalog": "Catalog",
    "footer.maison": "Maison",
    "footer.proInfo": "Pro info",
    "footer.shipping": "Shipping & returns",
    "footer.atelierLink": "The atelier",
    "footer.becomeReseller": "Become a reseller",
    "footer.contact": "Contact",
    "footer.faq": "FAQ",
    "footer.cgv": "Terms",
    "footer.legal": "Legal notice",
    "footer.privacy": "Privacy",
    "footer.newsletterTitle": "B2B Newsletter",
    "footer.newsletterHeading": "New arrivals in preview",
    "footer.newsletterText": "Catalogs, product sheets, reseller offers: directly in your pro inbox.",
    "footer.emailPlaceholder": "Your professional email",
    "footer.subscribe": "Subscribe",
  },
} as const;

type Key = keyof (typeof dict)["fr"];

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: Key) => string;
  locales: LocaleInfo[];
  isLoading: boolean;
}

const LanguageCtx = createContext<Ctx | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    return saved === "en" || saved === "fr" ? saved : "fr";
  });
  const [locales, setLocales] = useState<LocaleInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    localStorage.setItem("locale", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const { data } = await api.get("/translations/locales");
        setLocales(data.locales || []);
      } catch {
        setLocales([
          { code: "fr", name: "French", native_name: "Français", flag_emoji: "🇫🇷", is_default: true, direction: "ltr" },
          { code: "en", name: "English", native_name: "English", flag_emoji: "🇬🇧", is_default: false, direction: "ltr" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocales();
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);

    api.post("/translations/set-locale", { locale: l }).catch(() => {
      console.warn("Failed to set locale on server");
    });

    window.location.reload();
  }, []);

  const t = useCallback((k: Key) => (dict[lang] as any)[k] ?? (dict.fr as any)[k] ?? k, [lang]);

  return (
    <LanguageCtx.Provider value={{ lang, setLang, t, locales, isLoading }}>
      {children}
    </LanguageCtx.Provider>
  );
};

export const useLang = () => {
  const c = useContext(LanguageCtx);
  if (!c) throw new Error("useLang must be used inside LanguageProvider");
  return c;
};
