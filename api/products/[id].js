import { requireAdmin } from "../_lib/auth.js";
import { updateProduct } from "../_lib/productsCore.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Método no permitido" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query;
  try {
    const product = await updateProduct(id, req.body || {});
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ error: "Error al actualizar producto" });
  }
}
