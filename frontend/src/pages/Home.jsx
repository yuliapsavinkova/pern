import TradeList from '../components/TradeList';
import TradeForm from '../components/TradeForm';
import { useState } from 'react';

const Home = () => {
  const [trades, setTrades] = useState([]);

  const handleTradeAdded = (newTrade) => {
    setTrades([...trades, newTrade]);
  };

  return (
    <div>
      <h1>Trading Dashboard</h1>
      <TradeForm onTradeAdded={handleTradeAdded} />
      <TradeList />
    </div>
  );
};

export default Home;
