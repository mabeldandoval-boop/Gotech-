import { getPool } from "./db.js";

const LOCK_HOURS = 90;

export async function checkLockout(deviceId) {
  const pool = getPool();
  const { rows } = await pool.query(
    "SELECT locked_until FROM admin_lockouts WHERE device_id = $1",
    [deviceId]
  );
  if (rows.length && rows[0].locked_until && new Date(rows[0].locked_until) > new Date()) {
    return { locked: true, until: rows[0].locked_until };
  }
  return { locked: false };
}

export async function registerFailure(deviceId) {
  const pool = getPool();
  const until = new Date(Date.now() + LOCK_HOURS * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO admin_lockouts (device_id, locked_until, last_attempt, failed_count)
     VALUES ($1, $2, NOW(), 1)
     ON CONFLICT (device_id) DO UPDATE SET
       locked_until = $2,
       last_attempt = NOW(),
       failed_count = admin_lockouts.failed_count + 1`,
    [deviceId, until]
  );
  return until;
}

export async function clearLockout(deviceId) {
  const pool = getPool();
  await pool.query("DELETE FROM admin_lockouts WHERE device_id = $1", [deviceId]);
}
