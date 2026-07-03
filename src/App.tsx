import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import { ProductsProvider } from "@/hooks/useProducts";
import Navbar from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import DeliveryInfo from "@/pages/DeliveryInfo";
import AdminPanel from "@/pages/AdminPanel";
import Offers from "@/pages/Offers";
import NotFound from "@/pages/NotFound";
import AdminAccess from "@/pages/AdminAccess";
import AdminProducts from "@/pages/AdminProducts";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={base}>
      <ProductsProvider>
        <CartProvider>
          <div className="min-h-screen bg-dark-900 font-montserrat">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogo" element={<Catalog />} />
                <Route path="/producto/:id" element={<ProductDetail />} />
                <Route path="/envios" element={<DeliveryInfo />} />
                <Route path="/ofertas" element={<Offers />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/gt-acceso" element={<AdminAccess />} />
                <Route path="/gt-panel" element={<AdminProducts />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}
