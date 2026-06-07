import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProSidebar from "@/components/ProSidebar";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { contentApi, SubmittedTestimonial } from "@/services/contentApi";
import { toast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const MyTestimonials = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLang();
  const [testimonials, setTestimonials] = useState<SubmittedTestimonial[]>([]);
  const [busy, setBusy] = useState(true);
  const [quote, setQuote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const data = await contentApi.getMyTestimonials();
      setTestimonials(data || []);
    } catch {
      // non-critical
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  if (authLoading) return <Layout><div className="container py-32 text-center text-bordeaux/60">{t("common.loading")}</div></Layout>;
  if (!user) return <Navigate to="/connexion?redirect=/temoignages" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim()) return;
    setSubmitting(true);
    try {
      const res = await contentApi.submitTestimonial(quote.trim());
      setTestimonials((prev) => [res.testimonial, ...prev]);
      setQuote("");
      toast({ title: "Témoignage envoyé", description: "Il sera visible après validation par l'équipe." });
    } catch {
      toast({ title: "Erreur", description: "Impossible d'envoyer votre témoignage.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={t("account.pro_space")}
        title={t("account.testimonial")}
        subtitle="Partagez votre expérience"
        crumbs={[
          { label: t("pro.dashboard"), to: "/compte" },
          { label: t("account.testimonial") },
        ]}
      />
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <ProSidebar />

          <div className="flex-1 space-y-8">
            {/* Submission form */}
            <div className="bg-ivory border border-border p-6 md:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-gold fill-current" />
                <h2 className="font-serif text-lg text-bordeaux">{t("account.testimonial")}</h2>
              </div>
              <p className="text-xs text-bordeaux/60 mb-6">{t("account.testimonial_desc")}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  maxLength={1000}
                  rows={5}
                  placeholder="Écrivez votre témoignage ici…"
                  className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-bordeaux/40">{quote.length}/1000</span>
                  <button
                    type="submit"
                    disabled={submitting || !quote.trim()}
                    className="bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
                  >
                    {submitting ? "Envoi…" : "Envoyer mon témoignage"}
                  </button>
                </div>
              </form>
            </div>

            {/* History */}
            <div className="bg-ivory border border-border p-6 md:p-8">
              <h2 className="font-serif text-lg text-bordeaux mb-4">{t("account.my_testimonials")}</h2>
              {busy ? (
                <div className="py-12 text-center text-bordeaux/60">{t("common.loading")}</div>
              ) : testimonials.length === 0 ? (
                <div className="py-12 text-center">
                  <Star className="h-8 w-8 text-bordeaux/20 mx-auto mb-3" />
                  <p className="text-bordeaux/60 text-sm">Vous n'avez pas encore partagé de témoignage.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((t) => (
                    <div key={t.id} className="flex items-start gap-4 p-4 bg-cream/50 border border-border">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-bordeaux italic leading-relaxed">"{t.quote}"</p>
                        <p className="text-[10px] text-bordeaux/40 mt-2">
                          {new Date(t.submitted_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 shrink-0 mt-0.5 ${
                        t.active ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {t.active ? "Approuvé" : "En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyTestimonials;
