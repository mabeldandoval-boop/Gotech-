import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Product } from "@/types";
import { PRODUCTS as STATIC_PRODUCTS } from "@/constants/products";

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      }
    } catch {
      // Keep static fallback if the API is unavailable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts(): ProductsContextType {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
