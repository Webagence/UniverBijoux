import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  HeroContent,
  AtelierContent,
  Testimonial,
  FaqItem,
  SiteSettings,
  defaultHero,
  defaultAtelier,
  defaultTestimonials,
  defaultFaq,
  defaultSettings,
} from "@/data/content";
import { Product, Universe } from "@/types/product";
import { productApi } from "@/services/productApi";
import { contentApi } from "@/services/contentApi";
import { orderApi } from "@/services/orderApi";
import api from "@/services/api";

interface ProAccount {
  id: string;
  email: string;
  companyName: string;
  siret: string;
  contactName: string;
  approved: boolean;
}
interface AdminOrder {
  id: string;
  reference: string;
  date: string;
  email: string;
  totalTTC: number;
  status: string;
  lines: { productId: string | null; productName: string; quantity: number }[];
}

interface AdminCtx {
  isAdmin: boolean;
  loginAdmin: (pwd: string) => boolean;
  logoutAdmin: () => void;

  loading: boolean;

  hero: HeroContent;
  setHero: (v: HeroContent) => Promise<void>;
  atelier: AtelierContent;
  setAtelier: (v: AtelierContent) => Promise<void>;
  testimonials: Testimonial[];
  setTestimonials: (v: Testimonial[]) => Promise<void>;
  faq: FaqItem[];
  setFaq: (v: FaqItem[]) => Promise<void>;
  settings: SiteSettings;
  setSettings: (v: SiteSettings) => Promise<void>;

  products: Product[];
  upsertProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProducts: () => Promise<void>;

  universesList: UniverseRow[];
  upsertUniverse: (u: UniverseRow) => Promise<void>;
  deleteUniverse: (id: string) => Promise<void>;

  getProAccounts: () => ProAccount[];
  toggleApproveAccount: (id: string) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  getOrders: () => AdminOrder[];
  setOrderStatus: (id: string, status: string) => Promise<void>;

  refresh: () => Promise<void>;
}

export interface UniverseRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  display_order: number;
}

const Ctx = createContext<AdminCtx | null>(null);

const universeCache: { byId: Record<string, string>; bySlug: Record<string, string> } = {
  byId: {},
  bySlug: {},
};

const universeNameCache: Record<string, string> = {};

