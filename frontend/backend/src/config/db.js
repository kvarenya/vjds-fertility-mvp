// Central Postgres connection pool.
// Works with either a single DATABASE_URL (Supabase, Render, Railway)
// or individual PG* variables for a local database.

const { Pool } = require("pg");
require("dotenv").config();

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      // Hosted Postgres (Supabase etc.) requires SSL. The relaxed setting
      // is fine for a managed provider whose certificate chain isn't in
      // Node's default trust store.
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
    });

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

module.exports = pool;
