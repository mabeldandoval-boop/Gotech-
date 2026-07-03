import { Link } from "react-router-dom";
import { ShoppingCart, CheckCircle, Zap } from "lucide-react";
import { getDiscountedPrice, getBluetoothDynamicDiscount } from "@/constants/products";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types";

function getDailyProduct(products: Product[]) {
  // Uses the day of year to deterministically pick a product that rotates daily
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return products[dayOfYear % products.length];
}

function getDayName() {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[new Date().getDay()];
}

function formatDate() {
  return new Date().toLocaleDateString("es-SV", { day: "numeric", month: "long" });
}

export default function ProductOfTheDay() {
  const { products } = useProducts();
  const product = getDailyProduct(products);
  const { addToCart, items } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);
  const btDiscount = getBluetoothDynamicDiscount();
  const isDynBt = product.id === "bluetooth-5-0" && btDiscount > 0;
  const finalPrice = isDynBt ? getDiscountedPrice(product, btDiscount) : getDiscountedPrice(product);
  const activeDiscount = isDynBt ? btDiscount : product.discount;

  return (
    <section className="py-20 section-grid">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-neon text-xs">⭐ DESTACADO HOY</span>
              <span className="text-white/30 text-xs">{getDayName()} {formatDate()}</span>
            </div>
            <h2 className="font-orbitron font-black text-3xl text-white">
              Producto del <span className="text-neon-cyan glow-text">Día</span>
            </h2>
          </div>
        </div>

        {/* Card */}
        <div className="card-tech overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative bg-dark-700 flex items-center justify-center p-8 min-h-[300px]">
              <div className="absolute inset-0 bg-glow-radial opacity-30" />
              <img
                src={product.image}
                alt={product.name}
                className="relative z-10 max-h-64 w-full object-contain animate-float drop-shadow-[0_0_30px_rgba(0,207,255,0.3)]"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                {product.badge && <div className="badge-neon">{product.badge}</div>}
                {activeDiscount && activeDiscount > 0 && (
                  <div className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase shadow-lg">
                    -{activeDiscount}% OFF
                  </div>
                )}
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full border border-neon-cyan/10 animate-pulse" />
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col justify-center">
              <p className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-2">{product.category}</p>
              <h3 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-4 leading-tight">
                {product.name}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{product.description}</p>

              {/* Features (first 3) */}
              <ul className="space-y-2 mb-6">
                {product.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <CheckCircle className="w-4 h-4 text-neon-cyan shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-orbitron font-black text-4xl text-neon-cyan glow-text">
                  ${finalPrice.toFixed(2)}
                </span>
                {activeDiscount && activeDiscount > 0 && (
                  <span className="text-white/30 text-xl line-through">${product.price.toFixed(2)}</span>
                )}
                <span className="text-white/30 text-sm">USD</span>
              </div>

              {/* Stock */}
              <div className="mb-5">
                {product.stock <= 3 ? (
                  <span className="text-orange-400 text-sm font-bold">⚠️ Solo {product.stock} disponibles</span>
                ) : (
                  <span className="text-green-400 text-sm font-bold">✅ En stock: {product.stock} unidades</span>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => product.stock > 0 && addToCart(product)}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider transition-all
                    ${product.stock === 0
                      ? "bg-dark-600 border border-white/10 text-white/30 cursor-not-allowed"
                      : inCart
                        ? "bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-900"
                        : "btn-neon"
                    }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {inCart ? `En carrito (${inCart.quantity})` : "Agregar al carrito"}
                </button>
                <Link
                  to={`/producto/${product.id}`}
                  className="flex-1 btn-neon-outline flex items-center justify-center gap-2 py-3.5 text-sm"
                >
                  <Zap className="w-4 h-4" />
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
