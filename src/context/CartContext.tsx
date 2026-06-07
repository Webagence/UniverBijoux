import { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from "react";
import { Product } from "@/types/product";
import { useAdmin } from "@/context/AdminContext";
import { useAuth } from "@/context/AuthContext";
import { discountApi, type Discount, type AutoDiscount } from "@/services/discountApi";
import { toast } from "@/hooks/use-toast";

export interface CartLine {
  productId: string;
  quantity: number;
}

interface CartCtx {
  lines: CartLine[];
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  updateQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  subtotalHT: number;
  vat: number;
  totalTTC: number;
  getProduct: (id: string) => Product | undefined;
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: Discount | null;
  discountHt: number;
  autoDiscountId: string | null;
  validateDiscount: () => Promise<void>;
  clearDiscount: () => void;
  validatingDiscount: boolean;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ml_cart";
const DISCOUNT_KEY = "ml_discount";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { products } = useAdmin();
  const { user } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [validatingDiscount, setValidatingDiscount] = useState(false);
  const [autoDiscountId, setAutoDiscountId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!user || appliedDiscount) return;
    (async () => {
      try {
        const auto = await discountApi.getMyDiscounts();
        if (auto.length > 0) {
          const best = auto.reduce((a, b) => {
            const va = a.type === "percentage" ? a.value : a.value;
            const vb = b.type === "percentage" ? b.value : b.value;
            return va >= vb ? a : b;
          });
          setAppliedDiscount({ ...best, amount_ht: 0 });
          setAutoDiscountId(best.id);
        }
      } catch {
        /* non-critical */
      }
    })();
  }, [user]);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISCOUNT_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setDiscountCode(saved.code || "");
        setAppliedDiscount(saved.discount || null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const addItem: CartCtx["addItem"] = (productId, quantity = 1) => {
    const p = getProduct(productId);
    const qty = Math.max(quantity, p?.moq ?? 1);
    setLines((prev) => {
      const ex = prev.find((l) => l.productId === productId);
      if (ex)
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + qty } : l
        );
      return [...prev, { productId, quantity: qty }];
    });
  };

  const updateQty: CartCtx["updateQty"] = (productId, quantity) => {
    setLines((prev) =>
      prev
        .map((l) => (l.productId === productId ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0)
    );
  };

  const removeItem = (productId: string) =>
    setLines((prev) => prev.filter((l) => l.productId !== productId));

  const clear = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(DISCOUNT_KEY);
    setLines([]);
    setDiscountCode("");
    setAppliedDiscount(null);
    setAutoDiscountId(null);
  };

  const { itemCount, subtotalHT, discountHt, vat, totalTTC } = useMemo(() => {
    let count = 0;
    let sub = 0;
    lines.forEach((l) => {
      const p = getProduct(l.productId);
      if (!p) return;
      count += l.quantity;
      const price = p.salePriceHT ?? p.priceHT;
      sub += price * l.quantity;
    });

    let dh = appliedDiscount?.amount_ht ?? 0;
    if (appliedDiscount && appliedDiscount.code === null && dh === 0) {
      if (appliedDiscount.type === "percentage") {
        dh = +((sub * appliedDiscount.value) / 100).toFixed(2);
      } else if (appliedDiscount.type === "fixed") {
        dh = appliedDiscount.value;
      }
    }
    const v = +(((sub - dh) * 0.2)).toFixed(2);
    return {
      itemCount: count,
      subtotalHT: +sub.toFixed(2),
      discountHt: dh,
      vat: v,
      totalTTC: +(sub - dh + v).toFixed(2),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, products, appliedDiscount]);

  const validateDiscount = useCallback(async () => {
    if (!discountCode.trim()) return;

    setValidatingDiscount(true);
    try {
      const items = lines
        .map((l) => {
          const p = getProduct(l.productId);
          if (!p) return null;
          return { product_id: p.id, quantity: l.quantity };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      const result = await discountApi.validate({
        code: discountCode,
        items,
        subtotal_ht: subtotalHT,
      });

      if (result.valid && result.discount) {
        setAppliedDiscount(result.discount);
        localStorage.setItem(DISCOUNT_KEY, JSON.stringify({ code: discountCode, discount: result.discount }));
        toast({
          title: "Code promo appliqué",
          description: `-${result.discount.amount_ht} € HT de réduction`,
        });
      } else {
        setAppliedDiscount(null);
        localStorage.removeItem(DISCOUNT_KEY);
        toast({
          title: "Code promo invalide",
          description: result.message || "Ce code promo n'est pas valide.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setAppliedDiscount(null);
      localStorage.removeItem(DISCOUNT_KEY);
      toast({
        title: "Erreur",
        description: err.response?.data?.message || "Impossible de valider ce code promo.",
        variant: "destructive",
      });
    } finally {
      setValidatingDiscount(false);
    }
  }, [discountCode, lines, subtotalHT, getProduct]);

  const clearDiscount = () => {
    setDiscountCode("");
    setAppliedDiscount(null);
    setAutoDiscountId(null);
    localStorage.removeItem(DISCOUNT_KEY);
  };

  return (
    <Ctx.Provider
      value={{
        lines,
        itemCount,
        addItem,
        updateQty,
        removeItem,
        clear,
        subtotalHT,
        vat,
        totalTTC,
        getProduct,
        discountCode,
        setDiscountCode,
        appliedDiscount,
        discountHt,
        autoDiscountId,
        validateDiscount,
        clearDiscount,
        validatingDiscount,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};
