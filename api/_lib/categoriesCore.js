import { getPool } from "./db.js";

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id   SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export async function getAllCategories() {
  const pool = getPool();
  await ensureTable(pool);
  const { rows } = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  return rows.map((r) => ({ id: String(r.id), name: r.name }));
}

export async function createCategory(name) {
  const pool = getPool();
  await ensureTable(pool);
  const { rows } = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING *",
    [name.trim()]
  );
  return { id: String(rows[0].id), name: rows[0].name };
}

export async function deleteCategory(id) {
  const pool = getPool();
  await ensureTable(pool);
  const { rowCount } = await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  return rowCount > 0;
}
