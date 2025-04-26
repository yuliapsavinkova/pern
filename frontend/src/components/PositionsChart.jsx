import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { calculatePayoutData, parsePositionsForChart } from './payoutCalculator';
import styles from './PositionsChart.module.scss'; // Import the CSS Module

const PositionsChart = ({ stock, positions }) => {
  const svgRef = useRef();
  const [checkedPositions, setCheckedPositions] = useState({});
  const [cursorPrice, setCursorPrice] = useState(null); // State for cursor price
  const [cursorLineX, setCursorLineX] = useState(null);
  const [cursorPayoff, setCursorPayoff] = useState(null);
  const [chartData, setChartData] = useState(null); // Store processed chart data

  useEffect(() => {
    const initialCheckedState = {};
    if (positions && positions.length > 1) {
      positions.slice(1).forEach((_, index) => {
        initialCheckedState[index] = true;
      });
      setCheckedPositions(initialCheckedState);
    }
  }, [positions]);

  const handleCheckboxChange = (index) => {
    setCheckedPositions((prevChecked) => ({
      ...prevChecked,
      [index]: !prevChecked[index],
    }));
  };

  useEffect(() => {
    // Clear the chart if no positions or only header
    if (!positions || positions.length <= 1) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove();
      setChartData(null); // Clear stored data
      return;
    }
    const parsedPositions = parsePositionsForChart(positions, checkedPositions);
    const { priceExtent, data, breakevenPoints } = calculatePayoutData(parsedPositions);

    setChartData({ priceExtent, data, breakevenPoints }); // Store processed data
  }, [positions, checkedPositions]);

  useEffect(() => {
    if (!chartData) return;

    const { priceExtent, data, breakevenPoints } = chartData;

    // Set up SVG and draw chart
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 80, bottom: 30, left: 50 };
    svg.selectAll('*').remove();

    const x = d3
      .scaleLinear()
      .domain(priceExtent)
      .range([margin.left, width - margin.right]);

    // Determine the y-domain, ensuring it's not NaN
    let yDomain = [0, 0];
    if (data && data.length > 0) {
      const extent = d3.extent(data, (d) => d.payoff);
      if (extent[0] === extent[1]) {
        // If all payoffs are the same, expand the domain slightly
        yDomain = [extent[0] - 1, extent[0] + 1];
      } else {
        yDomain = extent;
      }
    }
    const y = d3
      .scaleLinear()
      .domain(yDomain)
      .nice()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g) =>
      g.attr('transform', `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
    const yAxis = (g) => g.attr('transform', `translate(${margin.left},0)`).call(d3.axisLeft(y));

    // Add gridlines *before* the axes
    svg
      .append('g')
      .attr('class', styles.xGrid) // Use CSS Module class
      .call(
        d3
          .axisBottom(x)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(''),
      );
    svg
      .append('g')
      .attr('class', styles.yGrid) // Use CSS Module class
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width + margin.left + margin.right)
          .tickFormat(''),
      );

    // Draw the axes
    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);

    const line = d3
      .line()
      .x((d) => x(d.price))
      .y((d) => y(d.payoff));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4f46e5')
      .attr('stroke-width', 2)
      .attr('d', line);
    svg
      .append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', y(0))
      .attr('y2', y(0))
      .attr('stroke', '#999')
      .attr('stroke-dasharray', '4');

    // Draw breakeven points as vertical lines
    if (breakevenPoints && breakevenPoints.length > 0) {
      breakevenPoints.forEach((bp) => {
        // Draw vertical line
        svg
          .append('line')
          .attr('x1', x(bp))
          .attr('x2', x(bp))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .attr('stroke', 'red')
          .attr('stroke-dasharray', '5,5'); // Make it dotted

        // Add label for the breakeven price
        svg
          .append('text')
          .attr('x', x(bp))
          .attr('y', margin.top - 5) // Position above the line
          .style('font-size', '10px')
          .style('fill', 'red')
          .attr('text-anchor', 'middle') // Center the text
          .text(bp.toFixed(2)); // Show price with 2 decimals
      });
    }

    // Add cursor tracking elements (before other interactive elements)
    const cursorLine = svg
      .append('line')
      .attr('class', styles.cursorLine)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .style('opacity', 0);

    const cursorPriceLabel = svg
      .append('text')
      .attr('class', styles.cursorPriceLabel)
      .style('opacity', 0)
      .attr('text-anchor', 'middle');

    const cursorPayoffLabel = svg
      .append('text') // Add this
      .attr('class', styles.cursorPayoffLabel)
      .style('opacity', 0)
      .attr('text-anchor', 'middle');

    // Add mousemove event listener to the SVG
    svg
      .on('mousemove', (event) => {
        const mouseX = d3.pointer(event, svg.node())[0];
        const bisect = d3.bisector((d) => d.price).center; // Use .center
        let price = x.invert(mouseX);

        // Find the closest data point's price.
        let index = bisect(data, price);
        if (index >= data.length) {
          index = data.length - 1;
        } else if (index < 0) {
          index = 0;
        }
        price = data[index].price;
        const payoff = data[index].payoff;

        // Update cursor line position and visibility
        cursorLine.style('opacity', 1).attr('transform', `translate(${x(price)},0)`);
        setCursorLineX(x(price)); //update state

        // Update price label position and text
        cursorPriceLabel
          .style('opacity', 1)
          .attr('transform', `translate(${x(price)},${y(payoff) - 15})`) //追跡
          .text(`Price: ${price.toFixed(2)}`);
        setCursorPrice(price.toFixed(2));
        setCursorPayoff(payoff.toFixed(2));

        // Update payoff label
        cursorPayoffLabel
          .style('opacity', 1)
          .attr('transform', `translate(${x(price)},${y(payoff) + 15})`) //追跡
          .text(`Payoff: ${payoff.toFixed(2)}`);
      })
      .on('mouseout', () => {
        // Hide cursor line and price label on mouseout
        cursorLine.style('opacity', 0);
        cursorPriceLabel.style('opacity', 0);
        cursorPayoffLabel.style('opacity', 0); // Hide this
        setCursorPrice(null);
        setCursorLineX(null);
        setCursorPayoff(null);
        // tooltip.style("display", "none");
      });
  }, [chartData]);

  if (!positions || positions.length <= 1) {
    return (
      <div className={styles.chartContainer}>
        <h3>{stock} Portfolio Payout</h3>
        <svg ref={svgRef} width={600} height={400}></svg>
      </div>
    );
  }

  const header = positions[0];
  const positionData = positions.slice(1);

  return (
    <div className={styles.chartContainer}>
      <h3>{stock} Portfolio Payout</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {header.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positionData.map((pos, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={checkedPositions[index] === undefined ? true : checkedPositions[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              {pos.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <svg ref={svgRef} width={600} height={400}></svg>
    </div>
  );
};

export default PositionsChart;
