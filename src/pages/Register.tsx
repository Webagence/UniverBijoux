import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useLang } from "@/context/LanguageContext";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    siret: "",
    contactName: "",
    phone: "",
    email: "",
    password: "",
  });

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(form);
    setLoading(false);
    if (!res.ok) {
      toast({ title: t("register.register_failed"), description: res.error });
      return;
    }
    toast({
      title: t("register.account_created"),
      description: t("register.account_created_desc"),
    });
    navigate("/compte");
  };

  const fields = [
    { k: "companyName" as const, label: t("account.company_name"), type: "text" },
    { k: "siret" as const, label: t("register.siret_label"), type: "text" },
    { k: "contactName" as const, label: t("account.contact_name"), type: "text" },
    { k: "phone" as const, label: t("contact.phone"), type: "tel" },
    { k: "email" as const, label: t("contact.professional_email"), type: "email" },
    { k: "password" as const, label: t("register.password_label"), type: "password" },
  ];

  return (
    <Layout>
      <PageHeader
        eyebrow={t("register.become_reseller")}
        title={t("register.open_pro_account")}
        subtitle={t("register.register_subtitle")}
        crumbs={[{ label: t("register.register") }]}
      />
      <section className="container py-16 max-w-xl">
        <form onSubmit={submit} className="space-y-5 bg-ivory border border-border p-4 sm:p-6 md:p-8">
          {fields.map((f) => (
            <div key={f.k}>
              <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">
                {f.label}
              </label>
              <input
                type={f.type}
                required={f.k !== "phone"}
                minLength={f.k === "password" ? 8 : undefined}
                value={form[f.k as keyof typeof form]}
                onChange={update(f.k as keyof typeof form)}
                className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50"
          >
            {loading ? t("register.creating") : t("register.create_account")}
          </button>
          <p className="text-sm text-bordeaux/70 text-center">
            {t("register.already_client")}{" "}
            <Link to="/connexion" className="text-gold border-b border-gold">
              {t("login.sign_in")}
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Register;
