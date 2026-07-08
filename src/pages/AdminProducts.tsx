import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, Package, RefreshCw, Plus, Trash2, Save, Tag, FolderOpen, X, ChevronDown, ChevronUp,
} from "lucide-react";
import { Product, Category, PromoCode, ShippingZone } from "@/types";
import { getAdminToken, clearAdminToken, isAdminAuthenticated } from "@/lib/adminAuth";
import { useProducts } from "@/hooks/useProducts";

/* ─── constants ─────────────────────────────────────────────────────────── */
const SHIPPING_ZONE_NAMES = [
  "Torre Futura",
  "75 Av. Norte",
  "Salvador del Mundo",
  "Galerías Escalón",
  "Redondel Masferrer",
  "Redondel Luceiro",
];

type Tab = "products" | "discounts" | "categories";

/* ─── helpers ────────────────────────────────────────────────────────────── */
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
  };
}

const labelCls =
  "block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1";
const inputCls =
  "w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none";
const sectionTitle = "font-orbitron font-black text-base text-white";

/* ─── blank form shapes ──────────────────────────────────────────────────── */
const blankProduct = (): Partial<Product> & {
  shippingZones: ShippingZone[];
  promoCode: string;
  featuresText: string;
} => ({
  name: "",
  shortName: "",
  price: 0,
  originalPrice: undefined,
  discount: undefined,
  stock: 0,
  image: "",
  badge: "",
  description: "",
  featuresText: "",
  available: true,
  category: "",
  shippingZones: [],
  promoCode: "",
});

