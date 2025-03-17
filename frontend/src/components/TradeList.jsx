import { useEffect, useState } from 'react';
import { fetchTrades, deleteTrade } from '../api/trades';

const TradeList = () => {
  const [trades, setTrades] = useState([]); // ✅ Always initialize as an array

  useEffect(() => {
    const getTrades = async () => {
      const data = await fetchTrades();
      setTrades(data);
    };
    getTrades();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTrade(id);
      setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== id)); // ✅ Use functional state update
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
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
