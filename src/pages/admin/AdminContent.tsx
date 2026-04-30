import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";

const Field = ({ label, value, onChange, multiline }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">{label}</label>
    {multiline ? (
      <textarea className="input min-h-[100px]" value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
);

const AdminContent = () => {
  const { hero, setHero, atelier, setAtelier } = useAdmin();
  const [h, setH] = useState(hero);
  const [a, setA] = useState(atelier);

  // Sync local state when DB values load
  useEffect(() => { setH(hero); }, [hero]);
  useEffect(() => { setA(atelier); }, [atelier]);

  const saveHero = async () => {
    await setHero(h);
    toast({ title: "Section Hero enregistrée" });
  };
  const saveAtelier = async () => {
    await setAtelier(a);
    toast({ title: "Section Atelier enregistrée" });
  };

  return (
    <AdminLayout title="Pages & Contenu">
      <div className="space-y-8 max-w-4xl">
        <section className="bg-ivory border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-bordeaux">Section Accueil — Hero</h2>
            <button
              onClick={saveHero}
              className="bg-bordeaux text-ivory px-5 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              Enregistrer
            </button>
          </div>
          <ImageUpload
            value={h.image || ""}
            onChange={(url) => setH({ ...h, image: url })}
            folder="hero"
            label="Image principale (Hero)"
          />
          <Field label="Surtitre" value={h.eyebrow} onChange={(v: string) => setH({ ...h, eyebrow: v })} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Titre — ligne 1" value={h.titleLine1} onChange={(v: string) => setH({ ...h, titleLine1: v })} />
            <Field label="Titre — emphase (or)" value={h.titleEm} onChange={(v: string) => setH({ ...h, titleEm: v })} />
            <Field label="Titre — ligne 2" value={h.titleLine2} onChange={(v: string) => setH({ ...h, titleLine2: v })} />
          </div>
          <Field label="Paragraphe" value={h.paragraph} onChange={(v: string) => setH({ ...h, paragraph: v })} multiline />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Bouton principal" value={h.ctaPrimary} onChange={(v: string) => setH({ ...h, ctaPrimary: v })} />
            <Field label="Bouton secondaire" value={h.ctaSecondary} onChange={(v: string) => setH({ ...h, ctaSecondary: v })} />
          </div>
          <div className="grid sm:grid-cols-4 gap-4">
            <Field label="Stat 1 — valeur" value={h.stat1Value} onChange={(v: string) => setH({ ...h, stat1Value: v })} />
            <Field label="Stat 1 — label" value={h.stat1Label} onChange={(v: string) => setH({ ...h, stat1Label: v })} />
            <Field label="Stat 2 — valeur" value={h.stat2Value} onChange={(v: string) => setH({ ...h, stat2Value: v })} />
            <Field label="Stat 2 — label" value={h.stat2Label} onChange={(v: string) => setH({ ...h, stat2Label: v })} />
          </div>
          <Field label="Citation" value={h.quote} onChange={(v: string) => setH({ ...h, quote: v })} />
        </section>

        <section className="bg-ivory border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-bordeaux">Section Atelier</h2>
            <button
              onClick={saveAtelier}
              className="bg-bordeaux text-ivory px-5 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              Enregistrer
            </button>
          </div>
          <ImageUpload
            value={a.image || ""}
            onChange={(url) => setA({ ...a, image: url })}
            folder="atelier"
            label="Image de l'atelier"
          />
          <Field label="Surtitre" value={a.eyebrow} onChange={(v: string) => setA({ ...a, eyebrow: v })} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Titre" value={a.title} onChange={(v: string) => setA({ ...a, title: v })} />
            <Field label="Titre — emphase" value={a.titleEm} onChange={(v: string) => setA({ ...a, titleEm: v })} />
          </div>
          <Field label="Paragraphe 1" value={a.paragraph1} onChange={(v: string) => setA({ ...a, paragraph1: v })} multiline />
          <Field label="Paragraphe 2" value={a.paragraph2} onChange={(v: string) => setA({ ...a, paragraph2: v })} multiline />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Badge — chiffre" value={a.badgeNumber} onChange={(v: string) => setA({ ...a, badgeNumber: v })} />
            <Field label="Badge — texte" value={a.badgeLabel} onChange={(v: string) => setA({ ...a, badgeLabel: v })} />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
