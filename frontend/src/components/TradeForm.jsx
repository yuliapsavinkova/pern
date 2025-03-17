import { useState } from "react";
import { createTrade } from "../api/trades";

const TradeForm = ({ onTradeAdded }) => {
  const [trade, setTrade] = useState({
    stock_symbol: "",
    price: "",
    quantity: "",
    trade_type: "buy",
  });

  const handleChange = (e) => {
    setTrade({ ...trade, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(trade);

    // TODO: add type checking
    trade.quantity = 50;
    trade.trade_type = "BUY";

    const newTrade = await createTrade(trade);
    onTradeAdded(newTrade);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="stock_symbol" placeholder="Stock Symbol" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <input type="number" name="quantity" placeholder="Quantity" onChange={handleChange} required />
      <select name="trade_type" onChange={handleChange}>
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
      <button type="submit">Add Trade</button>
    </form>
  );
};

export default TradeForm;
