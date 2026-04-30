import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ImageUpload from "@/components/admin/ImageUpload";
import { useAdmin, UniverseRow } from "@/context/AdminContext";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Save } from "lucide-react";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const AdminUniverses = () => {
  const { universesList, upsertUniverse, deleteUniverse } = useAdmin();
  const [rows, setRows] = useState<UniverseRow[]>([]);

  useEffect(() => {
    setRows(universesList);
  }, [universesList]);

  const update = (i: number, patch: Partial<UniverseRow>) => {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const add = () => {
    setRows((rs) => [
      ...rs,
      {
        id: `new-${Date.now()}`,
        slug: "",
        name: "",
        description: "",
        image_url: "",
        display_order: rs.length,
      },
    ]);
  };

  const save = async (u: UniverseRow) => {
    if (!u.name.trim() || !u.slug.trim()) {
      toast({ title: "Nom et slug requis", variant: "destructive" });
      return;
    }
    await upsertUniverse(u);
    toast({ title: "Univers enregistré" });
  };

  const remove = async (u: UniverseRow) => {
    if (u.id.startsWith("new-")) {
      setRows((rs) => rs.filter((r) => r.id !== u.id));
      return;
    }
    if (!confirm(`Supprimer l'univers « ${u.name} » ? Les produits associés perdront leur catégorie.`)) return;
    await deleteUniverse(u.id);
    toast({ title: "Univers supprimé" });
  };

  return (
    <AdminLayout title="Univers (catégories)">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-bordeaux/60">
            Créez, modifiez et supprimez les univers du catalogue (Colliers, Bracelets, etc.).
          </p>
          <button
            onClick={add}
            className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-4 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
          >
            <Plus className="h-4 w-4" /> Nouvel univers
          </button>
        </div>

        <div className="space-y-4">
          {rows.map((u, i) => (
            <div key={u.id} className="bg-ivory border border-border p-5 grid md:grid-cols-[200px_1fr_auto] gap-5">
              <ImageUpload
                value={u.image_url}
                onChange={(url) => update(i, { image_url: url })}
                folder="universes"
                label="Image"
              />
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">Nom</label>
                    <input
                      className="input"
                      value={u.name}
                      onChange={(e) =>
                        update(i, {
                          name: e.target.value,
                          slug: u.slug || slugify(e.target.value),
                        })
                      }
                      placeholder="Colliers"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">Slug (URL)</label>
                    <input
                      className="input"
                      value={u.slug}
                      onChange={(e) => update(i, { slug: slugify(e.target.value) })}
                      placeholder="colliers"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">Description</label>
                  <textarea
                    className="input min-h-[60px]"
                    value={u.description}
                    onChange={(e) => update(i, { description: e.target.value })}
                  />
                </div>
                <div className="w-32 space-y-1">
                  <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">Ordre</label>
                  <input
                    type="number"
                    className="input"
                    value={u.display_order}
                    onChange={(e) => update(i, { display_order: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex md:flex-col gap-2 md:justify-start">
                <button
                  onClick={() => save(u)}
                  className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-4 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
                >
                  <Save className="h-3.5 w-3.5" /> Enregistrer
                </button>
                <button
                  onClick={() => remove(u)}
                  className="inline-flex items-center gap-2 border border-bordeaux/30 text-bordeaux px-4 py-2 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="bg-ivory border border-border p-8 text-center text-bordeaux/60">
              Aucun univers. Cliquez sur « Nouvel univers ».
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUniverses;
