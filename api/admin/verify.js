import { signAdminToken } from "../_lib/auth.js";
import { checkRateLimit, recordFailedAttempt, clearAttempts } from "../_lib/rateLimiter.js";
import { logAction } from "../_lib/auditLog.js";

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const ip = getClientIp(req);

  // Rate limit check (shared counter with login step)
  const limit = await checkRateLimit(ip);
  if (limit.blocked) {
    const mins = Math.ceil(limit.remainingMs / 60000);
    return res.status(429).json({
      error: `Demasiados intentos fallidos. Intenta de nuevo en ${mins} minuto${mins !== 1 ? "s" : ""}.`,
    });
  }

  const { answer } = req.body || {};

  const expected = (process.env.ADMIN_SECURITY_ANSWER || "").trim().toLowerCase();
  const given    = (answer || "").trim().toLowerCase();

  if (!given || !expected || given !== expected) {
    await recordFailedAttempt(ip);
    return res.status(401).json({ error: "Respuesta incorrecta" });
  }

  // Both steps passed — clear rate limit + issue token
  await clearAttempts(ip);
  const token = signAdminToken();

  // Audit log: successful admin login
  await logAction("ADMIN_LOGIN", "admin", null, "admin", ip);

  return res.status(200).json({ ok: true, token });
}
