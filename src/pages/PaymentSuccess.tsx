import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { orderApi } from "@/services/orderApi";
import { formatEUR } from "@/types/product";
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react";

interface OrderData {
  id: string;
  reference: string;
  created_at: string;
  status: string;
  total_ttc: number;
  subtotal_ht: number;
  vat_amount: number;
  shipping_ht: number;
  items: { id: string; product_name: string; quantity: number; unit_price_ht: number }[];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const PaymentSuccess = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id") || searchParams.get("payment_intent");

  useEffect(() => {
    if (!user || !orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderApi.getById(orderId);
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  if (!user) {
    return (
      <Layout>
        <PageHeader title="Paiement" crumbs={[{ label: "Paiement" }]} />
        <section className="container py-20 text-center space-y-4">
          <p className="text-bordeaux/60 text-lg">Connectez-vous pour voir le statut de votre paiement.</p>
          <Link to="/connexion" className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            Se connecter
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Paiement réussi" crumbs={[{ label: "Panier", to: "/panier" }, { label: "Paiement" }, { label: "Confirmation" }]} />
      <section className="container py-12 md:py-16 max-w-2xl">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl text-bordeaux">Merci pour votre commande !</h2>
          <p className="text-bordeaux/70">Votre paiement a été traité avec succès.</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-bordeaux/60">Chargement des détails de la commande…</div>
        ) : order ? (
          <div className="bg-ivory border border-border p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Référence</p>
                <p className="font-serif text-xl text-bordeaux">{order.reference}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Statut</p>
                <p className="text-sm text-gold">{STATUS_LABEL[order.status] || order.status}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50 mb-3">Articles commandés</p>
              <ul className="space-y-2">
                {(order.items || []).map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-bordeaux/70">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>{formatEUR(item.unit_price_ht * item.quantity)} HT</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-4 border-t border-border">
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
              <div className="flex justify-between font-serif text-lg text-bordeaux pt-2 border-t border-border">
                <span>Total TTC</span>
                <span className="text-gold">{formatEUR(order.total_ttc)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                to="/commandes?refresh=true"
                className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-6 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
              >
                <Package className="w-4 h-4" />
                Voir mes commandes
              </Link>
              <button
                onClick={() => {
                  const html = renderInvoiceHTML(order);
                  const w = window.open("", "_blank");
                  if (w) {
                    w.document.write(html);
                    w.document.close();
                    setTimeout(() => w.print(), 400);
                  }
                }}
                className="inline-flex items-center gap-2 border border-bordeaux text-bordeaux px-6 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
              >
                <Download className="w-4 h-4" />
                Facture PDF
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-bordeaux/60">
              Votre paiement a été confirmé. Vous pouvez consulter vos commandes dans votre espace.
            </p>
            <Link
              to="/commandes"
              className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              <ArrowRight className="w-4 h-4" />
              Voir mes commandes
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
};

function renderInvoiceHTML(o: OrderData) {
  const date = new Date(o.created_at).toLocaleDateString("fr-FR");
  const rows = (o.items || [])
    .map(
      (l) => `<tr>
        <td>${l.product_name}</td>
        <td style="text-align:center">${l.quantity}</td>
        <td style="text-align:right">${Number(l.unit_price_ht).toFixed(2)} €</td>
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
    <thead><tr><th>Article</th><th style="text-align:center">Qté</th><th style="text-align:right">Total HT</th></tr></thead>
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

export default PaymentSuccess;
