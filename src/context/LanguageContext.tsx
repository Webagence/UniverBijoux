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
    "nav.home": "Accueil",
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
    "search_placeholder": "Rechercher un nom, une référence, une description...",
    "all_universes": "Tous les univers",
    "sort_by_relevance": "Trier par : pertinence",
    "price_ascending": "Prix croissant",
    "price_descending": "Prix décroissant",
    "alpha_az": "Alphabétique A-Z",
    "alpha_za": "Alphabétique Z-A",
    "in_stock": "En stock",
    "all_tags": "Tous les tags",
    "all_materials": "Tous les matériaux",
    "all_finishes": "Toutes les finitions",
    "reset_filters": "Réinitialiser les filtres",
    "filter_by_letter": "Filtrer par lettre",
    "references_singular": "référence",
    "references_plural": "références",
    "recycled_gold": "Or recyclé",
    "lifetime_warranty": "Garantie",
    "made_in": "Made in",
    "cart.your_cart": "Votre panier",
    "cart.login_required": "Connexion requise",
    "cart.login_required_desc": "Connectez-vous pour valider votre commande.",
    "cart.account_pending": "Compte en attente de validation",
    "cart.account_pending_desc": "Votre compte pro doit être validé par notre équipe avant toute commande.",
    "cart.discover_catalog": "Découvrir le catalogue",
    "cart.remove": "Retirer",
    "cart.clear_cart": "Vider le panier",
    "cart.summary": "Récapitulatif",
    "cart.subtotal_ht": "Sous-total HT",
    "cart.vat": "TVA (20%)",
    "cart.shipping": "Livraison",
    "cart.free": "Offerte",
    "cart.total_ttc": "Total TTC",
    "cart.proceed_order": "Procéder à la commande",
    "cart.free_shipping_from": "Livraison offerte dès",
    "cart.payment_terms": "Paiement à 30 jours après validation.",
    "cart.added": "Ajouté au panier",
    "cart.proceed_payment": "Procéder au paiement",
    "product.login_required": "Connexion requise",
    "product.login_required_desc": "Connectez-vous à votre compte pro pour commander.",
    "product.variations_required": "Variations requises",
    "product.variations_required_desc": "Veuillez choisir une option pour chaque variation.",
    "product.insufficient_qty": "Quantité insuffisante",
    "product.insufficient_qty_desc": "Minimum {moq} pièces.",
    "product.material": "Matière",
    "product.finish": "Finition",
    "product.quality": "Qualité",
    "product.min_qty": "Quantité minimale",
    "product.packaging": "Conditionnement",
    "product.by": "Par",
    "product.sold_out": "Épuisé",
    "product.choose_variations": "Choisir les variations",
    "product.decrease": "Diminuer",
    "product.increase": "Augmenter",
    "product.login_link": "Connectez-vous",
    "product.login_desc": "à votre compte professionnel pour commander.",
    "product.delivery_48h": "Livraison 48h",
    "product.lifetime_warranty": "Garantie à vie",
    "product.made_in_france": "Fabrication française",
    "product.you_will_also_like": "Vous aimerez aussi",
    "product.ht_per_piece": "HT / pièce",
    "product.recommended_price": "Prix public conseillé",
  },
  en: {
    "nav.home": "Home",
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
    "search_placeholder": "Search by name, reference, description...",
    "all_universes": "All universes",
    "sort_by_relevance": "Sort by: relevance",
    "price_ascending": "Price: low to high",
    "price_descending": "Price: high to low",
    "alpha_az": "Alphabetical A-Z",
    "alpha_za": "Alphabetical Z-A",
    "in_stock": "In stock",
    "all_tags": "All tags",
    "all_materials": "All materials",
    "all_finishes": "All finishes",
    "reset_filters": "Reset filters",
    "filter_by_letter": "Filter by letter",
    "references_singular": "reference",
    "references_plural": "references",
    "recycled_gold": "Recycled gold",
    "lifetime_warranty": "Warranty",
    "made_in": "Made in",
    "cart.your_cart": "Your Cart",
    "cart.login_required": "Login Required",
    "cart.login_required_desc": "Please sign in to complete your order.",
    "cart.account_pending": "Account Pending Approval",
    "cart.account_pending_desc": "Your pro account must be approved by our team before ordering.",
    "cart.discover_catalog": "Discover the Catalog",
    "cart.remove": "Remove",
    "cart.clear_cart": "Clear Cart",
    "cart.summary": "Summary",
    "cart.subtotal_ht": "Subtotal excl. VAT",
    "cart.vat": "VAT (20%)",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.total_ttc": "Total incl. VAT",
    "cart.proceed_order": "Proceed to Order",
    "cart.free_shipping_from": "Free shipping from",
    "cart.payment_terms": "Payment 30 days after approval.",
    "cart.added": "Added to cart",
    "cart.proceed_payment": "Proceed to Payment",
    "product.login_required": "Login Required",
    "product.login_required_desc": "Sign in to your pro account to order.",
    "product.variations_required": "Variations Required",
    "product.variations_required_desc": "Please choose an option for each variation.",
    "product.insufficient_qty": "Insufficient Quantity",
    "product.insufficient_qty_desc": "Minimum {moq} pieces.",
    "product.material": "Material",
    "product.finish": "Finish",
    "product.quality": "Quality",
    "product.min_qty": "Minimum Quantity",
    "product.packaging": "Packaging",
    "product.by": "By",
    "product.sold_out": "Sold Out",
    "product.choose_variations": "Choose Variations",
    "product.decrease": "Decrease",
    "product.increase": "Increase",
    "product.login_link": "Sign in",
    "product.login_desc": "to your professional account to order.",
    "product.delivery_48h": "48h Delivery",
    "product.lifetime_warranty": "Lifetime Warranty",
    "product.made_in_france": "Made in France",
    "product.you_will_also_like": "You Will Also Like",
    "product.ht_per_piece": "excl. VAT / piece",
    "product.recommended_price": "Recommended retail price",
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
