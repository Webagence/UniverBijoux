import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { stripeApi } from "@/services/stripeApi";
import { formatEUR } from "@/types/product";
import { toast } from "@/hooks/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const CheckoutForm = ({ clientSecret, orderId, orderReference, amount, onSuccess }: {
  clientSecret: string;
  orderId: string;
  orderReference: string;
  amount: number;
  onSuccess: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/paiement/succes",
      },
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Paiement échoué",
        description: error.message || "Une erreur est survenue lors du paiement.",
        variant: "destructive",
      });
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

  const freeShippingThreshold = Number(settings.freeShippingFrom) || 300;
  const shippingHT = subtotalHT >= freeShippingThreshold ? 0 : 15;
  const vat = +(subtotalHT * 0.2).toFixed(2);
  const totalTTC = +(subtotalHT + vat + shippingHT).toFixed(2);

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

        const result = await stripeApi.createPaymentIntent({
          items,
          shipping_address: {
            name: profile.contact_name || profile.company_name || "Client",
            company: profile.company_name || "N/A",
            address: profile.address || "Adresse non renseignée",
            city: profile.city || "Paris",
            postal_code: profile.postal_code || "75001",
            country: profile.country || "France",
          },
          notes: "",
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
  }, [user, profile, lines]);

  if (!user) return <Navigate to="/connexion" replace />;
  if (!profile?.approved) {
    return (
      <Layout>
        <PageHeader title="Paiement" crumbs={[{ label: "Panier", to: "/panier" }, { label: "Paiement" }]} />
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
    toast({ title: "Paiement réussi", description: `Commande ${orderReference} confirmée.` });
    navigate("/commandes");
  };

  return (
    <Layout>
      <PageHeader
        title="Paiement sécurisé"
        subtitle="Paiement sécurisé par Stripe"
        crumbs={[{ label: "Panier", to: "/panier" }, { label: "Paiement" }]}
      />
      <section className="container py-12 md:py-16 max-w-2xl">
        {loading ? (
          <div className="text-center py-20 text-bordeaux/60">Initialisation du paiement…</div>
        ) : error ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-destructive">{error}</p>
            <button onClick={() => navigate("/panier")} className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
              Retour au panier
            </button>
          </div>
        ) : clientSecret ? (
          <div className="bg-ivory border border-border p-8">
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
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
      </section>
    </Layout>
  );
};

export default StripeCheckout;
