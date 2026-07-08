/**
 * Admin audit log — records every admin mutation to Postgres.
 * Table auto-created on first use.
 */
import { getPool } from "./db.js";

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_audit_log (
      id          SERIAL PRIMARY KEY,
      action      TEXT         NOT NULL,
      entity_type TEXT,
      entity_id   TEXT,
      entity_name TEXT,
      field       TEXT,
      old_value   TEXT,
      new_value   TEXT,
      ip          TEXT,
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `);
}

/**
 * Log a single action (no field diff) — used for CREATE / DELETE / LOGIN.
 * @param {string} action       e.g. 'CREATE_PRODUCT'
 * @param {string} entityType   e.g. 'product'
 * @param {string|null} entityId
 * @param {string|null} entityName
 * @param {string|null} ip
 */
export async function logAction(action, entityType, entityId, entityName, ip) {
  try {
    const pool = getPool();
    await ensureTable(pool);
    await pool.query(
      `INSERT INTO admin_audit_log (action, entity_type, entity_id, entity_name, ip)
       VALUES ($1, $2, $3, $4, $5)`,
      [action, entityType, entityId ?? null, entityName ?? null, ip ?? null]
    );
  } catch (err) {
    // Never let audit failures break the main flow
    console.error("auditLog.logAction error:", err?.message);
  }
}

/**
 * Log field-level changes — used for UPDATE operations.
 * @param {string} action
 * @param {string} entityType
 * @param {string} entityId
 * @param {string} entityName
 * @param {Array<{field:string, oldValue:any, newValue:any}>} changes
 * @param {string|null} ip
 */
export async function logChanges(action, entityType, entityId, entityName, changes, ip) {
  if (!changes || !changes.length) {
    return logAction(action, entityType, entityId, entityName, ip);
  }
  try {
    const pool = getPool();
    await ensureTable(pool);

    const relevant = changes.filter(
      (c) => String(c.oldValue ?? "") !== String(c.newValue ?? "")
    );
    if (!relevant.length) {
      return logAction(action + "_NO_CHANGES", entityType, entityId, entityName, ip);
    }

    const values = [];
    const placeholders = relevant.map((c, i) => {
      const base = i * 8;
      values.push(
        action,
        entityType,
        entityId ?? null,
        entityName ?? null,
        c.field,
        c.oldValue != null ? String(c.oldValue) : null,
        c.newValue != null ? String(c.newValue) : null,
        ip ?? null
      );
      return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8})`;
    });

    await pool.query(
      `INSERT INTO admin_audit_log
         (action, entity_type, entity_id, entity_name, field, old_value, new_value, ip)
       VALUES ${placeholders.join(",")}`,
      values
    );
  } catch (err) {
    console.error("auditLog.logChanges error:", err?.message);
  }
}

/**
 * Read recent audit log entries (newest first).
 * @param {number} limit
 */
export async function getAuditLog(limit = 200) {
  const pool = getPool();
  await ensureTable(pool);
  const { rows } = await pool.query(
    `SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT $1`,
    [limit]
  );
  return rows;
}
