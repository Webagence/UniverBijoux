import { useEffect, useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { stripeApi } from "@/services/stripeApi";
import { formatEUR } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { Shield, Truck, MapPin } from "lucide-react";

interface CheckoutData {
  address: {
    name: string;
    company: string;
    address: string;
    city: string;
    postal_code: string;
    country: string;
  };
  carrier: string;
  notes: string;
}

const CheckoutForm = ({ clientSecret, orderId, orderReference, amount, onSuccess }: {
  clientSecret: string;
  orderId: string;
  orderReference: string;
  amount: number;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/paiement/succes?order_id=${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        navigate("/paiement/echec?error=" + encodeURIComponent(error.message || "Erreur de paiement"));
      } else {
        toast({
          title: "Paiement échoué",
          description: error.message || "Une erreur est survenue lors du paiement.",
          variant: "destructive",
        });
      }
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await stripeApi.confirmPayment(orderId, paymentIntent.id);
      onSuccess();
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-cream p-4 rounded-lg space-y-2">
        <p className="text-sm text-bordeaux/70">Commande <span className="font-medium text-bordeaux">{orderReference}</span></p>
        <p className="font-serif text-xl text-bordeaux">Total à payer : <span className="text-gold">{formatEUR(amount)}</span></p>
      </div>

      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card"],
        }}
      />

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
      >
        {processing ? "Traitement en cours…" : `Payer ${formatEUR(amount)}`}
      </button>

      <p className="text-[11px] text-bordeaux/50 text-center flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        Paiement sécurisé par Stripe · Vos données sont protégées
      </p>
    </form>
  );
};

