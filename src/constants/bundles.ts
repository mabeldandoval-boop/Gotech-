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
  highlight: string; // what makes it special
}

export const BUNDLES: Bundle[] = [
  {
    id: "storage-security-pack",
    name: "Storage & Lock Pack",
    tagline: "MicroSD 128GB + Candado para Moto",
    productIds: ["microsd-128gb", "candado-moto"],
    originalTotal: 18.00,
    bundlePrice: 17.20,
    badge: "🔥 COMBO ESTRELLA",
    emoji: "💾🔒",
    highlight: "Ahorrás $0.80",
  },
  {
    id: "moto-pack",
    name: "Moto Pack Pro",
    tagline: "Soporte Moto + Adaptador Bluetooth",
    productIds: ["soporte-moto", "bluetooth-5-0"],
    originalTotal: 18.00,
    bundlePrice: 17.20,
    badge: "🏍️ COMBO MOTO",
    emoji: "🏍️",
    highlight: "Ahorrás $0.80",
  },
  {
    id: "control-pack",
    name: "Control Pack",
    tagline: "Control Universal + Control TCL",
    productIds: ["control-remoto-universal", "control-tcl"],
    originalTotal: 17.00,
    bundlePrice: 16.20,
    badge: "📺 PACK TV",
    emoji: "🎮",
    highlight: "Ahorrás $0.80",
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
