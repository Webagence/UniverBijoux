import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { Product, Universe, formatEUR } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, RotateCcw, X } from "lucide-react";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import rings from "@/assets/product-rings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

const FALLBACK: Record<Universe, string> = {
  colliers: necklace,
  boucles: earrings,
  bagues: rings,
  bracelets: bracelet,
};

const empty = (): Product => ({
  id: `new-${Date.now()}`,
  slug: `nouveau-${Date.now()}`,
  name: "",
  universe: "colliers",
  universeLabel: "Colliers",
  priceHT: 0,
  retailTTC: 0,
  moq: 3,
  packSize: 3,
  reference: "",
  material: "",
  finish: "",
  description: "",
  images: [FALLBACK.colliers],
  stock: 0,
  isNew: false,
});

const labels: Record<Universe, string> = {
  colliers: "Colliers",
  boucles: "Boucles d'oreilles",
  bagues: "Bagues",
  bracelets: "Bracelets",
};

const AdminProducts = () => {
  const { products, upsertProduct, deleteProduct, resetProducts } = useAdmin();
  const [editing, setEditing] = useState<Product | null>(null);
  const [filter, setFilter] = useState<Universe | "all">("all");
  const [search, setSearch] = useState("");

  const list = products
    .filter((p) => filter === "all" || p.universe === filter)
    .filter(
      (p) =>
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.reference.toLowerCase().includes(search.toLowerCase())
    );

  const onSave = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      toast({ title: "Nom requis" });
      return;
    }
    const p: Product = {
      ...editing,
      universeLabel: labels[editing.universe],
      slug: editing.slug || `${editing.universe}-${editing.id}`,
      images: editing.images.length ? editing.images : [FALLBACK[editing.universe]],
    };
    upsertProduct(p);
    toast({ title: "Produit enregistré", description: p.name });
    setEditing(null);
  };

  return (
    <AdminLayout title="Produits">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          placeholder="Rechercher (nom, référence)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-ivory border border-border px-4 py-2.5 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-ivory border border-border px-4 py-2.5 text-sm"
        >
          <option value="all">Tous les univers</option>
          {(Object.keys(labels) as Universe[]).map((k) => (
            <option key={k} value={k}>
              {labels[k]}
            </option>
          ))}
        </select>
        <button
          onClick={() => setEditing(empty())}
          className="bg-bordeaux text-ivory px-5 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Nouveau produit
        </button>
        <button
          onClick={() => {
            if (confirm("Réinitialiser le catalogue par défaut ? Toutes vos modifications seront perdues.")) {
              resetProducts();
              toast({ title: "Catalogue réinitialisé" });
            }
          }}
          className="border border-border text-bordeaux px-4 py-2.5 text-xs tracking-luxe uppercase hover:bg-cream flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="bg-ivory border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-[11px] tracking-luxe uppercase text-bordeaux/60">
            <tr>
              <th className="text-left p-3 w-16">Image</th>
              <th className="text-left p-3">Nom</th>
              <th className="text-left p-3">Univers</th>
              <th className="text-left p-3">Référence</th>
              <th className="text-right p-3">Prix HT</th>
              <th className="text-right p-3">Stock</th>
              <th className="text-center p-3">Tag</th>
              <th className="p-3 w-24"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border hover:bg-cream/50">
                <td className="p-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 object-cover bg-cream" />
                </td>
                <td className="p-3 text-bordeaux">{p.name}</td>
                <td className="p-3 text-bordeaux/60">{p.universeLabel}</td>
                <td className="p-3 text-bordeaux/60 font-mono text-xs">{p.reference}</td>
                <td className="p-3 text-right text-bordeaux">{formatEUR(p.priceHT)}</td>
                <td className="p-3 text-right text-bordeaux/70">{p.stock}</td>
                <td className="p-3 text-center text-[10px] tracking-luxe uppercase text-gold">{p.tag || "—"}</td>
                <td className="p-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing(p)} className="text-bordeaux hover:text-gold">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Supprimer ${p.name} ?`)) {
                        deleteProduct(p.id);
                        toast({ title: "Produit supprimé" });
                      }
                    }}
                    className="text-bordeaux/40 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <div className="p-10 text-center text-bordeaux/60 text-sm">Aucun produit.</div>
        )}
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          onChange={setEditing}
          onSave={onSave}
          onClose={() => setEditing(null)}
        />
      )}
    </AdminLayout>
  );
};

