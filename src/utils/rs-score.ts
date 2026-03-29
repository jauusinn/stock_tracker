import { StockCandle } from "@/types/stock";

/**
 * Calculates a proprietary Relative Strength (RS) Score loosely inspired by IBD.
 * Returns a score between 1 and 99.
 * 
 * Formula:
 * 1. Find the oldest available price (approximately 1 year ago) for both Ticker and SPY.
 * 2. Find the newest available price for both.
 * 3. Calculate % change over the timeframe for both.
 * 4. Determine outperformance (Alpha = Ticker % - SPY %).
 * 5. Map Alpha to a 1-99 percentile-styled rank (Baseline 50).
 */
export function calculateRSScore(tickerData: StockCandle, spyData: StockCandle): number {
  if (
    !tickerData || tickerData.status !== "ok" || tickerData.close.length === 0 ||
    !spyData || spyData.status !== "ok" || spyData.close.length === 0
  ) {
    return 0; // Invalid or missing data
  }

  // Get earliest and latest close prices
  const tOld = tickerData.close[0];
  const tNew = tickerData.close[tickerData.close.length - 1];
  
  const sOld = spyData.close[0];
  const sNew = spyData.close[spyData.close.length - 1];

  // Calculate percentage returns
  const tReturn = ((tNew - tOld) / tOld) * 100;
  const sReturn = ((sNew - sOld) / sOld) * 100;

  // Calculate alpha outperformance
  const alpha = tReturn - sReturn;

  // Map to 1-99 Rank (50 = perfectly matched SPY benchmark)
  const rawScore = 50 + Math.round(alpha);
  
  // Bound the score tightly between 1 and 99
  return Math.max(1, Math.min(99, rawScore));
}
