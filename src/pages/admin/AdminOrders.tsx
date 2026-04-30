import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { formatEUR } from "@/data/products";
import { toast } from "@/hooks/use-toast";

const STATUSES: { value: string; label: string }[] = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "preparing", label: "En préparation" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

const AdminOrders = () => {
  const { getOrders, setOrderStatus } = useAdmin();
  const [, force] = useState(0);
  const orders = getOrders();

  const change = async (id: string, status: string) => {
    await setOrderStatus(id, status);
    toast({ title: "Statut mis à jour" });
    force((n) => n + 1);
  };

  return (
    <AdminLayout title="Commandes">
      <div className="bg-ivory border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-[11px] tracking-luxe uppercase text-bordeaux/60">
            <tr>
              <th className="text-left p-3">Référence</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Client</th>
              <th className="text-left p-3">Articles</th>
              <th className="text-right p-3">Total TTC</th>
              <th className="text-left p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="p-3 text-bordeaux font-mono text-xs">{o.reference}</td>
                <td className="p-3 text-bordeaux/60">{new Date(o.date).toLocaleDateString("fr-FR")}</td>
                <td className="p-3 text-bordeaux/70 text-xs">{o.email}</td>
                <td className="p-3 text-bordeaux/70 text-xs">
                  {o.lines.map((l, i) => (
                    <div key={i}>
                      {l.quantity} × {l.productName}
                    </div>
                  ))}
                </td>
                <td className="p-3 text-right text-bordeaux">{formatEUR(o.totalTTC)}</td>
                <td className="p-3">
                  <select
                    value={o.status}
                    onChange={(e) => change(o.id, e.target.value)}
                    className="bg-cream border border-border px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-10 text-center text-bordeaux/60 text-sm">Aucune commande.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
