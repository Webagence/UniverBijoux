import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useLang } from "@/context/LanguageContext";
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

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLang();
  const { settings } = useAdmin();

  const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    pending: { label: t("order.pending"), icon: <Clock className="w-4 h-4" />, color: "text-yellow-600" },
    confirmed: { label: t("order.confirmed"), icon: <CheckCircle className="w-4 h-4" />, color: "text-blue-600" },
    preparing: { label: t("order.preparing"), icon: <Package className="w-4 h-4" />, color: "text-purple-600" },
    shipped: { label: t("order.shipped"), icon: <Truck className="w-4 h-4" />, color: "text-bordeaux" },
    delivered: { label: t("order.delivered"), icon: <CheckCircle className="w-4 h-4" />, color: "text-green-600" },
    cancelled: { label: t("order.cancelled"), icon: <XCircle className="w-4 h-4" />, color: "text-destructive" },
  };
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
          title: t("common.error"),
          description: t("orderdetail.load_error"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, id]);

  if (authLoading) {
    return (
      <Layout>
        <PageHeader title={t("orderdetail.order")} crumbs={[{ label: t("pro.orders"), to: "/commandes" }, { label: t("orders.details") }]} />
        <section className="container py-20 text-center text-bordeaux/60">{t("common.loading")}</section>
      </Layout>
    );
  }

  if (!user) {
    navigate(`/connexion?redirect=/commandes/${id}`);
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <PageHeader title={t("orderdetail.order")} crumbs={[{ label: t("pro.orders"), to: "/commandes" }, { label: t("orders.details") }]} />
        <section className="container py-20 text-center text-bordeaux/60">{t("common.loading")}</section>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <PageHeader title={t("orderdetail.order_not_found")} crumbs={[{ label: t("pro.orders"), to: "/commandes" }]} />
        <section className="container py-20 text-center space-y-4">
          <p className="text-bordeaux/60">{t("orderdetail.order_not_found_desc")}</p>
          <Link to="/commandes" className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            {t("order.view_orders")}
          </Link>
        </section>
      </Layout>
    );
  }

  const statusConfig = STATUS_CONFIG[order.status] || { label: order.status, icon: null, color: "text-bordeaux" };

  const generateInvoice = async () => {
    try {
      await orderApi.downloadInvoice(order.id);
    } catch {
      toast({ title: t("common.error"), description: t("account.invoice_error") });
    }
  };

  const cancelOrder = async () => {
    if (!confirm(t("orders.cancel_confirm").replace("{ref}", order.reference))) return;
    try {
      await orderApi.cancel(order.id);
      setOrder((prev) => (prev ? { ...prev, status: "cancelled" } : null));
      toast({ title: t("orders.order_cancelled"), description: t("orders.order_cancelled_desc").replace("{ref}", order.reference) });
    } catch {
      toast({ title: t("common.error"), description: t("orders.cancel_error"), variant: "destructive" });
    }
  };

  const canCancel = ["pending", "confirmed"].includes(order.status);

  return (
    <Layout>
      <PageHeader
        title={`${t("orderdetail.order")} ${order.reference}`}
        crumbs={[{ label: t("pro.orders"), to: "/commandes" }, { label: order.reference }]}
      />

      <section className="container py-12 md:py-16 max-w-4xl">
        <button
          onClick={() => navigate("/commandes")}
          className="inline-flex items-center gap-2 text-sm text-bordeaux/60 hover:text-bordeaux mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("orderdetail.back_to_orders")}
        </button>

        <div className="grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
          <div className="space-y-6">
            <div className="bg-ivory border border-border p-6">
              <h2 className="font-serif text-xl text-bordeaux mb-4">{t("orders.items")}</h2>
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
                <h2 className="font-serif text-xl text-bordeaux mb-4">{t("checkout.shipping_address")}</h2>
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
                <h2 className="font-serif text-xl text-bordeaux mb-2">{t("checkout.notes")}</h2>
                <p className="text-sm text-bordeaux/70">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-cream p-6 space-y-4">
              <div>
                <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">{t("order.status")}</p>
                <div className={`flex items-center gap-2 mt-1 ${statusConfig.color}`}>
                  {statusConfig.icon}
                  <span className="font-medium">{statusConfig.label}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">{t("orders.date")}</p>
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
                  <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">{t("checkout.carrier")}</p>
                  <p className="text-sm text-bordeaux mt-1">{order.carrier}</p>
                </div>
              )}

              {order.tracking_number && (
                <div>
                  <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">{t("orderdetail.tracking_number")}</p>
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
                    {t("orderdetail.track_package")}
                  </a>
                </div>
              )}
            </div>

            <div className="bg-ivory border border-border p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-bordeaux/70">{t("cart.subtotal_ht")}</span>
                <span>{formatEUR(order.subtotal_ht)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bordeaux/70">{t("cart.shipping")}</span>
                <span>{formatEUR(order.shipping_ht)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-bordeaux/70">{t("cart.vat")}</span>
                <span>{formatEUR(order.vat_amount)}</span>
              </div>
              <div className="flex justify-between font-serif text-lg text-bordeaux pt-3 border-t border-border">
                <span>{t("cart.total_ttc")}</span>
                <span className="text-gold">{formatEUR(order.total_ttc)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={generateInvoice}
                className="w-full inline-flex items-center justify-center gap-2 border border-bordeaux text-bordeaux px-4 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
              >
                <Download className="w-4 h-4" />
                {t("order.pdf_invoice")}
              </button>

              <Link
                to={`/support?order=${order.id}`}
                className="w-full inline-flex items-center justify-center gap-2 border border-bordeaux/30 text-bordeaux/70 px-4 py-3 text-xs tracking-luxe uppercase hover:bg-cream"
              >
                <FileText className="w-4 h-4" />
                {t("orders.open_ticket")}
              </Link>

              {canCancel && (
                <button
                  onClick={cancelOrder}
                  className="w-full inline-flex items-center justify-center gap-2 border border-destructive/30 text-destructive px-4 py-3 text-xs tracking-luxe uppercase hover:bg-destructive hover:text-ivory transition-smooth"
                >
                  <XCircle className="w-4 h-4" />
                  {t("orderdetail.cancel_order")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderDetail;
