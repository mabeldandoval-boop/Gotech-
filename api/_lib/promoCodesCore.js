import { getPool } from "./db.js";

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS promo_codes (
      id               SERIAL PRIMARY KEY,
      code             TEXT NOT NULL UNIQUE,
      label            TEXT NOT NULL DEFAULT '',
      discount_percent NUMERIC,
      discount_fixed   NUMERIC,
      description      TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function mapRow(r) {
  return {
    id: String(r.id),
    code: r.code,
    label: r.label,
    discountPercent: r.discount_percent != null ? Number(r.discount_percent) : null,
    discountFixed: r.discount_fixed != null ? Number(r.discount_fixed) : null,
    description: r.description || null,
  };
}

export async function getAllPromoCodes() {
  const pool = getPool();
  await ensureTable(pool);
  const { rows } = await pool.query("SELECT * FROM promo_codes ORDER BY code ASC");
  return rows.map(mapRow);
}

export async function createPromoCode(fields) {
  const pool = getPool();
  await ensureTable(pool);
  const {
    code = "",
    label = "",
    discountPercent = null,
    discountFixed = null,
    description = null,
  } = fields || {};

  const { rows } = await pool.query(
    `INSERT INTO promo_codes (code, label, discount_percent, discount_fixed, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      code.trim().toUpperCase(),
      label.trim(),
      discountPercent || null,
      discountFixed || null,
      description || null,
    ]
  );
  return mapRow(rows[0]);
}

export async function deletePromoCode(id) {
  const pool = getPool();
  await ensureTable(pool);
  const { rowCount } = await pool.query("DELETE FROM promo_codes WHERE id = $1", [id]);
  return rowCount > 0;
}
