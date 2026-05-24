import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { formatEUR } from "@/types/product";

interface CheckoutSummaryProps {
  showShipping?: boolean;
  showTotal?: boolean;
}

const CheckoutSummary = ({ showShipping = true, showTotal = true }: CheckoutSummaryProps) => {
  const { lines, getProduct, subtotalHT, vat, totalTTC } = useCart();
  const { settings } = useAdmin();

  const freeShippingThreshold = Number(settings.freeShippingFrom) || 300;
  const shippingHT = subtotalHT >= freeShippingThreshold ? 0 : 15;

  return (
    <div className="bg-cream p-4 sm:p-6 space-y-4">
      <h3 className="font-serif text-xl text-bordeaux">Récapitulatif</h3>

      <ul className="space-y-3">
        {lines.map((l) => {
          const p = getProduct(l.productId);
          if (!p) return null;
          return (
            <li key={l.productId} className="flex gap-3 text-sm">
              <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover bg-ivory" />
              <div className="flex-1 min-w-0">
                <p className="text-bordeaux font-medium truncate">{p.name}</p>
                <p className="text-bordeaux/50 text-xs">
                  Réf. {p.reference} · {l.quantity} pcs
                </p>
              </div>
              <span className="text-bordeaux font-medium whitespace-nowrap">
                {formatEUR(p.priceHT * l.quantity)} HT
              </span>
            </li>
          );
        })}
      </ul>

      {showShipping && (
        <dl className="space-y-2 text-sm pt-4 border-t border-border">
          <div className="flex justify-between">
            <dt className="text-bordeaux/70">Sous-total HT</dt>
            <dd>{formatEUR(subtotalHT)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bordeaux/70">TVA (20%)</dt>
            <dd>{formatEUR(vat)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-bordeaux/70">Livraison</dt>
            <dd>{subtotalHT >= freeShippingThreshold ? "Offerte" : formatEUR(shippingHT)}</dd>
          </div>
        </dl>
      )}

      {showTotal && (
        <div className="flex justify-between font-serif text-lg text-bordeaux pt-3 border-t border-border">
          <span>Total TTC</span>
          <span className="text-gold">{formatEUR(totalTTC + shippingHT)}</span>
        </div>
      )}

      <p className="text-[11px] text-bordeaux/50 text-center">
        Livraison offerte dès {formatEUR(freeShippingThreshold)} HT.
      </p>
    </div>
  );
};

export default CheckoutSummary;
