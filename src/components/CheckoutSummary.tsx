import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useLang } from "@/context/LanguageContext";
import { formatEUR } from "@/types/product";
import { Tag, X } from "lucide-react";

interface CheckoutSummaryProps {
  showShipping?: boolean;
  showTotal?: boolean;
  showDiscountInput?: boolean;
}

const CheckoutSummary = ({ showShipping = true, showTotal = true, showDiscountInput = false }: CheckoutSummaryProps) => {
  const { lines, getProduct, subtotalHT, vat, totalTTC, discountCode, setDiscountCode, appliedDiscount, discountHt, validateDiscount, clearDiscount, validatingDiscount } = useCart();
  const { settings } = useAdmin();
  const { t } = useLang();

  if (!settings) return <div className="bg-cream p-4 sm:p-6 animate-pulse space-y-4"><div className="h-6 w-32 bg-bordeaux/10 rounded" /><div className="h-4 w-full bg-bordeaux/10 rounded" /><div className="h-4 w-3/4 bg-bordeaux/10 rounded" /></div>;

  const freeShippingThreshold = Number(settings.freeShippingFrom);
  const shippingHT = subtotalHT >= freeShippingThreshold ? 0 : 15;

  const finalShippingHT = appliedDiscount?.type === 'free_shipping' ? 0 : shippingHT;
  const finalTotalTTC = totalTTC + finalShippingHT;

  return (
    <div className="bg-cream p-4 sm:p-6 space-y-4">
      <h3 className="font-serif text-xl text-bordeaux">{t("cart.summary")}</h3>

      <ul className="space-y-3">
        {lines.map((l) => {
          const p = getProduct(l.productId);
          if (!p) return null;
          const price = p.salePriceHT ?? p.priceHT;
          return (
            <li key={l.productId} className="flex gap-3 text-sm">
              <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover bg-ivory" />
              <div className="flex-1 min-w-0">
                <p className="text-bordeaux font-medium truncate">{p.name}</p>
                <p className="text-bordeaux/50 text-xs">
                  {t("common.ref")} {p.reference} · {l.quantity} {t("common.pcs")}
                </p>
              </div>
              <span className="text-bordeaux font-medium whitespace-nowrap">
                {formatEUR(price * l.quantity)} HT
              </span>
            </li>
          );
        })}
      </ul>

      {showDiscountInput && (
        <div className="pt-4 border-t border-border">
          {appliedDiscount ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">{appliedDiscount.code}</p>
                  <p className="text-xs text-green-600">-{formatEUR(appliedDiscount.amount_ht)} HT</p>
                </div>
              </div>
              <button onClick={clearDiscount} className="text-green-600 hover:text-green-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code promo"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                className="flex-1 min-w-0 bg-ivory border border-border px-3 py-2 text-sm focus:outline-none focus:border-gold"
              />
              <button
                onClick={validateDiscount}
                disabled={validatingDiscount || !discountCode.trim()}
                className="shrink-0 whitespace-nowrap bg-bordeaux text-ivory px-3 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
              >
                {validatingDiscount ? "..." : t("discount.apply")}
              </button>
            </div>
          )}
        </div>
      )}

      {showShipping && (
        <dl className="space-y-2 text-sm pt-4 border-t border-border">
          <div className="flex justify-between">
            <dt className="text-bordeaux/70">{t("cart.subtotal_ht")}</dt>
            <dd>{formatEUR(subtotalHT)}</dd>
          </div>
          {appliedDiscount && (
            <div className="flex justify-between text-green-700">
              <dt>{t("discount.discount")} {appliedDiscount.code}</dt>
              <dd>-{formatEUR(discountHt)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-bordeaux/70">{t("cart.vat")}</dt>
            <dd>{formatEUR(vat)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bordeaux/70">{t("cart.shipping")}</dt>
            <dd>{subtotalHT >= freeShippingThreshold || appliedDiscount?.type === 'free_shipping' ? t("cart.free") : formatEUR(shippingHT)}</dd>
          </div>
        </dl>
      )}

      {showTotal && (
        <div className="flex justify-between font-serif text-lg text-bordeaux pt-3 border-t border-border">
          <span>{t("cart.total_ttc")}</span>
          <span className="text-gold">{formatEUR(finalTotalTTC)}</span>
        </div>
      )}

      <p className="text-[11px] text-bordeaux/50 text-center">
        {t("cart.free_shipping_from")} {formatEUR(freeShippingThreshold)} HT.
      </p>
    </div>
  );
};

export default CheckoutSummary;
