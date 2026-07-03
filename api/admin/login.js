import { checkLockout, registerFailure } from "../_lib/lockout.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { password, deviceId } = req.body || {};
  if (!deviceId) return res.status(400).json({ error: "deviceId requerido" });

  const lock = await checkLockout(deviceId);
  if (lock.locked) {
    return res.status(423).json({ error: "locked", until: lock.until });
  }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    const until = await registerFailure(deviceId);
    return res.status(401).json({ error: "Contraseña incorrecta. Acceso bloqueado por 90 horas.", until });
  }

  return res.status(200).json({ ok: true, question: "¿Quién es el dueño?" });
}
