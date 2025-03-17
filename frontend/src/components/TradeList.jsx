import { useEffect, useState } from "react";
import { fetchTrades, deleteTrade } from "../api/trades";

const TradeList = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const getTrades = async () => {
      const data = await fetchTrades();
      setTrades(data);
    };
    getTrades();
  }, []);

  const handleDelete = async (id) => {
    await deleteTrade(id);
    setTrades(trades.filter((trade) => trade.id !== id));
  };

  return (
    <div>
      <h2>Trade List</h2>
      <ul>
        {trades.map((trade) => (
          <li key={trade.id}>
            {trade.stock_symbol} - {trade.trade_type} - ${trade.price} x {trade.quantity}
            <button onClick={() => handleDelete(trade.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradeList;
