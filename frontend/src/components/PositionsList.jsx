const PositionsList = ({ stock, positions = [] }) => {
  if (!positions.length) return <p>No positions found for {stock}.</p>;

  return (
    <div>
      <h2>Positions List for {stock}</h2>
      <table>
        <thead>
          <tr>
            <th>Ticker</th>
            <th>Expiry</th>
            <th>Strike</th>
            <th>Type</th>
            <th>Side</th>
            <th>Price</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, index) => (
            <tr key={index}>
              <td>{pos[0]}</td>
              <td>{pos[1]}</td>
              <td>{pos[2]}</td>
              <td>{pos[3]}</td>
              <td>{pos[4]}</td>
              <td>{pos[5]}</td>
              <td>{pos[6] || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsList;
