import { requireAdmin } from "../_lib/auth.js";
import { getProductById, updateProduct, deleteProduct } from "../_lib/productsCore.js";
import { logAction, logChanges } from "../_lib/auditLog.js";

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

// Human-readable field names for the audit log
const FIELD_LABELS = {
  name:          "Nombre",
  shortName:     "Nombre corto",
  price:         "Precio",
  originalPrice: "Precio original",
  discount:      "Descuento (%)",
  stock:         "Stock",
  image:         "Imagen",
  badge:         "Badge",
  description:   "Descripción",
  available:     "Disponible",
  category:      "Categoría",
  promoCode:     "Código promo",
};

export default async function handler(req, res) {
  if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });

  const { id } = req.query;
  const ip = getClientIp(req);

  if (req.method === "PUT") {
    try {
      // Fetch before-state for diff
      const before = await getProductById(id);
      const product = await updateProduct(id, req.body || {});
      if (!product) return res.status(404).json({ error: "Producto no encontrado" });

      // Build change list
      if (before) {
        const changes = Object.entries(FIELD_LABELS)
          .filter(([key]) => {
            const oldVal = before[key];
            const newVal = product[key];
            return String(oldVal ?? "") !== String(newVal ?? "");
          })
          .map(([key, label]) => ({
            field:    label,
            oldValue: before[key],
            newValue: product[key],
          }));
        await logChanges("UPDATE_PRODUCT", "product", id, product.name, changes, ip);
      } else {
        await logAction("UPDATE_PRODUCT", "product", id, product.name, ip);
      }

      return res.status(200).json({ product });
    } catch (err) {
      console.error("updateProduct error:", err);
      return res.status(500).json({ error: "Error al actualizar producto" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const before = await getProductById(id);
      const deleted = await deleteProduct(id);
      if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
      await logAction(
        "DELETE_PRODUCT",
        "product",
        id,
        before?.name ?? id,
        ip
      );
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("deleteProduct error:", err);
      return res.status(500).json({ error: "Error al eliminar producto" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
