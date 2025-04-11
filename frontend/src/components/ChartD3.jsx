import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ShortStraddlesD3 = () => {
  const svgRef = useRef();

  useEffect(() => {
    const strike1 = 100;
    const premium1 = 50;
    const strike2 = 80;
    const premium2 = 40;

    const data = [];
    for (let S = 40; S <= 140; S++) {
      const straddle1 = premium1 - Math.max(S - strike1, 0) - Math.max(strike1 - S, 0);
      const straddle2 = premium2 - Math.max(S - strike2, 0) - Math.max(strike2 - S, 0);
      const combined = straddle1 + straddle2;
      data.push({ price: S, profit: combined });
    }

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr(
        'viewBox',
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`,
      )
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([40, 140]).range([0, width]);
    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.profit) - 10, d3.max(data, (d) => d.profit) + 10])
      .range([height, 0]);

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));

    svg.append('g').call(d3.axisLeft(y));

    const line = d3
      .line()
      .x((d) => x(d.price))
      .y((d) => y(d.profit));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('PLTR Price at Expiration');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text('Profit / Loss');
  }, []);

  return <svg ref={svgRef} style={{ width: '100%', height: '500px' }} />;
};

export default ShortStraddlesD3;
