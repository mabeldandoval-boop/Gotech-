import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldQuestion } from "lucide-react";
import { setAdminToken } from "@/lib/adminAuth";

type Step = "password" | "question";

export default function AdminAccess() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Contraseña incorrecta");
      } else {
        setQuestion(data.question || "¿Quién es el dueño?");
        setStep("question");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Respuesta incorrecta");
      } else {
        setAdminToken(data.token);
        navigate("/gt-panel");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen flex items-center justify-center section-grid px-4">
      <div className="w-full max-w-sm card-tech p-8">
        {step === "password" ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-neon-cyan" />
              <h1 className="font-orbitron font-black text-xl text-white">Acceso restringido</h1>
            </div>
            <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-700 border border-neon-cyan/20 focus:border-neon-cyan rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors mb-4"
              placeholder="••••••••"
            />
            {error && (
              <p className="text-red-400 text-xs font-semibold mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="btn-neon w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Continuar"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAnswerSubmit}>
            <div className="flex items-center gap-2 mb-6">
              <ShieldQuestion className="w-5 h-5 text-neon-cyan" />
              <h1 className="font-orbitron font-black text-xl text-white">Pregunta de seguridad</h1>
            </div>
            <label className="block text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
              {question}
            </label>
            <input
              type="text"
              autoFocus
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-dark-700 border border-neon-cyan/20 focus:border-neon-cyan rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors mb-4"
              placeholder="Respuesta"
            />
            {error && (
              <p className="text-red-400 text-xs font-semibold mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading || !answer}
              className="btn-neon w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Verificando..." : "Entrar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
