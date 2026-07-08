/**
 * Postgres-backed rate limiter for admin login.
 * 5 failed attempts → 15-minute IP lockout.
 */
import { getPool } from "./db.js";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

async function ensureTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_login_attempts (
      ip           TEXT PRIMARY KEY,
      attempts     INT  NOT NULL DEFAULT 0,
      locked_until TIMESTAMPTZ,
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

/** Returns { blocked: true, remainingMs } or { blocked: false } */
export async function checkRateLimit(ip) {
  const pool = getPool();
  await ensureTable(pool);

  const { rows } = await pool.query(
    "SELECT attempts, locked_until FROM admin_login_attempts WHERE ip = $1",
    [ip]
  );
  if (!rows.length) return { blocked: false };

  const row = rows[0];
  if (row.locked_until) {
    const remaining = new Date(row.locked_until).getTime() - Date.now();
    if (remaining > 0) {
      return { blocked: true, remainingMs: remaining };
    }
    // Lockout expired — reset
    await pool.query(
      "UPDATE admin_login_attempts SET attempts = 0, locked_until = NULL, updated_at = NOW() WHERE ip = $1",
      [ip]
    );
  }
  return { blocked: false };
}

/** Call this on every failed login attempt. */
export async function recordFailedAttempt(ip) {
  const pool = getPool();
  await ensureTable(pool);

  await pool.query(`
    INSERT INTO admin_login_attempts (ip, attempts, locked_until, updated_at)
    VALUES ($1, 1, NULL, NOW())
    ON CONFLICT (ip) DO UPDATE SET
      attempts   = admin_login_attempts.attempts + 1,
      locked_until = CASE
        WHEN admin_login_attempts.attempts + 1 >= $2
        THEN NOW() + ($3::BIGINT || ' milliseconds')::INTERVAL
        ELSE NULL
      END,
      updated_at = NOW()
  `, [ip, MAX_ATTEMPTS, LOCKOUT_MS]);
}

/** Call this on successful authentication to clear the counter. */
export async function clearAttempts(ip) {
  const pool = getPool();
  await ensureTable(pool);
  await pool.query(
    "DELETE FROM admin_login_attempts WHERE ip = $1",
    [ip]
  );
}
