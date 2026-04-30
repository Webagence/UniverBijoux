import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import { products as defaultProducts, Product, Universe } from "@/data/products";
import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import rings from "@/assets/product-rings.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

const FALLBACK_IMG: Record<Universe, string> = {
  colliers: necklace,
  boucles: earrings,
  bagues: rings,
  bracelets: bracelet,
};
const UNIVERSE_LABEL: Record<Universe, string> = {
  colliers: "Colliers",
  boucles: "Boucles d'oreilles",
  bagues: "Bagues",
  bracelets: "Bracelets",
};

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

// universe id <-> slug cache
const universeCache: { byId: Record<string, Universe>; bySlug: Record<Universe, string> } = {
  byId: {},
  bySlug: {} as Record<Universe, string>,
};

const dbToProduct = (row: any): Product => {
  const universe = (universeCache.byId[row.universe_id] || "colliers") as Universe;
  const imgs = Array.isArray(row.images) && row.images.length > 0 ? row.images : [FALLBACK_IMG[universe]];
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    universe,
    universeLabel: UNIVERSE_LABEL[universe],
    priceHT: Number(row.price_ht),
    retailTTC: Math.round(Number(row.price_ht) * 2.8 * 1.2),
    moq: row.moq,
    packSize: row.pack_size,
    reference: row.reference || "",
    material: row.material || "",
    finish: "Finition mate & brillante",
    description: row.description || "",
    images: imgs,
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
  const [products, setProductsState] = useState<Product[]>(defaultProducts);
  const [accounts, setAccounts] = useState<ProAccount[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [universesList, setUniversesList] = useState<UniverseRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      // Universes (cache mapping + full list)
      const { data: uRows } = await supabase
        .from("universes")
        .select("id,slug,name,description,image_url,display_order")
        .order("display_order");
      if (uRows) {
        universeCache.byId = {};
        universeCache.bySlug = {} as Record<Universe, string>;
        uRows.forEach((u: any) => {
          universeCache.byId[u.id] = u.slug as Universe;
          universeCache.bySlug[u.slug as Universe] = u.id;
        });
        setUniversesList(
          uRows.map((u: any) => ({
            id: u.id,
            slug: u.slug,
            name: u.name,
            description: u.description || "",
            image_url: u.image_url || "",
            display_order: u.display_order ?? 0,
          }))
        );
      }

      const [blocks, settingsRow, prodRows, testRows, faqRows] = await Promise.all([
        supabase.from("content_blocks").select("key,data"),
        supabase.from("site_settings").select("key,value").eq("key", "settings").maybeSingle(),
        supabase.from("products").select("*").order("created_at", { ascending: true }),
        supabase.from("testimonials").select("*").order("display_order"),
        supabase.from("faq_items").select("*").order("display_order"),
      ]);

      if (blocks.data) {
        const map: Record<string, any> = {};
        blocks.data.forEach((b: any) => (map[b.key] = b.data));
        if (map.hero) setHeroState({ ...defaultHero, ...map.hero });
        if (map.atelier) setAtelierState({ ...defaultAtelier, ...map.atelier });
      }
      if (settingsRow.data?.value) {
        setSettingsState({ ...defaultSettings, ...(settingsRow.data.value as any) });
      }
      if (prodRows.data) setProductsState(prodRows.data.map(dbToProduct));
      if (testRows.data) {
        setTestimonialsState(
          testRows.data.map((t: any) => ({ id: t.id, name: t.author, shop: t.role || "", text: t.quote }))
        );
      }
      if (faqRows.data) {
        setFaqState(faqRows.data.map((f: any) => ({ id: f.id, q: f.question, a: f.answer })));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Load admin-only data when becoming admin
  const loadAdminData = useCallback(async () => {
    if (!isAdmin) return;
    const [profRes, orderRes] = await Promise.all([
      supabase.from("profiles").select("id,email,company_name,siret,contact_name,approved").order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id,reference,created_at,total_ttc,status,user_id,profiles:user_id(email),order_items(product_id,product_name,quantity)")
        .order("created_at", { ascending: false }),
    ]);
    if (profRes.data) {
      setAccounts(
        profRes.data.map((p: any) => ({
          id: p.id,
          email: p.email,
          companyName: p.company_name,
          siret: p.siret,
          contactName: p.contact_name,
          approved: p.approved,
        }))
      );
    }
    if (orderRes.data) {
      setOrders(
        orderRes.data.map((o: any) => ({
          id: o.id,
          reference: o.reference,
          date: o.created_at,
          email: o.profiles?.email || "",
          totalTTC: Number(o.total_ttc),
          status: o.status,
          lines: (o.order_items || []).map((li: any) => ({
            productId: li.product_id,
            productName: li.product_name,
            quantity: li.quantity,
          })),
        }))
      );
    }
  }, [isAdmin]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Wrappers for legacy admin pages
  const loginAdmin = (_pwd: string) => false;
  const logoutAdmin = () => {
    void logout();
  };

  // === Setters: Supabase write + local update ===
  const setHero = async (v: HeroContent) => {
    setHeroState(v);
    await supabase.from("content_blocks").upsert({ key: "hero", data: v as any });
  };
  const setAtelier = async (v: AtelierContent) => {
    setAtelierState(v);
    await supabase.from("content_blocks").upsert({ key: "atelier", data: v as any });
  };
  const setSettings = async (v: SiteSettings) => {
    setSettingsState(v);
    await supabase.from("site_settings").upsert({ key: "settings", value: v as any });
  };

  const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const setTestimonials = async (v: Testimonial[]) => {
    setTestimonialsState(v);
    const keepIds = v.filter((t) => isUuid(t.id)).map((t) => t.id);
    if (keepIds.length === 0) {
      await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } else {
      await supabase.from("testimonials").delete().not("id", "in", `(${keepIds.join(",")})`);
    }
    for (let i = 0; i < v.length; i++) {
      const t = v[i];
      const payload = { author: t.name, role: t.shop, quote: t.text, display_order: i, active: true };
      if (!isUuid(t.id)) {
        await supabase.from("testimonials").insert(payload);
      } else {
        await supabase.from("testimonials").update(payload).eq("id", t.id);
      }
    }
    await loadAll();
  };

  const setFaq = async (v: FaqItem[]) => {
    setFaqState(v);
    const keepIds = v.filter((f) => isUuid(f.id)).map((f) => f.id);
    if (keepIds.length === 0) {
      await supabase.from("faq_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    } else {
      await supabase.from("faq_items").delete().not("id", "in", `(${keepIds.join(",")})`);
    }
    for (let i = 0; i < v.length; i++) {
      const f = v[i];
      const payload = { question: f.q, answer: f.a, display_order: i, active: true };
      if (!isUuid(f.id)) {
        await supabase.from("faq_items").insert(payload);
      } else {
        await supabase.from("faq_items").update(payload).eq("id", f.id);
      }
    }
    await loadAll();
  };

  // Products
  const upsertProduct = async (p: Product) => {
    const universeId = universeCache.bySlug[p.universe];
    const payload = {
      slug: p.slug,
      name: p.name,
      reference: p.reference,
      description: p.description,
      universe_id: universeId,
      price_ht: p.priceHT,
      moq: p.moq,
      pack_size: p.packSize,
      stock: p.stock,
      images: p.images as any,
      is_new: !!p.isNew,
      material: p.material,
      active: true,
    };
    const isNewRow = p.id.startsWith("new-");
    if (isNewRow) {
      await supabase.from("products").insert(payload);
    } else {
      await supabase.from("products").update(payload).eq("id", p.id);
    }
    await loadAll();
  };
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    await loadAll();
  };
  const resetProducts = async () => {
    // Just reload from DB — no destructive action
    await loadAll();
  };

  // Accounts & orders
  const getProAccounts = useCallback(() => accounts, [accounts]);
  const toggleApproveAccount = async (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    await supabase.from("profiles").update({ approved: !acc.approved }).eq("id", id);
    await loadAdminData();
  };
  const deleteAccount = async (id: string) => {
    await supabase.from("profiles").delete().eq("id", id);
    await loadAdminData();
  };
  const getOrders = useCallback(() => orders, [orders]);
  const setOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status: status as any }).eq("id", id);
    await loadAdminData();
  };

  // Universes CRUD
  const upsertUniverse = async (u: UniverseRow) => {
    const payload = {
      slug: u.slug,
      name: u.name,
      description: u.description,
      image_url: u.image_url,
      display_order: u.display_order,
    };
    if (u.id.startsWith("new-")) {
      await supabase.from("universes").insert(payload);
    } else {
      await supabase.from("universes").update(payload).eq("id", u.id);
    }
    await loadAll();
  };
  const deleteUniverse = async (id: string) => {
    await supabase.from("universes").delete().eq("id", id);
    await loadAll();
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
