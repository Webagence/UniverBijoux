import { ReactNode } from "react";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Ticket,
} from "lucide-react";

const items = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/produits", label: "Produits", icon: Package },
  { to: "/admin/univers", label: "Univers", icon: Package },
  { to: "/admin/commandes", label: "Commandes", icon: ShoppingCart },
  { to: "/admin/comptes", label: "Comptes pros", icon: Users },
  { to: "/admin/tickets", label: "Tickets SAV", icon: Ticket },
  { to: "/admin/contenu", label: "Pages & Contenu", icon: FileText },
  { to: "/admin/temoignages", label: "Témoignages", icon: MessageSquare },
  { to: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { to: "/admin/parametres", label: "Paramètres", icon: Settings },
];

const AdminLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { isAdmin, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center text-bordeaux/60">Chargement…</div>;
  }
  if (!isAdmin) return <Navigate to="/admin/connexion" replace />;

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-bordeaux text-ivory flex flex-col shrink-0">
        <div className="p-6 border-b border-ivory/10">
          <div className="font-serif text-lg tracking-luxe">MAISON LUNE</div>
          <div className="text-[10px] tracking-luxe uppercase text-gold mt-1">Administration</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-sm transition-smooth ${
                  isActive ? "bg-gold text-bordeaux" : "text-ivory/80 hover:bg-ivory/10"
                }`
              }
            >
              <it.icon className="h-4 w-4" />
              {it.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-ivory/10 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/80 hover:bg-ivory/10 transition-smooth"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate("/admin/connexion");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/80 hover:bg-ivory/10 transition-smooth"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-ivory border-b border-border px-8 py-5">
          <h1 className="font-serif text-2xl text-bordeaux">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
