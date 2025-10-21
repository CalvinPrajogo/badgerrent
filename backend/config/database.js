import pkg from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
// This allows us to keep sensitive info (like passwords) out of our code
dotenv.config();

// Destructure Pool from the pg package
// Pool is a class that manages multiple database connections
const { Pool } = pkg;

/**
 * PostgreSQL Connection Pool
 * 
 * Why these settings matter:
 * - host: Where PostgreSQL server is running (localhost for local dev)
 * - port: PostgreSQL's default port is 5432
 * - database: Which database to use (we created 'badgerrent')
 * - user: Your PostgreSQL username (usually your Mac username)
 * - password: Your PostgreSQL password (often blank for local dev)
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'badgerrent',
  user: process.env.DB_USER || 'calvinprajogo',
  password: process.env.DB_PASSWORD || '',
});

/**
 * Connection event listeners
 * These help us debug connection issues
 */
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on PostgreSQL client', err);
  process.exit(-1); // Exit the app if database connection fails
});

/**
 * Export the pool so other files can use it
 * Usage in routes:
 * 
 * import pool from '../config/database.js';
 * const result = await pool.query('SELECT * FROM properties');
 */
export default pool;
