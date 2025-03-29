// import pool from './db.js';

// const createTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS trades (
//       id SERIAL PRIMARY KEY,
//       stock_symbol VARCHAR(10) NOT NULL,
//       quantity INTEGER NOT NULL,
//       price NUMERIC(10, 4) NOT NULL,
//       trade_type VARCHAR(4) CHECK (trade_type IN ('BUY', 'SELL')),
//       trade_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;
//   try {
//     await pool.query(query);
//     console.log('Trades table created!');
//   } catch (error) {
//     console.error('Error creating table:', error);
//   }
// };

// createTable();
