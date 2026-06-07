import { MapPin, Truck, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const zones = [
  { name: "Torre Futura", detail: "Punto de entrega", icon: "🏢" },
  { name: "75 Av. Norte", detail: "Gasolinera", icon: "⛽" },
];

export default function DeliveryInfo() {
  return (
    <div className="pt-24 min-h-screen section-grid">
      {/* Header */}
      <div className="bg-dark-800 border-b border-neon-cyan/20">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 mb-4">
            <Truck className="w-8 h-8 text-neon-cyan" />
          </div>
          <p className="text-neon-cyan text-sm font-bold uppercase tracking-widest mb-2">GoTech</p>
          <h1 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-3">
            Envíos Gratis
          </h1>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Hacemos entregas en San Salvador. Solo en las zonas indicadas, sin costo adicional.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {zones.map((z) => (
              <div key={z.name} className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl px-4 py-2">
                <span>{z.icon}</span>
                <span className="text-neon-cyan font-bold text-sm">{z.name}</span>
                <span className="text-green-400 text-xs font-black">GRATIS</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Zones card */}
        <div className="card-tech overflow-hidden">
          <div className="bg-neon-cyan/10 border-b border-neon-cyan/20 px-6 py-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-neon-cyan rounded-full" />
            <div>
              <h2 className="text-white font-bold text-lg">Zonas de entrega</h2>
              <p className="text-green-400 text-sm font-semibold">🚚 Envío GRATIS en todas tus compras</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zones.map((zone) => (
              <div key={zone.name} className="flex items-center gap-3 p-4 rounded-xl bg-dark-700/50 border border-neon-cyan/10">
                <span className="text-3xl">{zone.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{zone.name}</p>
                  <p className="text-white/40 text-xs">{zone.detail}</p>
                </div>
                <div className="ml-auto">
                  <span className="text-green-400 text-xs font-bold bg-green-400/10 px-2 py-0.5 rounded-full">GRATIS</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info notice */}
        <div className="card-tech p-6 border-neon-cyan/30">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-bold mb-2">Información importante</h3>
              <ul className="space-y-2 text-white/60 text-sm leading-relaxed">
                <li>• Solo realizamos entregas en Torre Futura y 75 Av. Norte (Gasolinera).</li>
                <li>• No hacemos envíos a otros departamentos fuera de San Salvador.</li>
                <li>• Para coordinar tu entrega, contáctanos por WhatsApp.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <p className="text-white/50 text-sm mb-6">¿Tienes dudas sobre tu entrega? Escríbenos directamente.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/50379433144"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Consultar por WhatsApp
            </a>
            <Link to="/catalogo" className="btn-neon-outline flex items-center gap-2">
              Ver productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
