import { useTrades, useCreateTrade, useUpdateTrade, useDeleteTrade } from '../api/trades';
import { useState } from 'react';

const TradesList = () => {
  const { data: trades, isLoading, error } = useTrades();
  const { mutate: createTrade } = useCreateTrade();
  const { mutate: updateTrade } = useUpdateTrade();
  const { mutate: deleteTrade } = useDeleteTrade();

  const [newTrade, setNewTrade] = useState({
    stock_symbol: '',
    trade_type: '',
    price: '',
    quantity: '',
  });

  const handleCreate = () => {
    if (!newTrade.stock_symbol || !newTrade.trade_type || !newTrade.price || !newTrade.quantity)
      return;
    createTrade(newTrade, {
      onSuccess: () => setNewTrade({ stock_symbol: '', trade_type: '', price: '', quantity: '' }),
    });
  };

  const handleUpdate = (id) => {
    const updatedTrade = { trade_type: 'Updated', price: 200 }; // Example update
    updateTrade({ id, trade: updatedTrade });
  };

  const handleDelete = (id) => {
    deleteTrade(id);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Trades</h2>
      <ul>
        {trades.map((trade) => (
          <li key={trade.id}>
            {trade.stock_symbol} - {trade.trade_type} - ${trade.price} x {trade.quantity}
            <button onClick={() => handleUpdate(trade.id)}>Update</button>
            <button onClick={() => handleDelete(trade.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradesList;
