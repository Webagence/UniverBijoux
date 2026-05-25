import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import AddressForm, { type AddressFormData } from "@/components/AddressForm";
import CheckoutSummary from "@/components/CheckoutSummary";
import { ChevronRight, MapPin, FileText } from "lucide-react";

const CARRIER_OPTIONS = [
  { id: "colissimo", name: "Colissimo", price: 15, delay: "3-5 jours ouvrés" },
  { id: "chronopost", name: "Chronopost", price: 25, delay: "1-2 jours ouvrés" },
  { id: "mondial_relay", name: "Mondial Relay", price: 8, delay: "4-6 jours ouvrés" },
];

const Checkout = () => {
  const { lines, subtotalHT } = useCart();
  const { user, profile } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const [step, setStep] = useState<"address" | "review">("address");
  const [address, setAddress] = useState<AddressFormData>({
    name: profile?.contact_name || "",
    company: profile?.company_name || "",
    address: profile?.address || "",
    city: profile?.city || "",
    postal_code: profile?.postal_code || "",
    country: profile?.country || "France",
  });
  const [carrier, setCarrier] = useState("colissimo");
  const [notes, setNotes] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!user) {
    navigate("/connexion?redirect=/checkout");
    return null;
  }

  if (!profile?.approved) {
    return (
      <Layout>
        <PageHeader title={t("checkout.title")} crumbs={[{ label: t("common.cart"), to: "/panier" }, { label: t("checkout.checkout") }]} />
        <section className="container py-20 text-center space-y-4">
          <p className="text-bordeaux/60 text-lg">{t("checkout.account_must_be_approved")}</p>
          <Link to="/compte" className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            {t("checkout.back_to_account")}
          </Link>
        </section>
      </Layout>
    );
  }

  if (lines.length === 0) {
    return (
      <Layout>
        <PageHeader title={t("checkout.title")} crumbs={[{ label: t("common.cart"), to: "/panier" }, { label: t("checkout.checkout") }]} />
        <section className="container py-20 text-center space-y-4">
          <p className="text-bordeaux/60 text-lg">{t("cart.empty")}</p>
          <Link to="/boutique" className="inline-block bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            {t("checkout.view_catalog")}
          </Link>
        </section>
      </Layout>
    );
  }

  const handleAddressSubmit = (data: AddressFormData) => {
    setAddress(data);
    setStep("review");
  };

  const handleProceedToPayment = () => {
    if (!acceptTerms) {
      toast({
        title: t("checkout.terms_required"),
        description: t("checkout.terms_required_desc"),
        variant: "destructive",
      });
      return;
    }

    const checkoutData = {
      address,
      carrier,
      notes,
    };

    sessionStorage.setItem("checkout_data", JSON.stringify(checkoutData));
    navigate("/paiement");
  };

  const selectedCarrier = CARRIER_OPTIONS.find((c) => c.id === carrier);

  return (
    <Layout>
      <PageHeader
        title={t("checkout.finalize")}
        subtitle={t("checkout.finalize_subtitle")}
        crumbs={[{ label: t("common.cart"), to: "/panier" }, { label: t("checkout.checkout") }]}
      />

      <section className="container py-12 md:py-16">
        <div className="grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_360px] gap-8 lg:gap-12">
          <div className="space-y-8">
            <nav className="flex items-center gap-2 text-sm text-bordeaux/60 mb-6">
              <button
                onClick={() => setStep("address")}
                className={`flex items-center gap-1 ${step === "address" ? "text-bordeaux font-medium" : "hover:text-bordeaux"}`}
              >
                <MapPin className="w-4 h-4" />
                {t("checkout.address_step")}
              </button>
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => step === "review" && setStep("review")}
                className={`flex items-center gap-1 ${step === "review" ? "text-bordeaux font-medium" : "hover:text-bordeaux"}`}
              >
                <FileText className="w-4 h-4" />
                {t("checkout.review_step")}
              </button>
            </nav>

            {step === "address" && (
              <div className="space-y-6">
                <div className="bg-ivory border border-border p-6">
                  <h2 className="font-serif text-xl text-bordeaux mb-4">{t("checkout.shipping_address")}</h2>
                  <AddressForm
                    defaultValues={address}
                    onSubmit={handleAddressSubmit}
                    submitLabel={t("checkout.continue")}
                  />
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <div className="bg-ivory border border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl text-bordeaux">{t("checkout.shipping_address")}</h2>
                    <button onClick={() => setStep("address")} className="text-xs text-bordeaux/60 hover:text-bordeaux underline">
                      {t("checkout.edit")}
                    </button>
                  </div>
                  <div className="text-sm text-bordeaux/70 space-y-1">
                    <p className="font-medium text-bordeaux">{address.name}</p>
                    <p>{address.company}</p>
                    <p>{address.address}</p>
                    <p>{address.postal_code} {address.city}, {address.country}</p>
                  </div>
                </div>

                <div className="bg-ivory border border-border p-6 space-y-4">
                  <h2 className="font-serif text-xl text-bordeaux">{t("checkout.carrier")}</h2>
                <div className="space-y-3">
                  {CARRIER_OPTIONS.map((option) => {
                    const freeShippingThreshold = 300;
                    const isFree = subtotalHT >= freeShippingThreshold;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-smooth ${
                          carrier === option.id
                            ? "border-bordeaux bg-cream"
                            : "border-border hover:border-bordeaux/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="carrier"
                          value={option.id}
                          checked={carrier === option.id}
                          onChange={(e) => setCarrier(e.target.value)}
                          className="accent-bordeaux"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-bordeaux">{option.name}</p>
                          <p className="text-xs text-bordeaux/50">{option.delay}</p>
                        </div>
                        <span className="text-sm text-bordeaux">
                          {isFree ? t("cart.free") : `${option.price} €`}
                        </span>
                      </label>
                    );
                  })}
                </div>
                </div>

                <div className="bg-ivory border border-border p-6 space-y-4">
                  <h2 className="font-serif text-xl text-bordeaux">{t("checkout.notes")}</h2>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("checkout.notes_placeholder")}
                    className="w-full min-h-[80px] p-3 border border-border bg-cream text-sm resize-none focus:outline-none focus:ring-1 focus:ring-bordeaux"
                  />
                </div>

                <div className="bg-ivory border border-border p-6 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 accent-bordeaux"
                    />
                    <span className="text-sm text-bordeaux/70">
                      {t("checkout.accept_terms_prefix")}{" "}
                      <Link to="/cgv" className="text-bordeaux underline hover:text-gold" target="_blank">
                        {t("checkout.terms_link")}
                      </Link>{" "}
                      {t("checkout.accept_terms_suffix")}
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
                >
                  {t("checkout.proceed_payment")}
                </button>
              </div>
            )}
          </div>

          <div className="md:sticky md:top-28 lg:sticky lg:top-28 h-fit">
            <CheckoutSummary />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
