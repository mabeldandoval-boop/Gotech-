import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save, Package, Image as ImageIcon, RefreshCw } from "lucide-react";
import { Product } from "@/types";
import { getAdminToken, clearAdminToken, isAdminAuthenticated } from "@/lib/adminAuth";
import { useProducts } from "@/hooks/useProducts";

export default function AdminProducts() {
  const navigate = useNavigate();
  const { products, loading, refreshProducts } = useProducts();
  const [editing, setEditing] = useState<Record<string, Partial<Product>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate("/gt-acceso");
    }
  }, [navigate]);

  const getValue = (p: Product, field: keyof Product) => {
    const draft = editing[p.id];
    if (draft && field in draft) return (draft as Record<string, unknown>)[field];
    return p[field];
  };

  const setField = (id: string, field: keyof Product, value: unknown) => {
    setEditing((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setField(id, "image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (product: Product) => {
    const draft = editing[product.id];
    if (!draft) return;
    setSaving(product.id);
    setStatusMsg((prev) => ({ ...prev, [product.id]: "" }));
    try {
      const token = getAdminToken();
      const res = await fetch(`/api/products/${encodeURIComponent(product.id)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      if (res.status === 401) {
        clearAdminToken();
        navigate("/gt-acceso");
        return;
      }
      if (!res.ok) throw new Error("Error al guardar");
      await refreshProducts();
      setEditing((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
      setStatusMsg((prev) => ({ ...prev, [product.id]: "✅ Guardado" }));
      setTimeout(() => setStatusMsg((prev) => ({ ...prev, [product.id]: "" })), 3000);
    } catch {
      setStatusMsg((prev) => ({ ...prev, [product.id]: "❌ Error al guardar" }));
    } finally {
      setSaving(null);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    navigate("/gt-acceso");
  };

  return (
    <div className="pt-24 min-h-screen section-grid">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-neon-cyan" />
            <h1 className="font-orbitron font-black text-2xl text-white">
              Panel de <span className="text-neon-cyan">Productos</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refreshProducts()}
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

        {loading && products.length === 0 ? (
          <p className="text-white/40 text-sm">Cargando productos...</p>
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const hasChanges = !!editing[product.id];
              return (
                <div key={product.id} className="card-tech p-5 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-5">
                  {/* Image */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-28 h-28 rounded-xl bg-dark-700 border border-neon-cyan/10 flex items-center justify-center overflow-hidden">
                      <img
                        src={getValue(product, "image") as string}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <label className="flex items-center gap-1.5 text-[11px] text-neon-cyan/70 hover:text-neon-cyan cursor-pointer">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Cambiar imagen
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(product.id, file);
                        }}
                      />
                    </label>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Nombre</label>
                      <input
                        type="text"
                        value={getValue(product, "name") as string}
                        onChange={(e) => setField(product.id, "name", e.target.value)}
                        className="w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Precio ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={getValue(product, "price") as number}
                        onChange={(e) => setField(product.id, "price", parseFloat(e.target.value))}
                        className="w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Stock</label>
                      <input
                        type="number"
                        value={getValue(product, "stock") as number}
                        onChange={(e) => setField(product.id, "stock", parseInt(e.target.value, 10))}
                        className="w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Descuento (%)</label>
                      <input
                        type="number"
                        value={(getValue(product, "discount") as number) || 0}
                        onChange={(e) => setField(product.id, "discount", parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Categoría</label>
                      <input
                        type="text"
                        value={getValue(product, "category") as string}
                        onChange={(e) => setField(product.id, "category", e.target.value)}
                        className="w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">Descripción</label>
                      <textarea
                        value={getValue(product, "description") as string}
                        onChange={(e) => setField(product.id, "description", e.target.value)}
                        rows={2}
                        className="w-full bg-dark-700 border border-neon-cyan/10 focus:border-neon-cyan/50 rounded-lg px-3 py-2 text-white text-sm outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`avail-${product.id}`}
                        checked={getValue(product, "available") as boolean}
                        onChange={(e) => setField(product.id, "available", e.target.checked)}
                        className="w-4 h-4 accent-cyan-400"
                      />
                      <label htmlFor={`avail-${product.id}`} className="text-white/60 text-xs font-semibold">
                        Disponible
                      </label>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold">
                        {statusMsg[product.id] && (
                          <span className={statusMsg[product.id].startsWith("✅") ? "text-green-400" : "text-red-400"}>
                            {statusMsg[product.id]}
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleSave(product)}
                        disabled={!hasChanges || saving === product.id}
                        className="flex items-center gap-1.5 btn-neon px-4 py-2 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {saving === product.id ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
