import { Link } from "react-router-dom";
import { Zap, Truck, ChevronRight, Tag } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import ProductCard from "@/components/features/ProductCard";
import ReviewsSection from "@/components/features/ReviewsSection";
import ProductOfTheDay from "@/components/features/ProductOfTheDay";
import BundlesSection from "@/components/features/BundlesSection";
import DeliveryScheduler from "@/components/features/DeliveryScheduler";
import { useProducts } from "@/hooks/useProducts";

export default function Home() {
  const { products: PRODUCTS } = useProducts();
  return (
    <div className="pt-24">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* BG Image + overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="GoTech banner"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-hero-gradient opacity-80" />
          <div className="absolute inset-0 bg-glow-radial" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 section-grid opacity-30 z-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px w-12 bg-neon-cyan" />
              <span className="badge-neon">⚡ San Salvador · Entrega Hoy</span>
            </div>

            {/* Headline */}
            <h1 className="font-orbitron font-black text-4xl md:text-6xl leading-tight text-white mb-4">
              Tu tienda{" "}
              <span className="text-neon-cyan glow-text">tech</span>
              <br />
              en El Salvador
            </h1>

            <p className="text-white/70 text-lg md:text-xl mb-8 leading-relaxed">
              Accesorios Bluetooth, controles y más. <br />
              <span className="text-neon-cyan font-semibold">Compra en menos de 1 minuto por WhatsApp.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/catalogo" className="btn-neon flex items-center gap-2 text-base px-8 py-4 animate-pulse-neon">
                <Zap className="w-5 h-5" />
                Ver Productos
              </Link>
              <a
                href="https://wa.me/50379433144"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon-outline flex items-center gap-2 text-base px-8 py-4"
              >
                💬 Escribir al WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {[
                { icon: "🚚", label: "Envío Gratis", sub: "En zonas seleccionadas" },
                { icon: "⚡", label: "Compra Rápida", sub: "En menos de 1 minuto" },
                { icon: "🟢", label: "Stock disponible", sub: "Entrega el mismo día" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{s.label}</p>
                    <p className="text-white/50 text-xs">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BLUETOOTH SPOTLIGHT BANNER ── */}
      <section className="py-10 bg-gradient-to-r from-dark-900 via-neon-blue/10 to-dark-900 border-y border-neon-cyan/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <img
              src="https://cdn-ai.onspace.ai/onspace/files/THvUj2c69krqnY28qJZzBE/1000512167.png"
              alt="USB Bluetooth 5.0"
              className="w-28 h-28 object-contain drop-shadow-[0_0_20px_rgba(0,207,255,0.4)] animate-float shrink-0"
            />
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase animate-pulse">🔥 MÁS VENDIDO</span>
                <span className="badge-neon text-[10px]">PRODUCTO ESTRELLA</span>
              </div>
              <h3 className="font-orbitron font-black text-xl text-white">
                USB Bluetooth 5.0 — <span className="text-neon-cyan glow-text">Conecta Sin Límites</span>
              </h3>
              <p className="text-white/50 text-sm mt-1">Plug & Play, sin drivers. Compatible con PC, laptops, audífonos y más.</p>
              <div className="flex items-center gap-2 mt-1 justify-center lg:justify-start">
                <Tag className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-yellow-300 text-xs font-bold">Código <strong>REGALO</strong> → baja de $9.50 a $8.70</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="font-orbitron font-black text-3xl text-neon-cyan glow-text">$9.50</div>
              <p className="text-green-400 text-xs font-bold">🚚 Envío gratis en 6 zonas</p>
              <Link to="/producto/bluetooth-5-0" className="btn-neon text-xs px-5 py-2.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Comprar ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-divider" />
      <section className="bg-dark-800 py-4">
        <div className="max-w-6xl mx-auto px-4 overflow-hidden">
          <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
            {[
              "🔥 OFERTA LIMITADA",
              "🚚 ENVÍO GRATIS en zonas seleccionadas",
              "⚡ COMPRA RÁPIDA por WhatsApp",
              "🟢 DISPONIBLE HOY",
              "🔵 Bluetooth 5.0 — $9.50 🔥",
              "🎁 Código REGALO → Bluetooth a $8.70",
              "📺 Control TCL — $10.00",
              "💾 MicroSD 128GB — $12.00",
              "💾 MicroSD 64GB — $8.50",
              "🔒 Candado Moto — $7.00",
              "🎮 Control Universal — $7.00",
              "🚗 Soporte Auto 360° — $5.00",
              "🏍️ Soporte Moto Premium — $8.50",
            ].map((t, i) => (
              <span key={i} className="text-neon-cyan font-bold text-sm uppercase tracking-widest shrink-0">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="neon-divider" />

      {/* ── FULL CATALOG ── */}
      <section id="catalogo" className="py-20 section-grid">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-neon-cyan text-sm font-bold uppercase tracking-widest mb-2">Catálogo Completo</p>
              <h2 className="font-orbitron font-black text-3xl md:text-4xl text-white">
                Todos los <span className="text-neon-cyan">Productos</span>
              </h2>
              <p className="text-white/40 text-sm mt-1">{PRODUCTS.length} productos disponibles · Entrega en San Salvador</p>
            </div>
            <Link
              to="/catalogo"
              className="hidden sm:flex items-center gap-1 text-neon-cyan font-semibold text-sm hover:gap-2 transition-all"
            >
              Buscar / Filtrar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category quick-filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["Todos", "Bluetooth", "Memorias", "Controles", "Accesorios Moto", "Accesorios Auto"].map((cat) => (
              <a
                key={cat}
                href={`/catalogo`}
                className="px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-dark-700 border border-neon-cyan/20 text-white/50 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all"
              >
                {cat}
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <div className="neon-divider" />

      {/* ── PRODUCT OF THE DAY ── */}
      <ProductOfTheDay />

      <div className="neon-divider" />

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-neon-cyan text-sm font-bold uppercase tracking-widest mb-2">Simple</p>
            <h2 className="font-orbitron font-black text-3xl text-white">¿Cómo comprar?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Elige tu producto",
                desc: "Navega el catálogo y selecciona el accesorio que necesitas.",
              },
              {
                step: "02",
                icon: "💬",
                title: "Escríbenos por WhatsApp",
                desc: "Toca 'Comprar' y se abrirá WhatsApp con el mensaje listo.",
              },
              {
                step: "03",
                icon: "🚀",
                title: "Recibe tu pedido",
                desc: "Coordinamos la entrega en tu zona. ¡Mismo día disponible!",
              },
            ].map((item) => (
              <div key={item.step} className="card-tech p-6 text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 mb-4 group-hover:border-neon-cyan/60 transition-colors">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="font-orbitron text-neon-cyan/30 text-5xl font-black mb-2">{item.step}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="neon-divider" />

      {/* ── BUNDLES ── */}
      <BundlesSection />


      <div className="neon-divider" />

      {/* ── DELIVERY SCHEDULER ── */}
      <DeliveryScheduler />

      <div className="neon-divider" />

      {/* ── REVIEWS ── */}
      <ReviewsSection />

      <div className="neon-divider" />

      {/* ── DELIVERY PREVIEW ── */}
      <section className="py-16 section-grid">
        <div className="max-w-6xl mx-auto px-4">
          <div className="card-tech p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="badge-neon mb-3">🚚 Envíos Gratis</p>
              <h2 className="font-orbitron font-black text-2xl md:text-3xl text-white mb-3">
                Entregamos en San Salvador
              </h2>
              <p className="text-white/60 text-base leading-relaxed max-w-md">
                Zonas seleccionadas con envío gratis. Torre Futura, Galerías Escalón, Salvador del Mundo y más.
              </p>
            </div>
            <Link to="/envios" className="btn-neon-outline shrink-0 flex items-center gap-2">
              Ver zonas de entrega <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-dark-800 border-t border-neon-cyan/10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-btn-gradient flex items-center justify-center">
                <Zap className="w-5 h-5 text-dark-900 fill-current" />
              </div>
              <span className="font-orbitron font-black text-xl text-neon-cyan">
                Go<span className="text-white">Tech</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/50">
              <Link to="/ofertas" className="hover:text-neon-cyan transition-colors">🔥 Ofertas</Link>
              <Link to="/catalogo" className="hover:text-neon-cyan transition-colors">Catálogo</Link>
              <Link to="/envios" className="hover:text-neon-cyan transition-colors">Envíos</Link>
              <a href="https://wa.me/50379433144" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">
                WhatsApp
              </a>
            </div>
            <p className="text-white/30 text-xs">© 2026 GoTech SV · San Salvador</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
