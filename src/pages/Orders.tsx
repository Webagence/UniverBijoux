import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/services/orderApi";
import { formatEUR } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { Download, FileText, XCircle, ChevronRight } from "lucide-react";

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

  return (
    <Layout>
      <PageHeader title="Mes commandes" crumbs={[{ label: "Mon compte", to: "/compte" }, { label: "Commandes" }]} />
      <section className="container py-12 md:py-16">
        {busy ? (
          <p className="text-center text-bordeaux/60 py-20">Chargement…</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-bordeaux/60">Vous n'avez pas encore passé de commande.</p>
            <Link
              to="/boutique"
              className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <article key={o.id} className="bg-ivory border border-border p-6">
                <header className="flex flex-wrap justify-between gap-4 mb-4 pb-4 border-b border-border">
                  <Link to={`/commandes/${o.id}`} className="hover:text-gold transition-smooth">
                    <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Référence</p>
                    <p className="font-serif text-lg text-bordeaux">{o.reference}</p>
                  </Link>
                  <div>
                    <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Date</p>
                    <p className="text-sm text-bordeaux">
                      {new Date(o.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Statut</p>
                    <p className="text-sm text-gold">{STATUS_LABEL[o.status] || o.status}</p>
                  </div>
                  <div>
                    <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Total TTC</p>
                    <p className="font-serif text-lg text-bordeaux">{formatEUR(Number(o.total_ttc))}</p>
                  </div>
                </header>
                <ul className="text-sm text-bordeaux/70 space-y-1">
                  {(o.items || []).map((l) => (
                    <li key={l.id}>
                      {l.product_name} — {l.quantity} pcs × {formatEUR(Number(l.unit_price_ht))} HT
                    </li>
                  ))}
                </ul>
                {(o.tracking_number || o.carrier) && (
                  <p className="mt-3 text-xs text-bordeaux/60">
                    Suivi : {o.carrier} · n° {o.tracking_number}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/commandes/${o.id}`}
                    className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-4 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
                  >
                    Voir les détails
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    onClick={() => generateInvoice(o)}
                    className="inline-flex items-center gap-2 border border-bordeaux text-bordeaux px-4 py-2 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Facture PDF
                  </button>
                  <Link
                    to={`/support?order=${o.id}`}
                    className="inline-flex items-center gap-2 border border-bordeaux/30 text-bordeaux/70 px-4 py-2 text-xs tracking-luxe uppercase hover:bg-cream"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Ouvrir un ticket
                  </Link>
                  {canCancel(o.status) && (
                    <button
                      onClick={() => cancelOrder(o)}
                      className="inline-flex items-center gap-2 border border-destructive/30 text-destructive px-4 py-2 text-xs tracking-luxe uppercase hover:bg-destructive hover:text-ivory transition-smooth"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Annuler
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
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
    <div><h1>MAISON LUNE</h1><p style="color:#9a7a5a">Grossiste bijoux français</p></div>
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
  <p style="margin-top:60px;font-size:11px;color:#9a7a5a;text-align:center">Maison Lune — 12 rue Saint-Honoré, 75001 Paris — TVA FR00 000000000</p>
  </body></html>`;
}

export default Orders;
