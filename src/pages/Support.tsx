import { useEffect, useState } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, MessageCircle } from "lucide-react";

interface Ticket {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  order_id: string | null;
}

const STATUS_LABEL: Record<string, string> = {
  open: "Ouvert",
  pending: "En attente",
  resolved: "Résolu",
  closed: "Fermé",
};

const Support = () => {
  const { user, loading } = useAuth();
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [busy, setBusy] = useState(true);
  const [showNew, setShowNew] = useState(!!orderId);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("normal");
  const [body, setBody] = useState("");

  const refresh = async () => {
    if (!user) return;
    setBusy(true);
    const { data } = await supabase
      .from("tickets")
      .select("id,reference,subject,status,priority,created_at,order_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setTickets((data as any) || []);
    setBusy(false);
  };

  useEffect(() => {
    if (user) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return null;
  if (!user) return <Navigate to="/connexion" replace />;

  const submit = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Sujet et message requis" });
      return;
    }
    const { data: t, error } = await supabase
      .from("tickets")
      .insert({ user_id: user.id, subject, priority, order_id: orderId || null })
      .select()
      .single();
    if (error || !t) {
      toast({ title: "Erreur", description: error?.message });
      return;
    }
    await supabase.from("ticket_messages").insert({
      ticket_id: t.id,
      author_id: user.id,
      body,
      is_admin: false,
    });
    toast({ title: "Ticket créé", description: t.reference });
    setSubject("");
    setBody("");
    setShowNew(false);
    refresh();
  };

  return (
    <Layout>
      <PageHeader title="Support & Tickets" crumbs={[{ label: "Mon compte", to: "/compte" }, { label: "Support" }]} />
      <section className="container py-12 md:py-16 space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-bordeaux/70 text-sm">
            Suivez vos demandes ou créez un nouveau ticket pour notre équipe.
          </p>
          <button
            onClick={() => setShowNew((v) => !v)}
            className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-5 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
          >
            <Plus className="h-4 w-4" /> Nouveau ticket
          </button>
        </div>

        {showNew && (
          <div className="bg-ivory border border-border p-6 space-y-3">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet"
              className="w-full bg-cream border border-border px-3 py-2 text-sm"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-cream border border-border px-3 py-2 text-sm"
            >
              <option value="low">Priorité basse</option>
              <option value="normal">Priorité normale</option>
              <option value="high">Priorité haute</option>
            </select>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Décrivez votre demande…"
              rows={5}
              className="w-full bg-cream border border-border px-3 py-2 text-sm"
            />
            {orderId && (
              <p className="text-[11px] text-bordeaux/60">Lié à la commande #{orderId.slice(0, 8)}</p>
            )}
            <button
              onClick={submit}
              className="bg-bordeaux text-ivory px-6 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              Envoyer
            </button>
          </div>
        )}

        {busy ? (
          <p className="text-center text-bordeaux/60 py-12">Chargement…</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-bordeaux/60 py-12">Aucun ticket.</p>
        ) : (
          <div className="bg-ivory border border-border divide-y divide-border">
            {tickets.map((t) => (
              <Link
                key={t.id}
                to={`/support/${t.id}`}
                className="flex justify-between items-center p-4 hover:bg-cream transition"
              >
                <div>
                  <p className="font-mono text-xs text-bordeaux/50">{t.reference}</p>
                  <p className="text-bordeaux">{t.subject}</p>
                  <p className="text-[11px] text-bordeaux/50">
                    {new Date(t.created_at).toLocaleDateString("fr-FR")} · {t.priority}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] tracking-luxe uppercase px-2 py-1 ${
                      t.status === "open"
                        ? "bg-gold/20 text-gold"
                        : t.status === "resolved" || t.status === "closed"
                        ? "bg-cream text-bordeaux/60"
                        : "bg-bordeaux/10 text-bordeaux"
                    }`}
                  >
                    {STATUS_LABEL[t.status] || t.status}
                  </span>
                  <MessageCircle className="h-4 w-4 text-bordeaux/40" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Support;
