import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { Product } from "@/data/products";
import { useAdmin } from "@/context/AdminContext";

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
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ml_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { products } = useAdmin();
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

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

  const clear = () => setLines([]);

  const { itemCount, subtotalHT, vat, totalTTC } = useMemo(() => {
    let count = 0;
    let sub = 0;
    lines.forEach((l) => {
      const p = getProduct(l.productId);
      if (!p) return;
      count += l.quantity;
      sub += p.priceHT * l.quantity;
    });
    const v = +(sub * 0.2).toFixed(2);
    return { itemCount: count, subtotalHT: +sub.toFixed(2), vat: v, totalTTC: +(sub + v).toFixed(2) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, products]);

  return (
    <Ctx.Provider
      value={{ lines, itemCount, addItem, updateQty, removeItem, clear, subtotalHT, vat, totalTTC, getProduct }}
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
