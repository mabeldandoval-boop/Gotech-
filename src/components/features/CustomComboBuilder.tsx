import { useState } from "react";
import { ShoppingCart, Zap, Plus, Minus, Check, PackagePlus, X } from "lucide-react";
import { getDiscountedPrice, WHATSAPP_NUMBER } from "@/constants/products";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";

const COMBO_DISCOUNT = 0.80;
const MIN_PRODUCTS = 2;

export default function CustomComboBuilder() {
  const { addCustomComboToCart, openCart } = useCart();
  const { products: PRODUCTS } = useProducts();
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedProducts = PRODUCTS.filter((p) => selected.includes(p.id));
  const originalTotal = selectedProducts.reduce((sum, p) => sum + getDiscountedPrice(p), 0);
  const discount = selectedProducts.length >= MIN_PRODUCTS ? Math.min(COMBO_DISCOUNT, originalTotal) : 0;
  const finalTotal = originalTotal - discount;

  const handleAddToCart = () => {
    addCustomComboToCart(selectedProducts, discount);
    setSelected([]);
    openCart();
  };

  const handleWhatsApp = () => {
    const lines = selectedProducts.map((p) => `• ${p.shortName} — $${getDiscountedPrice(p).toFixed(2)}`).join("\n");
    const msg =
      `Hola GoTech! 👋\n\n🎯 *Quiero armar mi combo:*\n${lines}\n\n` +
      `💰 Subtotal: $${originalTotal.toFixed(2)}\n` +
      `🎁 Descuento combo: -$${discount.toFixed(2)}\n` +
      `✅ *Total combo: $${finalTotal.toFixed(2)}*\n\n` +
      `¿Pueden confirmar disponibilidad y envío?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const canCheckout = selectedProducts.length >= MIN_PRODUCTS;

  return (
    <section className="py-20 bg-dark-900 section-grid">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <PackagePlus className="w-4 h-4 text-neon-cyan" />
            <span className="badge-neon text-xs">TÚ ELIGES</span>
          </div>
          <h2 className="font-orbitron font-black text-3xl md:text-4xl text-white">
            Arma tu <span className="text-neon-cyan glow-text">Combo</span>
          </h2>
          <p className="text-white/50 text-sm mt-2">
            Selecciona 2 o más productos y obtén <span className="text-neon-cyan font-bold">$0.80 de descuento</span> automático.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PRODUCTS.filter((p) => p.available && p.stock > 0).map((product) => {
                const isSelected = selected.includes(product.id);
                const price = getDiscountedPrice(product);
                return (
                  <button
                    key={product.id}
                    onClick={() => toggle(product.id)}
                    className={`relative rounded-2xl border p-3 text-left transition-all duration-200 flex flex-col gap-2 overflow-hidden
                      ${isSelected
                        ? "border-neon-cyan bg-neon-cyan/10 shadow-neon-sm"
                        : "border-neon-cyan/20 bg-dark-700/60 hover:border-neon-cyan/40 hover:bg-dark-700"
                      }`}
                  >
                    {/* Check mark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-neon-cyan flex items-center justify-center">
                        <Check className="w-3 h-3 text-dark-900" strokeWidth={3} />
                      </div>
                    )}

                    {/* Image */}
                    <div className="w-full aspect-square bg-dark-600 rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div>
                      <p className="text-[10px] text-neon-cyan/60 uppercase font-bold tracking-wider leading-none mb-1">
                        {product.category}
                      </p>
                      <p className={`text-xs font-bold leading-tight line-clamp-2 ${isSelected ? "text-white" : "text-white/80"}`}>
                        {product.shortName}
                      </p>
                      <p className={`font-black text-sm mt-1 ${isSelected ? "text-neon-cyan glow-text" : "text-neon-cyan"}`}>
                        ${price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 card-tech p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-orbitron font-bold text-white text-sm">Tu Combo</h3>
                {selected.length > 0 && (
                  <button
                    onClick={() => setSelected([])}
                    className="text-white/30 hover:text-white/60 transition-colors flex items-center gap-1 text-xs"
                  >
                    <X className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>

              {/* Selected items */}
              {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                  <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                    <PackagePlus className="w-6 h-6 text-neon-cyan/40" />
                  </div>
                  <p className="text-white/30 text-xs leading-relaxed">
                    Selecciona al menos 2 productos para armar tu combo
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProducts.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 bg-dark-700/60 rounded-xl px-3 py-2">
                      <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{p.shortName}</p>
                        <p className="text-neon-cyan text-xs font-black">${getDiscountedPrice(p).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => toggle(p.id)}
                        className="text-white/20 hover:text-red-400 transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing breakdown */}
              {selectedProducts.length > 0 && (
                <div className="border-t border-neon-cyan/10 pt-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Subtotal ({selectedProducts.length} productos)</span>
                    <span className="text-white/60 font-bold">${originalTotal.toFixed(2)}</span>
                  </div>

                  {canCheckout ? (
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Descuento combo
                      </span>
                      <span className="text-green-400 font-black">-${discount.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl px-3 py-2">
                      <p className="text-neon-cyan/70 text-[11px] text-center">
                        Agrega 1 producto más para activar el descuento de <span className="font-black text-neon-cyan">$0.80</span>
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between pt-1 border-t border-neon-cyan/10">
                    <span className="text-white/70 text-sm font-semibold">Total</span>
                    <span className="font-orbitron font-black text-xl text-neon-cyan glow-text">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>

                  {canCheckout && (
                    <p className="text-green-400 text-[11px] font-bold text-center">
                      🎉 ¡Estás ahorrando $0.80 con tu combo!
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={!canCheckout}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${canCheckout
                      ? "btn-neon"
                      : "bg-dark-600 border border-white/10 text-white/20 cursor-not-allowed"
                    }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {canCheckout ? "Agregar combo al carrito" : `Selecciona ${MIN_PRODUCTS - selectedProducts.length} más`}
                </button>
                <button
                  onClick={handleWhatsApp}
                  disabled={!canCheckout}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${canCheckout
                      ? "btn-neon-outline"
                      : "opacity-30 border border-white/10 text-white/20 cursor-not-allowed rounded-xl"
                    }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Pedir por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