const dbToProduct = (row: any): Product => {
  const universeSlug = universeCache.byId[row.universe_id] || "colliers";
  const universeLabel = universeNameCache[row.universe_id] || universeSlug;
  const imgs = Array.isArray(row.images) && row.images.length > 0 ? row.images : [];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    universe: universeSlug as Universe,
    universeLabel,
    priceHT: Number(row.price_ht),
    retailTTC: row.retail_ttc ? Number(row.retail_ttc) : Math.round(Number(row.price_ht) * 2.8 * 1.2),
    moq: row.moq,
    packSize: row.pack_size,
    reference: row.reference || "",
    material: row.material || "",
    finish: row.finish || "Finition mate & brillante",
    description: row.description || "",
    images: imgs,
    tag: row.tag,
    isNew: row.is_new,
    stock: row.stock,
  };
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, logout } = useAuth();
  const [hero, setHeroState] = useState<HeroContent>(defaultHero);
  const [atelier, setAtelierState] = useState<AtelierContent>(defaultAtelier);
  const [testimonials, setTestimonialsState] = useState<Testimonial[]>(defaultTestimonials);
  const [faq, setFaqState] = useState<FaqItem[]>(defaultFaq);
  const [settings, setSettingsState] = useState<SiteSettings>(defaultSettings);
  const [products, setProductsState] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [universesList, setUniversesList] = useState<UniverseRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [universes, heroData, atelierData, testimonialsData, faqData, settingsData, productsData] = await Promise.all([
        productApi.getUniverses(),
        contentApi.getHero().catch(() => defaultHero),
        contentApi.getAtelier().catch(() => defaultAtelier),
        contentApi.getTestimonials().catch(() => []),
        contentApi.getFaq().catch(() => []),
        contentApi.getSettings().catch(() => ({})),
        productApi.getAll({ per_page: 200 }).catch(() => ({ data: [] })),
      ]);

      if (universes) {
        universeCache.byId = {};
        universeCache.bySlug = {};
        Object.keys(universeNameCache).forEach((k) => delete universeNameCache[k]);
        universes.forEach((u: any) => {
          universeCache.byId[u.id] = u.slug;
          universeCache.bySlug[u.slug] = u.id;
          universeNameCache[u.id] = u.name;
        });
        setUniversesList(
          universes.map((u: any) => ({
            id: u.id,
            slug: u.slug,
            name: u.name,
            description: u.description || "",
            image_url: u.image_url || "",
            display_order: u.display_order ?? 0,
          }))
        );
      }

      if (heroData) setHeroState({ ...defaultHero, ...heroData });
      if (atelierData) setAtelierState({ ...defaultAtelier, ...atelierData });
      if (settingsData) setSettingsState({ ...defaultSettings, ...settingsData });

      if (testimonialsData) {
        setTestimonialsState(
          testimonialsData.map((t: any) => ({
            id: t.id,
            name: t.author,
            shop: t.shop || t.role || "",
            text: t.quote,
          }))
        );
      }

      if (faqData) {
        setFaqState(faqData.map((f: any) => ({ id: f.id, q: f.question, a: f.answer })));
      }

      if (productsData?.data) {
        setProductsState(productsData.data.map(dbToProduct));
      }
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [accountsRes, ordersRes] = await Promise.all([
        api.get("/admin/accounts").catch(() => ({ data: [] })),
        api.get("/admin/orders?per_page=200").catch(() => ({ data: [] })),
      ]);

      if (accountsRes.data) {
        setAccounts(
          accountsRes.data.map((p: any) => ({
            id: p.id,
            email: p.email,
            companyName: p.company_name || p.name,
            siret: p.siret || "",
            contactName: p.contact_name || p.name,
            approved: p.approved,
          }))
        );
      }

      if (ordersRes.data?.data) {
        setOrders(
          ordersRes.data.data.map((o: any) => ({
            id: o.id,
            reference: o.reference,
            date: o.created_at,
            email: o.user?.email || "",
            totalTTC: Number(o.total_ttc),
            status: o.status,
            lines: (o.items || []).map((li: any) => ({
              productId: li.product_id,
              productName: li.product_name,
              quantity: li.quantity,
            })),
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  }, [isAdmin]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const loginAdmin = (_pwd: string) => false;
  const logoutAdmin = () => {
    void logout();
  };

  const setHero = async (v: HeroContent) => {
    setHeroState(v);
    try {
      await api.put("/admin/content/hero", v);
    } catch (err) {
      console.error("Failed to save hero:", err);
    }
  };

  const setAtelier = async (v: AtelierContent) => {
    setAtelierState(v);
    try {
      await api.put("/admin/content/atelier", v);
    } catch (err) {
      console.error("Failed to save atelier:", err);
    }
  };

  const setSettings = async (v: SiteSettings) => {
    setSettingsState(v);
    try {
      await api.put("/admin/settings", v);
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const setTestimonials = async (v: Testimonial[]) => {
    setTestimonialsState(v);
    try {
      await api.post("/admin/testimonials/sync", {
        testimonials: v.map((t, i) => ({
          id: t.id.startsWith("new-") ? undefined : t.id,
          author: t.name,
          shop: t.shop,
          quote: t.text,
          display_order: i,
          active: true,
        })),
      });
      await loadAll();
    } catch (err) {
      console.error("Failed to save testimonials:", err);
    }
  };

  const setFaq = async (v: FaqItem[]) => {
    setFaqState(v);
    try {
      await api.post("/admin/faq/sync", {
        faq: v.map((f, i) => ({
          id: f.id.startsWith("new-") ? undefined : f.id,
          question: f.q,
          answer: f.a,
          display_order: i,
          active: true,
        })),
      });
      await loadAll();
    } catch (err) {
      console.error("Failed to save FAQ:", err);
    }
  };

  const upsertProduct = async (p: Product) => {
    const universeId = universeCache.bySlug[p.universe];
    const payload = {
      slug: p.slug,
      name: p.name,
      reference: p.reference,
      description: p.description,
      universe_id: universeId,
      price_ht: p.priceHT,
      retail_ttc: p.retailTTC,
      moq: p.moq,
      pack_size: p.packSize,
      stock: p.stock,
      images: p.images,
      is_new: !!p.isNew,
      material: p.material,
      finish: p.finish,
      tag: p.tag,
      active: true,
    };

    try {
      if (p.id.startsWith("new-")) {
        await api.post("/admin/products", payload);
      } else {
        await api.put(`/admin/products/${p.id}`, payload);
      }
      await loadAll();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      await loadAll();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const resetProducts = async () => {
    await loadAll();
  };

  const getProAccounts = useCallback(() => accounts, [accounts]);

  const toggleApproveAccount = async (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    try {
      await api.put(`/admin/accounts/${id}/approve`, { approved: !acc.approved });
      await loadAdminData();
    } catch (err) {
      console.error("Failed to toggle account approval:", err);
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await api.delete(`/admin/accounts/${id}`);
      await loadAdminData();
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const getOrders = useCallback(() => orders, [orders]);

  const setOrderStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      await loadAdminData();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const upsertUniverse = async (u: UniverseRow) => {
    const payload = {
      slug: u.slug,
      name: u.name,
      description: u.description,
      image_url: u.image_url,
      display_order: u.display_order,
    };
    try {
      if (u.id.startsWith("new-")) {
        await api.post("/admin/universes", payload);
      } else {
        await api.put(`/admin/universes/${u.id}`, payload);
      }
      await loadAll();
    } catch (err) {
      console.error("Failed to save universe:", err);
    }
  };

  const deleteUniverse = async (id: string) => {
    try {
      await api.delete(`/admin/universes/${id}`);
      await loadAll();
    } catch (err) {
      console.error("Failed to delete universe:", err);
    }
  };

  return (
    <Ctx.Provider
      value={{
        isAdmin,
        loginAdmin,
        logoutAdmin,
        loading,
        hero,
        setHero,
        atelier,
        setAtelier,
        testimonials,
        setTestimonials,
        faq,
        setFaq,
        settings,
        setSettings,
        products,
        upsertProduct,
        deleteProduct,
        resetProducts,
        getProAccounts,
        toggleApproveAccount,
        deleteAccount,
        getOrders,
        setOrderStatus,
        universesList,
        upsertUniverse,
        deleteUniverse,
        refresh: loadAll,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAdmin = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdmin must be used inside AdminProvider");
  return c;
};
