import { requireAdmin } from "../_lib/auth.js";
import { getAllPromoCodes, createPromoCode } from "../_lib/promoCodesCore.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const promoCodes = await getAllPromoCodes();
      return res.status(200).json({ promoCodes });
    } catch (err) {
      return res.status(500).json({ error: "Error al obtener códigos" });
    }
  }

  if (req.method === "POST") {
    if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });
    const { code } = req.body || {};
    if (!code?.trim()) return res.status(400).json({ error: "El código es requerido" });
    try {
      const promoCode = await createPromoCode(req.body);
      return res.status(201).json({ promoCode });
    } catch (err) {
      console.error("createPromoCode error:", err);
      if (err.code === "23505") return res.status(409).json({ error: "El código ya existe" });
      return res.status(500).json({ error: "Error al crear código" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
