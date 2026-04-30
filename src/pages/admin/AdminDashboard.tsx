import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";

const Stat = ({ label, value, icon: Icon, to }: any) => (
  <Link to={to} className="bg-ivory p-6 border border-border hover:border-gold transition-smooth group">
    <div className="flex items-center justify-between mb-4">
      <div className="text-[11px] tracking-luxe uppercase text-bordeaux/60">{label}</div>
      <Icon className="h-5 w-5 text-gold" />
    </div>
    <div className="font-serif text-4xl text-bordeaux group-hover:text-gold transition-smooth">{value}</div>
  </Link>
);

const AdminDashboard = () => {
  const { products, getOrders, getProAccounts, testimonials } = useAdmin();
  const orders = getOrders();
  const accounts = getProAccounts();
  const pendingAccounts = accounts.filter((a) => !a.approved).length;

  return (
    <AdminLayout title="Tableau de bord">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat label="Produits" value={products.length} icon={Package} to="/admin/produits" />
        <Stat label="Commandes" value={orders.length} icon={ShoppingCart} to="/admin/commandes" />
        <Stat label="Comptes pros" value={accounts.length} icon={Users} to="/admin/comptes" />
        <Stat label="Témoignages" value={testimonials.length} icon={MessageSquare} to="/admin/temoignages" />
      </div>

      {pendingAccounts > 0 && (
        <div className="mt-8 bg-gold/10 border border-gold p-5 text-sm text-bordeaux">
          <strong>{pendingAccounts}</strong> compte{pendingAccounts > 1 ? "s" : ""} pro en attente de validation. {" "}
          <Link to="/admin/comptes" className="underline">Gérer →</Link>
        </div>
      )}

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        <div className="bg-ivory p-6 border border-border">
          <h2 className="font-serif text-lg text-bordeaux mb-4">Dernières commandes</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-bordeaux/60">Aucune commande pour le moment.</p>
          ) : (
            <ul className="divide-y divide-border">
              {orders.slice(0, 5).map((o: any) => (
                <li key={o.id || o.ref} className="py-3 flex justify-between text-sm">
                  <span className="text-bordeaux">{o.id || o.ref}</span>
                  <span className="text-bordeaux/60">{o.email}</span>
                  <span className="text-bordeaux font-medium">
                    {(o.totalTTC || 0).toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-ivory p-6 border border-border">
          <h2 className="font-serif text-lg text-bordeaux mb-4">Comptes récents</h2>
          {accounts.length === 0 ? (
            <p className="text-sm text-bordeaux/60">Aucun compte enregistré.</p>
          ) : (
            <ul className="divide-y divide-border">
              {accounts.slice(0, 5).map((a) => (
                <li key={a.email} className="py-3 flex justify-between text-sm">
                  <span className="text-bordeaux">{a.companyName}</span>
                  <span className="text-bordeaux/60 truncate">{a.email}</span>
                  <span className={`text-xs tracking-luxe uppercase ${a.approved ? "text-gold" : "text-bordeaux/40"}`}>
                    {a.approved ? "Validé" : "Attente"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
