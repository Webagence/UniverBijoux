import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { settings, setSettings } = useAdmin();
  const [s, setS] = useState(settings);

  useEffect(() => { setS(settings); }, [settings]);

  const save = async () => {
    await setSettings(s);
    toast({ title: "Paramètres enregistrés" });
  };

  return (
    <AdminLayout title="Paramètres du site">
      <div className="bg-ivory border border-border p-6 space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom du site">
            <input className="input" value={s.siteName} onChange={(e) => setS({ ...s, siteName: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <input className="input" value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} />
          </Field>
          <Field label="Email contact">
            <input className="input" value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} />
          </Field>
          <Field label="Téléphone">
            <input className="input" value={s.phone} onChange={(e) => setS({ ...s, phone: e.target.value })} />
          </Field>
          <Field label="Adresse">
            <input className="input" value={s.address} onChange={(e) => setS({ ...s, address: e.target.value })} />
          </Field>
          <Field label="Franco de port à partir de (€ HT)">
            <input
              className="input"
              value={s.freeShippingFrom}
              onChange={(e) => setS({ ...s, freeShippingFrom: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Annonces bandeau (une par ligne)">
          <textarea
            className="input min-h-[120px]"
            value={s.announcements.join("\n")}
            onChange={(e) =>
              setS({ ...s, announcements: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })
            }
          />
        </Field>
        <div className="flex justify-end pt-2">
          <button
            onClick={save}
            className="bg-bordeaux text-ivory px-6 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

const Field = ({ label, children }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">{label}</label>
    {children}
  </div>
);

export default AdminSettings;
