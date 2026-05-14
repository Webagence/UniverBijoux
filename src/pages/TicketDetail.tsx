import { useEffect, useState, useRef, useCallback } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { ticketApi } from "@/services/ticketApi";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface Msg {
  id: string;
  body: string;
  is_admin: boolean;
  created_at: string;
  author_id: string;
}
interface Ticket {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  user_id: string;
}

const STATUS_LABEL: Record<string, string> = {
  open: "Ouvert",
  pending: "En attente",
  resolved: "Résolu",
  closed: "Fermé",
};

const TicketDetail = () => {
  const { user, loading: authLoading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);
  const ticketStatusRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    try {
      const data = await ticketApi.getById(id);
      setTicket(data);
      setMsgs(data.messages || []);
      ticketStatusRef.current = data?.status || null;
    } catch (err) {
      console.error("Failed to load ticket:", err);
    } finally {
      setBusy(false);
    }
  }, [id]);

  useEffect(() => {
    if (user && id) {
      setBusy(true);
      refresh();
    }
  }, [user, id, refresh]);

  useEffect(() => {
    if (!id || ticketStatusRef.current === "closed" || ticketStatusRef.current === "resolved") return;
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [id, refresh]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  if (authLoading) return null;
  if (!user) return <Navigate to="/connexion" replace />;

  const send = async () => {
    if (!input.trim() || !ticket || !user) return;
    const text = input;
    setInput("");
    try {
      const result = await ticketApi.reply(ticket.id, text);
      setTicket(result.ticket);
      setMsgs(result.ticket.messages || []);
      ticketStatusRef.current = result.ticket?.status || null;
    } catch (err: any) {
      toast({ title: "Erreur", description: err.response?.data?.message || "Impossible d'envoyer le message." });
      setInput(text);
    }
  };

  return (
    <Layout>
      <PageHeader
        title={ticket?.subject || "Ticket"}
        crumbs={[{ label: "Support", to: "/support" }, { label: ticket?.reference || "..." }]}
      />
      <section className="container py-12 md:py-16 max-w-3xl space-y-4">
        {busy ? (
          <p className="text-center text-bordeaux/60">Chargement…</p>
        ) : !ticket ? (
          <p className="text-center text-bordeaux/60">Ticket introuvable.</p>
        ) : (
          <>
            <div className="bg-ivory border border-border p-4 flex justify-between items-center">
              <div>
                <p className="font-mono text-xs text-bordeaux/50">{ticket.reference}</p>
                <p className="text-bordeaux">{ticket.subject}</p>
              </div>
              <span className="text-[10px] tracking-luxe uppercase bg-gold/20 text-gold px-2 py-1">
                {STATUS_LABEL[ticket.status]}
              </span>
            </div>

            <div className="bg-ivory border border-border min-h-[300px] max-h-[500px] overflow-y-auto p-4 space-y-3">
              {msgs.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.is_admin ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[75%] p-3 text-sm ${
                      m.is_admin
                        ? "bg-cream text-bordeaux"
                        : "bg-bordeaux text-ivory"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>
                    <p className="text-[10px] opacity-60 mt-1">
                      {m.is_admin ? "Maison Lune" : "Vous"} ·{" "}
                      {new Date(m.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {(ticket.status === "open" || ticket.status === "pending") && (
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Votre message…"
                  className="flex-1 bg-cream border border-border px-3 py-2 text-sm"
                />
                <button
                  onClick={send}
                  className="bg-bordeaux text-ivory px-4 py-2 hover:bg-gold transition-smooth"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            )}
            <Link to="/support" className="text-xs text-bordeaux/60 hover:text-gold">
              ← Retour aux tickets
            </Link>
          </>
        )}
      </section>
    </Layout>
  );
};

export default TicketDetail;
