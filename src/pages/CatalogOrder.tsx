import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import ProSidebar from "@/components/ProSidebar";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LanguageContext";
import { formatEUR } from "@/types/product";
import { productApi, type Product } from "@/services/productApi";
import { Search, ShoppingCart, Check, Minus, Plus, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Selection {
  productId: string;
  quantity: number;
}

const CatalogOrder = () => {
  const { lines, addItem, clear } = useCart();
  const { t } = useLang();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selections, setSelections] = useState<Record<string, number>>({});

  useEffect(() => {
    setLoading(true);
    productApi.getAll({ page, per_page: 50, search: search || undefined }).then((res) => {
      const data = res.data ?? res.products ?? [];
      setProducts(data);
      setTotalPages(res.last_page ?? 1);
    }).catch(() => {
      setProducts([]);
    }).finally(() => setLoading(false));
  }, [page, search]);

  const handleSelect = (product: Product) => {
    setSelections((prev) => {
      if (prev[product.id]) {
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      return { ...prev, [product.id]: product.moq };
    });
  };

  const handleQtyChange = (productId: string, qty: number) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const clamped = Math.max(p.moq, qty);
    if (clamped <= 0) {
      setSelections((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      return;
    }
    setSelections((prev) => ({ ...prev, [productId]: clamped }));
  };

  const filtered = products.filter(
    (p) =>
      p.active !== false &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.reference?.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedCount = Object.keys(selections).length;
  const selectedTotal = Object.entries(selections).reduce((sum, [id, qty]) => {
    const p = products.find((x) => x.id === id);
    return sum + (p ? (p.salePriceHT ?? p.priceHT) * qty : 0);
  }, 0);

  const handleSubmit = () => {
    const entries = Object.entries(selections);
    if (entries.length === 0) {
      toast({ title: t("catalog_order.no_selection"), variant: "destructive" });
      return;
    }

    clear();

    for (const [productId, qty] of entries) {
      addItem(productId, qty);
    }

    navigate("/checkout");
  };

  return (
    <Layout>
      <PageHeader
        title={t("catalog_order.title")}
        subtitle={t("catalog_order.subtitle")}
      />

      <section className="container py-8">
        <div className="flex gap-8">
          <ProSidebar />

          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bordeaux/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder={t("catalog_order.search_placeholder")}
                  className="w-full pl-10 pr-4 py-2.5 border border-border bg-cream text-sm focus:outline-none focus:ring-1 focus:ring-bordeaux"
                />
              </div>
              {selectedCount > 0 && (
                <button
                  onClick={() => setSelections({})}
                  className="text-xs text-bordeaux/50 hover:text-destructive tracking-luxe uppercase"
                >
                  {t("catalog_order.clear")}
                </button>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-cream animate-pulse rounded" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-bordeaux/60">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p>{t("catalog_order.no_results")}</p>
              </div>
            ) : (
              <>
                <div className="hidden md:block bg-ivory border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-cream text-xs tracking-luxe uppercase text-bordeaux/60">
                        <th className="w-10 p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCount === filtered.length && filtered.length > 0}
                            onChange={() => {
                              if (selectedCount === filtered.length) {
                                setSelections({});
                              } else {
                                const all: Record<string, number> = {};
                                filtered.forEach((p) => { all[p.id] = p.moq; });
                                setSelections(all);
                              }
                            }}
                            className="accent-bordeaux"
                          />
                        </th>
                        <th className="p-3 text-left w-16">{t("catalog_order.photo")}</th>
                        <th className="p-3 text-left">{t("catalog_order.product")}</th>
                        <th className="p-3 text-left">{t("catalog_order.reference")}</th>
                        <th className="p-3 text-right">{t("catalog_order.stock")}</th>
                        <th className="p-3 text-right">{t("catalog_order.price")}</th>
                        <th className="p-3 text-center w-36">{t("catalog_order.quantity")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => {
                        const selected = selections[p.id] != null;
                        const qty = selections[p.id] ?? 0;
                        const price = p.salePriceHT ?? p.priceHT;
                        return (
                          <tr
                            key={p.id}
                            className={`border-b border-border last:border-0 transition-smooth ${
                              selected ? "bg-gold/5" : "hover:bg-cream"
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => handleSelect(p)}
                                className="accent-bordeaux"
                              />
                            </td>
                            <td className="p-3">
                              <img
                                src={p.images?.[0] || "/placeholder.svg"}
                                alt={p.name}
                                className="w-12 h-12 object-cover bg-cream rounded"
                              />
                            </td>
                            <td className="p-3">
                              <p className="font-medium text-bordeaux">{p.name}</p>
                              <p className="text-xs text-bordeaux/50">{p.material}{p.finish ? ` - ${p.finish}` : ""}</p>
                            </td>
                            <td className="p-3 text-bordeaux/70 text-xs">{p.reference}</td>
                            <td className="p-3 text-right">
                              <span className={`text-xs font-medium ${p.stock <= 0 ? "text-red-500" : p.stock < 10 ? "text-amber-600" : "text-green-600"}`}>
                                {p.stock <= 0 ? t("catalog_order.out_of_stock") : p.stock}
                              </span>
                            </td>
                            <td className="p-3 text-right font-medium text-bordeaux whitespace-nowrap">
                              {p.salePriceHT ? (
                                <>
                                  <span className="line-through text-bordeaux/40 text-xs mr-1">{formatEUR(p.priceHT)}</span>
                                  {formatEUR(p.salePriceHT)}
                                </>
                              ) : (
                                formatEUR(p.priceHT)
                              )}
                              <span className="text-[10px] text-bordeaux/40 ml-0.5">HT</span>
                            </td>
                            <td className="p-3">
                              {selected ? (
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => handleQtyChange(p.id, qty - p.packSize)}
                                    className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-cream"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min={p.moq}
                                    value={qty}
                                    onChange={(e) => handleQtyChange(p.id, parseInt(e.target.value) || p.moq)}
                                    className="w-16 text-center border border-border bg-cream py-1 text-sm focus:outline-none focus:ring-1 focus:ring-bordeaux [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <button
                                    onClick={() => handleQtyChange(p.id, qty + p.packSize)}
                                    className="w-7 h-7 flex items-center justify-center border border-border rounded hover:bg-cream"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-bordeaux/40 block text-center">
                                  {t("catalog_order.select")}
                                </span>
                              )}
                              {selected && (
                                <p className="text-[10px] text-bordeaux/40 text-center mt-1">
                                  {p.moq > 1 && `${t("catalog_order.moq")} ${p.moq}`}{p.packSize > 1 && p.moq > 1 ? " · " : ""}{p.packSize > 1 && `${t("catalog_order.by")} ${p.packSize}`}
                                </p>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {filtered.map((p) => {
                    const selected = selections[p.id] != null;
                    const qty = selections[p.id] ?? 0;
                    const price = p.salePriceHT ?? p.priceHT;
                    return (
                      <div
                        key={p.id}
                        className={`bg-ivory border p-3 space-y-3 transition-smooth ${
                          selected ? "border-gold" : "border-border"
                        }`}
                      >
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => handleSelect(p)}
                            className="accent-bordeaux mt-1"
                          />
                          <div className="flex gap-3 flex-1 min-w-0">
                            <img src={p.images?.[0] || "/placeholder.svg"} alt={p.name} className="w-16 h-16 object-cover bg-cream rounded shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-bordeaux text-sm">{p.name}</p>
                              <p className="text-xs text-bordeaux/50 truncate">{p.reference}</p>
                              <p className="font-medium text-bordeaux mt-1">
                                {p.salePriceHT ? (
                                  <>
                                    <span className="line-through text-bordeaux/40 text-xs mr-1">{formatEUR(p.priceHT)}</span>
                                    {formatEUR(p.salePriceHT)}
                                  </>
                                ) : (
                                  formatEUR(p.priceHT)
                                )}
                                <span className="text-[10px] text-bordeaux/40 ml-0.5">HT</span>
                              </p>
                            </div>
                          </div>
                        </label>
                        {selected && (
                          <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
                            <button
                              onClick={() => handleQtyChange(p.id, qty - p.packSize)}
                              className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-cream"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input
                              type="number"
                              min={p.moq}
                              value={qty}
                              onChange={(e) => handleQtyChange(p.id, parseInt(e.target.value) || p.moq)}
                              className="w-16 text-center border border-border bg-cream py-1 text-sm focus:outline-none focus:ring-1 focus:ring-bordeaux [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => handleQtyChange(p.id, qty + p.packSize)}
                              className="w-8 h-8 flex items-center justify-center border border-border rounded hover:bg-cream"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="text-[10px] text-bordeaux/40 ml-auto">{t("catalog_order.stock")}: {p.stock}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 pt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 text-xs rounded transition-smooth ${
                          page === p
                            ? "bg-bordeaux text-ivory"
                            : "bg-ivory border border-border text-bordeaux/70 hover:bg-cream"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {selectedCount > 0 && (
        <div className="sticky bottom-0 bg-ivory border-t border-border shadow-lg z-40">
          <div className="container flex items-center justify-between py-4">
            <div className="text-sm text-bordeaux/70">
              <span className="font-medium text-bordeaux">{selectedCount}</span> {t("catalog_order.products_selected")}
              <span className="mx-2">·</span>
              <span className="font-medium text-bordeaux">{formatEUR(selectedTotal)} HT</span>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-bordeaux text-ivory px-6 py-3 text-xs tracking-luxe uppercase hover:bg-gold transition-smooth"
            >
              <ShoppingCart className="w-4 h-4" />
              {t("catalog_order.validate")}
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CatalogOrder;
