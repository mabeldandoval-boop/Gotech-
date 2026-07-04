import { signAdminToken } from "../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { answer } = req.body || {};

  const expected = (process.env.ADMIN_SECURITY_ANSWER || "").trim().toLowerCase();
  const given = (answer || "").trim().toLowerCase();

  if (!given || !expected || given !== expected) {
    return res.status(401).json({ error: "Respuesta incorrecta" });
  }

  const token = signAdminToken();
  return res.status(200).json({ ok: true, token });
}
