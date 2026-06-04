import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, ChevronLeft, MessageCircle, Truck, Zap, MapPin, ShoppingCart } from "lucide-react";
import { PRODUCTS, getDiscountedPrice, getBluetoothDynamicDiscount } from "@/constants/products";
import { useCart } from "@/hooks/useCart";
import AddressPickerModal from "@/components/features/AddressPickerModal";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const { addToCart, items, address, setAddress, openCart } = useCart();
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const btDiscount = getBluetoothDynamicDiscount();

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">📦</p>
          <h2 className="font-orbitron text-2xl text-white mb-4">Producto no encontrado</h2>
          <Link to="/catalogo" className="btn-neon">Ver catálogo</Link>
        </div>
      </div>
    );
  }

  const inCart = items.find((i) => i.product.id === product.id);
  const isDynBt = product.id === "bluetooth-5-0" && btDiscount > 0;
  const finalPrice = isDynBt ? getDiscountedPrice(product, btDiscount) : getDiscountedPrice(product);
  const activeDiscount = isDynBt ? btDiscount : product.discount;
  const stockLow = product.stock > 0 && product.stock <= 3;
  const otherProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 2);

  return (
    <div className="pt-24 min-h-screen section-grid">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Back */}
        <Link
          to="/catalogo"
          className="flex items-center gap-1 text-neon-cyan/70 hover:text-neon-cyan text-sm font-semibold uppercase tracking-wider mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="card-tech overflow-hidden">
              <div className="aspect-square flex items-center justify-center bg-dark-700 p-4 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain animate-float"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-xl uppercase tracking-wider">Sin stock</span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ boxShadow: "0 0 80px rgba(0,207,255,0.1) inset" }} />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && <div className="badge-neon">{product.badge}</div>}
              {activeDiscount && activeDiscount > 0 && (
                <div className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-lg">
                  -{activeDiscount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-2">
              {product.category}
            </p>
            <h1 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="text-white/60 text-base leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Features */}
            <div className="card-tech p-5 mb-6">
              <p className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-4">Características</p>
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-neon-cyan shrink-0 mt-0.5" />
                    <span className="text-white/80 text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-orbitron font-black text-4xl text-neon-cyan glow-text">
                ${finalPrice.toFixed(2)}
              </span>
              {activeDiscount && activeDiscount > 0 && (
                <span className="text-white/30 text-xl line-through">${product.price.toFixed(2)}</span>
              )}
              <span className="text-white/30 text-sm">USD</span>
            </div>

            {activeDiscount && activeDiscount > 0 && (
              <p className="text-red-400 text-sm font-bold mb-2">
                Ahorras ${(product.price - finalPrice).toFixed(2)} ({activeDiscount}% OFF)
              </p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-2">
              {product.stock === 0 ? (
                <span className="text-red-400 text-sm font-bold">❌ Sin stock disponible</span>
              ) : stockLow ? (
                <span className="text-orange-400 text-sm font-bold">⚠️ Últimas {product.stock} unidades</span>
              ) : (
                <span className="text-green-400 text-sm font-bold">✅ En stock: {product.stock} unidades</span>
              )}
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold mb-5">
              <Truck className="w-4 h-4" />
              Envío gratis en zonas seleccionadas
            </div>

            {/* Address section */}
            <button
              onClick={() => setShowAddressPicker(true)}
              className="flex items-center gap-2 bg-dark-700 border border-neon-cyan/20 hover:border-neon-cyan/50 rounded-xl px-4 py-3 mb-5 w-full transition-all group text-left"
            >
              <MapPin className="w-4 h-4 text-neon-cyan shrink-0" />
              <div className="flex-1 min-w-0">
                {address ? (
                  <>
                    <p className="text-[10px] text-neon-cyan/60 uppercase tracking-wider font-bold">Tu dirección</p>
                    <p className="text-white text-sm truncate">{address}</p>
                  </>
                ) : (
                  <p className="text-white/40 text-sm">Agregar dirección de entrega (opcional)</p>
                )}
              </div>
              <span className="text-neon-cyan/40 group-hover:text-neon-cyan text-xs shrink-0">
                {address ? "Cambiar" : "Agregar"}
              </span>
            </button>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (product.stock > 0) {
                    addToCart(product);
                    openCart();
                  }
                }}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider transition-all
                  ${product.stock === 0
                    ? "bg-dark-600 border border-white/10 text-white/30 cursor-not-allowed"
                    : inCart
                      ? "bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-900"
                      : "btn-neon"
                  }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {inCart ? `Ver carrito (${inCart.quantity} en carrito)` : "Agregar al carrito"}
              </button>
            </div>

            <p className="text-white/30 text-xs text-center mt-3">
              Agrega al carrito y revisa el resumen antes de pedir
            </p>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: <Zap className="w-4 h-4" />, label: "Compra Rápida" },
                { icon: <Truck className="w-4 h-4" />, label: "Envío Rápido" },
                { icon: <MessageCircle className="w-4 h-4" />, label: "Soporte Directo" },
              ].map((b) => (
                <div key={b.label} className="card-tech p-3 text-center">
                  <div className="text-neon-cyan flex justify-center mb-1">{b.icon}</div>
                  <p className="text-white/60 text-[10px] font-semibold uppercase">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {otherProducts.length > 0 && (
          <div className="mt-20">
            <div className="neon-divider mb-10" />
            <h2 className="font-orbitron font-black text-xl text-white mb-6">También te puede interesar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherProducts.map((p) => (
                <Link key={p.id} to={`/producto/${p.id}`} className="card-tech p-4 flex items-center gap-4 hover:border-neon-cyan/50 transition-all">
                  <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm mb-1 line-clamp-2">{p.name}</p>
                    <p className="text-neon-cyan font-black text-lg">${getDiscountedPrice(p).toFixed(2)}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-neon-cyan/50 rotate-180 ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Address Picker Modal */}
      {showAddressPicker && (
        <AddressPickerModal
          initialAddress={address}
          onConfirm={setAddress}
          onClose={() => setShowAddressPicker(false)}
        />
      )}
    </div>
  );
}
