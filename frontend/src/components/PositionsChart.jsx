import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PositionsChart = ({ stock, positions }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!positions || positions.length === 0) return;

    // 1. Parse positions
    const parsed = positions.map(([ticker, , , type, side, premium, strike]) => ({
      type,
      side,
      premium: parseFloat(premium),
      strike: parseFloat(strike),
    }));

    // 2. Generate price range and payoff data
    const stockPrices = d3.range(50, 151); // stock prices from 50 to 150

    const data = stockPrices.map((price) => {
      let payoff = 0;

      parsed.forEach(({ type, side, premium, strike }) => {
        let value = 0;
        if (type === 'CALL') {
          value = Math.max(0, price - strike);
        } else if (type === 'PUT') {
          value = Math.max(0, strike - price);
        }
        value = side === 'SELL' ? premium - value : -premium + value;
        payoff += value;
      });

      return { price, payoff };
    });

    // 3. Set up SVG
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    svg.selectAll('*').remove(); // clear svg

    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.price))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.payoff))
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));

    const yAxis = (g) => g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(d.price))
      .y((d) => y(d.payoff));

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4f46e5')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Draw breakeven line
    svg
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', '#999')
      .attr('stroke-dasharray', '4');
  }, [positions]);

  return (
    <div>
      <h3>{stock} Options Payout</h3>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
};

export default PositionsChart;
