import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "@/types";
import { PromoCode, validatePromoCode } from "@/constants/promoCodes";
import { PRODUCTS } from "@/constants/products";
import { Bundle } from "@/constants/bundles";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  address: string;
  setAddress: (addr: string) => void;
  addToCart: (product: Product) => void;
  addBundle: (bundle: Bundle) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  promoCode: PromoCode | null;
  promoInput: string;
  setPromoInput: (v: string) => void;
  applyPromoCode: () => "ok" | "invalid" | "empty";
  removePromoCode: () => void;
  discountAmount: number;
  bundleDiscountTotal: number;
  finalTotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [appliedBundles, setAppliedBundles] = useState<Bundle[]>([]);

  const addToCart = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.product.stock) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const addBundle = useCallback((bundle: Bundle) => {
    setItems((prev) => {
      let updated = [...prev];
      for (const productId of bundle.productIds) {
        const product = PRODUCTS.find((p) => p.id === productId);
        if (!product) continue;
        const existing = updated.find((i) => i.product.id === productId);
        if (existing) {
          updated = updated.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(i.quantity + 1, i.product.stock) }
              : i
          );
        } else {
          updated = [...updated, { product, quantity: 1 }];
        }
      }
      return updated;
    });
    setAppliedBundles((prev) =>
      prev.find((b) => b.id === bundle.id) ? prev : [...prev, bundle]
    );
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.product.id === productId
            ? { ...i, quantity: Math.min(qty, i.product.stock) }
            : i
        )
      );
    }
  }, []);

  const applyPromoCode = useCallback((): "ok" | "invalid" | "empty" => {
    if (!promoInput.trim()) return "empty";
    const found = validatePromoCode(promoInput);
    if (found) {
      setPromoCode(found);
      return "ok";
    }
    return "invalid";
  }, [promoInput]);

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
    setPromoInput("");
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
    setPromoInput("");
    setAppliedBundles([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const price = i.product.discount
      ? i.product.price * (1 - i.product.discount / 100)
      : i.product.price;
    return sum + price * i.quantity;
  }, 0);

  const discountAmount = promoCode
    ? (() => {
        if (promoCode.productId) {
          const targetItem = items.find((i) => i.product.id === promoCode.productId);
          if (!targetItem) return 0;
          if (promoCode.discountFixed !== undefined) {
            return promoCode.discountFixed * targetItem.quantity;
          }
          const itemPrice = targetItem.product.discount
            ? targetItem.product.price * (1 - targetItem.product.discount / 100)
            : targetItem.product.price;
          return itemPrice * targetItem.quantity * (promoCode.discountPercent / 100);
        }
        if (promoCode.discountFixed !== undefined) return promoCode.discountFixed;
        return totalPrice * (promoCode.discountPercent / 100);
      })()
    : 0;

  const bundleDiscountTotal = appliedBundles.reduce((total, bundle) => {
    const allInCart = bundle.productIds.every((id) =>
      items.some((i) => i.product.id === id)
    );
    return allInCart ? total + (bundle.originalTotal - bundle.bundlePrice) : total;
  }, 0);

  const finalTotal = Math.max(0, totalPrice - discountAmount - bundleDiscountTotal);

  return (
    <CartContext.Provider
      value={{
        items, address, setAddress,
        addToCart, addBundle, removeFromCart, updateQuantity, clearCart,
        totalItems, totalPrice,
        promoCode, promoInput, setPromoInput, applyPromoCode, removePromoCode,
        discountAmount, bundleDiscountTotal, finalTotal,
        isOpen, openCart, closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
