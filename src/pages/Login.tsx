import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      toast({ title: "Connexion impossible", description: res.error });
      return;
    }
    toast({ title: "Bon retour !", description: "Vous êtes connecté." });
    navigate("/compte");
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Espace pro"
        title="Connexion revendeur"
        subtitle="Accédez à votre catalogue, vos tarifs HT et votre historique de commandes."
        crumbs={[{ label: "Connexion" }]}
      />
      <section className="container py-16 max-w-md">
        <form onSubmit={submit} className="space-y-5 bg-ivory border border-border p-8">
          <div>
            <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Email professionnel</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold transition-smooth"
            />
          </div>
          <div>
            <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Mot de passe</label>
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <p className="text-sm text-bordeaux/70 text-center">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="text-gold border-b border-gold">
              Ouvrir un compte pro
            </Link>
          </p>
        </form>
      </section>
    </Layout>
  );
};

export default Login;
