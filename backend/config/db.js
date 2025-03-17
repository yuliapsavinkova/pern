import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const { EXTERNAL_DB_URL_STRING, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const pool = new Pool({
  connectionString: EXTERNAL_DB_URL_STRING,
  // connectionString: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  ssl: {
    rejectUnauthorized: false, // Needed for Render
  },
});

export default pool;
