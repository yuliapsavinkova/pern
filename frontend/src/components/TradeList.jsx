import { useEffect, useState } from "react";
import { fetchTrades, deleteTrade } from "../api/trades";

const TradeList = () => {
  const [trades, setTrades] = useState([]); // ✅ Always initialize as an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTrades = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchTrades();
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("Fetched trades:", data);

        if (Array.isArray(data)) {
          setTrades(data); // ✅ Ensure it's an array before setting state
        } else {
          console.error("Unexpected response:", data);
          setTrades([]); // Default to empty array
        }
      } catch (error) {
        console.error("Error fetching trades lll:", error);
        setError("Failed to load trades.");
        setTrades([]); // ✅ Prevents crashing
      } finally {
        setLoading(false);
      }
    };

    getTrades();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTrade(id);
      setTrades((prevTrades) => prevTrades.filter((trade) => trade.id !== id)); // ✅ Use functional state update
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  return (
    <div>
      <h2>Trade List</h2>

      {loading && <p>Loading trades...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && trades.length === 0 && <p>No trades found.</p>}

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
