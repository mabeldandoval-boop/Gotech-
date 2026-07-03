import { checkLockout, registerFailure } from "../_lib/lockout.js";
import { signAdminToken } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { answer, deviceId } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: "deviceId requerido" });

  const lock = await checkLockout(deviceId);
  if (lock.locked) {
    return res.status(423).json({ error: "locked", until: lock.until });
  }

  const expected = (process.env.ADMIN_SECURITY_ANSWER || "").trim().toLowerCase();
  const given = (answer || "").trim().toLowerCase();

  if (!given || !expected || given !== expected) {
    const until = await registerFailure(deviceId);
    return res.status(401).json({ error: "Respuesta incorrecta. Acceso bloqueado por 90 horas.", until });
  }

  const token = signAdminToken();
  return res.status(200).json({ ok: true, token });
}
