import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Ticket,
  Settings,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", shortLabel: "Accueil", to: "/compte" },
  { icon: Package, label: "Commandes", shortLabel: "Commandes", to: "/commandes" },
  { icon: Ticket, label: "Support", shortLabel: "Support", to: "/support" },
  { icon: ShoppingCart, label: "Catalogue", shortLabel: "Catalogue", to: "/boutique" },
  { icon: Settings, label: "Profil", shortLabel: "Profil", to: "/compte?edit=profile" },
];

const ProSidebar = () => {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === "/compte") {
      return location.pathname === "/compte" && !location.search.includes("edit");
    }
    if (to === "/compte?edit=profile") {
      return location.pathname === "/compte" && location.search.includes("edit");
    }
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile: Horizontal scrollable tabs */}
      <nav className="md:hidden flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 border-b border-border">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap shrink-0 transition-smooth ${
                active
                  ? "bg-bordeaux text-ivory"
                  : "text-bordeaux/70 bg-ivory border border-border hover:bg-cream"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop: Vertical sidebar */}
      <aside className="hidden md:block w-64 bg-ivory border-r border-border min-h-[calc(100vh-200px)] p-6">
        <div className="mb-8">
          <p className="text-[10px] tracking-luxe uppercase text-bordeaux/40 mb-4">Navigation</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth ${
                    active
                      ? "bg-bordeaux text-ivory"
                      : "text-bordeaux/70 hover:bg-cream hover:text-bordeaux"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="h-3 w-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 bg-gradient-gold rounded-lg">
          <p className="text-[10px] tracking-luxe uppercase text-bordeaux/60 mb-2">Besoin d'aide ?</p>
          <p className="text-xs text-bordeaux/70 mb-3">Notre équipe est disponible du lundi au vendredi.</p>
          <Link
            to="/support"
            className="block text-center bg-bordeaux text-ivory px-4 py-2 text-[10px] tracking-luxe uppercase rounded hover:bg-bordeaux/90 transition-smooth"
          >
            Contacter le support
          </Link>
        </div>
      </aside>
    </>
  );
};

export default ProSidebar;