const ProductEditor = ({
  product,
  onChange,
  onSave,
  onClose,
}: {
  product: Product;
  onChange: (p: Product) => void;
  onSave: () => void;
  onClose: () => void;
}) => {
  const set = (patch: Partial<Product>) => onChange({ ...product, ...patch });

  return (
    <div className="fixed inset-0 z-[80] bg-bordeaux/40 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-ivory w-full max-w-2xl shadow-elegant my-8">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-serif text-xl text-bordeaux">
            {product.name ? `Modifier — ${product.name}` : "Nouveau produit"}
          </h2>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-bordeaux" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom">
              <input className="input" value={product.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="Référence">
              <input className="input" value={product.reference} onChange={(e) => set({ reference: e.target.value })} />
            </Field>
            <Field label="Univers">
              <select
                className="input"
                value={product.universe}
                onChange={(e) => set({ universe: e.target.value as Universe, images: [FALLBACK[e.target.value as Universe]] })}
              >
                {(Object.keys(labels) as Universe[]).map((k) => (
                  <option key={k} value={k}>
                    {labels[k]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Slug (URL)">
              <input className="input" value={product.slug} onChange={(e) => set({ slug: e.target.value })} />
            </Field>
            <Field label="Prix HT (€)">
              <input
                type="number"
                step="0.01"
                className="input"
                value={product.priceHT}
                onChange={(e) => set({ priceHT: parseFloat(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Prix public conseillé TTC (€)">
              <input
                type="number"
                step="0.01"
                className="input"
                value={product.retailTTC}
                onChange={(e) => set({ retailTTC: parseFloat(e.target.value) || 0 })}
              />
            </Field>
            <Field label="MOQ">
              <input
                type="number"
                className="input"
                value={product.moq}
                onChange={(e) => set({ moq: parseInt(e.target.value) || 1 })}
              />
            </Field>
            <Field label="Conditionnement">
              <input
                type="number"
                className="input"
                value={product.packSize}
                onChange={(e) => set({ packSize: parseInt(e.target.value) || 1 })}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                className="input"
                value={product.stock}
                onChange={(e) => set({ stock: parseInt(e.target.value) || 0 })}
              />
            </Field>
            <Field label="Tag">
              <select
                className="input"
                value={product.tag || ""}
                onChange={(e) => set({ tag: (e.target.value || undefined) as any })}
              >
                <option value="">Aucun</option>
                <option>Nouveauté</option>
                <option>Best-seller</option>
                <option>Réassort</option>
                <option>Édition limitée</option>
              </select>
            </Field>
          </div>
          <Field label="Matière">
            <input className="input" value={product.material} onChange={(e) => set({ material: e.target.value })} />
          </Field>
          <Field label="Finition">
            <input className="input" value={product.finish} onChange={(e) => set({ finish: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea
              className="input min-h-[100px]"
              value={product.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </Field>
          <Field label="URL des images (une par ligne)">
            <textarea
              className="input min-h-[80px] font-mono text-xs"
              value={product.images.join("\n")}
              onChange={(e) => set({ images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-bordeaux">
            <input
              type="checkbox"
              checked={!!product.isNew}
              onChange={(e) => set({ isNew: e.target.checked })}
            />
            Marquer comme nouveauté (apparaît dans "Nouveautés par univers")
          </label>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border bg-cream">
          <button onClick={onClose} className="px-5 py-2.5 text-xs tracking-luxe uppercase text-bordeaux hover:bg-ivory">
            Annuler
          </button>
          <button
            onClick={onSave}
            className="bg-bordeaux text-ivory px-6 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60">{label}</label>
    {children}
  </div>
);

export default AdminProducts;
