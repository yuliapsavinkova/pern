import { useEffect, useState } from "react";
import { fetchTrades, deleteTrade } from "../api/trades";

const TradeList = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const getTrades = async () => {
      // const data = await fetchTrades();
      // setTrades(data);

      try {
        const res = await fetch(import.meta.env.VITE_API_URL + "/trades"); // Use .env variable
        const data = await res.json();
        console.log("Fetched trades:", data); // Debug API response
        if (Array.isArray(data)) {
          setTrades(data); // ✅ Only set if it's an array
        } else {
          console.error("Unexpected response:", data);
          setTrades([]); // Set to empty array if response is invalid
        }
      } catch (error) {
        console.error("Error fetching trades:", error);
        setTrades([]); // Prevents crashing UI
      }
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
        {Array.isArray(trades) && trades.length > 0 ? (
          trades.map((trade) => (
            <li key={trade.id}>
              {trade.stock_symbol} - {trade.trade_type} - ${trade.price} x {trade.quantity}
              <button onClick={() => handleDelete(trade.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No trades found.</p>
        )}
      </ul>
    </div>
  );
};

export default TradeList;
