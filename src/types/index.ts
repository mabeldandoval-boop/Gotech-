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
}
