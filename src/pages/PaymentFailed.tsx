import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || "Une erreur est survenue lors du traitement de votre paiement.";

  return (
    <Layout>
      <PageHeader title="Paiement échoué" crumbs={[{ label: "Panier", to: "/panier" }, { label: "Paiement" }, { label: "Échec" }]} />
      <section className="container py-12 md:py-16 max-w-2xl">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl text-bordeaux">Paiement non abouti</h2>
          <p className="text-bordeaux/70 max-w-md mx-auto">{error}</p>
        </div>

        <div className="bg-ivory border border-border p-4 sm:p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <h3 className="font-serif text-lg text-bordeaux">Que s'est-il passé ?</h3>
            <ul className="text-sm text-bordeaux/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>Votre carte a peut-être été refusée par votre banque</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>Les informations de paiement étaient incorrectes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>Une erreur technique est survenue pendant le traitement</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg text-bordeaux">Que faire ?</h3>
            <ul className="text-sm text-bordeaux/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>Vérifiez les informations de votre carte bancaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>Contactez votre banque pour autoriser le paiement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>Essayez avec une autre carte bancaire</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/panier"
              className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-6 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au panier
            </Link>
            <Link
              to="/paiement"
              className="inline-flex items-center gap-2 border border-bordeaux text-bordeaux px-6 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
            >
              <RefreshCw className="w-4 h-4" />
              Réessayer le paiement
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-bordeaux/50">
            Besoin d'aide ?{" "}
            <Link to="/contact" className="text-bordeaux underline hover:text-gold">
              Contactez-nous
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentFailed;
