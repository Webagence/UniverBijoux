import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

interface Row {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  user_id: string;
  profiles: { email: string; company_name: string } | null;
}

const STATUS_LABEL: Record<string, string> = {
  open: "Ouvert",
  pending: "En attente",
  resolved: "Résolu",
  closed: "Fermé",
};

const AdminTickets = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      setBusy(true);
      const { data } = await supabase
        .from("tickets")
        .select("id,reference,subject,status,priority,created_at,user_id,profiles:user_id(email,company_name)")
        .order("created_at", { ascending: false });
      setRows((data as any) || []);
      setBusy(false);
    })();
  }, []);

  const list = rows.filter((r) => filter === "all" || r.status === filter);

  return (
    <AdminLayout title="Tickets support">
      <div className="flex gap-2 mb-4">
        {["all", "open", "pending", "resolved", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 text-xs tracking-luxe uppercase border ${
              filter === s ? "bg-bordeaux text-ivory border-bordeaux" : "border-border text-bordeaux/70"
            }`}
          >
            {s === "all" ? "Tous" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>
      <div className="bg-ivory border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-[11px] tracking-luxe uppercase text-bordeaux/60">
            <tr>
              <th className="text-left p-3">Référence</th>
              <th className="text-left p-3">Date</th>
              <th className="text-left p-3">Société</th>
              <th className="text-left p-3">Sujet</th>
              <th className="text-left p-3">Priorité</th>
              <th className="text-left p-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {busy ? (
              <tr><td colSpan={6} className="p-10 text-center text-bordeaux/60">Chargement…</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-bordeaux/60">Aucun ticket.</td></tr>
            ) : (
              list.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-cream/50">
                  <td className="p-3 font-mono text-xs">
                    <Link to={`/support/${t.id}`} className="text-bordeaux hover:text-gold">{t.reference}</Link>
                  </td>
                  <td className="p-3 text-bordeaux/60">{new Date(t.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="p-3 text-bordeaux/70">{t.profiles?.company_name || t.profiles?.email}</td>
                  <td className="p-3 text-bordeaux">{t.subject}</td>
                  <td className="p-3 text-bordeaux/60">{t.priority}</td>
                  <td className="p-3">
                    <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 ${
                      t.status === "open" ? "bg-gold/20 text-gold" : "bg-cream text-bordeaux/60"
                    }`}>{STATUS_LABEL[t.status]}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminTickets;
