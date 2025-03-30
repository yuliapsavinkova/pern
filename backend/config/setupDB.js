import pool from './db.js';

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

const seedTradesQuery = `
  INSERT INTO trades (stock_symbol, quantity, price, trade_type)
  VALUES
    ('AAPL', 10, 150.00, 'BUY'),
    ('TSLA', 5, 700.50, 'SELL'),
    ('GOOG', 2, 2800.00, 'BUY')
  ON CONFLICT DO NOTHING; -- Prevents duplicate entries
`;

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');

    // Create table
    await pool.query(createTableQuery);
    console.log('✅ Trades table created or already exists.');

    // Clear existing trades
    await pool.query(clearTradesQuery);
    console.log('✅ Existing trades cleared.');

    // Seed database
    await pool.query(seedTradesQuery);
    console.log('✅ Sample trades added successfully!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await pool.end(); // Close database connection
    console.log('🔌 Database connection closed.');
  }
};

// Run setup
setupDatabase();
