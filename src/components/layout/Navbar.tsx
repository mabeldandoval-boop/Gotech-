import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/components/features/CartDrawer";

const navLinks = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/#combos", label: "Arma tu Combo" },
  { href: "/#agenda", label: "Agendar Envío" },
  { href: "/envios", label: "Envíos Gratis" },
  { href: "/ofertas", label: "🔥 Ofertas" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { totalItems, openCart, isOpen } = useCart();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-md border-b border-neon-cyan/20">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/gotech-logo.png"
              alt="GoTech"
              className="h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,207,255,0.6)]"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith("/#");
              const isActive = !isAnchor && location.pathname === link.href;
              if (isAnchor) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold uppercase tracking-wider transition-all duration-200 text-white/70 hover:text-neon-cyan"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-semibold uppercase tracking-wider transition-all duration-200
                    ${isActive ? "text-neon-cyan glow-text" : "text-white/70 hover:text-neon-cyan"}`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-dark-700 border border-neon-cyan/20 hover:border-neon-cyan/60 hover:shadow-neon-sm rounded-xl px-4 py-2 transition-all duration-200 group"
              aria-label="Carrito"
            >
              <ShoppingCart className="w-4 h-4 text-neon-cyan" />
              <span className="text-white/70 group-hover:text-white text-sm font-semibold">Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon-cyan text-dark-900 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse-neon">
                  {totalItems}
                </span>
              )}
            </button>

            <a
              href="https://wa.me/50379433144"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon text-xs px-4 py-2"
            >
              WhatsApp
            </a>
          </div>

          {/* Mobile: Cart + Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative text-neon-cyan p-2"
              aria-label="Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-neon-cyan text-dark-900 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="text-neon-cyan p-2"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-dark-800 border-t border-neon-cyan/20 animate-fade-in">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith("/#");
              const isActive = !isAnchor && location.pathname === link.href;
              if (isAnchor) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b border-neon-cyan/10 text-white/70 hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-4 text-sm font-semibold uppercase tracking-wider border-b border-neon-cyan/10 transition-colors
                    ${isActive ? "text-neon-cyan" : "text-white/70 hover:text-neon-cyan"}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://wa.me/50379433144"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-6 py-4 text-sm font-bold text-neon-cyan uppercase tracking-wider"
            >
              💬 Contactar por WhatsApp
            </a>
          </div>
        )}
      </nav>

      {/* Cart Drawer rendered here so it's above everything */}
      <CartDrawer />
    </>
  );
}
