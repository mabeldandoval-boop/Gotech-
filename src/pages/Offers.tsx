import { Link } from "react-router-dom";
import { Zap, Truck, Tag, ChevronRight, Star } from "lucide-react";
import { PRODUCTS, getDiscountedPrice, getBluetoothDynamicDiscount } from "@/constants/products";
import ProductCard from "@/components/features/ProductCard";

// Products that always have free shipping regardless of total
const FREE_SHIPPING_PRODUCT_IDS = [
  "bluetooth-5-0",
  "microsd-128gb",
  "microsd-64gb",
  "candado-moto",
  "control-remoto-universal",
  "control-tcl",
  "soporte-moto",
  "soporte-retrovisor",
];

export default function Offers() {
  const btDiscount = getBluetoothDynamicDiscount();
  const freeShippingProducts = PRODUCTS.filter((p) =>
    FREE_SHIPPING_PRODUCT_IDS.includes(p.id)
  );

  return (
    <div className="pt-24 min-h-screen section-grid">
      {/* Header */}
      <section className="relative py-16 overflow-hidden bg-dark-800">
        <div className="absolute inset-0 bg-glow-radial opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-neon-cyan" />
              <span className="badge-neon text-sm">OFERTAS ESPECIALES</span>
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-5xl text-white mb-4">
              🔥 <span className="text-neon-cyan glow-text">Ofertas</span> GoTech
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Los mejores precios + envío gratis en zonas seleccionadas. ¡Compra hoy!
            </p>
          </div>
        </div>
      </section>

      {/* Bluetooth Spotlight — TOP PROMO */}
      <section className="py-12 bg-dark-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="relative card-tech overflow-hidden border-2 border-neon-cyan/50 shadow-[0_0_40px_rgba(0,207,255,0.15)]">
            {/* BG glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-blue/5 pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center gap-8 p-8">
              {/* Image */}
              <div className="relative shrink-0">
                <div className="w-56 h-56 flex items-center justify-center bg-dark-700 rounded-2xl overflow-hidden relative">
                  <img
                    src="https://cdn-ai.onspace.ai/onspace/files/THvUj2c69krqnY28qJZzBE/1000512167.png"
                    alt="USB Bluetooth 5.0"
                    className="w-full h-full object-contain animate-float"
                  />
                  <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(0,207,255,0.3)_inset]" />
                </div>
                {/* Hot badge */}
                <div className="absolute -top-3 -right-3 bg-red-500 text-white font-black text-xs px-3 py-1.5 rounded-full uppercase shadow-lg animate-pulse">
                  🔥 TOP VENTA
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-2">⭐ Producto Estrella</p>
                <h2 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-3">
                  USB Adaptador Bluetooth 5.0
                </h2>
                <p className="text-white/60 mb-4 text-sm leading-relaxed max-w-md">
                  Conecta sin límites. Plug & Play, sin drivers. Compatible con PC, laptops, audífonos, bocinas y controles. Alcance hasta 20m.
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-6 max-w-sm mx-auto lg:mx-0">
                  {["Bluetooth 5.0 CSR", "Plug & Play", "Hasta 20m alcance", "Certificación BQB"].map((f) => (
                    <div key={f} className="flex items-center gap-1.5 text-xs text-white/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 justify-center lg:justify-start mb-3">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-orbitron font-black text-4xl text-neon-cyan glow-text">
                        ${btDiscount > 0 ? (9.50 * (1 - btDiscount / 100)).toFixed(2) : "9.50"}
                      </span>
                      {btDiscount > 0 && (
                        <span className="text-white/30 text-xl line-through">$9.50</span>
                      )}
                    </div>
                    <p className="text-green-400 text-xs font-bold">🚚 Envío gratis en 6 zonas</p>
                  </div>
                  {btDiscount > 0 && (
                    <div className="bg-red-500 text-white font-black text-sm px-3 py-1.5 rounded-full uppercase">
                      -{btDiscount}% HOY
                    </div>
                  )}
                </div>

                {/* Promo code hint */}
                <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-400/30 rounded-xl px-4 py-2 mb-5">
                  <Tag className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-300 text-xs font-bold">
                    Código <span className="bg-yellow-400/20 px-1.5 py-0.5 rounded font-black">REGALO</span> → baja a $8.70
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link to="/producto/bluetooth-5-0" className="btn-neon flex items-center gap-2 px-6 py-3 text-sm">
                    <Zap className="w-4 h-4" />
                    Comprar ahora
                  </Link>
                  <a
                    href="https://wa.me/50379433144?text=Hola%20GoTech!%20Quiero%20el%20USB%20Bluetooth%205.0%20%E2%80%94%20%249.50"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon-outline flex items-center gap-2 px-6 py-3 text-sm"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>

              {/* Stars */}
              <div className="shrink-0 text-center hidden lg:block">
                <div className="bg-dark-700 border border-neon-cyan/20 rounded-2xl p-5">
                  <div className="flex gap-0.5 justify-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="font-orbitron font-black text-2xl text-white">4.9</p>
                  <p className="text-white/40 text-xs">+120 ventas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="py-8 bg-gradient-to-r from-neon-blue/20 via-dark-800 to-neon-blue/20 border-y border-neon-cyan/15">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-neon-cyan" />
            </div>
            <div>
              <p className="font-orbitron font-black text-white text-lg">
                🚚 ENVÍOS GRATIS DISPONIBLES
              </p>
              <p className="text-white/50 text-sm">
                La compra de cualquiera de estos productos incluye envío gratis en zonas seleccionadas
              </p>
            </div>
            <Link to="/envios" className="btn-neon-outline shrink-0 text-xs flex items-center gap-1 px-4 py-2.5">
              Ver zonas <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* All offer products */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <Tag className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-orbitron font-black text-2xl text-white">
              Todos con <span className="text-neon-cyan">Envío Gratis</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {freeShippingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo code section */}
      <section className="py-12 bg-dark-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="card-tech p-8 border-2 border-yellow-400/30 bg-yellow-400/5">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-orbitron font-black text-xl text-white mb-2">
              Código de Regalo Exclusivo
            </h3>
            <p className="text-white/60 text-sm mb-4">
              Aplica el código en el carrito y obtén el USB Bluetooth de <span className="line-through text-white/30">$9.50</span> a solo
            </p>
            <div className="font-orbitron font-black text-4xl text-yellow-400 mb-3">$8.70</div>
            <div className="inline-flex items-center gap-3 bg-dark-700 border border-yellow-400/40 rounded-2xl px-6 py-3 mb-5">
              <Tag className="w-4 h-4 text-yellow-400" />
              <span className="font-orbitron font-black text-yellow-300 text-xl tracking-widest">REGALO</span>
            </div>
            <p className="text-white/30 text-xs">Válido solo para el Adaptador USB Bluetooth 5.0</p>
          </div>
        </div>
      </section>
    </div>
  );
}
