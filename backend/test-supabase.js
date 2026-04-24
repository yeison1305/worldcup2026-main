// Test con pooler de Supabase
require('dotenv').config({ path: './.env' });

console.log('🔍 Testing Supabase Pooler Connection...\n');

const { Pool } = require('pg');

// Pooler de Supabase (puerto 6543)
const poolerUrl = 'postgres://postgres:5pPvwysLdQ%2E2aAh@zrpmibwlmvsyfavbqdxd.supabase.co:6543/postgres';

console.log('📡 URL:', poolerUrl.replace(/:[^:]+@/, ':****@'));

const pool = new Pool({
  connectionString: poolerUrl,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 20000
});

pool.query('SELECT 1 as test, now() as time, version() as pg_version')
  .then(r => {
    console.log('✅ CONEXIÓN EXITOSA!');
    console.log('Result:', JSON.stringify(r.rows[0], null, 2));
    pool.end();
    process.exit(0);
  })
  .catch(e => {
    console.log('❌ Error:', e.message);
    console.log('Code:', e.code);
    pool.end();
    process.exit(1);
  });