const StripeCheckout = () => {
  const { lines, getProduct, subtotalHT, clear } = useCart();
  const { user, profile } = useAuth();
  const { settings } = useAdmin();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null);

  const stripeKey = settings.stripePublishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

  useEffect(() => {
    if (!stripeKey) return;
    let cancelled = false;
    const initStripe = async () => {
      const stripe = await loadStripe(stripeKey);
      if (!cancelled && stripe) {
        setStripeInstance(stripe);
      }
    };
    initStripe();
    return () => { cancelled = true; };
  }, [stripeKey]);

  const freeShippingThreshold = Number(settings.freeShippingFrom) || 300;
  const shippingHT = subtotalHT >= freeShippingThreshold ? 0 : 15;
  const vat = +(subtotalHT * 0.2).toFixed(2);
  const totalTTC = +(subtotalHT + vat + shippingHT).toFixed(2);

  useEffect(() => {
    const raw = sessionStorage.getItem("checkout_data");
    if (raw) {
      try {
        setCheckoutData(JSON.parse(raw));
      } catch {
        setCheckoutData(null);
      }
    }
  }, []);

  useEffect(() => {
    if (!user || !profile?.approved) return;
    if (lines.length === 0) {
      navigate("/panier");
      return;
    }

    const createIntent = async () => {
      setLoading(true);
      try {
        const items = lines
          .map((l) => {
            const p = getProduct(l.productId);
            if (!p) return null;
            return { product_id: p.id, quantity: l.quantity };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null);

        const shippingAddress = checkoutData?.address || {
          name: profile.contact_name || profile.company_name || "Client",
          company: profile.company_name || "N/A",
          address: profile.address || "Adresse non renseignée",
          city: profile.city || "Paris",
          postal_code: profile.postal_code || "75001",
          country: profile.country || "France",
        };

        const result = await stripeApi.createPaymentIntent({
          items,
          shipping_address: shippingAddress,
          notes: checkoutData?.notes || "",
        });

        setClientSecret(result.clientSecret);
        setOrderId(result.orderId);
        setOrderReference(result.orderReference);
        setAmount(result.amount);
      } catch (err: any) {
        setError(err.response?.data?.message || "Impossible d'initialiser le paiement.");
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [user, profile, lines, checkoutData]);

  if (!user) return <Navigate to="/connexion" replace />;
  if (!profile?.approved) {
    return (
      <Layout>
        <PageHeader title="Paiement" crumbs={[{ label: "Checkout", to: "/checkout" }, { label: "Paiement" }]} />
        <section className="container py-20 text-center space-y-4">
          <p className="text-bordeaux/60 text-lg">Votre compte pro doit être validé avant de pouvoir commander.</p>
          <button onClick={() => navigate("/compte")} className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            Retour à mon compte
          </button>
        </section>
      </Layout>
    );
  }

  const handleSuccess = () => {
    clear();
    sessionStorage.removeItem("checkout_data");
    navigate(`/paiement/succes?order_id=${orderId}`);
  };

  const stripeOptions = useMemo(() => {
    if (!clientSecret) return undefined;
    return { clientSecret, appearance: { theme: "stripe" } };
  }, [clientSecret]);

  return (
    <Layout>
      <PageHeader
        title="Paiement sécurisé"
        subtitle="Finalisez votre commande en toute sécurité"
        crumbs={[{ label: "Panier", to: "/panier" }, { label: "Checkout", to: "/checkout" }, { label: "Paiement" }]}
      />
      <section className="container py-12 md:py-16">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12 max-w-5xl mx-auto">
          <div>
            {checkoutData && (
              <div className="bg-ivory border border-border p-6 mb-6 space-y-4">
                <h3 className="font-serif text-lg text-bordeaux">Informations de livraison</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-bordeaux/50 mt-0.5" />
                    <div className="text-sm text-bordeaux/70">
                      <p className="font-medium text-bordeaux">{checkoutData.address.name}</p>
                      <p>{checkoutData.address.company}</p>
                      <p>{checkoutData.address.address}</p>
                      <p>{checkoutData.address.postal_code} {checkoutData.address.city}</p>
                      <p>{checkoutData.address.country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 text-bordeaux/50 mt-0.5" />
                    <div className="text-sm text-bordeaux/70">
                      <p className="font-medium text-bordeaux">Transporteur</p>
                      <p>{checkoutData.carrier === "colissimo" ? "Colissimo" : checkoutData.carrier === "chronopost" ? "Chronopost" : "Mondial Relay"}</p>
                      {checkoutData.notes && (
                        <>
                          <p className="mt-2 font-medium text-bordeaux">Notes</p>
                          <p>{checkoutData.notes}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20 text-bordeaux/60">Initialisation du paiement…</div>
            ) : error ? (
              <div className="text-center py-20 space-y-4">
                <p className="text-destructive">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => navigate("/checkout")} className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
                    Retour au checkout
                  </button>
                  <button onClick={() => navigate("/panier")} className="inline-block border border-bordeaux text-bordeaux px-8 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth">
                    Retour au panier
                  </button>
                </div>
              </div>
            ) : clientSecret && stripeInstance && stripeOptions ? (
              <div className="bg-ivory border border-border p-8">
                <Elements stripe={stripeInstance} options={stripeOptions}>
                  <CheckoutForm
                    clientSecret={clientSecret}
                    orderId={orderId}
                    orderReference={orderReference}
                    amount={amount}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              </div>
            ) : (
              <div className="text-center py-20 text-bordeaux/60">Aucun article à payer.</div>
            )}
          </div>

          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-cream p-6 space-y-4">
              <h3 className="font-serif text-xl text-bordeaux">Votre commande</h3>
              <ul className="space-y-3">
                {lines.map((l) => {
                  const p = getProduct(l.productId);
                  if (!p) return null;
                  return (
                    <li key={l.productId} className="flex gap-3 text-sm">
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover bg-ivory" />
                      <div className="flex-1 min-w-0">
                        <p className="text-bordeaux font-medium truncate">{p.name}</p>
                        <p className="text-bordeaux/50 text-xs">{l.quantity} pcs</p>
                      </div>
                      <span className="text-bordeaux font-medium whitespace-nowrap">
                        {formatEUR(p.priceHT * l.quantity)} HT
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="space-y-2 pt-4 border-t border-border text-sm">
                <div className="flex justify-between">
                  <span className="text-bordeaux/70">Sous-total HT</span>
                  <span>{formatEUR(subtotalHT)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bordeaux/70">TVA (20%)</span>
                  <span>{formatEUR(vat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bordeaux/70">Livraison</span>
                  <span>{subtotalHT >= freeShippingThreshold ? "Offerte" : formatEUR(shippingHT)}</span>
                </div>
                <div className="flex justify-between font-serif text-lg text-bordeaux pt-3 border-t border-border">
                  <span>Total TTC</span>
                  <span className="text-gold">{formatEUR(totalTTC + shippingHT)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StripeCheckout;
