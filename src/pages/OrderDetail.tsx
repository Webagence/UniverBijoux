import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/services/orderApi";
import { formatEUR } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Download, FileText, Package, Truck, XCircle, Clock, CheckCircle, ExternalLink } from "lucide-react";

interface OrderDetail {
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
  shipping_address: Record<string, string>;
  notes: string;
  items: { id: string; product_name: string; product_reference: string; quantity: number; unit_price_ht: number; line_total_ht: number }[];
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "En attente", icon: <Clock className="w-4 h-4" />, color: "text-yellow-600" },
  confirmed: { label: "Confirmée", icon: <CheckCircle className="w-4 h-4" />, color: "text-blue-600" },
  preparing: { label: "En préparation", icon: <Package className="w-4 h-4" />, color: "text-purple-600" },
  shipped: { label: "Expédiée", icon: <Truck className="w-4 h-4" />, color: "text-bordeaux" },
  delivered: { label: "Livrée", icon: <CheckCircle className="w-4 h-4" />, color: "text-green-600" },
  cancelled: { label: "Annulée", icon: <XCircle className="w-4 h-4" />, color: "text-destructive" },
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    const fetchOrder = async () => {
      try {
        const data = await orderApi.getById(id);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la commande.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, id]);

  if (!user) {
    navigate("/connexion");
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <PageHeader title="Commande" crumbs={[{ label: "Commandes", to: "/commandes" }, { label: "Détails" }]} />
        <section className="container py-20 text-center text-bordeaux/60">Chargement…</section>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <PageHeader title="Commande introuvable" crumbs={[{ label: "Commandes", to: "/commandes" }]} />
        <section className="container py-20 text-center space-y-4">
          <p className="text-bordeaux/60">Cette commande n'existe pas ou n'est pas accessible.</p>
          <Link to="/commandes" className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            Voir mes commandes
          </Link>
        </section>
      </Layout>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || { label: order.status, icon: null, color: "text-bordeaux" };

  const generateInvoice = () => {
    const html = renderInvoiceHTML(order);
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      setTimeout(() => w.print(), 400);
    }
  };

  const cancelOrder = async () => {
    if (!confirm(`Annuler la commande ${order.reference} ?`)) return;
    try {
      await orderApi.cancel(order.id);
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      toast({ title: "Commande annulée", description: `La référence ${order.reference} a été annulée.` });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'annuler cette commande.", variant: "destructive" });
    }
  };

  const canCancel = ["pending", "confirmed"].includes(order.status);

  return (
    <Layout>
      <PageHeader
        title={`Commande ${order.reference}`}
        crumbs={[{ label: "Commandes", to: "/commandes" }, { label: order.reference }]}
      />

      <section className="container py-12 md:py-16 max-w-4xl">
        <button
          onClick={() => navigate("/commandes")}
          className="inline-flex items-center gap-2 text-sm text-bordeaux/60 hover:text-bordeaux mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux commandes
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <div className="bg-ivory border border-border p-6">
              <h2 className="font-serif text-xl text-bordeaux mb-4">Articles</h2>
              <ul className="space-y-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="font-medium text-bordeaux">{item.product_name}</p>
                      <p className="text-xs text-bordeaux/50">Réf. {item.product_reference}</p>
                      <p className="text-sm text-bordeaux/70 mt-1">
                        {item.quantity} pcs × {formatEUR(item.unit_price_ht)} HT
                      </p>
                    </div>
                    <span className="font-medium text-bordeaux">{formatEUR(item.line_total_ht)} HT</span>
                  </li>
                ))}
              </ul>
            </div>

            {order.shipping_address && (
              <div className="bg-ivory border border-border p-6">
                <h2 className="font-serif text-xl text-bordeaux mb-4">Adresse de livraison</h2>
                <div className="text-sm text-bordeaux/70 space-y-1">
                  <p className="font-medium text-bordeaux">{order.shipping_address.name}</p>
                  {order.shipping_address.company && <p>{order.shipping_address.company}</p>}
                  <p>{order.shipping_address.address}</p>
                  <p>
                    {order.shipping_address.postal_code} {order.shipping_address.city}
                  </p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            )}

            {order.notes && (
              <div className="bg-ivory border border-border p-6">
                <h2 className="font-serif text-xl text-bordeaux mb-2">Notes</h2>
                <p className="text-sm text-bordeaux/70">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-cream p-6 space-y-4">
              <div>
                <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Statut</p>
                <div className={`flex items-center gap-2 mt-1 ${statusConfig.color}`}>
                  {statusConfig.icon}
                  <span className="font-medium">{statusConfig.label}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Date</p>
                <p className="text-sm text-bordeaux mt-1">
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {order.carrier && (
                <div>
                  <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Transporteur</p>
                  <p className="text-sm text-bordeaux mt-1">{order.carrier}</p>
                </div>
              )}

              {order.tracking_number && (
                <div>
                  <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">N° de suivi</p>
                  <p className="text-sm text-bordeaux mt-1 font-mono">{order.tracking_number}</p>
                </div>
              )}

              {order.tracking_number && order.carrier && (
                <div>
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(order.carrier + ' tracking ' + order.tracking_number)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-gold hover:text-bordeaux transition-smooth mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Suivre mon colis
                  </a>
                </div>
              )}
            </div>

            <div className="bg-ivory border border-border p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-bordeaux/70">Sous-total HT</span>
                <span>{formatEUR(order.subtotal_ht)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bordeaux/70">Livraison</span>
                <span>{formatEUR(order.shipping_ht)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bordeaux/70">TVA (20%)</span>
                <span>{formatEUR(order.vat_amount)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-bordeaux pt-3 border-t border-border">
                <span>Total TTC</span>
                <span className="text-gold">{formatEUR(order.total_ttc)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={generateInvoice}
                className="w-full inline-flex items-center justify-center gap-2 border border-bordeaux text-bordeaux px-4 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
              >
                <Download className="w-4 h-4" />
                Facture PDF
              </button>

              <Link
                to={`/support?order=${order.id}`}
                className="w-full inline-flex items-center justify-center gap-2 border border-bordeaux/30 text-bordeaux/70 px-4 py-3 text-xs tracking-luxe uppercase hover:bg-cream"
              >
                <FileText className="w-4 h-4" />
                Ouvrir un ticket
              </Link>

              {canCancel && (
                <button
                  onClick={cancelOrder}
                  className="w-full inline-flex items-center justify-center gap-2 border border-destructive/30 text-destructive px-4 py-3 text-xs tracking-luxe uppercase hover:bg-destructive hover:text-ivory transition-smooth"
                >
                  <XCircle className="w-4 h-4" />
                  Annuler la commande
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

function renderInvoiceHTML(o: OrderDetail) {
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

export default OrderDetail;
