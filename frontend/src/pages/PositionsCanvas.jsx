import React, { useState } from 'react';
import PositionsChart from '../components/PositionsChart';
import PositionsList from '../components/PositionsList';

const PositionsCanvas = () => {
  const [spreadsheetName, setSpreadsheetName] = useState('VTRS');
  const [spreadsheetRange, setSpreadsheetRange] = useState('A3:G6');
  const [ticker, setTicker] = useState('VTRS');
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPositions = async () => {
    if (!spreadsheetName || !spreadsheetRange || !ticker) return;

    setLoading(true);
    try {
      console.log('Fetching with:', spreadsheetName, spreadsheetRange, ticker);
      const res = await fetch(
        `/api/positions?sheet=${spreadsheetName}&range=${spreadsheetRange}&ticker=${ticker}`,
      );
      if (!res.ok) throw new Error('Failed to fetch positions');
      const data = await res.json();
      setPositions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchPositions();
    }
  };

  const filteredPositions = positions.filter(
    (trade) => trade.ticker?.toUpperCase() === ticker.toUpperCase(),
  );

  return (
    <div>
      <h1>Positions Canvas</h1>

      <label>
        Spreadsheet Name:
        <input
          type="text"
          value={spreadsheetName}
          onChange={(e) => setSpreadsheetName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>

      <label>
        Range:
        <input
          type="text"
          value={spreadsheetRange}
          onChange={(e) => setSpreadsheetRange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>

      <label>
        Ticker:
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </label>

      <button onClick={fetchPositions}>Fetch Positions</button>

      {loading ? (
        <p>Loading positions...</p>
      ) : (
        <>
          <PositionsChart stock={ticker} positions={positions} />
          <PositionsList stock={ticker} positions={positions} />
        </>
      )}
    </div>
  );
};

export default PositionsCanvas;
