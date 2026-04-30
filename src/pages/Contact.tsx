import { useState } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { toast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message envoyé", description: "Notre équipe vous répond sous 24h ouvrées." });
    setForm({ name: "", company: "", email: "", message: "" });
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Nous écrire"
        title="Contact commercial"
        subtitle="Une question sur un produit, un devis, ou une demande de partenariat ?"
        crumbs={[{ label: "Contact" }]}
      />
      <section className="container py-12 md:py-16 grid md:grid-cols-2 gap-12">
        <form onSubmit={submit} className="space-y-5 bg-ivory border border-border p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
            <input
              required
              placeholder="Société"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>
          <input
            type="email"
            required
            placeholder="Email professionnel"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
          />
          <textarea
            required
            rows={6}
            placeholder="Votre message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
          />
          <button className="w-full bg-bordeaux text-ivory py-4 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
            Envoyer
          </button>
        </form>

        <aside className="space-y-6">
          <div className="flex gap-4"><Mail className="h-5 w-5 text-gold shrink-0 mt-1" /><div>
            <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Email</p>
            <a href="mailto:pro@maisonlune.fr" className="text-bordeaux hover:text-gold">pro@maisonlune.fr</a>
          </div></div>
          <div className="flex gap-4"><Phone className="h-5 w-5 text-gold shrink-0 mt-1" /><div>
            <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Téléphone</p>
            <a href="tel:+33142000000" className="text-bordeaux hover:text-gold">+33 1 42 00 00 00</a>
          </div></div>
          <div className="flex gap-4"><MapPin className="h-5 w-5 text-gold shrink-0 mt-1" /><div>
            <p className="text-[11px] tracking-luxe uppercase text-bordeaux/50">Atelier</p>
            <p className="text-bordeaux">12 rue du Faubourg Saint-Honoré<br />75008 Paris, France</p>
          </div></div>
          <div className="bg-cream p-6 text-sm text-bordeaux/70">
            <p className="font-serif text-base text-bordeaux mb-1">Showroom sur rendez-vous</p>
            Du lundi au vendredi, 10h–18h. Prenez contact pour venir découvrir les collections en avant-première.
          </div>
        </aside>
      </section>
    </Layout>
  );
};

export default Contact;
