import { requireAdmin } from "../_lib/auth.js";
import { getAllProducts, createProduct } from "../_lib/productsCore.js";
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
      const products = await getAllProducts();
      return res.status(200).json({ products });
    } catch (err) {
      return res.status(500).json({ error: "Error al obtener productos" });
    }
  }

  if (req.method === "POST") {
    if (!requireAdmin(req)) return res.status(401).json({ error: "No autorizado" });
    try {
      const product = await createProduct(req.body || {});
      await logAction("CREATE_PRODUCT", "product", product.id, product.name, getClientIp(req));
      return res.status(201).json({ product });
    } catch (err) {
      console.error("createProduct error:", err);
      return res.status(500).json({ error: "Error al crear producto" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
