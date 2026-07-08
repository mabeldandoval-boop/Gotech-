export interface ShippingZone {
  name: string;
  cost: number;
}

export interface Product {
  id: string;
  name: string;
  shortName: string;
  price: number;
  originalPrice?: number;
  discount?: number; // percentage e.g. 15 = 15% off
  stock: number;
  image: string;
  badge?: string;
  description: string;
  features: string[];
  available: boolean;
  category: string;
  shippingZones?: ShippingZone[];
  promoCode?: string | null;
}

export interface Category {
  id: string;
  name: string;
}

export interface PromoCode {
  id: string;
  code: string;
  label: string;
  discountPercent: number | null;
  discountFixed: number | null;
  description: string | null;
}
