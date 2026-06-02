export interface PromoCode {
  code: string;
  label: string;
  discountPercent: number;
  discountFixed?: number; // Fixed dollar discount (overrides percent calculation if set)
  description: string;
  productId?: string; // If set, discount applies only to this product
}

export const PROMO_CODES: PromoCode[] = [
  {
    code: "REGALO",
    label: "🎁 Código de Regalo",
    discountPercent: 8.42,
    discountFixed: 0.80,
    description: "Descuento especial: Bluetooth de $9.50 a $8.70",
    productId: "bluetooth-5-0",
  },
];

export function validatePromoCode(code: string): PromoCode | null {
  return PROMO_CODES.find((p) => p.code === code.toUpperCase().trim()) ?? null;
}
