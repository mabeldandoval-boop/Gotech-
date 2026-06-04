import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { PRODUCTS } from "@/constants/products";
import ProductCard from "@/components/features/ProductCard";

const categories = ["Todos", "Bluetooth", "Memorias", "Controles", "Accesorios Moto", "Accesorios Auto"];

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = PRODUCTS.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 min-h-screen section-grid">
      {/* Header */}
      <div className="bg-dark-800 border-b border-neon-cyan/20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <p className="text-neon-cyan text-sm font-bold uppercase tracking-widest mb-2">GoTech</p>
          <h1 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-2">
            Catálogo de Productos
          </h1>
          <p className="text-white/50 text-base">
            {PRODUCTS.length} productos disponibles · Entrega en San Salvador
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neon-cyan/50" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-700 border border-neon-cyan/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neon-cyan/50 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200
                  ${activeCategory === cat
                    ? "bg-neon-cyan text-dark-900 shadow-neon-sm"
                    : "bg-dark-700 border border-neon-cyan/20 text-white/60 hover:border-neon-cyan/50 hover:text-white"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-white/50 text-lg">No encontramos productos para "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* WhatsApp promo */}
        <div className="mt-16 card-tech p-8 text-center">
          <p className="text-3xl mb-3">💬</p>
          <h3 className="font-orbitron font-bold text-xl text-white mb-2">¿No encuentras lo que buscas?</h3>
          <p className="text-white/50 text-sm mb-6">Escríbenos por WhatsApp y te ayudamos a encontrar el accesorio perfecto.</p>
          <a
            href="https://wa.me/50379433144"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon inline-flex items-center gap-2"
          >
            💬 Preguntar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