const blankPromo = () => ({
  code: "",
  label: "",
  discountPercent: "" as string | number,
  discountFixed: "" as string | number,
  description: "",
});

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function AdminProducts() {
  const navigate = useNavigate();
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const [tab, setTab] = useState<Tab>("products");

  /* --- categories state --- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catMsg, setCatMsg] = useState("");
  const [showCatForm, setShowCatForm] = useState(false);

  /* --- promo codes state --- */
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [newPromo, setNewPromo] = useState(blankPromo());
  const [promoMsg, setPromoMsg] = useState("");
  const [showPromoForm, setShowPromoForm] = useState(false);

  /* --- product create state --- */
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(blankProduct());
  const [createMsg, setCreateMsg] = useState("");
  const [creating, setCreating] = useState(false);

  /* --- product edit state (existing) --- */
  const [editing, setEditing] = useState<Record<string, Partial<Product>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* --- delete confirm --- */
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  /* ── auth guard ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isAdminAuthenticated()) navigate("/gt-acceso");
  }, [navigate]);

  /* ── fetch helpers ──────────────────────────────────────────────────── */
  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (res.ok) setCategories((await res.json()).categories || []);
    } finally {
      setCatLoading(false);
    }
  }, []);

  const fetchPromoCodes = useCallback(async () => {
    setPromoLoading(true);
    try {
      const res = await fetch("/api/promo-codes", { headers: authHeaders() });
      if (res.status === 401) { clearAdminToken(); navigate("/gt-acceso"); return; }
      if (res.ok) setPromoCodes((await res.json()).promoCodes || []);
    } finally {
      setPromoLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCategories();
    fetchPromoCodes();
  }, [fetchCategories, fetchPromoCodes]);

  /* ── logout ─────────────────────────────────────────────────────────── */
  const handleLogout = () => {
    clearAdminToken();
    navigate("/gt-acceso");
  };

  /* ══════════════════════════════════════════════════════════════════════
     PRODUCT HANDLERS
  ══════════════════════════════════════════════════════════════════════ */
  const getVal = (p: Product, field: keyof Product) => {
    const draft = editing[p.id];
    if (draft && field in draft) return (draft as Record<string, unknown>)[field];
    return p[field];
  };
  const setField = (id: string, field: keyof Product, val: unknown) =>
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));

  const handleSaveExisting = async (p: Product) => {
    const draft = editing[p.id];
    if (!draft) return;
    setSaving(p.id);
    setStatusMsg((prev) => ({ ...prev, [p.id]: "" }));
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(p.id)}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(draft),
      });
      if (res.status === 401) { clearAdminToken(); navigate("/gt-acceso"); return; }
      if (!res.ok) throw new Error();
      await refreshProducts();
      setEditing((prev) => { const n = { ...prev }; delete n[p.id]; return n; });
      setStatusMsg((prev) => ({ ...prev, [p.id]: "✅ Guardado" }));
      setTimeout(() => setStatusMsg((prev) => ({ ...prev, [p.id]: "" })), 3000);
    } catch {
      setStatusMsg((prev) => ({ ...prev, [p.id]: "❌ Error al guardar" }));
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) { clearAdminToken(); navigate("/gt-acceso"); return; }
      if (res.ok) { await refreshProducts(); setConfirmDelete(null); }
    } catch {}
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name?.trim()) { setCreateMsg("❌ El nombre es requerido"); return; }
    setCreating(true);
    setCreateMsg("");
    try {
      const features = (newProduct as any).featuresText
        ? (newProduct as any).featuresText.split("\n").map((s: string) => s.trim()).filter(Boolean)
        : [];
      const body = { ...newProduct, features };
      delete (body as any).featuresText;

      const res = await fetch("/api/products", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      if (res.status === 401) { clearAdminToken(); navigate("/gt-acceso"); return; }
      if (!res.ok) throw new Error();
      await refreshProducts();
      setNewProduct(blankProduct());
      setShowCreateProduct(false);
      setCreateMsg("✅ Producto creado");
      setTimeout(() => setCreateMsg(""), 3000);
    } catch {
      setCreateMsg("❌ Error al crear producto");
    } finally {
      setCreating(false);
    }
  };

  /* shipping zone toggles for new product */
  const toggleZone = (zoneName: string, cost: number) => {
    setNewProduct((prev) => {
      const zones = prev.shippingZones || [];
      const exists = zones.find((z) => z.name === zoneName);
      return {
        ...prev,
        shippingZones: exists
          ? zones.filter((z) => z.name !== zoneName)
          : [...zones, { name: zoneName, cost }],
      };
    });
  };
  const updateZoneCost = (zoneName: string, cost: number) => {
    setNewProduct((prev) => ({
      ...prev,
      shippingZones: (prev.shippingZones || []).map((z) =>
        z.name === zoneName ? { ...z, cost } : z
      ),
    }));
  };

  /* ══════════════════════════════════════════════════════════════════════
     CATEGORY HANDLERS
  ══════════════════════════════════════════════════════════════════════ */
  const handleCreateCategory = async () => {
    if (!newCatName.trim()) { setCatMsg("❌ Ingresa un nombre"); return; }
    setCatMsg("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: newCatName }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { category } = await res.json();
      setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCatName("");
      setShowCatForm(false);
      setCatMsg("✅ Categoría creada");
      setTimeout(() => setCatMsg(""), 3000);
    } catch (e: any) {
      setCatMsg(`❌ ${e.message || "Error"}`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {}
  };

  /* ══════════════════════════════════════════════════════════════════════
     PROMO CODE HANDLERS
  ══════════════════════════════════════════════════════════════════════ */
  const handleCreatePromo = async () => {
    if (!newPromo.code.trim()) { setPromoMsg("❌ El código es requerido"); return; }
    setPromoMsg("");
    try {
      const res = await fetch("/api/promo-codes", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          ...newPromo,
          discountPercent: newPromo.discountPercent !== "" ? Number(newPromo.discountPercent) : null,
          discountFixed: newPromo.discountFixed !== "" ? Number(newPromo.discountFixed) : null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const { promoCode } = await res.json();
      setPromoCodes((prev) => [...prev, promoCode].sort((a, b) => a.code.localeCompare(b.code)));
      setNewPromo(blankPromo());
      setShowPromoForm(false);
      setPromoMsg("✅ Código creado");
      setTimeout(() => setPromoMsg(""), 3000);
    } catch (e: any) {
      setPromoMsg(`❌ ${e.message || "Error"}`);
    }
  };

  const handleDeletePromo = async (id: string) => {
    try {
      const res = await fetch(`/api/promo-codes/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) setPromoCodes((prev) => prev.filter((p) => p.id !== id));
    } catch {}
  };

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="pt-24 min-h-screen section-grid">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-neon-cyan" />
            <h1 className="font-orbitron font-black text-2xl text-white">
              Panel de <span className="text-neon-cyan">Administración</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { refreshProducts(); fetchCategories(); fetchPromoCodes(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neon-cyan/20 text-neon-cyan/70 hover:border-neon-cyan/60 hover:text-neon-cyan text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Actualizar
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/20 text-red-400/70 hover:border-red-500/60 hover:text-red-400 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </div>
        </div>

        {/* ── tabs ───────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-8 border-b border-white/10">
          {(
            [
              { key: "products", label: "Productos", icon: Package },
              { key: "discounts", label: "Descuentos", icon: Tag },
              { key: "categories", label: "Categorías", icon: FolderOpen },
            ] as { key: Tab; label: string; icon: React.ElementType }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-t-lg transition-all border-b-2 -mb-px ${
                tab === key
                  ? "border-neon-cyan text-neon-cyan bg-neon-cyan/5"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB: PRODUCTOS
        ══════════════════════════════════════════════════════════════ */}
        {tab === "products" && (
          <div>
            {/* action bar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/40 text-sm">{products.length} productos en total</p>
              <button
                onClick={() => setShowCreateProduct((v) => !v)}
                className="flex items-center gap-1.5 btn-neon px-4 py-2 text-xs"
              >
                {showCreateProduct ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCreateProduct ? "Cancelar" : "Nuevo Producto"}
              </button>
            </div>

            {createMsg && (
              <p className={`text-sm mb-4 ${createMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
                {createMsg}
              </p>
            )}

            {/* ── create product form ────────────────────────────────── */}
            {showCreateProduct && (
              <div className="card-tech p-6 mb-6 border border-neon-cyan/30">
                <h2 className={`${sectionTitle} mb-5`}>Nuevo producto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="sm:col-span-2">
                    <label className={labelCls}>Nombre completo *</label>
                    <input className={inputCls} value={newProduct.name || ""} onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Nombre corto</label>
                    <input className={inputCls} value={newProduct.shortName || ""} onChange={(e) => setNewProduct((p) => ({ ...p, shortName: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Categoría</label>
                    <select className={inputCls} value={newProduct.category || ""} onChange={(e) => setNewProduct((p) => ({ ...p, category: e.target.value }))}>
                      <option value="">— Sin categoría —</option>
                      {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Precio ($) *</label>
                    <input type="number" step="0.01" className={inputCls} value={newProduct.price || 0} onChange={(e) => setNewProduct((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Precio original ($)</label>
                    <input type="number" step="0.01" placeholder="Opcional" className={inputCls} value={newProduct.originalPrice || ""} onChange={(e) => setNewProduct((p) => ({ ...p, originalPrice: parseFloat(e.target.value) || undefined }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Descuento (%)</label>
                    <input type="number" placeholder="Ej: 15" className={inputCls} value={newProduct.discount || ""} onChange={(e) => setNewProduct((p) => ({ ...p, discount: parseInt(e.target.value, 10) || undefined }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Stock</label>
                    <input type="number" className={inputCls} value={newProduct.stock || 0} onChange={(e) => setNewProduct((p) => ({ ...p, stock: parseInt(e.target.value, 10) || 0 }))} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls}>URL de imagen</label>
                    <input type="url" placeholder="https://..." className={inputCls} value={newProduct.image || ""} onChange={(e) => setNewProduct((p) => ({ ...p, image: e.target.value }))} />
                  </div>
                  {newProduct.image && (
                    <div className="sm:col-span-2">
                      <img src={newProduct.image} alt="preview" className="w-20 h-20 object-contain rounded-xl bg-dark-700 border border-neon-cyan/10" />
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Badge (texto)</label>
                    <input placeholder="🔥 MÁS VENDIDO" className={inputCls} value={newProduct.badge || ""} onChange={(e) => setNewProduct((p) => ({ ...p, badge: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Código de descuento aplicable</label>
                    <select className={inputCls} value={newProduct.promoCode || ""} onChange={(e) => setNewProduct((p) => ({ ...p, promoCode: e.target.value || "" }))}>
                      <option value="">— Ninguno —</option>
                      {promoCodes.map((pc) => <option key={pc.id} value={pc.code}>{pc.code} — {pc.label}</option>)}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls}>Descripción</label>
                    <textarea rows={2} className={`${inputCls} resize-none`} value={newProduct.description || ""} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls}>Características (una por línea)</label>
                    <textarea rows={3} placeholder={"USB-C 3.2 Gen 2\n10 Gbps\nCable incluido"} className={`${inputCls} resize-none`} value={(newProduct as any).featuresText || ""} onChange={(e) => setNewProduct((p) => ({ ...p, featuresText: e.target.value } as any))} />
                  </div>

                  {/* shipping zones */}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Zonas de envío</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {SHIPPING_ZONE_NAMES.map((zoneName) => {
                        const zone = (newProduct.shippingZones || []).find((z) => z.name === zoneName);
                        return (
                          <div key={zoneName} className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${zone ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-white/10"}`}>
                            <input
                              type="checkbox"
                              id={`zone-${zoneName}`}
                              checked={!!zone}
                              onChange={() => toggleZone(zoneName, zone?.cost ?? 2)}
                              className="w-4 h-4 accent-cyan-400 shrink-0"
                            />
                            <label htmlFor={`zone-${zoneName}`} className="text-white/70 text-xs flex-1 cursor-pointer">{zoneName}</label>
                            {zone && (
                              <div className="flex items-center gap-1">
                                <span className="text-white/30 text-xs">$</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  value={zone.cost}
                                  onChange={(e) => updateZoneCost(zoneName, parseFloat(e.target.value) || 0)}
                                  className="w-14 bg-dark-700 border border-neon-cyan/20 rounded px-2 py-0.5 text-white text-xs outline-none"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="new-avail" checked={newProduct.available !== false} onChange={(e) => setNewProduct((p) => ({ ...p, available: e.target.checked }))} className="w-4 h-4 accent-cyan-400" />
                    <label htmlFor="new-avail" className="text-white/60 text-xs font-semibold">Disponible</label>
                  </div>

                  <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                    <button onClick={() => { setShowCreateProduct(false); setNewProduct(blankProduct()); }} className="px-4 py-2 text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-xl transition-all">
                      Cancelar
                    </button>
                    <button onClick={handleCreateProduct} disabled={creating} className="flex items-center gap-1.5 btn-neon px-5 py-2 text-xs disabled:opacity-50">
                      <Save className="w-3.5 h-3.5" />
                      {creating ? "Creando..." : "Crear producto"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── existing products list ─────────────────────────────── */}
            {productsLoading && products.length === 0 ? (
              <p className="text-white/40 text-sm">Cargando productos...</p>
            ) : (
              <div className="space-y-3">
                {products.map((product) => {
                  const hasChanges = !!editing[product.id];
                  const isExpanded = expandedId === product.id;
                  return (
                    <div key={product.id} className="card-tech border border-white/5">
                      {/* collapsed row */}
                      <div
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-white/[0.02] transition-all"
                        onClick={() => setExpandedId(isExpanded ? null : product.id)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-contain rounded-lg bg-dark-700 border border-neon-cyan/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                          <p className="text-white/40 text-xs truncate">{product.category || "Sin categoría"} · ${product.price.toFixed(2)} · Stock: {product.stock}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {hasChanges && <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />}
                          {product.available
                            ? <span className="text-[10px] font-bold text-green-400 border border-green-400/20 px-2 py-0.5 rounded-full">Disponible</span>
                            : <span className="text-[10px] font-bold text-red-400/60 border border-red-400/20 px-2 py-0.5 rounded-full">Inactivo</span>
                          }
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                        </div>
                      </div>

                      {/* expanded edit form */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-white/5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                            <div className="sm:col-span-2">
                              <label className={labelCls}>Nombre</label>
                              <input className={inputCls} value={getVal(product, "name") as string} onChange={(e) => setField(product.id, "name", e.target.value)} />
                            </div>
                            <div>
                              <label className={labelCls}>Precio ($)</label>
                              <input type="number" step="0.01" className={inputCls} value={getVal(product, "price") as number} onChange={(e) => setField(product.id, "price", parseFloat(e.target.value))} />
                            </div>
                            <div>
                              <label className={labelCls}>Precio original ($)</label>
                              <input type="number" step="0.01" className={inputCls} value={(getVal(product, "originalPrice") as number) || ""} onChange={(e) => setField(product.id, "originalPrice", parseFloat(e.target.value) || undefined)} />
                            </div>
                            <div>
                              <label className={labelCls}>Descuento (%)</label>
                              <input type="number" className={inputCls} value={(getVal(product, "discount") as number) || 0} onChange={(e) => setField(product.id, "discount", parseInt(e.target.value, 10) || 0)} />
                            </div>
                            <div>
                              <label className={labelCls}>Stock</label>
                              <input type="number" className={inputCls} value={getVal(product, "stock") as number} onChange={(e) => setField(product.id, "stock", parseInt(e.target.value, 10))} />
                            </div>
                            <div>
                              <label className={labelCls}>Categoría</label>
                              <select className={inputCls} value={getVal(product, "category") as string} onChange={(e) => setField(product.id, "category", e.target.value)}>
                                <option value="">— Sin categoría —</option>
                                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>URL de imagen</label>
                              <input type="url" className={inputCls} value={getVal(product, "image") as string} onChange={(e) => setField(product.id, "image", e.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                              <label className={labelCls}>Descripción</label>
                              <textarea rows={2} className={`${inputCls} resize-none`} value={getVal(product, "description") as string} onChange={(e) => setField(product.id, "description", e.target.value)} />
                            </div>
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id={`avail-${product.id}`} checked={getVal(product, "available") as boolean} onChange={(e) => setField(product.id, "available", e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                              <label htmlFor={`avail-${product.id}`} className="text-white/60 text-xs font-semibold">Disponible</label>
                            </div>

                            <div className="sm:col-span-2 flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2">
                                {/* delete */}
                                {confirmDelete === product.id ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-red-400 text-xs">¿Eliminar?</span>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-xs font-bold text-red-400 border border-red-400/30 px-2 py-1 rounded-lg hover:bg-red-400/10 transition-all">Sí</button>
                                    <button onClick={() => setConfirmDelete(null)} className="text-xs font-bold text-white/40 border border-white/10 px-2 py-1 rounded-lg hover:bg-white/5 transition-all">No</button>
                                  </div>
                                ) : (
                                  <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(product.id); }} className="flex items-center gap-1 text-xs font-bold text-red-400/60 hover:text-red-400 border border-red-400/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all">
                                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                                  </button>
                                )}
                                {statusMsg[product.id] && (
                                  <span className={`text-xs font-semibold ${statusMsg[product.id].startsWith("✅") ? "text-green-400" : "text-red-400"}`}>
                                    {statusMsg[product.id]}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleSaveExisting(product)}
                                disabled={!hasChanges || saving === product.id}
                                className="flex items-center gap-1.5 btn-neon px-4 py-2 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Save className="w-3.5 h-3.5" />
                                {saving === product.id ? "Guardando..." : "Guardar cambios"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: DESCUENTOS
        ══════════════════════════════════════════════════════════════ */}
        {tab === "discounts" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/40 text-sm">{promoCodes.length} códigos activos</p>
              <button
                onClick={() => setShowPromoForm((v) => !v)}
                className="flex items-center gap-1.5 btn-neon px-4 py-2 text-xs"
              >
                {showPromoForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showPromoForm ? "Cancelar" : "Nuevo Código"}
              </button>
            </div>

            {promoMsg && (
              <p className={`text-sm mb-4 ${promoMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{promoMsg}</p>
            )}

            {/* create promo form */}
            {showPromoForm && (
              <div className="card-tech p-6 mb-6 border border-neon-cyan/30">
                <h2 className={`${sectionTitle} mb-5`}>Nuevo código de descuento</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Código *</label>
                    <input placeholder="REGALO" className={inputCls} value={newPromo.code} onChange={(e) => setNewPromo((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Etiqueta</label>
                    <input placeholder="Descuento de regalo" className={inputCls} value={newPromo.label} onChange={(e) => setNewPromo((p) => ({ ...p, label: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>% Descuento</label>
                    <input type="number" placeholder="Ej: 10" className={inputCls} value={newPromo.discountPercent} onChange={(e) => setNewPromo((p) => ({ ...p, discountPercent: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>$ Descuento fijo</label>
                    <input type="number" step="0.01" placeholder="Ej: 5.00" className={inputCls} value={newPromo.discountFixed} onChange={(e) => setNewPromo((p) => ({ ...p, discountFixed: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Descripción</label>
                    <input placeholder="Descripción visible al cliente" className={inputCls} value={newPromo.description} onChange={(e) => setNewPromo((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                    <button onClick={() => { setShowPromoForm(false); setNewPromo(blankPromo()); }} className="px-4 py-2 text-xs text-white/40 hover:text-white/70 border border-white/10 hover:border-white/20 rounded-xl transition-all">
                      Cancelar
                    </button>
                    <button onClick={handleCreatePromo} className="flex items-center gap-1.5 btn-neon px-5 py-2 text-xs">
                      <Save className="w-3.5 h-3.5" /> Crear código
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* promo codes list */}
            {promoLoading ? (
              <p className="text-white/40 text-sm">Cargando códigos...</p>
            ) : promoCodes.length === 0 ? (
              <div className="card-tech p-8 text-center">
                <Tag className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No hay códigos de descuento.</p>
                <p className="text-white/20 text-xs mt-1">Crea uno con el botón de arriba.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {promoCodes.map((pc) => (
                  <div key={pc.id} className="card-tech p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-orbitron font-black text-neon-cyan text-sm">{pc.code}</span>
                        {pc.label && <span className="text-white/50 text-xs">{pc.label}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {pc.discountPercent != null && (
                          <span className="text-xs text-green-400 font-bold">{pc.discountPercent}% off</span>
                        )}
                        {pc.discountFixed != null && (
                          <span className="text-xs text-green-400 font-bold">${pc.discountFixed.toFixed(2)} off</span>
                        )}
                        {pc.description && (
                          <span className="text-white/30 text-xs">{pc.description}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePromo(pc.id)}
                      className="shrink-0 flex items-center gap-1 text-xs text-red-400/60 hover:text-red-400 border border-red-400/10 hover:border-red-400/30 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB: CATEGORÍAS
        ══════════════════════════════════════════════════════════════ */}
        {tab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-white/40 text-sm">{categories.length} categorías</p>
              <button
                onClick={() => setShowCatForm((v) => !v)}
                className="flex items-center gap-1.5 btn-neon px-4 py-2 text-xs"
              >
                {showCatForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {showCatForm ? "Cancelar" : "Nueva Categoría"}
              </button>
            </div>

            {catMsg && (
              <p className={`text-sm mb-4 ${catMsg.startsWith("✅") ? "text-green-400" : "text-red-400"}`}>{catMsg}</p>
            )}

            {/* create category form */}
            {showCatForm && (
              <div className="card-tech p-5 mb-6 border border-neon-cyan/30">
                <h2 className={`${sectionTitle} mb-4`}>Nueva categoría</h2>
                <div className="flex gap-3">
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="Ej: Cables, Adaptadores, Cargadores..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                  />
                  <button onClick={handleCreateCategory} className="flex items-center gap-1.5 btn-neon px-4 py-2 text-xs shrink-0">
                    <Plus className="w-3.5 h-3.5" /> Crear
                  </button>
                </div>
              </div>
            )}

            {/* categories list */}
            {catLoading ? (
              <p className="text-white/40 text-sm">Cargando categorías...</p>
            ) : categories.length === 0 ? (
              <div className="card-tech p-8 text-center">
                <FolderOpen className="w-8 h-8 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No hay categorías creadas.</p>
                <p className="text-white/20 text-xs mt-1">Crea la primera con el botón de arriba.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const productCount = products.filter((p) => p.category === cat.name).length;
                  return (
                    <div key={cat.id} className="card-tech p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-white text-sm font-semibold">{cat.name}</p>
                        <p className="text-white/30 text-xs mt-0.5">{productCount} producto{productCount !== 1 ? "s" : ""}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="shrink-0 flex items-center gap-1 text-xs text-red-400/50 hover:text-red-400 border border-red-400/10 hover:border-red-400/30 px-2.5 py-1.5 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
