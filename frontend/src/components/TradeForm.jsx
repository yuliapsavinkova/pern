import { useState } from 'react';
import { useCreateTrade } from '../api/trades';

const TradeForm = () => {
  const { mutate: createTrade, isLoading, error } = useCreateTrade();
  const [trade, setTrade] = useState({
    stock_symbol: '',
    price: '',
    quantity: '',
    trade_type: 'BUY',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrade((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input validation
    if (!trade.stock_symbol.trim()) {
      alert('Stock symbol is required.');
      return;
    }
    if (trade.price <= 0 || isNaN(trade.price)) {
      alert('Price must be a valid positive number.');
      return;
    }
    if (trade.quantity <= 0 || isNaN(trade.quantity)) {
      alert('Quantity must be a valid positive number.');
      return;
    }

    createTrade(trade, {
      onSuccess: () => {
        setTrade({ stock_symbol: '', price: '', quantity: '', trade_type: 'BUY' });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="stock_symbol"
        placeholder="Stock Symbol"
        value={trade.stock_symbol}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={trade.price}
        min="0.01"
        step="0.01"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={trade.quantity}
        min="1"
        step="1"
        onChange={handleChange}
        required
      />
      <select name="trade_type" value={trade.trade_type} onChange={handleChange}>
        <option value="BUY">Buy</option>
        <option value="SELL">Sell</option>
      </select>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Trade'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </form>
  );
};

export default TradeForm;
