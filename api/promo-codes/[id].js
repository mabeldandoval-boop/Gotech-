import { requireAdmin } from "../_lib/auth.js";
import { deletePromoCode } from "../_lib/promoCodesCore.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Método no permitido" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query;
  try {
    const deleted = await deletePromoCode(id);
    if (!deleted) return res.status(404).json({ error: "Código no encontrado" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("deletePromoCode error:", err);
    return res.status(500).json({ error: "Error al eliminar código" });
  }
}
