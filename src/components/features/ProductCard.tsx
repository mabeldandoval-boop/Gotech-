import { Link } from "react-router-dom";
import { CheckCircle, ShoppingCart, Plus } from "lucide-react";
import { Product } from "@/types";
import { getDiscountedPrice, getBluetoothDynamicDiscount } from "@/constants/products";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const inCart = items.find((i) => i.product.id === product.id);
  const btDiscount = getBluetoothDynamicDiscount();
  const isDynBt = product.id === "bluetooth-5-0" && btDiscount > 0;
  const finalPrice = isDynBt ? getDiscountedPrice(product, btDiscount) : getDiscountedPrice(product);
  const activeDiscount = isDynBt ? btDiscount : product.discount;
  const stockLow = product.stock > 0 && product.stock <= 3;

  return (
    <div className="card-tech group overflow-hidden animate-slide-up flex flex-col">
      {/* Image */}
      <Link to={`/producto/${product.id}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-dark-700 flex items-center justify-center relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-sm uppercase tracking-wider">Sin stock</span>
            </div>
          )}
        </div>

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <div className="badge-neon text-[10px]">{product.badge}</div>
          )}
          {activeDiscount && activeDiscount > 0 && (
            <div className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
              -{activeDiscount}% OFF
            </div>
          )}
        </div>

        {/* Stock badge */}
        <div className="absolute top-3 right-3">
          {product.stock === 0 ? (
            <div className="bg-red-500/20 border border-red-400/50 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              Agotado
            </div>
          ) : stockLow ? (
            <div className="bg-orange-500/20 border border-orange-400/50 text-orange-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
              Últimas {product.stock}
            </div>
          ) : (
            <div className="bg-green-500/20 border border-green-400/50 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Stock: {product.stock}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-neon-cyan/60 uppercase tracking-wider font-semibold mb-1">
          {product.category}
        </p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="text-white font-bold text-base leading-tight mb-3 hover:text-neon-cyan transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-white/50 mb-4">
          <CheckCircle className="w-3 h-3 text-neon-cyan shrink-0" />
          <span>{product.features[0]}</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-2xl font-black text-neon-cyan glow-text">
              ${finalPrice.toFixed(2)}
            </span>
            {activeDiscount && activeDiscount > 0 && (
              <span className="text-white/30 text-sm line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="text-[10px] text-green-400 font-semibold mb-3">🚚 ENVÍO GRATIS disponible</p>

          {/* Add to cart */}
          <button
            onClick={() => product.stock > 0 && addToCart(product)}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200
              ${product.stock === 0
                ? "bg-dark-600 border border-white/10 text-white/30 cursor-not-allowed"
                : inCart
                  ? "bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-900"
                  : "btn-neon"
              }`}
          >
            {inCart ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                En carrito ({inCart.quantity})
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                Agregar al carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
