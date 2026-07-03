import { getAllProducts } from "../_lib/productsCore.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });
  try {
    const products = await getAllProducts();
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ error: "Error al obtener productos" });
  }
}
