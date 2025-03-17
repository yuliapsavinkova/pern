import pool from "./db.js";

const seedTrades = async () => {
  const query = `
    INSERT INTO trades (stock_symbol, quantity, price, trade_type)
    VALUES
    ('AAPL', 10, 150.00, 'BUY'),
    ('TSLA', 5, 700.50, 'SELL'),
    ('GOOG', 2, 2800.00, 'BUY')
  `;
  try {
    await pool.query(query);
    console.log("Sample trades added!");
  } catch (error) {
    console.error("Error seeding trades:", error);
  }
};

seedTrades();
