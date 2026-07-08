/**
 * Admin audit log — records every admin mutation to Postgres.
 * Stores a human-readable `description` plus structured fields.
 * Table auto-created on first use; `description` column added if missing.
 */
import { getPool } from "./db.js";

// Fields that should be formatted as currency ($)
const CURRENCY_FIELDS = new Set(["Precio", "Precio original"]);
// Fields that should be formatted as percentage (%)
const PERCENT_FIELDS  = new Set(["Descuento (%)"]);

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_audit_log (
      id          SERIAL PRIMARY KEY,
      description TEXT         NOT NULL DEFAULT '',
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
  // Add description column to existing installations that don't have it yet
  await pool.query(`
    ALTER TABLE admin_audit_log ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT ''
  `);
}

/* ── Human-readable formatters ─────────────────────────────────────────── */

function fmtValue(field, raw) {
  if (raw == null || raw === "") return "—";
  if (CURRENCY_FIELDS.has(field)) return `$${Number(raw).toFixed(2)}`;
  if (PERCENT_FIELDS.has(field))  return `${raw}%`;
  if (raw === "true")  return "Sí";
  if (raw === "false") return "No";
  return raw;
}

function buildActionDescription(action, entityName) {
  const n = entityName ? `«${entityName}»` : "";
  switch (action) {
    case "ADMIN_LOGIN":       return "Inicio de sesión del administrador";
    case "CREATE_PRODUCT":    return `Creó el producto ${n}`;
    case "DELETE_PRODUCT":    return `Eliminó el producto ${n}`;
    case "UPDATE_PRODUCT":    return `Actualizó el producto ${n} (sin cambios detectados)`;
    case "UPDATE_PRODUCT_NO_CHANGES": return `Guardó el producto ${n} sin cambios`;
    case "CREATE_PROMO_CODE": return `Creó el código de descuento ${n}`;
    case "DELETE_PROMO_CODE": return `Eliminó el código de descuento ${n}`;
    case "CREATE_CATEGORY":   return `Creó la categoría ${n}`;
    case "DELETE_CATEGORY":   return `Eliminó la categoría ${n}`;
    default:                  return `${action}${n ? ` — ${n}` : ""}`;
  }
}

function buildChangeDescription(field, entityName, oldRaw, newRaw) {
  const n  = entityName ? `«${entityName}»` : "";
  const ov = fmtValue(field, oldRaw);
  const nv = fmtValue(field, newRaw);

  switch (field) {
    case "Precio":          return `Cambió el precio de ${n} de ${ov} a ${nv}`;
    case "Precio original": return `Cambió el precio original de ${n} de ${ov} a ${nv}`;
    case "Descuento (%)":   return `Cambió el descuento de ${n} de ${ov} a ${nv}`;
    case "Stock":           return `Cambió el stock de ${n} de ${ov} a ${nv} unidades`;
    case "Nombre":          return `Renombró ${n} a ${nv}`;
    case "Nombre corto":    return `Cambió el nombre corto de ${n} a ${nv}`;
    case "Descripción":     return `Cambió la descripción de ${n}`;
    case "Imagen":          return `Cambió la imagen de ${n}`;
    case "Badge":           return `Cambió el badge de ${n} de ${ov} a ${nv}`;
    case "Disponible":      return `Cambió disponibilidad de ${n}: ${ov} → ${nv}`;
    case "Categoría":       return `Cambió la categoría de ${n} de ${ov} a ${nv}`;
    case "Código promo":    return `Cambió el código promo de ${n} de ${ov} a ${nv}`;
    default:                return `Cambió ${field} de ${n} de ${ov} a ${nv}`;
  }
}

/* ── NEVER log any of these fields ────────────────────────────────────── */
const BLOCKED_FIELDS = new Set([
  "password", "contraseña", "secret", "token", "jwt",
  "ADMIN_PASSWORD", "ADMIN_JWT_SECRET", "ADMIN_SECURITY_ANSWER",
]);

function isSafeField(field) {
  return !BLOCKED_FIELDS.has((field || "").toLowerCase());
}

/* ── Public API ─────────────────────────────────────────────────────────── */

/**
 * Log a single action (CREATE / DELETE / LOGIN — no field diff).
 */
export async function logAction(action, entityType, entityId, entityName, ip) {
  // Never log if this looks like a sensitive action being called incorrectly
  if (action?.toLowerCase().includes("password")) return;
  try {
    const pool = getPool();
    await ensureTable(pool);
    const description = buildActionDescription(action, entityName);
    await pool.query(
      `INSERT INTO admin_audit_log
         (description, action, entity_type, entity_id, entity_name, ip)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [description, action, entityType ?? null, entityId ?? null, entityName ?? null, ip ?? null]
    );
  } catch (err) {
    console.error("auditLog.logAction error:", err?.message);
  }
}

/**
 * Log field-level changes for UPDATE operations.
 * One row per changed field, each with its own human-readable description.
 * Sensitive fields (passwords, tokens) are silently skipped.
 */
export async function logChanges(action, entityType, entityId, entityName, changes, ip) {
  if (!changes || !changes.length) {
    return logAction(action, entityType, entityId, entityName, ip);
  }
  try {
    const pool = getPool();
    await ensureTable(pool);

    const relevant = changes.filter(
      (c) =>
        isSafeField(c.field) &&
        String(c.oldValue ?? "") !== String(c.newValue ?? "")
    );

    if (!relevant.length) {
      return logAction(action + "_NO_CHANGES", entityType, entityId, entityName, ip);
    }

    const values = [];
    const placeholders = relevant.map((c, i) => {
      const base = i * 9;
      const description = buildChangeDescription(
        c.field, entityName,
        c.oldValue != null ? String(c.oldValue) : null,
        c.newValue != null ? String(c.newValue) : null
      );
      values.push(
        description,
        action,
        entityType ?? null,
        entityId ?? null,
        entityName ?? null,
        c.field,
        c.oldValue != null ? String(c.oldValue) : null,
        c.newValue != null ? String(c.newValue) : null,
        ip ?? null
      );
      return `($${base+1},$${base+2},$${base+3},$${base+4},$${base+5},$${base+6},$${base+7},$${base+8},$${base+9})`;
    });

    await pool.query(
      `INSERT INTO admin_audit_log
         (description, action, entity_type, entity_id, entity_name, field, old_value, new_value, ip)
       VALUES ${placeholders.join(",")}`,
      values
    );
  } catch (err) {
    console.error("auditLog.logChanges error:", err?.message);
  }
}

/**
 * Read recent audit log entries (newest first).
 */
export async function getAuditLog(limit = 200) {
  const pool = getPool();
  await ensureTable(pool);
  const { rows } = await pool.query(
    `SELECT id, description, action, entity_type, entity_name, field,
            old_value, new_value, ip, created_at
     FROM admin_audit_log
     ORDER BY created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}
