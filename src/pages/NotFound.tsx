import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center section-grid">
      <div className="text-center px-4">
        <p className="font-orbitron font-black text-8xl text-neon-cyan/20 mb-4">404</p>
        <h1 className="font-orbitron font-black text-2xl text-white mb-3">Página no encontrada</h1>
        <p className="text-white/50 mb-8">La página que buscas no existe.</p>
        <Link to="/" className="btn-neon inline-flex items-center gap-2">
          <Home className="w-4 h-4" />
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
