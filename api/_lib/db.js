import pg from "pg";

const { Pool } = pg;

let pool;

function resolveConnectionString() {
  return (
    process.env.Database_POSTGRES_URL ||
    process.env.Database_DATABASE_URL ||
    process.env.DATABASE_URL
  );
}

export function getPool() {
  if (!pool) {
    const connectionString = resolveConnectionString();
    pool = new Pool({
      connectionString,
      ssl: connectionString?.includes("localhost") ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}
