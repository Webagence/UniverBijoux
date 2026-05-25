import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import api from "@/services/api";

export interface Locale {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  is_default: boolean;
  direction: string;
}

interface LocaleContextType {
  locale: string;
  locales: Locale[];
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

const translations: Record<string, Record<string, string>> = {
  fr: {
    "nav.home": "Accueil",
    "nav.shop": "Boutique",
    "nav.about": "Notre Atelier",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.login": "Connexion",
    "nav.register": "Inscription",
    "nav.cart": "Panier",
    "nav.account": "Mon Compte",
    "nav.admin": "Admin",
    "footer.rights": "Tous droits réservés",
    "footer.legal": "Mentions légales",
    "footer.cgv": "CGV",
    "footer.privacy": "Confidentialité",
    "footer.shipping": "Livraison & Retours",
    "common.loading": "Chargement...",
    "common.error": "Une erreur est survenue",
    "common.retry": "Réessayer",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.search": "Rechercher",
    "cart.add": "Ajouter au panier",
    "cart.remove": "Retirer",
    "cart.empty": "Votre panier est vide",
    "cart.total": "Total",
    "cart.checkout": "Commander",
    "auth.login": "Se connecter",
    "auth.logout": "Se déconnecter",
    "auth.register": "Créer un compte",
    "auth.email": "Email",
    "auth.password": "Mot de passe",
    "auth.forgot": "Mot de passe oublié ?",
  },
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.about": "Our Workshop",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.cart": "Cart",
    "nav.account": "My Account",
    "nav.admin": "Admin",
    "footer.rights": "All rights reserved",
    "footer.legal": "Legal Notice",
    "footer.cgv": "Terms & Conditions",
    "footer.privacy": "Privacy Policy",
    "footer.shipping": "Shipping & Returns",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "cart.add": "Add to cart",
    "cart.remove": "Remove",
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "auth.login": "Login",
    "auth.logout": "Logout",
    "auth.register": "Create account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgot": "Forgot password?",
  },
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<string>(() => {
    return localStorage.getItem("locale") || "fr";
  });
  const [locales, setLocales] = useState<Locale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const setLocale = useCallback(async (newLocale: string) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);

    try {
      await api.post("/translations/set-locale", { locale: newLocale });
    } catch {
      console.warn("Failed to set locale on server");
    }

    window.location.reload();
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const localeTranslations = translations[locale] || translations.fr;
    return localeTranslations[key] || fallback || key;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, locales, setLocale, t, isLoading }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
