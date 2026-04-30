import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";

const Account = () => {
  const { user, profile, logout, loading } = useAuth();
  if (loading) return <Layout><div className="container py-32 text-center text-bordeaux/60">Chargement…</div></Layout>;
  if (!user) return <Navigate to="/connexion" replace />;

  const contactName = profile?.contact_name || user.email?.split("@")[0] || "";
  const companyName = profile?.company_name || "—";

  return (
    <Layout>
      <PageHeader
        eyebrow="Espace pro"
        title={`Bonjour, ${contactName}`}
        subtitle={companyName}
        crumbs={[{ label: "Mon compte" }]}
      />
      <section className="container py-12 md:py-16 grid md:grid-cols-3 gap-6">
        <div className="bg-ivory border border-border p-6 space-y-3">
          <h2 className="font-serif text-xl text-bordeaux">Informations</h2>
          <dl className="text-sm text-bordeaux/70 space-y-1">
            <div><dt className="inline text-bordeaux/50">Société : </dt><dd className="inline">{companyName}</dd></div>
            <div><dt className="inline text-bordeaux/50">SIRET : </dt><dd className="inline">{profile?.siret || "—"}</dd></div>
            <div><dt className="inline text-bordeaux/50">Email : </dt><dd className="inline">{user.email}</dd></div>
            <div>
              <dt className="inline text-bordeaux/50">Statut : </dt>
              <dd className={`inline ${profile?.approved ? "text-gold" : "text-destructive"}`}>
                {profile?.approved ? "Compte validé" : "En attente de validation"}
              </dd>
            </div>
          </dl>
        </div>

        <Link to="/commandes" className="bg-ivory border border-border p-6 hover:border-gold transition-smooth">
          <h2 className="font-serif text-xl text-bordeaux mb-2">Mes commandes</h2>
          <p className="text-sm text-bordeaux/60">Historique, statut, suivi et factures PDF.</p>
        </Link>

        <Link to="/support" className="bg-ivory border border-border p-6 hover:border-gold transition-smooth">
          <h2 className="font-serif text-xl text-bordeaux mb-2">Support & Tickets</h2>
          <p className="text-sm text-bordeaux/60">Posez vos questions, suivez vos demandes.</p>
        </Link>

        <Link to="/boutique" className="bg-ivory border border-border p-6 hover:border-gold transition-smooth">
          <h2 className="font-serif text-xl text-bordeaux mb-2">Passer commande</h2>
          <p className="text-sm text-bordeaux/60">Accédez au catalogue complet.</p>
        </Link>

        <div className="md:col-span-3">
          <button
            onClick={logout}
            className="text-xs tracking-luxe uppercase text-bordeaux/70 border border-border px-6 py-3 hover:bg-bordeaux hover:text-ivory transition-smooth"
          >
            Se déconnecter
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default Account;
