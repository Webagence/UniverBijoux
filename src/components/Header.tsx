import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, LogOut, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useLang, announcementTranslations } from "@/context/LanguageContext";

const Header = () => {
  const { lang, setLang, t } = useLang();
  const { universesList } = useAdmin();
  const universeLinks = universesList?.slice(0, 4).map((u) => ({
    to: `/boutique/${u.slug}`,
    label: u.name,
  })) || [];
  const links = [
    { to: "/nouveautes", label: t("nav.new") },
    ...universeLinks,
    { to: "/atelier", label: t("nav.atelier") },
  ];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { settings } = useAdmin();
  const navigate = useNavigate();

  const translateAnnouncement = (text: string): string => {
    if (lang === "en" && announcementTranslations[text]) {
      return announcementTranslations[text];
    }
    return text;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `transition-smooth tracking-wide ${
      isActive ? "text-gold" : "text-bordeaux/80 hover:text-gold"
    }`;

  return (
    <>
      <div className="bg-bordeaux text-ivory overflow-hidden text-xs">
        <div className="flex animate-marquee whitespace-nowrap py-2.5">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-12 px-6 tracking-luxe uppercase">
              {settings.announcements.map((a, j) => (
                <span key={j}>✦ {translateAnnouncement(a)}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-smooth ${
          scrolled ? "bg-ivory/95 backdrop-blur-md shadow-soft" : "bg-ivory"
        }`}
      >
        <div className="container flex items-center justify-between py-5 gap-4">
            <button
              aria-label={t("common.menu")}
              onClick={() => setMobileOpen(true)}
            >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-sm flex-1">
            {links.slice(0, 3).map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/" className="flex items-center">
            {settings.logo ? (
              <img src={settings.logo} alt={settings.siteName} className="h-16 md:h-24 w-auto object-contain" />
            ) : (
              <span className="font-serif text-2xl md:text-3xl text-bordeaux tracking-luxe whitespace-nowrap">
                {settings.siteName}
              </span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm flex-1 justify-end">
            {links.slice(3).map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-5 md:ml-6 text-bordeaux">
            <button
              aria-label={t("common.search")}
              onClick={() => navigate("/boutique")}
              className="hover:text-gold transition-smooth"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[11px] tracking-luxe uppercase">
              <Globe className="h-[14px] w-[14px] text-bordeaux/60" />
              <button
                onClick={() => setLang("fr")}
                className={`px-1 transition-smooth ${lang === "fr" ? "text-gold font-medium" : "text-bordeaux/60 hover:text-gold"}`}
                aria-label="Français"
              >
                FR
              </button>
              <span className="text-bordeaux/30">|</span>
              <button
                onClick={() => setLang("en")}
                className={`px-1 transition-smooth ${lang === "en" ? "text-gold font-medium" : "text-bordeaux/60 hover:text-gold"}`}
                aria-label="English"
              >
                EN
              </button>
            </div>

            {user ? (
              <>
                <Link
                  to="/compte"
                  aria-label={t("nav.account")}
                  className="hover:text-gold transition-smooth hidden sm:block"
                >
                  <User className="h-[18px] w-[18px]" />
                </Link>
                <button
                  onClick={logout}
                  aria-label={t("nav.logout")}
                  className="hover:text-gold transition-smooth hidden sm:block"
                >
                  <LogOut className="h-[18px] w-[18px]" />
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                aria-label={t("nav.login")}
                className="hover:text-gold transition-smooth text-[11px] tracking-luxe uppercase hidden sm:inline-block"
              >
                {t("nav.proSpace")}
              </Link>
            )}

            <Link to="/panier" aria-label={t("common.cart")} className="hover:text-gold transition-smooth relative">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-ivory text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-bordeaux/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-ivory p-6 space-y-6 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl text-bordeaux tracking-luxe flex items-center">
                {settings.logo ? (
                  <img src={settings.logo} alt={settings.siteName} className="h-16 md:h-20 w-auto object-contain" />
                ) : (
                  settings.siteName
                )}
              </span>
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer">
                <X className="h-5 w-5 text-bordeaux" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 text-bordeaux">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-base ${isActive ? "text-gold" : "text-bordeaux hover:text-gold"}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="h-px bg-border my-2" />
              <div className="flex items-center gap-2 text-[11px] tracking-luxe uppercase">
                <Globe className="h-[14px] w-[14px] text-bordeaux/60" />
                <button
                  onClick={() => setLang("fr")}
                  className={`px-1 ${lang === "fr" ? "text-gold font-medium" : "text-bordeaux/60"}`}
                >
                  FR
                </button>
                <span className="text-bordeaux/30">|</span>
                <button
                  onClick={() => setLang("en")}
                  className={`px-1 ${lang === "en" ? "text-gold font-medium" : "text-bordeaux/60"}`}
                >
                  EN
                </button>
              </div>
              <div className="h-px bg-border my-2" />
              {user ? (
                <>
                  <Link to="/compte" onClick={() => setMobileOpen(false)} className="text-sm">
                    {t("nav.account")}
                  </Link>
                  <Link to="/commandes" onClick={() => setMobileOpen(false)} className="text-sm">
                    {t("nav.orders")}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="text-sm text-left"
                  >
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/connexion" onClick={() => setMobileOpen(false)} className="text-sm">
                    {t("nav.login")}
                  </Link>
                  <Link to="/inscription" onClick={() => setMobileOpen(false)} className="text-sm">
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
};

export default Header;
