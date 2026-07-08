import { requireAdmin } from "../_lib/auth.js";
import { updateProduct, deleteProduct } from "../_lib/productsCore.js";

export default async function handler(req, res) {
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const product = await updateProduct(id, req.body || {});
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });
      return res.status(200).json({ product });
    } catch (err) {
      console.error("updateProduct error:", err);
      return res.status(500).json({ error: "Error al actualizar producto" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await deleteProduct(id);
      if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("deleteProduct error:", err);
      return res.status(500).json({ error: "Error al eliminar producto" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
