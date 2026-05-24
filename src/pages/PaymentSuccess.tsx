import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
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
  const { settings } = useAdmin();
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
          <div className="bg-ivory border border-border p-4 sm:p-6 md:p-8 space-y-6">
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
                onClick={async () => {
                  try {
                    await orderApi.downloadInvoice(order.id);
                  } catch {
                    // fallback
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

export default PaymentSuccess;
