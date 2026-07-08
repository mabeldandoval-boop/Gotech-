import { randomUUID } from "node:crypto";
import { getPool } from "./db.js";

async function ensureColumns(pool) {
  await pool.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_zones JSONB;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS promo_code TEXT;
  `);
}

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
    shippingZones: r.shipping_zones || [],
    promoCode: r.promo_code || null,
  };
}

export async function getAllProducts() {
  const pool = getPool();
  await ensureColumns(pool);
  const { rows } = await pool.query("SELECT * FROM products ORDER BY sort_order ASC, name ASC");
  return rows.map(mapRow);
}

export async function createProduct(fields) {
  const pool = getPool();
  await ensureColumns(pool);

  const {
    name = "",
    shortName = "",
    price = 0,
    originalPrice = null,
    discount = null,
    stock = 0,
    image = "",
    badge = null,
    description = "",
    features = [],
    available = true,
    category = "",
    shippingZones = [],
    promoCode = null,
  } = fields || {};

  const { rows } = await pool.query(
    `INSERT INTO products
       (id, name, short_name, price, original_price, discount, stock, image, badge,
        description, features, available, category, shipping_zones, promo_code, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12, $13, $14::jsonb, $15,
             (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM products))
     RETURNING *`,
    [
      randomUUID(),
      name,
      shortName,
      price,
      originalPrice || null,
      discount || null,
      stock,
      image,
      badge || null,
      description,
      JSON.stringify(features),
      available,
      category,
      JSON.stringify(shippingZones),
      promoCode || null,
    ]
  );
  return mapRow(rows[0]);
}

export async function updateProduct(id, fields) {
  const pool = getPool();
  await ensureColumns(pool);

  const {
    name = null,
    shortName = null,
    price = null,
    originalPrice = null,
    stock = null,
    image = null,
    badge = null,
    description = null,
    features = null,
    available = null,
    category = null,
    discount = null,
    shippingZones = null,
    promoCode = null,
  } = fields || {};

  const { rows } = await pool.query(
    `UPDATE products SET
       name            = COALESCE($2, name),
       short_name      = COALESCE($3, short_name),
       price           = COALESCE($4, price),
       stock           = COALESCE($5, stock),
       image           = COALESCE($6, image),
       badge           = COALESCE($7, badge),
       description     = COALESCE($8, description),
       features        = COALESCE($9::jsonb, features),
       available       = COALESCE($10, available),
       category        = COALESCE($11, category),
       discount        = COALESCE($12, discount),
       original_price  = COALESCE($13, original_price),
       shipping_zones  = COALESCE($14::jsonb, shipping_zones),
       promo_code      = COALESCE($15, promo_code),
       updated_at      = NOW()
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
      originalPrice,
      shippingZones ? JSON.stringify(shippingZones) : null,
      promoCode,
    ]
  );
  if (!rows.length) return null;
  return mapRow(rows[0]);
}

export async function deleteProduct(id) {
  const pool = getPool();
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return rowCount > 0;
}
