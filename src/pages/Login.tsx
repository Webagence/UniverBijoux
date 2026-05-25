import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      toast({ title: t("login.login_failed"), description: res.error });
      return;
    }
    toast({ title: t("login.welcome_back"), description: t("login.logged_in") });
    const redirect = searchParams.get("redirect");
    navigate(redirect || "/compte");
  };

  return (
    <Layout>
      <PageHeader
        eyebrow={t("account.pro_space")}
        title={t("login.reseller_login")}
        subtitle={t("login.login_subtitle")}
        crumbs={[{ label: t("login.login") }]}
      />
      <section className="container py-16 max-w-md">
        <form onSubmit={submit} className="space-y-5 bg-ivory border border-border p-4 sm:p-6 md:p-8">
          <div>
            <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("contact.professional_email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("login.password")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
          >
            {loading ? t("login.logging_in") : t("login.sign_in")}
          </button>
          <p className="text-sm text-bordeaux/70 text-center">
            {t("login.no_account")}{" "}
            <Link to="/inscription" className="text-gold border-b border-gold">
              {t("login.open_pro_account")}
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Login;
