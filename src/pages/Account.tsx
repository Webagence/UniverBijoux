import { useEffect, useState } from "react";
import { Navigate, Link, useSearchParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProSidebar from "@/components/ProSidebar";
import StatCard from "@/components/StatCard";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/context/AdminContext";
import { useLang } from "@/context/LanguageContext";
import { orderApi } from "@/services/orderApi";
import { ticketApi } from "@/services/ticketApi";
import { authApi } from "@/services/authApi";
import { toast } from "@/hooks/use-toast";
import { formatEUR } from "@/types/product";
import {
  Package,
  TrendingUp,
  Clock,
  Truck,
  ChevronRight,
  Edit3,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Ticket,
  FileText,
  Download,
} from "lucide-react";

interface OrderRow {
  id: string;
  reference: string;
  created_at: string;
  status: string;
  total_ttc: number;
  subtotal_ht: number;
  vat_amount: number;
  shipping_ht: number;
  carrier: string | null;
  tracking_number: string | null;
  items: { id: string; product_name: string; quantity: number; unit_price_ht: number; line_total_ht: number }[];
}

interface TicketRow {
  id: string;
  reference: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

const Account = () => {
  const { user, profile, logout, loading: authLoading, refreshProfile } = useAuth();
  const { t } = useLang();
  const { settings } = useAdmin();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [busy, setBusy] = useState(true);
  const [editing, setEditing] = useState(params.get("edit") === "profile");

  useEffect(() => {
    setEditing(params.get("edit") === "profile");
  }, [params]);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact_name: "",
    phone: "",
    company_name: "",
    siret: "",
    address: "",
    city: "",
    postal_code: "",
    country: "France",
    vat_number: "",
  });

  useEffect(() => {
    if (editing && user) {
      setForm({
        name: user.name || "",
        contact_name: profile?.contact_name || "",
        phone: profile?.phone || "",
        company_name: profile?.company_name || "",
        siret: profile?.siret || "",
        address: profile?.address || "",
        city: profile?.city || "",
        postal_code: profile?.postal_code || "",
        country: profile?.country || "France",
        vat_number: profile?.vat_number || "",
      });
    }
  }, [editing, user, profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setBusy(true);
      try {
        const [ordersData, ticketsData] = await Promise.all([
          orderApi.getAll(),
          ticketApi.getAll(),
        ]);
        setOrders(ordersData.data || []);
        setTickets(ticketsData.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setBusy(false);
      }
    })();
  }, [user]);

  if (authLoading) return <Layout><div className="container py-32 text-center text-bordeaux/60">{t("common.loading")}</div></Layout>;
  if (!user) return <Navigate to="/connexion?redirect=/compte" replace />;

  const contactName = profile?.contact_name || user.name || user.email?.split("@")[0] || "";
  const companyName = profile?.company_name || "—";

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => ["pending", "confirmed"].includes(o.status)).length;
  const shippedOrders = orders.filter((o) => o.status === "shipped").length;
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total_ttc), 0);
  const openTickets = tickets.filter((t) => ["open", "pending"].includes(t.status)).length;
  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const openEdit = () => {
    setForm({
      name: user.name || "",
      contact_name: profile?.contact_name || "",
      phone: profile?.phone || "",
      company_name: profile?.company_name || "",
      siret: profile?.siret || "",
      address: profile?.address || "",
      city: profile?.city || "",
      postal_code: profile?.postal_code || "",
      country: profile?.country || "France",
      vat_number: profile?.vat_number || "",
    });
    navigate("/compte?edit=profile", { replace: true });
  };

  const closeEdit = () => {
    setEditing(false);
    navigate("/compte", { replace: true });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      await refreshProfile();
      closeEdit();
      toast({ title: t("account.profile_updated"), description: t("account.profile_updated_desc") });
    } catch {
      toast({ title: t("common.error"), description: t("account.save_error"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const generateInvoice = async (order: OrderRow) => {
    try {
      await orderApi.downloadInvoice(order.id);
    } catch {
      toast({ title: t("common.error"), description: t("account.invoice_error") });
    }
  };

  if (editing) {
    return (
      <Layout>
        <PageHeader
          eyebrow={t("account.pro_space")}
          title={t("account.edit_profile")}
          subtitle={companyName}
          crumbs={[{ label: t("pro.dashboard"), to: "/compte" }, { label: t("pro.profile") }]}
        />
        <div className="container py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-8">
            <ProSidebar />
            <div className="flex-1 max-w-2xl">
              <div className="bg-ivory border border-border p-8">
                <h2 className="font-serif text-xl text-bordeaux mb-6">{t("account.account_info")}</h2>
                <form onSubmit={save} className="space-y-5">
                  <div>
                    <h3 className="text-[11px] tracking-luxe uppercase text-bordeaux/50 mb-3">{t("account.personal_info")}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.name")}</label>
                        <input value={form.name} onChange={updateField("name")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.contact_name")}</label>
                        <input value={form.contact_name} onChange={updateField("contact_name")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.phone")}</label>
                      <input value={form.phone} onChange={updateField("phone")} type="tel" className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-[11px] tracking-luxe uppercase text-bordeaux/50 mb-3">{t("account.company")}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.company_name")}</label>
                        <input value={form.company_name} onChange={updateField("company_name")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">SIRET</label>
                        <input value={form.siret} onChange={updateField("siret")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.vat_number")}</label>
                      <input value={form.vat_number} onChange={updateField("vat_number")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <h3 className="text-[11px] tracking-luxe uppercase text-bordeaux/50 mb-3">{t("account.address")}</h3>
                    <div>
                      <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.address")}</label>
                      <input value={form.address} onChange={updateField("address")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.city")}</label>
                        <input value={form.city} onChange={updateField("city")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.postal_code")}</label>
                        <input value={form.postal_code} onChange={updateField("postal_code")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div>
                        <label className="text-[11px] tracking-luxe uppercase text-bordeaux/60 block mb-2">{t("account.country")}</label>
                        <input value={form.country} onChange={updateField("country")} className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={saving} className="bg-bordeaux text-ivory px-8 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth disabled:opacity-50">
                      {saving ? t("account.saving") : t("account.save")}
                    </button>
                    <button type="button" onClick={closeEdit} className="border border-border px-8 py-3 text-xs tracking-luxe uppercase hover:bg-bordeaux hover:text-ivory transition-smooth">
                      {t("account.cancel")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        eyebrow={t("account.pro_space")}
        title={`${t("account.hello")}, ${contactName}`}
        subtitle={companyName}
        crumbs={[{ label: t("pro.dashboard") }]}
      />
      <div className="container py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8">
          <ProSidebar />

          <div className="flex-1 space-y-8">
            {/* Account Status Banner */}
            <div className={`p-4 border-l-4 ${profile?.approved ? "border-green-500 bg-green-50" : "border-amber-500 bg-amber-50"}`}>
              <div className="flex items-center gap-3">
                {profile?.approved ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                )}
                <div>
                  <p className={`font-medium ${profile?.approved ? "text-green-800" : "text-amber-800"}`}>
                    {profile?.approved ? t("account.account_approved") : t("account.account_pending")}
                  </p>
                  <p className={`text-sm ${profile?.approved ? "text-green-700" : "text-amber-700"}`}>
                    {profile?.approved
                      ? t("account.account_approved_desc")
                      : t("account.account_pending_desc")}
                  </p>
                </div>
              </div>
            </div>

            {/* KPI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Package}
                label={t("account.total_orders")}
                value={totalOrders}
                subValue={t("account.since_registration")}
              />
              <StatCard
                icon={Clock}
                label={t("account.in_progress")}
                value={pendingOrders}
                subValue={t("account.pending_or_confirmed")}
                color="gold"
              />
              <StatCard
                icon={Truck}
                label={t("account.shipped")}
                value={shippedOrders}
                subValue={t("account.in_delivery")}
                color="blue"
              />
              <StatCard
                icon={TrendingUp}
                label={t("account.total_spent")}
                value={formatEUR(totalSpent)}
                subValue={t("account.all_taxes_included")}
                color="green"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-ivory border border-border p-6">
              <h2 className="font-serif text-lg text-bordeaux mb-4">{t("account.quick_actions")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  to="/boutique"
                  className="flex items-center gap-3 p-4 bg-cream hover:bg-gold/10 border border-border hover:border-gold/50 transition-smooth"
                >
                  <ShoppingCart className="h-5 w-5 text-bordeaux" />
                  <div>
                    <p className="text-sm font-medium text-bordeaux">{t("account.order")}</p>
                    <p className="text-[10px] text-bordeaux/50">{t("account.access_catalog")}</p>
                  </div>
                </Link>
                <Link
                  to="/commandes"
                  className="flex items-center gap-3 p-4 bg-cream hover:bg-gold/10 border border-border hover:border-gold/50 transition-smooth"
                >
                  <Package className="h-5 w-5 text-bordeaux" />
                  <div>
                    <p className="text-sm font-medium text-bordeaux">{t("pro.orders")}</p>
                    <p className="text-[10px] text-bordeaux/50">{t("account.view_history")}</p>
                  </div>
                </Link>
                <Link
                  to="/support"
                  className="flex items-center gap-3 p-4 bg-cream hover:bg-gold/10 border border-border hover:border-gold/50 transition-smooth"
                >
                  <Ticket className="h-5 w-5 text-bordeaux" />
                  <div>
                    <p className="text-sm font-medium text-bordeaux">{t("pro.support")}</p>
                    <p className="text-[10px] text-bordeaux/50">{openTickets > 0 ? `${openTickets} ${t("account.ticket_open")}` : t("account.no_ticket")}</p>
                  </div>
                </Link>
                <button
                  onClick={openEdit}
                  className="flex items-center gap-3 p-4 bg-cream hover:bg-gold/10 border border-border hover:border-gold/50 transition-smooth"
                >
                  <Edit3 className="h-5 w-5 text-bordeaux" />
                  <div>
                    <p className="text-sm font-medium text-bordeaux">{t("pro.profile")}</p>
                    <p className="text-[10px] text-bordeaux/50">{t("account.edit_info")}</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-ivory border border-border">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="font-serif text-lg text-bordeaux">{t("account.recent_orders")}</h2>
                <Link to="/commandes" className="text-xs text-gold hover:underline flex items-center gap-1">
                  {t("account.view_all")} <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              {busy ? (
                <div className="p-12 text-center text-bordeaux/60">{t("common.loading")}</div>
              ) : recentOrders.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <p className="text-bordeaux/60">{t("account.no_orders_yet")}</p>
                  <Link to="/boutique" className="inline-block bg-bordeaux text-ivory px-6 py-2 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth">
                    {t("account.view_catalog")}
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-4 hover:bg-cream/50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cream flex items-center justify-center">
                          <Package className="h-5 w-5 text-bordeaux/60" />
                        </div>
                        <div>
                          <Link to={`/commandes/${o.id}`} className="font-medium text-bordeaux hover:text-gold transition-smooth">
                            {o.reference}
                          </Link>
                          <p className="text-xs text-bordeaux/50">
                            {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            {(o.items || []).length > 0 && ` · ${(o.items || []).length} article(s)`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <OrderStatusBadge status={o.status} />
                        <span className="font-serif text-bordeaux">{formatEUR(Number(o.total_ttc))}</span>
                        <Link to={`/commandes/${o.id}`} className="text-bordeaux/40 hover:text-gold transition-smooth">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Open Tickets */}
            {openTickets > 0 && (
              <div className="bg-ivory border border-border">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <h2 className="font-serif text-lg text-bordeaux">{t("account.open_tickets")}</h2>
                  <Link to="/support" className="text-xs text-gold hover:underline flex items-center gap-1">
                    {t("account.view_all")} <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {tickets
                    .filter((t) => ["open", "pending"].includes(t.status))
                    .slice(0, 3)
                    .map((t) => (
                      <Link key={t.id} to={`/support/${t.id}`} className="flex items-center justify-between p-4 hover:bg-cream/50 transition">
                        <div>
                          <p className="font-medium text-bordeaux">{t.subject}</p>
                          <p className="text-xs text-bordeaux/50">
                            {t.reference} · {new Date(t.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <span className={`text-[10px] tracking-luxe uppercase px-2 py-1 ${
                          t.status === "open" ? "bg-gold/20 text-gold" : "bg-bordeaux/10 text-bordeaux"
                        }`}>
                          {t.status === "open" ? t("ticket.open") : t("ticket.pending")}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            )}

            {/* Company Info Summary */}
            <div className="bg-ivory border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-lg text-bordeaux">{t("account.company_info")}</h2>
                <button onClick={openEdit} className="text-xs text-gold hover:underline flex items-center gap-1">
                  <Edit3 className="h-3 w-3" /> {t("account.edit")}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">Contact</p>
                  <p className="text-sm text-bordeaux">{profile?.contact_name || user.name || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">Email</p>
                  <p className="text-sm text-bordeaux">{user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">Téléphone</p>
                  <p className="text-sm text-bordeaux">{profile?.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">SIRET</p>
                  <p className="text-sm text-bordeaux">{profile?.siret || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">TVA</p>
                  <p className="text-sm text-bordeaux">{profile?.vat_number || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] tracking-luxe uppercase text-bordeaux/50">Adresse</p>
                  <p className="text-sm text-bordeaux">
                    {profile?.address ? `${profile.city}, ${profile.postal_code}` : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Logout */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <p className="text-xs text-bordeaux/50">{t("account.logged_in_as")} <span className="text-bordeaux">{user.email}</span></p>
              <button
                onClick={logout}
                className="text-xs tracking-luxe uppercase text-bordeaux/70 border border-border px-6 py-3 hover:bg-bordeaux hover:text-ivory transition-smooth"
              >
                {t("account.logout")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
