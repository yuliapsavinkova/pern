/**
 * Parses the raw positions data, filters based on checked positions, and transforms
 * it into a format suitable for payout calculations.
 *
 * @param {Array<Array<string>>} positions - The raw positions data (including header).
 * @param {Object<number, boolean>} checkedPositions - An object indicating which positions are checked.
 * @returns {Array<Object>} An array of parsed and filtered position objects.
 */
export const parsePositionsForChart = (positions, checkedPositions) => {
  if (!positions || positions.length <= 1) {
    console.warn('parsePositionsForChart: No positions data provided, or only header row.');
    return [];
  }

  const header = positions[0];
  const positionData = positions.slice(1).filter((_, index) => checkedPositions[index]);

  const typeIndex = header.indexOf('Type');
  const directionIndex = header.indexOf('Direction');
  const costIndex = header.indexOf('Cost');
  const strikeIndex = header.indexOf('Strike');
  const sharesIndex = header.indexOf('Shares');
  const contractsIndex = header.indexOf('Contracts');

  if (typeIndex === -1 || directionIndex === -1 || costIndex === -1) {
    console.error(
      'parsePositionsForChart: Missing required columns in positions data for chart (Type, Direction, Cost).',
    );
    return [];
  }

  return positionData.map((pos) => {
    const type = pos[typeIndex];
    const side = pos[directionIndex] === 'BUY' ? 1 : -1; // 1 for Long, -1 for Short
    const cost = parseFloat(pos[costIndex]) || 0;
    const strike = parseFloat(pos[strikeIndex]) || 0;
    const shares = parseInt(pos[sharesIndex]) || 0;
    const contracts = parseInt(pos[contractsIndex]) || 0;

    return {
      type,
      side,
      cost,
      strike,
      shares,
      contracts,
    };
  });
};

/**
 * Calculates the price range and payoff data for a set of trades, including breakeven points.
 *
 * @param {Array<Object>} positions - An array of parsed position objects.
 * @returns {Object} An object containing the priceExtent (min/max prices), the payoff data, and an array of breakeven points.
 */
export const calculatePayoutData = (positions) => {
  if (!positions || positions.length === 0) {
    console.warn('calculatePayoutData: No positions provided for calculation.');
    return { priceExtent: [0, 1], data: [], breakevenPoints: [] };
  }

  // Determine price range based on positions
  let minPrice = 40;
  let maxPrice = 160;

  const stockPositions = positions.filter((p) => p.type === 'STOCK');
  const optionPositions = positions.filter((p) => p.type !== 'STOCK');

  if (stockPositions.length > 0) {
    const allStockCosts = stockPositions.map((p) => p.cost);
    minPrice = Math.min(minPrice, ...allStockCosts) - 5;
    maxPrice = Math.max(maxPrice, ...allStockCosts) + 5;
  }

  if (optionPositions.length > 0) {
    const optionStrikes = optionPositions.map((p) => p.strike).filter((s) => !isNaN(s) && s !== 0);
    if (optionStrikes.length > 0) {
      minPrice = Math.min(minPrice, ...optionStrikes) - 10;
      maxPrice = Math.max(maxPrice, ...optionStrikes) + 10;
    }
  }

  // Generate a set of prices to evaluate the payoff at.
  const priceStep = (maxPrice - minPrice) / 100;
  const stockPrices = [];
  for (let price = minPrice; price <= maxPrice; price += priceStep) {
    stockPrices.push(price);
  }
  const priceExtent = [minPrice, maxPrice];

  let breakevenPoints = [];
  let previousPayoff = null; // Track sign changes, start with null
  const data = stockPrices.map((price) => {
    let payoff = 0;

    stockPositions.forEach(({ side, cost, shares }) => {
      payoff += side * shares * (price - cost);
    });

    optionPositions.forEach(({ type, side, cost, strike, contracts }) => {
      if (type === 'CALL') {
        const optionValue = Math.max(0, price - strike);
        payoff += side * contracts * 100 * (optionValue - cost);
      } else if (type === 'PUT') {
        const optionValue = Math.max(0, strike - price);
        payoff += side * contracts * 100 * (optionValue - cost);
      }
    });

    // Check for breakeven points (where payoff crosses zero)
    if (
      previousPayoff !== null &&
      ((previousPayoff < 0 && payoff >= 0) || (previousPayoff > 0 && payoff <= 0))
    ) {
      // More accurate breakeven: Interpolate
      const breakevenPrice =
        previousPayoff === payoff
          ? price
          : price - (previousPayoff / (payoff - previousPayoff)) * priceStep;
      breakevenPoints.push(breakevenPrice);
    }
    previousPayoff = payoff;
    return { price, payoff };
  });
  return { priceExtent, data, breakevenPoints };
};
