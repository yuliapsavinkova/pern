const PositionsList = ({ stock, positions = [] }) => {
  if (!positions || positions.length === 0) {
    return <p>No positions found for {stock}.</p>;
  }

  const header = positions[0];
  const positionData = positions.slice(1);

  const mapPositionData = (item) => {
    const type = item[3];
    const isStock = type === 'STOCK';

    return {
      ticker: item[0],
      expiry: item[1],
      strike: isStock ? '-' : item[6],
      type: type,
      side: item[4] === 'BUY' ? 'Long' : 'Short',
      price: item[5],
      qty: isStock ? item[7] : item[8],
    };
  };

  const formattedPositions = positionData.map(mapPositionData);

  // Map the JSON header to the desired table header names
  const headerMap = {
    '': 'Ticker',
    Date: 'Expiry',
    Expiration: 'Expiration', // Keep as is for now, might not be needed in the table
    Type: 'Type',
    Direction: 'Side',
    Cost: 'Price',
    Strike: 'Strike',
    Shares: 'Qty',
    Contracts: 'Qty',
  };

  // Filter out empty header keys and get the desired order
  const visibleHeaders = header.filter((key) => key !== '').map((key) => headerMap[key] || key); // Use mapped name or original if no mapping

  return (
    <div>
      <h2>Positions List for {stock}</h2>
      <table>
        <thead>
          <tr>
            {visibleHeaders.map((headerText, index) => (
              <th key={index}>{headerText}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formattedPositions.map((pos, index) => (
            <tr key={index}>
              <td>{pos.ticker}</td>
              <td>{pos.expiry}</td>
              <td>{pos.strike}</td>
              <td>{pos.type}</td>
              <td>{pos.side}</td>
              <td>{pos.price}</td>
              <td>{pos.qty || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsList;
