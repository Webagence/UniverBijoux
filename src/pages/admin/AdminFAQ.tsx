import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/context/AdminContext";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const AdminFAQ = () => {
  const { faq, setFaq } = useAdmin();

  const update = (id: string, patch: any) => setFaq(faq.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const add = () => setFaq([...faq, { id: `f-${Date.now()}`, q: "Nouvelle question", a: "Réponse…" }]);
  const remove = (id: string) => {
    if (confirm("Supprimer cette question ?")) setFaq(faq.filter((f) => f.id !== id));
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= faq.length) return;
    const next = [...faq];
    [next[i], next[j]] = [next[j], next[i]];
    setFaq(next);
  };

  return (
    <AdminLayout title="FAQ">
      <div className="flex justify-end mb-4">
        <button
          onClick={add}
          className="bg-bordeaux text-ivory px-5 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Ajouter une question
        </button>
      </div>
      <div className="space-y-4 max-w-3xl">
        {faq.map((f, i) => (
          <div key={f.id} className="bg-ivory border border-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <input
                className="input flex-1 font-serif"
                value={f.q}
                onChange={(e) => update(f.id, { q: e.target.value })}
              />
              <button onClick={() => move(i, -1)} className="text-bordeaux/60 hover:text-gold p-1">
                <ChevronUp className="h-4 w-4" />
              </button>
              <button onClick={() => move(i, 1)} className="text-bordeaux/60 hover:text-gold p-1">
                <ChevronDown className="h-4 w-4" />
              </button>
              <button onClick={() => remove(f.id)} className="text-bordeaux/40 hover:text-destructive p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <textarea
              className="input min-h-[80px]"
              value={f.a}
              onChange={(e) => update(f.id, { a: e.target.value })}
            />
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
