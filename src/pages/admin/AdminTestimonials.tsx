import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

const AdminTestimonials = () => {
  const { testimonials, setTestimonials } = useAdmin();

  const update = (id: string, patch: any) =>
    setTestimonials(testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const add = () =>
    setTestimonials([
      ...testimonials,
      { id: `t-${Date.now()}`, name: "Nouveau client", shop: "Boutique · Ville", text: "Témoignage…" },
    ]);

  const remove = (id: string) => {
    if (confirm("Supprimer ce témoignage ?")) setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  return (
    <AdminLayout title="Témoignages">
      <div className="flex justify-end mb-4">
        <button
          onClick={add}
          className="bg-bordeaux text-ivory px-5 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Ajouter un témoignage
        </button>
      </div>
      <div className="space-y-4 max-w-3xl">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-ivory border border-border p-5 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                className="input"
                placeholder="Nom"
                value={t.name}
                onChange={(e) => update(t.id, { name: e.target.value })}
              />
              <input
                className="input"
                placeholder="Boutique · Ville"
                value={t.shop}
                onChange={(e) => update(t.id, { shop: e.target.value })}
              />
            </div>
            <textarea
              className="input min-h-[90px]"
              placeholder="Témoignage"
              value={t.text}
              onChange={(e) => update(t.id, { text: e.target.value })}
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  toast({ title: "Modifications enregistrées automatiquement" });
                }}
                className="text-xs tracking-luxe uppercase text-bordeaux/60"
              >
                Sauvegarde auto
              </button>
              <button
                onClick={() => remove(t.id)}
                className="text-bordeaux/60 hover:text-destructive flex items-center gap-1 text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
