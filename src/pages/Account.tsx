import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { authApi } from "@/services/authApi";

const Account = () => {
  const { user, profile, logout, loading, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact_name: "",
    phone: "",
    company_name: "",
    siret: "",
    address: "",
    city: "",
    postal_code: "",
    country: "France",
    vat_number: "",
  });

  if (loading) return <Layout><div className="container py-32 text-center text-bordeaux/60">Chargement…</div></Layout>;
  if (!user) return <Navigate to="/connexion" replace />;

  const contactName = profile?.contact_name || user.name || user.email?.split("@")[0] || "";
  const companyName = profile?.company_name || "—";

  const openEdit = () => {
    setForm({
      name: user.name || "",
      contact_name: profile?.contact_name || "",
      phone: profile?.phone || "",
      company_name: profile?.company_name || "",
      siret: profile?.siret || "",
      address: profile?.address || "",
      city: profile?.city || "",
      postal_code: profile?.postal_code || "",
      country: profile?.country || "France",
      vat_number: profile?.vat_number || "",
    });
    setEditing(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      await refreshProfile();
      setEditing(false);
      toast({ title: "Profil mis à jour", description: "Vos informations ont été enregistrées." });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder les modifications.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (editing) {
    return (
      <Layout>
        <PageHeader
          eyebrow="Espace pro"
          title="Modifier mon profil"
          subtitle={companyName}
          crumbs={[{ label: "Mon compte", to: "/compte" }, { label: "Modifier" }]}
        />
        <section className="container py-12 md:py-16 max-w-2xl">
          <form onSubmit={save} className="space-y-5 bg-ivory border border-border p-8">
            <h3 className="font-serif text-lg text-bordeaux">Informations personnelles</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Nom</label>
                <input value={form.name} onChange={updateField("name")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Nom du contact</label>
                <input value={form.contact_name} onChange={updateField("contact_name")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <div>
              <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Téléphone</label>
              <input value={form.phone} onChange={updateField("phone")} type="tel" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            </div>

            <h3 className="font-serif text-lg text-bordeaux pt-4 border-t border-border">Entreprise</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Raison sociale</label>
                <input value={form.company_name} onChange={updateField("company_name")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">SIRET</label>
                <input value={form.siret} onChange={updateField("siret")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>
            <div>
              <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">N° TVA intracommunautaire</label>
              <input value={form.vat_number} onChange={updateField("vat_number")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            </div>

            <h3 className="font-serif text-lg text-bordeaux pt-4 border-t border-border">Adresse</h3>
            <div>
              <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Adresse</label>
              <input value={form.address} onChange={updateField("address")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Ville</label>
                <input value={form.city} onChange={updateField("city")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Code postal</label>
                <input value={form.postal_code} onChange={updateField("postal_code")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Pays</label>
                <input value={form.country} onChange={updateField("country")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={saving} className="bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="border border-border px-8 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth">
                Annuler
              </button>
            </div>
          </form>
        </section>
      </Layout>
    );
  }

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
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-bordeaux">Informations</h2>
            <button onClick={openEdit} className="text-xs text-gold hover:underline">Modifier</button>
          </div>
          <dl className="text-sm text-bordeaux/70 space-y-1">
            <div><dt className="inline text-bordeaux/50">Contact : </dt><dd className="inline">{profile?.contact_name || user.name || "—"}</dd></div>
            <div><dt className="inline text-bordeaux/50">Société : </dt><dd className="inline">{companyName}</dd></div>
            <div><dt className="inline text-bordeaux/50">SIRET : </dt><dd className="inline">{profile?.siret || "—"}</dd></div>
            <div><dt className="inline text-bordeaux/50">Email : </dt><dd className="inline">{user.email}</dd></div>
            <div><dt className="inline text-bordeaux/50">Téléphone : </dt><dd className="inline">{profile?.phone || "—"}</dd></div>
            {profile?.address && (
              <div><dt className="inline text-bordeaux/50">Adresse : </dt><dd className="inline">{profile.address}{profile.city ? `, ${profile.city}` : ""} {profile.postal_code || ""}</dd></div>
            )}
            {profile?.vat_number && (
              <div><dt className="inline text-bordeaux/50">TVA : </dt><dd className="inline">{profile.vat_number}</dd></div>
            )}
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
