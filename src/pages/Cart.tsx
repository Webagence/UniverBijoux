import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { formatEUR } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { orderApi } from "@/services/orderApi";
import { Trash2, Minus, Plus } from "lucide-react";

const Cart = () => {
  const { lines, getProduct, updateQty, removeItem, subtotalHT, vat, totalTTC, clear } = useCart();
  const { user, profile } = useAuth();
  const { settings } = useAdmin();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const freeShippingThreshold = Number(settings.freeShippingFrom) || 300;
  const shippingHT = subtotalHT >= freeShippingThreshold ? 0 : 15;

  const checkout = async () => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Connectez-vous pour valider votre commande." });
      navigate("/connexion");
      return;
    }
    if (!profile?.approved) {
      toast({
        title: "Compte en attente de validation",
        description: "Votre compte pro doit être validé par notre équipe avant toute commande.",
      });
      return;
    }
    setSubmitting(true);

    const items = lines
      .map((l) => {
        const p = getProduct(l.productId);
        if (!p) return null;
        return {
          product_id: p.id,
          quantity: l.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    try {
      const result = await orderApi.create({
        items,
        shipping_address: {
          name: profile.contact_name || profile.company_name,
          company: profile.company_name,
          address: profile.address || "",
          city: profile.city || "",
          postal_code: profile.postal_code || "",
          country: profile.country || "France",
        },
        notes: "",
      });

      clear();
      toast({ title: "Commande enregistrée", description: `Référence ${result.order.reference}` });
      navigate("/commandes");
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Impossible d'enregistrer la commande.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHeader title="Votre panier" crumbs={[{ label: "Panier" }]} />
      <section className="container py-12 md:py-16">
        {lines.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-bordeaux/60">Votre panier est vide.</p>
            <Link
              to="/boutique"
              className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              Découvrir le catalogue
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-12">
            <div className="space-y-4">
              {lines.map((l) => {
                const p = getProduct(l.productId);
                if (!p) return null;
                return (
                  <div key={l.productId} className="flex gap-4 bg-ivory border border-border p-4">
                    <Link to={`/produit/${p.slug}`} className="shrink-0">
                      <img src={p.images[0]} alt={p.name} className="w-24 h-24 object-cover bg-cream" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <div>
                          <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">
                            Réf. {p.reference}
                          </p>
                          <Link to={`/produit/${p.slug}`} className="font-serif text-lg text-bordeaux hover:text-gold transition-smooth">
                            {p.name}
                          </Link>
                        </div>
                        <button onClick={() => removeItem(l.productId)} aria-label="Retirer" className="text-bordeaux/40 hover:text-destructive transition-smooth">
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
                Vider le panier
              </button>
            </div>

            <aside className="bg-cream p-6 h-fit space-y-4 sticky top-28">
              <h2 className="font-serif text-xl text-bordeaux">Récapitulatif</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt>Sous-total HT</dt><dd>{formatEUR(subtotalHT)}</dd></div>
                <div className="flex justify-between"><dt>TVA (20%)</dt><dd>{formatEUR(vat)}</dd></div>
                <div className="flex justify-between"><dt>Livraison</dt><dd>{subtotalHT >= freeShippingThreshold ? "Offerte" : `${formatEUR(shippingHT)}`}</dd></div>
                <div className="flex justify-between border-t border-border pt-3 font-serif text-lg text-bordeaux">
                  <dt>Total TTC</dt><dd>{formatEUR(totalTTC + shippingHT)}</dd>
                </div>
              </dl>
              <button
                onClick={checkout}
                disabled={submitting}
                className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
              >
                {submitting ? "Enregistrement…" : "Valider la commande"}
              </button>
              <p className="text-[11px] text-bordeaux/50 text-center">
                Livraison offerte dès {formatEUR(freeShippingThreshold)} HT. Paiement à 30 jours après validation.
              </p>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Cart;
