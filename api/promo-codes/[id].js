import { requireAdmin } from "../_lib/auth.js";
import { getPromoCodeById, deletePromoCode } from "../_lib/promoCodesCore.js";
import { logAction } from "../_lib/auditLog.js";

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Método no permitido" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query;
  try {
    const before = await getPromoCodeById(id);
    const deleted = await deletePromoCode(id);
    if (!deleted) return res.status(404).json({ error: "Código no encontrado" });
    await logAction("DELETE_PROMO_CODE", "promo_code", id, before?.code ?? id, getClientIp(req));
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("deletePromoCode error:", err);
    return res.status(500).json({ error: "Error al eliminar código" });
  }
}
