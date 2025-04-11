import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const generateStraddleData = () => {
  const strike1 = 100;
  const premium1 = 50;
  const strike2 = 80;
  const premium2 = 40;

  const data = [];

  for (let S = 40; S <= 140; S += 1) {
    const straddle1 = premium1 - Math.max(S - strike1, 0) - Math.max(strike1 - S, 0);
    const straddle2 = premium2 - Math.max(S - strike2, 0) - Math.max(strike2 - S, 0);
    const combined = straddle1 + straddle2;

    data.push({
      x: S,
      y: combined,
    });
  }

  return [
    {
      id: 'Combined Payout',
      color: 'hsl(0, 0%, 10%)',
      data,
    },
  ];
};

const ShortStraddlesChart = () => {
  const data = generateStraddleData();

  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: 'linear', min: 40, max: 140 }}
        yScale={{ type: 'linear', stacked: false }}
        axisBottom={{
          legend: 'PLTR Price at Expiration',
          legendOffset: 40,
          legendPosition: 'middle',
        }}
        axisLeft={{
          legend: 'Profit / Loss',
          legendOffset: -50,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={0}
        useMesh={true}
        gridYValues={[0]}
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            justify: false,
            translateX: 0,
            translateY: 0,
            itemsSpacing: 2,
            itemDirection: 'left-to-right',
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
      />
    </div>
  );
};

export default ShortStraddlesChart;
