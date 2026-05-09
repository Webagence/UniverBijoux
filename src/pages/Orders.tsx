import { useEffect, useState, useMemo } from "react";
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProSidebar from "@/components/ProSidebar";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/services/orderApi";
import { formatEUR } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import {
  Download,
  FileText,
  XCircle,
  ChevronRight,
  Search,
  Filter,
  Package,
  Eye,
} from "lucide-react";

interface OrderRow {
  id: string;
  reference: string;
  created_at: string;
  status: string;
  total_ttc: number;
  subtotal_ht: number;
  vat_amount: number;
  shipping_ht: number;
  carrier: string | null;
  tracking_number: string | null;
  items: { id: string; product_name: string; quantity: number; unit_price_ht: number; line_total_ht: number }[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const Orders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [busy, setBusy] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    (async () => {
      setBusy(true);
      try {
        const data = await orderApi.getAll();
        setOrders(data.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/connexion" replace />;

  const generateInvoice = async (order: OrderRow) => {
    const html = renderInvoiceHTML(order);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 400);
    }
  };

  const cancelOrder = async (order: OrderRow) => {
    if (!confirm(`Annuler la commande ${order.reference} ?`)) return;
    try {
      await orderApi.cancel(order.id);
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: "cancelled" } : o));
      toast({ title: "Commande annulée", description: `La référence ${order.reference} a été annulée.` });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'annuler cette commande.", variant: "destructive" });
    }
  };

  const canCancel = (status: string) => ["pending", "confirmed"].includes(status);

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.reference.toLowerCase().includes(q) ||
          (o.items || []).some((i) => i.product_name.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const now = new Date();
      const cutoff = new Date();
      switch (dateFilter) {
        case "7d": cutoff.setDate(now.getDate() - 7); break;
        case "30d": cutoff.setDate(now.getDate() - 30); break;
        case "90d": cutoff.setDate(now.getDate() - 90); break;
      }
      result = result.filter((o) => new Date(o.created_at) >= cutoff);
    }

