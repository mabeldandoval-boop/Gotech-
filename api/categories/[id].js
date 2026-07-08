import { requireAdmin } from "../_lib/auth.js";
import { deleteCategory } from "../_lib/categoriesCore.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Método no permitido" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query;
  try {
    const deleted = await deleteCategory(id);
    if (!deleted) return res.status(404).json({ error: "Categoría no encontrada" });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ error: "Error al eliminar categoría" });
  }
}
