import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Product } from "@/types";
import { PromoCode, validatePromoCode } from "@/constants/promoCodes";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  address: string;
  setAddress: (addr: string) => void;
  addToCart: (product: Product) => void;
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

  const clearCart = useCallback(() => { setItems([]); setPromoCode(null); setPromoInput(""); }, []);
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
          // Use fixed discount amount if specified (e.g. $0.80 per unit)
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
  const finalTotal = Math.max(0, totalPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items, address, setAddress,
        addToCart, removeFromCart, updateQuantity, clearCart,
        totalItems, totalPrice,
        promoCode, promoInput, setPromoInput, applyPromoCode, removePromoCode,
        discountAmount, finalTotal,
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