    return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, search, statusFilter, dateFilter]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  return (
    <Layout>
      <PageHeader
        eyebrow="Espace pro"
        title="Mes commandes"
        subtitle="Historique complet de vos commandes et suivi en temps réel"
        crumbs={[{ label: "Tableau de bord", to: "/compte" }, { label: "Commandes" }]}
      />
      <div className="container py-12 md:py-16">
        <div className="flex gap-8">
          <ProSidebar />

          <div className="flex-1 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { key: "all", label: "Total", color: "bordeaux" },
                { key: "pending", label: "En attente", color: "gold" },
                { key: "preparing", label: "En cours", color: "blue" },
                { key: "shipped", label: "Expédiées", color: "bordeaux" },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`p-4 border text-left transition-smooth ${
                    statusFilter === key
                      ? "border-gold bg-gold/5"
                      : "border-border bg-ivory hover:border-gold/50"
                  }`}
                >
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">{label}</p>
                  <p className="font-serif text-xl text-bordeaux mt-1">{statusCounts[key] || 0}</p>
                </button>
              ))}
            </div>

            {/* Filters Bar */}
            <div className="bg-ivory border border-border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bordeaux/40" />
                  <input
                    type="search"
                    placeholder="Rechercher par référence ou produit..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="all">Tous les statuts</option>
                    {Object.entries(STATUS_LABEL).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-transparent border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="all">Toutes les dates</option>
                    <option value="7d">7 derniers jours</option>
                    <option value="30d">30 derniers jours</option>
                    <option value="90d">90 derniers jours</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] tracking-luxe uppercase text-bordeaux/40 mt-3">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? "s" : ""} trouvée{filteredOrders.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Orders Table */}
            {busy ? (
              <div className="text-center py-20 text-bordeaux/60">Chargement…</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-ivory border border-border">
                <Package className="h-12 w-12 text-bordeaux/20 mx-auto" />
                <p className="text-bordeaux/60">Aucune commande trouvée.</p>
                <Link
                  to="/boutique"
                  className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
                >
                  Voir le catalogue
                </Link>
              </div>
            ) : (
              <div className="bg-ivory border border-border">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border text-[10px] tracking-luxe uppercase text-bordeaux/50">
                  <div className="col-span-2">Référence</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Statut</div>
                  <div className="col-span-2">Articles</div>
                  <div className="col-span-2">Total TTC</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Order Rows */}
                <div className="divide-y divide-border">
                  {filteredOrders.map((o) => (
                    <div key={o.id} className="group">
                      {/* Desktop Row */}
                      <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center hover:bg-cream/30 transition">
                        <div className="col-span-2">
                          <Link to={`/commandes/${o.id}`} className="font-medium text-bordeaux hover:text-gold transition-smooth">
                            {o.reference}
                          </Link>
                        </div>
                        <div className="col-span-2 text-sm text-bordeaux/70">
                          {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                        <div className="col-span-2">
                          <OrderStatusBadge status={o.status} />
                        </div>
                        <div className="col-span-2 text-sm text-bordeaux/70">
                          {(o.items || []).length} article{(o.items || []).length > 1 ? "s" : ""}
                        </div>
                        <div className="col-span-2 font-serif text-bordeaux">
                          {formatEUR(Number(o.total_ttc))}
                        </div>
                        <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                          <Link
                            to={`/commandes/${o.id}`}
                            className="p-2 text-bordeaux/60 hover:text-bordeaux hover:bg-cream"
                            title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => generateInvoice(o)}
                            className="p-2 text-bordeaux/60 hover:text-bordeaux hover:bg-cream"
                            title="Facture PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <Link
                            to={`/support?order=${o.id}`}
                            className="p-2 text-bordeaux/60 hover:text-bordeaux hover:bg-cream"
                            title="Ouvrir un ticket"
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                          {canCancel(o.status) && (
                            <button
                              onClick={() => cancelOrder(o)}
                              className="p-2 text-destructive/60 hover:text-destructive hover:bg-red-50"
                              title="Annuler"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div className="md:hidden p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <Link to={`/commandes/${o.id}`} className="font-medium text-bordeaux hover:text-gold transition-smooth">
                            {o.reference}
                          </Link>
                          <OrderStatusBadge status={o.status} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-bordeaux/50">
                            {new Date(o.created_at).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="font-serif text-bordeaux">
                            {formatEUR(Number(o.total_ttc))}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Link
                            to={`/commandes/${o.id}`}
                            className="flex-1 text-center bg-bordeaux text-ivory px-3 py-2 text-[10px] tracking-luxe uppercase hover:bg-gold transition-smooth"
                          >
                            Détails
                          </Link>
                          <button
                            onClick={() => generateInvoice(o)}
                            className="flex-1 text-center border border-bordeaux text-bordeaux px-3 py-2 text-[10px] tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
                          >
                            Facture
                          </button>
                          {canCancel(o.status) && (
                            <button
                              onClick={() => cancelOrder(o)}
                              className="flex-1 text-center border border-destructive/30 text-destructive px-3 py-2 text-[10px] tracking-luxe uppercase hover:bg-destructive hover:text-ivory transition-smooth"
                            >
                              Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

function renderInvoiceHTML(o: OrderRow) {
  const date = new Date(o.created_at).toLocaleDateString("fr-FR");
  const rows = (o.items || [])
    .map(
      (l) => `<tr>
        <td>${l.product_name}</td>
        <td style="text-align:center">${l.quantity}</td>
        <td style="text-align:right">${Number(l.unit_price_ht).toFixed(2)} €</td>
        <td style="text-align:right">${Number(l.line_total_ht).toFixed(2)} €</td>
      </tr>`
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Facture ${o.reference}</title>
  <style>
    body{font-family:Georgia,serif;color:#3a1a25;padding:40px;max-width:800px;margin:auto}
    h1{font-size:28px;margin-bottom:0}
    table{width:100%;border-collapse:collapse;margin-top:24px}
    th,td{padding:8px;border-bottom:1px solid #e6dfd3;font-size:13px}
    th{background:#f5efe4;text-align:left;font-size:11px;letter-spacing:1px;text-transform:uppercase}
    .totals{margin-top:24px;width:300px;margin-left:auto}
    .totals td{padding:6px}
    .total{font-weight:bold;font-size:16px;border-top:2px solid #3a1a25}
  </style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div><h1>UNIVER BIJOUX</h1><p style="color:#9a7a5a">Grossiste bijoux français</p></div>
    <div style="text-align:right"><h2>Facture</h2><p>N° ${o.reference}<br>Date : ${date}</p></div>
  </div>
  <table>
    <thead><tr><th>Article</th><th style="text-align:center">Qté</th><th style="text-align:right">PU HT</th><th style="text-align:right">Total HT</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <table class="totals">
    <tr><td>Sous-total HT</td><td style="text-align:right">${Number(o.subtotal_ht).toFixed(2)} €</td></tr>
    <tr><td>Livraison HT</td><td style="text-align:right">${Number(o.shipping_ht).toFixed(2)} €</td></tr>
    <tr><td>TVA (20%)</td><td style="text-align:right">${Number(o.vat_amount).toFixed(2)} €</td></tr>
    <tr class="total"><td>Total TTC</td><td style="text-align:right">${Number(o.total_ttc).toFixed(2)} €</td></tr>
  </table>
  </body></html>`;
}

export default Orders;
