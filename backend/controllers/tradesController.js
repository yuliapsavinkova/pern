import pool from "../config/db.js";

export const getTrades = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM trades ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTrade = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM trades WHERE id = $1", [id]);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTrade = async (req, res) => {
  try {
    const { stock_symbol, price, quantity, trade_type } = req.body;
    const result = await pool.query(
      "INSERT INTO trades (stock_symbol, price, quantity, trade_type) VALUES ($1, $2, $3, $4) RETURNING *",
      [stock_symbol, price, quantity, trade_type]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_symbol, price, quantity, trade_type } = req.body;
    const result = await pool.query(
      "UPDATE trades SET stock_symbol = $1, price = $2, quantity = $3, trade_type = $4 WHERE id = $5 RETURNING *",
      [stock_symbol, price, quantity, trade_type, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTrade = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM trades WHERE id = $1", [id]);
    res.json({ message: "Trade deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
