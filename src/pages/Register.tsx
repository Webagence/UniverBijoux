import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const Register = () => {
  const { register } = useAuth();
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
      toast({ title: "Inscription impossible", description: res.error });
      return;
    }
    toast({
      title: "Compte créé",
      description: "Votre compte est en attente de validation par notre équipe (24-48h).",
    });
    navigate("/compte");
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Devenir revendeur"
        title="Ouvrir un compte pro"
        subtitle="Réservé aux professionnels titulaires d'un numéro SIRET valide. Validation sous 24-48h."
        crumbs={[{ label: "Inscription" }]}
      />
      <section className="container py-16 max-w-xl">
        <form onSubmit={submit} className="space-y-5 bg-ivory border border-border p-8">
          {[
            { k: "companyName", label: "Raison sociale", type: "text" },
            { k: "siret", label: "Numéro SIRET (14 chiffres)", type: "text" },
            { k: "contactName", label: "Nom du contact", type: "text" },
            { k: "phone", label: "Téléphone", type: "tel" },
            { k: "email", label: "Email professionnel", type: "email" },
            { k: "password", label: "Mot de passe (min. 8 caractères)", type: "password" },
          ].map((f) => (
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
            {loading ? "Création..." : "Créer mon compte pro"}
          </button>
          <p className="text-sm text-bordeaux/70 text-center">
            Déjà client ?{" "}
            <Link to="/connexion" className="text-gold border-b border-gold">
              Se connecter
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Register;
