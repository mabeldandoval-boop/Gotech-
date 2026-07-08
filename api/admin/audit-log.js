import { requireAdmin } from "../_lib/auth.js";
import { getAuditLog } from "../_lib/auditLog.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  try {
    const limit = Math.min(Number(req.query.limit) || 200, 500);
    const entries = await getAuditLog(limit);
    return res.status(200).json({ entries });
  } catch (err) {
    console.error("audit-log error:", err);
    return res.status(500).json({ error: "Error al obtener el registro" });
  }
}
