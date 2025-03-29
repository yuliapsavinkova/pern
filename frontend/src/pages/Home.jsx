import TradesList from '../components/TradesList';
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
      <TradeForm />
      <TradesList />
    </div>
  );
};

export default Home;
