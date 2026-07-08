import { getClientIp } from "../_lib/auth.js";
import { checkRateLimit, recordFailedAttempt } from "../_lib/rateLimiter.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const ip = getClientIp(req);

  // Rate limit check
  const limit = await checkRateLimit(ip);
  if (limit.blocked) {
    const mins = Math.ceil(limit.remainingMs / 60000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${mins} minuto${mins !== 1 ? "s" : ""}.`,
    });
  }

  const { password } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    await recordFailedAttempt(ip);
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  // Password correct — do NOT clear attempts yet (cleared after full 2-step auth)
  return res.status(200).json({ ok: true, question: "¿Quién es el dueño?" });
}
