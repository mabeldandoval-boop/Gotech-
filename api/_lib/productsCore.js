import { getPool } from "./db.js";

export function mapRow(r) {
  return {
    id: r.id,
    name: r.name,
    shortName: r.short_name,
    price: Number(r.price),
    originalPrice: r.original_price != null ? Number(r.original_price) : undefined,
    discount: r.discount != null ? Number(r.discount) : undefined,
    stock: r.stock,
    image: r.image,
    badge: r.badge || undefined,
    description: r.description,
    features: r.features || [],
    available: r.available,
    category: r.category,
  };
}

export async function getAllProducts() {
  const pool = getPool();
  const { rows } = await pool.query("SELECT * FROM products ORDER BY sort_order ASC, name ASC");
  return rows.map(mapRow);
}

export async function updateProduct(id, fields) {
  const pool = getPool();
  const {
    name = null,
    shortName = null,
    price = null,
    stock = null,
    image = null,
    badge = null,
    description = null,
    features = null,
    available = null,
    category = null,
    discount = null,
  } = fields || {};

  const { rows } = await pool.query(
    `UPDATE products SET
       name = COALESCE($2, name),
       short_name = COALESCE($3, short_name),
       price = COALESCE($4, price),
       stock = COALESCE($5, stock),
       image = COALESCE($6, image),
       badge = COALESCE($7, badge),
       description = COALESCE($8, description),
       features = COALESCE($9::jsonb, features),
       available = COALESCE($10, available),
       category = COALESCE($11, category),
       discount = COALESCE($12, discount),
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      name,
      shortName,
      price,
      stock,
      image,
      badge,
      description,
      features ? JSON.stringify(features) : null,
      available,
      category,
      discount,
    ]
  );
  if (!rows.length) return null;
  return mapRow(rows[0]);
}
