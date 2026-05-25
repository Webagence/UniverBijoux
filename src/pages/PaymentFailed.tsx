import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useLang } from "@/context/LanguageContext";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const PaymentFailed = () => {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || t("payment.error_default");

  return (
    <Layout>
      <PageHeader title={t("payment.failed_title")} crumbs={[{ label: t("common.cart"), to: "/panier" }, { label: t("payment.payment") }, { label: t("payment.failure") }]} />
      <section className="container py-12 md:py-16 max-w-2xl">
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mb-4">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl text-bordeaux">{t("payment.failed_heading")}</h2>
          <p className="text-bordeaux/70 max-w-md mx-auto">{error}</p>
        </div>

        <div className="bg-ivory border border-border p-4 sm:p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <h3 className="font-serif text-lg text-bordeaux">{t("payment.what_happened")}</h3>
            <ul className="text-sm text-bordeaux/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>{t("payment.card_refused")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>{t("payment.incorrect_info")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>{t("payment.technical_error")}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-lg text-bordeaux">{t("payment.what_to_do")}</h3>
            <ul className="text-sm text-bordeaux/70 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>{t("payment.check_card_info")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>{t("payment.contact_bank")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bordeaux mt-1">•</span>
                <span>{t("payment.try_other_card")}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/panier"
              className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-6 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("payment.back_to_cart")}
            </Link>
            <Link
              to="/paiement"
              className="inline-flex items-center gap-2 border border-bordeaux text-bordeaux px-6 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
            >
              <RefreshCw className="w-4 h-4" />
              {t("payment.retry_payment")}
            </Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-bordeaux/50">
            {t("payment.need_help")}{" "}
            <Link to="/contact" className="text-bordeaux underline hover:text-gold">
              {t("payment.contact_us")}
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentFailed;
