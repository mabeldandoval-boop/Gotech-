import { useState, useRef } from "react";
import { MapPin, X, Navigation, Search } from "lucide-react";

interface AddressPickerModalProps {
  onConfirm: (address: string) => void;
  onClose: () => void;
  initialAddress?: string;
}

export default function AddressPickerModal({ onConfirm, onClose, initialAddress = "" }: AddressPickerModalProps) {
  const [address, setAddress] = useState(initialAddress);
  const [locating, setLocating] = useState(false);
  const [mapQuery, setMapQuery] = useState("San Salvador, El Salvador");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleUseLocation() {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setAddress(coords);
        setMapQuery(coords);
        setLocating(false);
      },
      () => {
        setLocating(false);
        alert("No se pudo obtener tu ubicación. Por favor escribe tu dirección manualmente.");
      }
    );
  }

  function handleSearch() {
    if (address.trim()) {
      setMapQuery(address + ", San Salvador, El Salvador");
    }
  }

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed&z=15`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg card-tech overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neon-cyan/20 bg-dark-700/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neon-cyan" />
            <h2 className="font-orbitron font-bold text-white text-base">Dirección de Entrega</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Address input */}
          <div>
            <label className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-2 block">
              Escribe tu dirección
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Ej: Col. Escalón, Calle El Pedregal #12"
                className="flex-1 bg-dark-700 border border-neon-cyan/20 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-neon-cyan/50 transition-colors"
              />
              <button
                onClick={handleSearch}
                className="bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/20 text-neon-cyan rounded-xl px-3 transition-colors"
                title="Buscar en mapa"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* GPS button */}
          <button
            onClick={handleUseLocation}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 bg-dark-700 border border-neon-cyan/20 hover:border-neon-cyan/50 text-white/70 hover:text-neon-cyan rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 ${locating ? "animate-spin" : ""}`} />
            {locating ? "Obteniendo ubicación..." : "Usar mi ubicación actual (GPS)"}
          </button>

          {/* Map embed */}
          <div className="rounded-xl overflow-hidden border border-neon-cyan/20 h-52">
            <iframe
              key={mapQuery}
              title="Mapa de entrega"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p className="text-white/40 text-xs text-center leading-relaxed">
            Busca tu dirección y verifica que esté en nuestras zonas de entrega. Si tienes dudas, te contactamos por WhatsApp.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 btn-neon-outline text-sm py-3"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (address.trim()) {
                  onConfirm(address.trim());
                  onClose();
                }
              }}
              disabled={!address.trim()}
              className="flex-1 btn-neon text-sm py-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar dirección
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
