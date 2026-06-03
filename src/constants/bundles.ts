import { WHATSAPP_NUMBER } from "@/constants/products";

export interface Bundle {
  id: string;
  name: string;
  tagline: string;
  productIds: string[];
  originalTotal: number;
  bundlePrice: number;
  badge: string;
  emoji: string;
  highlight: string;
}

export const BUNDLES: Bundle[] = [
  {
    id: "tech-essentials-64",
    name: "Tech Essentials",
    tagline: "USB Bluetooth 5.0 + MicroSD 64GB",
    productIds: ["bluetooth-5-0", "microsd-64gb"],
    originalTotal: 19.49,
    bundlePrice: 18.52,
    badge: "⚡ TECH COMBO",
    emoji: "🔵💾",
    highlight: "Ahorrás $0.97 — 5% OFF",
  },
  {
    id: "tech-essentials-128",
    name: "Tech Essentials Pro",
    tagline: "USB Bluetooth 5.0 + MicroSD 128GB",
    productIds: ["bluetooth-5-0", "microsd-128gb"],
    originalTotal: 22.50,
    bundlePrice: 21.38,
    badge: "🔥 MEJOR VALOR",
    emoji: "🔵💾",
    highlight: "Ahorrás $1.12 — 5% OFF",
  },
];

export function buildBundleWhatsAppMessage(bundle: Bundle, address?: string): string {
  let msg = `Hola GoTech! 👋\n\n`;
  msg += `🎯 *Quiero el Combo: ${bundle.name}*\n`;
  msg += `📦 ${bundle.tagline}\n`;
  msg += `\n💰 Precio del combo: *$${bundle.bundlePrice.toFixed(2)}* (antes $${bundle.originalTotal.toFixed(2)})\n`;
  msg += `✅ ${bundle.highlight}`;
  if (address) msg += `\n\n📍 Dirección: ${address}`;
  msg += `\n\n¿Pueden confirmar disponibilidad?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
