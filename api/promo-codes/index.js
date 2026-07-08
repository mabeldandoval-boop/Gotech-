import { requireAdmin } from "../_lib/auth.js";
import { getAllPromoCodes, createPromoCode } from "../_lib/promoCodesCore.js";
import { logAction } from "../_lib/auditLog.js";

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export default async function handler(req, res) {
  // All promo-code endpoints require admin (listing codes exposes discount values)
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  if (req.method === "GET") {
    try {
      const promoCodes = await getAllPromoCodes();
      return res.status(200).json({ promoCodes });
    } catch (err) {
      return res.status(500).json({ error: "Error al obtener códigos" });
    }
  }

  if (req.method === "POST") {
    const { code } = req.body || {};
    if (!code?.trim()) return res.status(400).json({ error: "El código es requerido" });
    try {
      const promoCode = await createPromoCode(req.body);
      await logAction("CREATE_PROMO_CODE", "promo_code", String(promoCode.id), promoCode.code, getClientIp(req));
      return res.status(201).json({ promoCode });
    } catch (err) {
      console.error("createPromoCode error:", err);
      if (err.code === "23505") return res.status(409).json({ error: "El código ya existe" });
      return res.status(500).json({ error: "Error al crear código" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
