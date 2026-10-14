// ============================================================
// db.js - the connection to our own Postgres (replaces the Supabase client)
// ============================================================
//
// WHY THIS FILE EXISTS
// Before: server.js -> supabase-js -> internet -> Supabase's API (PostgREST) -> Postgres
// Now:    server.js -> this file (the "pg" driver) -> Postgres in Docker, spoken to directly in SQL
//
// A "pool" keeps a few database connections open and lends them out, so each request
// doesn't pay the cost of opening a brand-new connection.

// Load .env HERE as well. With "import", every imported file runs BEFORE the code in server.js,
// so dotenv.config() in server.js would run too late and DATABASE_URL would still be empty.
import 'dotenv/config';
import pg from 'pg';

const { Pool, types } = pg;

// Postgres DATE columns (dob): keep them as plain text like '2000-01-31'.
// By default pg turns them into JavaScript Date objects at local midnight, which can shift
// the date by a day when sent to the browser. Supabase returned text, so this keeps things identical.
types.setTypeParser(1082, (value) => value);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // postgres://USER:PASSWORD@HOST:PORT/DATABASE
  max: 10, // at most 10 connections at once (plenty for this site)
  idleTimeoutMillis: 30_000,
});

// If a connection that is sitting idle breaks (e.g. the database restarts), log it instead of crashing
pool.on('error', (err) => {
  console.error('Postgres pool error:', err.message);
});

// Run one SQL statement. ALWAYS pass user input in `params` ($1, $2 ... in the SQL), never glue it
// into the SQL text yourself. The driver sends the values separately, which makes SQL injection impossible.
export const query = (text, params) => pool.query(text, params);

// Run several statements as one all-or-nothing unit (a "transaction").
// If anything inside throws, every change is undone (ROLLBACK).
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release(); // give the connection back to the pool
  }
}

export default { query, pool, withTransaction };