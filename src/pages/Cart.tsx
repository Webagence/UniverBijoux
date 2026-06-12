import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useLang } from "@/context/LanguageContext";
import { formatEUR } from "@/types/product";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Cart = () => {
  const { lines, getProduct, updateQty, removeItem, subtotalHT, vat, totalTTC, clear } = useCart();
  const { user, profile } = useAuth();
  const { settings } = useAdmin();
  const { t } = useLang();
  const navigate = useNavigate();

  if (!settings) return <Layout><div className="container py-32 text-center"><div className="animate-pulse space-y-4"><div className="h-6 w-48 bg-bordeaux/10 rounded mx-auto" /><div className="h-4 w-64 bg-bordeaux/10 rounded mx-auto" /></div></div></Layout>;

  const freeShippingThreshold = Number(settings.freeShippingFrom);
  const defaultShippingPrice = Number(settings.defaultShippingPrice) || 15;
  const shippingHT = subtotalHT >= freeShippingThreshold ? 0 : defaultShippingPrice;

  const checkout = async () => {
    if (!user) {
      toast({ title: t("cart.login_required"), description: t("cart.login_required_desc") });
      navigate("/connexion?redirect=/checkout");
      return;
    }
    if (!profile?.approved) {
      toast({
        title: t("cart.account_pending"),
        description: t("cart.account_pending_desc"),
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <Layout>
      <PageHeader title={t("cart.your_cart")} crumbs={[{ label: t("common.cart") }]} />
      <section className="container py-12 md:py-16">
        {lines.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-bordeaux/60">{t("cart.empty")}</p>
            <Link
              to="/boutique"
              className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              {t("cart.discover_catalog")}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
            <div className="space-y-4">
              {lines.map((l) => {
                const p = getProduct(l.productId);
                if (!p) return null;
                return (
                  <div key={l.productId} className="flex gap-3 sm:gap-4 bg-ivory border border-border p-3 sm:p-4">
                    <Link to={`/produit/${p.slug}`} className="shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover bg-cream" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">
                            {t("common.ref")} {p.reference}
                          </p>
                          <Link to={`/produit/${p.slug}`} className="font-serif text-lg text-bordeaux hover:text-gold transition-smooth">
                            {p.name}
                          </Link>
                        </div>
                        <button onClick={() => removeItem(l.productId)} aria-label={t("cart.remove")} className="text-bordeaux/40 hover:text-destructive transition-smooth">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQty(l.productId, Math.max(p.moq, l.quantity - p.packSize))}
                            className="h-8 w-8 flex items-center justify-center hover:bg-cream"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-sm">{l.quantity}</span>
                          <button
                            onClick={() => updateQty(l.productId, l.quantity + p.packSize)}
                            className="h-8 w-8 flex items-center justify-center hover:bg-cream"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-bordeaux font-medium">{formatEUR(p.priceHT * l.quantity)} HT</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={clear} className="text-xs tracking-luxe uppercase text-bordeaux/50 hover:text-destructive">
                {t("cart.clear_cart")}
              </button>
            </div>

            <aside className="bg-cream p-6 h-fit space-y-4 sticky top-28">
              <h2 className="font-serif text-xl text-bordeaux">{t("cart.summary")}</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>{t("cart.subtotal_ht")}</dt><dd>{formatEUR(subtotalHT)}</dd></div>
                <div className="flex justify-between"><dt>{t("cart.vat")}</dt><dd>{formatEUR(vat)}</dd></div>
                <div className="flex justify-between"><dt>{t("cart.shipping")}</dt><dd>{subtotalHT >= freeShippingThreshold ? t("cart.free") : `${formatEUR(shippingHT)}`}</dd></div>
                <div className="flex justify-between border-t border-border pt-3 font-serif text-lg text-bordeaux">
                  <dt>{t("cart.total_ttc")}</dt><dd>{formatEUR(totalTTC + shippingHT)}</dd>
                </div>
              </dl>
              <button
                onClick={checkout}
                className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
              >
                {t("cart.proceed_order")}
              </button>
              <p className="text-[11px] text-bordeaux/50 text-center">
                {t("cart.free_shipping_from")} {formatEUR(freeShippingThreshold)} HT. {t("cart.payment_terms")}
              </p>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
