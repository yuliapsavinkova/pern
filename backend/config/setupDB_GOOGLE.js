import pool from './db.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SHEETS_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SPREADSHEET_NAME = process.env.SPREADSHEET_NAME;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    stock_symbol VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 4) NOT NULL,
    trade_type VARCHAR(4) CHECK (trade_type IN ('BUY', 'SELL')),
    trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const clearTradesQuery = `DELETE FROM trades;`;

const fetchTradesFromSheets = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SPREADSHEET_NAME}!A:D`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('❌ No trade data found in Google Sheets.');
      return [];
    }

    return rows.map((row) => ({
      stock_symbol: row[0],
      quantity: parseInt(row[1], 10),
      price: parseFloat(row[2]),
      trade_type: row[3].toUpperCase(),
    }));
  } catch (error) {
    console.error('❌ Error fetching data from Google Sheets:', error);
    return [];
  }
};

const seedDatabase = async () => {
  try {
    console.log('🔄 Fetching trade data from Google Sheets...');
    const trades = await fetchTradesFromSheets();

    if (trades.length === 0) {
      console.log('⚠️ No data to insert.');
      return;
    }

    // Dynamically generate parameterized placeholders
    const values = [];
    const valuePlaceholders = trades
      .map((_, i) => {
        const baseIndex = i * 4 + 1;
        values.push(
          trades[i].stock_symbol,
          trades[i].quantity,
          trades[i].price,
          trades[i].trade_type,
        );
        return `($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3})`;
      })
      .join(', ');

    const insertQuery = `
      INSERT INTO trades (stock_symbol, quantity, price, trade_type)
      VALUES ${valuePlaceholders}
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(insertQuery, values);
    console.log('✅ Trades seeded successfully from Google Sheets!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');

    // Create table
    await pool.query(createTableQuery);
    console.log('✅ Trades table created or already exists.');

    // Clear existing trades
    await pool.query(clearTradesQuery);
    console.log('✅ Existing trades cleared.');

    // Seed database with Google Sheets data
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await pool.end(); // Close database connection
    console.log('🔌 Database connection closed.');
  }
};

// Run setup
setupDatabase();
