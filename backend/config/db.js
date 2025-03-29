import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const { NEON_DB_STRING } = process.env;

const pool = new Pool({
  connectionString: NEON_DB_STRING,
  ssl: {
    rejectUnauthorized: false, // Needed for Render
  },
});

export default pool;
