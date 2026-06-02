import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/useCart";
import Navbar from "@/components/layout/Navbar";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import DeliveryInfo from "@/pages/DeliveryInfo";
import AdminPanel from "@/pages/AdminPanel";
import Offers from "@/pages/Offers";
import NotFound from "@/pages/NotFound";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={base}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
