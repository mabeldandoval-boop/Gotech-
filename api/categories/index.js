import { requireAdmin } from "../_lib/auth.js";
import { getAllCategories, createCategory } from "../_lib/categoriesCore.js";
import { logAction } from "../_lib/auditLog.js";

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const categories = await getAllCategories();
      return res.status(200).json({ categories });
    } catch (err) {
      return res.status(500).json({ error: "Error al obtener categorías" });
    }
  }

  if (req.method === "POST") {
    if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });
    const { name } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ error: "El nombre es requerido" });
    try {
      const category = await createCategory(name);
      await logAction("CREATE_CATEGORY", "category", String(category.id), category.name, getClientIp(req));
      return res.status(201).json({ category });
    } catch (err) {
      console.error("createCategory error:", err);
      return res.status(500).json({ error: "Error al crear categoría" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
