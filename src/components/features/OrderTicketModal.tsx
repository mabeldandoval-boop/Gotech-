import { useState, useEffect } from "react";
import { X, Truck, MessageCircle, MapPin, CheckCircle2, Receipt } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { getDiscountedPrice, getShippingZones, WHATSAPP_NUMBER, buildCartWhatsAppMessage } from "@/constants/products";
import { getBluetoothDynamicDiscount } from "@/constants/products";

interface OrderTicketModalProps {
  onClose: () => void;
}

export default function OrderTicketModal({ onClose }: OrderTicketModalProps) {
  const { items, address, promoCode, discountAmount, finalTotal } = useCart();
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const btDiscount = getBluetoothDynamicDiscount();

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  // Calculate subtotal with dynamic discount for bluetooth
  const subtotal = items.reduce((sum, { product, quantity }) => {
    const isDynBt = product.id === "bluetooth-5-0" && btDiscount > 0;
    const price = isDynBt
      ? getDiscountedPrice(product, btDiscount)
      : getDiscountedPrice(product);
    return sum + price * quantity;
  }, 0);

  const promoDiscount = promoCode
    ? (() => {
        if (promoCode.productId) {
          const t = items.find((i) => i.product.id === promoCode.productId);
          if (!t) return 0;
          const isDynBt = t.product.id === "bluetooth-5-0" && btDiscount > 0;
          const ip = isDynBt ? getDiscountedPrice(t.product, btDiscount) : getDiscountedPrice(t.product);
          return ip * t.quantity * (promoCode.discountPercent / 100);
        }
        return subtotal * (promoCode.discountPercent / 100);
      })()
    : 0;

  const afterPromo = subtotal - promoDiscount;

  const shippingZones = getShippingZones(subtotal);
  const selectedZoneObj = shippingZones.find((z) => z.name === selectedZone);
  const shippingCost = selectedZoneObj?.cost ?? null;
  const totalWithShipping = shippingCost !== null ? afterPromo + shippingCost : afterPromo;

  const buildEnrichedWhatsApp = () => {
    const lines = items.map(({ product, quantity }) => {
      const isDynBt = product.id === "bluetooth-5-0" && btDiscount > 0;
      const price = isDynBt ? getDiscountedPrice(product, btDiscount) : getDiscountedPrice(product);
      return `• ${product.name} x${quantity} — $${(price * quantity).toFixed(2)}`;
    });

    let msg = `Hola GoTech! 👋\n\n🧾 *Mi Pedido:*\n${lines.join("\n")}`;
    if (promoCode && promoDiscount > 0) {
      msg += `\n\n🎁 Código: ${promoCode.code} → -$${promoDiscount.toFixed(2)}`;
    }
    msg += `\n\n💰 Subtotal: $${subtotal.toFixed(2)}`;
    if (selectedZone && shippingCost !== null) {
      msg += `\n🚚 Envío (${selectedZone}): ${shippingCost === 0 ? "GRATIS" : `$${shippingCost.toFixed(2)}`}`;
      msg += `\n✅ *Total: $${totalWithShipping.toFixed(2)}*`;
    }
    if (address) msg += `\n\n📍 Dirección: ${address}`;
    msg += `\n\n¿Pueden confirmar el pedido?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const today = new Date().toLocaleDateString("es-SV", { day: "numeric", month: "long", year: "numeric" });
  const orderNum = `GT-${Date.now().toString().slice(-6)}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />

      {/* Ticket */}
      <div
        className={`relative w-full max-w-sm transition-all duration-300 ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
      >
        {/* Top perforated edge */}
        <div className="flex gap-0 overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-dark-900 shrink-0" style={{ marginLeft: i === 0 ? "-8px" : "-2px" }} />
          ))}
        </div>

        <div className="bg-dark-800 border-x border-neon-cyan/30 shadow-[0_0_60px_rgba(0,207,255,0.15)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10 border-b border-dashed border-neon-cyan/20 px-6 py-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-neon-cyan" />
                <span className="font-orbitron font-black text-neon-cyan text-base">GoTech</span>
              </div>
              <button onClick={handleClose} className="text-white/30 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/40 text-[10px] font-mono">Ticket #{orderNum}</p>
            <p className="text-white/30 text-[10px] font-mono">{today}</p>
          </div>

          {/* Items */}
          <div className="px-6 py-4 space-y-2.5 border-b border-dashed border-neon-cyan/15">
            <p className="text-neon-cyan/70 text-[10px] font-bold uppercase tracking-widest mb-3">Productos</p>
            {items.map(({ product, quantity }) => {
              const isDynBt = product.id === "bluetooth-5-0" && btDiscount > 0;
              const price = isDynBt ? getDiscountedPrice(product, btDiscount) : getDiscountedPrice(product);
              return (
                <div key={product.id} className="flex items-start gap-3">
                  <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg shrink-0 bg-dark-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-1">{product.name}</p>
                    <p className="text-white/40 text-[10px]">
                      ${price.toFixed(2)} × {quantity}
                      {isDynBt && (
                        <span className="ml-1 text-neon-cyan font-bold">(-{btDiscount}%)</span>
                      )}
                    </p>
                  </div>
                  <span className="text-neon-cyan font-black text-sm shrink-0">
                    ${(price * quantity).toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subtotals */}
          <div className="px-6 py-4 space-y-1.5 border-b border-dashed border-neon-cyan/15">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Subtotal</span>
              <span className="text-white/70 font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {promoCode && promoDiscount > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  🎁 {promoCode.code}
                  {promoCode.productId ? " (Bluetooth)" : ""}
                </span>
                <span className="text-green-400 font-semibold">-${promoDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Zone selector */}
          <div className="px-6 py-4 border-b border-dashed border-neon-cyan/15">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
              <p className="text-neon-cyan/70 text-[10px] font-bold uppercase tracking-widest">Zona de entrega</p>
            </div>
            <div className="space-y-1.5">
              {shippingZones.map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => setSelectedZone(zone.name)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-200 border ${
                    selectedZone === zone.name
                      ? "border-neon-cyan/60 bg-neon-cyan/10"
                      : "border-white/5 bg-dark-700/50 hover:border-neon-cyan/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selectedZone === zone.name ? "border-neon-cyan" : "border-white/20"
                    }`}>
                      {selectedZone === zone.name && (
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                      )}
                    </div>
                    <span className={`text-[11px] font-semibold leading-tight ${selectedZone === zone.name ? "text-white" : "text-white/60"}`}>
                      {zone.name}
                    </span>
                  </div>
                  <span className={`text-[11px] font-black shrink-0 ml-2 ${zone.cost === 0 ? "text-green-400" : "text-orange-400"}`}>
                    {zone.cost === 0 ? "GRATIS" : `+$${zone.cost.toFixed(2)}`}
                  </span>
                </button>
              ))}
            </div>
            {address && (
              <div className="flex items-center gap-1.5 mt-2.5">
                <MapPin className="w-3 h-3 text-neon-cyan/50 shrink-0" />
                <p className="text-white/30 text-[10px] truncate">{address}</p>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="px-6 py-4 border-b border-dashed border-neon-cyan/15">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm font-semibold">TOTAL A PAGAR</span>
              <div className="text-right">
                {selectedZone && shippingCost !== null ? (
                  <>
                    <p className="font-orbitron font-black text-2xl text-neon-cyan glow-text">
                      ${totalWithShipping.toFixed(2)}
                    </p>
                    {shippingCost > 0 && (
                      <p className="text-orange-400/70 text-[10px]">
                        Incluye envío +${shippingCost.toFixed(2)}
                      </p>
                    )}
                    {shippingCost === 0 && (
                      <p className="text-green-400/70 text-[10px]">Envío incluido gratis ✓</p>
                    )}
                  </>
                ) : (
                  <div className="text-right">
                    <p className="font-orbitron font-black text-2xl text-neon-cyan/40">
                      ${afterPromo.toFixed(2)}
                    </p>
                    <p className="text-white/30 text-[10px]">Selecciona zona para ver total</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-5">
            {selectedZone ? (
              <a
                href={buildEnrichedWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className="btn-neon w-full flex items-center justify-center gap-2 py-3.5 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Confirmar pedido por WhatsApp
              </a>
            ) : (
              <button
                disabled
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold uppercase tracking-wider bg-dark-700 border border-white/10 text-white/30 cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                Selecciona tu zona primero
              </button>
            )}
            <p className="text-white/20 text-[10px] text-center mt-3">
              🔒 Tu pedido será coordinado por WhatsApp
            </p>
          </div>
        </div>

        {/* Bottom perforated edge */}
        <div className="flex gap-0 overflow-hidden rotate-180">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-dark-900 shrink-0" style={{ marginLeft: i === 0 ? "-8px" : "-2px" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
