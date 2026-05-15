import { useEffect, useState } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProSidebar from "@/components/ProSidebar";
import { useAuth } from "@/context/AuthContext";
import { ticketApi } from "@/services/ticketApi";
import { toast } from "@/hooks/use-toast";
import { Plus, MessageCircle, Search, Filter, ChevronRight, Clock, CheckCircle, XCircle } from "lucide-react";

interface Ticket {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
  order_id: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  open: { label: "Ouvert", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
  pending: { label: "En attente", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  resolved: { label: "Résolu", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  closed: { label: "Fermé", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Basse", color: "text-bordeaux/50" },
  normal: { label: "Normale", color: "text-bordeaux" },
  high: { label: "Haute", color: "text-destructive" },
};

const Support = () => {
  const { user, loading: authLoading } = useAuth();
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [busy, setBusy] = useState(true);
  const [showNew, setShowNew] = useState(!!orderId);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("normal");
  const [body, setBody] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const refresh = async () => {
    if (!user) return;
    setBusy(true);
    try {
      const data = await ticketApi.getAll();
      setTickets(data?.data || []);
    } catch (err) {
      console.error("Failed to load tickets:", err);
      setTickets([]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (user) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading) {
    return (
      <Layout>
        <section className="container py-20 text-center text-bordeaux/60">Chargement…</section>
      </Layout>
    );
  }
  if (!user) return <Navigate to="/connexion?redirect=/support" replace />;

  const submit = async () => {
    if (!subject.trim() || !body.trim()) {
      toast({ title: "Sujet et message requis" });
      return;
    }
    try {
      const result = await ticketApi.create({
        subject,
        priority,
        order_id: orderId || undefined,
        message: body,
      });
      toast({ title: "Ticket créé", description: result.ticket.reference });
      setSubject("");
      setBody("");
      setShowNew(false);
      refresh();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.response?.data?.message || "Impossible de créer le ticket." });
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.subject.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q);
    }
    return true;
  });

  const statusCounts = {
    open: tickets.filter((t) => t.status === "open").length,
    pending: tickets.filter((t) => t.status === "pending").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Espace pro"
        title="Support & Tickets"
        subtitle="Suivez vos demandes et communiquez avec notre équipe"
        crumbs={[{ label: "Tableau de bord", to: "/compte" }, { label: "Support" }]}
      />
      <div className="container py-12 md:py-16">
        <div className="flex gap-8">
          <ProSidebar />

          <div className="flex-1 space-y-6">
            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
                  className={`p-4 border text-left transition-smooth ${
                    statusFilter === key
                      ? "border-gold bg-gold/5"
                      : "border-border bg-ivory hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                    <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">{config.label}</p>
                  </div>
                  <p className="font-serif text-xl text-bordeaux mt-1">{statusCounts[key as keyof typeof statusCounts]}</p>
                </button>
              ))}
            </div>

            {/* New Ticket Form */}
            {showNew && (
              <div className="bg-ivory border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-lg text-bordeaux">Nouveau ticket</h2>
                  <button onClick={() => setShowNew(false)} className="text-bordeaux/50 hover:text-bordeaux">
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Sujet</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Décrivez brièvement votre demande"
                      className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Priorité</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
                      >
                        <option value="low">Basse</option>
                        <option value="normal">Normale</option>
                        <option value="high">Haute</option>
                      </select>
                    </div>
                    {orderId && (
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Commande liée</label>
                        <p className="text-sm text-bordeaux py-3">#{orderId.slice(0, 8)}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">Message</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Décrivez votre demande en détail…"
                      rows={5}
                      className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={submit}
                      className="bg-bordeaux text-ivory px-6 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
                    >
                      Envoyer le ticket
                    </button>
                    <button
                      onClick={() => setShowNew(false)}
                      className="border border-border px-6 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-ivory border border-border p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bordeaux/40" />
                  <input
                    type="search"
                    placeholder="Rechercher un ticket..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-transparent border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-gold"
                >
                  <option value="all">Tous les statuts</option>
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-bordeaux/60">
                {filteredTickets.length} ticket{filteredTickets.length > 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setShowNew((v) => !v)}
                className="inline-flex items-center gap-2 bg-bordeaux text-ivory px-5 py-2.5 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
              >
                <Plus className="h-4 w-4" /> Nouveau ticket
              </button>
            </div>

            {/* Tickets List */}
            {busy ? (
              <div className="text-center py-20 text-bordeaux/60">Chargement…</div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-ivory border border-border">
                <MessageCircle className="h-12 w-12 text-bordeaux/20 mx-auto" />
                <p className="text-bordeaux/60">Aucun ticket trouvé.</p>
                <button
                  onClick={() => setShowNew(true)}
                  className="inline-block bg-bordeaux text-ivory px-6 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
                >
                  Créer un ticket
                </button>
              </div>
            ) : (
              <div className="bg-ivory border border-border divide-y divide-border">
                {filteredTickets.map((t) => {
                  const statusConfig = STATUS_CONFIG[t.status] || STATUS_CONFIG.closed;
                  const priorityConfig = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.normal;
                  return (
                    <Link
                      key={t.id}
                      to={`/support/${t.id}`}
                      className="flex items-center justify-between p-4 hover:bg-cream/50 transition group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cream flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-bordeaux/60" />
                        </div>
                        <div>
                          <p className="font-medium text-bordeaux group-hover:text-gold transition-smooth">{t.subject}</p>
                          <p className="text-xs text-bordeaux/50">
                            {t.reference} · {new Date(t.created_at).toLocaleDateString("fr-FR")}
                            {t.order_id && ` · Commande #${t.order_id.slice(0, 8)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] ${priorityConfig.color}`}>
                          {priorityConfig.label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text} text-[10px] tracking-luxe uppercase px-2 py-1`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                          {statusConfig.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-bordeaux/30 group-hover:text-gold transition" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
