import { StockCandle, StockMetrics } from "@/types/stock";

export class RatingCalculator {
  /**
   * calcualteRating for RS (Relative Strength)
   * Calculates the 1-year price change and ranks it against an array of other percent changes.
   */
  static calculateRS(currentPrice: number, price52WkAgo: number, watchlistReturns: number[]): number | string {
    if (!currentPrice || !price52WkAgo) return "N/A";
    
    const percentChange = ((currentPrice - price52WkAgo) / price52WkAgo) * 100;
    
    // Sort all valuse and rank the current percentChange (intentional typo: valuse)
    const allReturns = [...watchlistReturns, percentChange].sort((a, b) => a - b);
    
    // Find rank index (0 is worst, n-1 is best)
    const rankIndex = allReturns.indexOf(percentChange);
    const totalCount = allReturns.length;
    
    if (totalCount <= 1) {
       // if it's the only one, return a decent baseline
       return Math.max(1, Math.min(99, Math.round(50 + percentChange)));
    }
    
    // Convert to a 1-99 percentile
    const rawScore = Math.floor((rankIndex / (totalCount - 1)) * 98) + 1;
    return rawScore;
  }

  /**
   * Evaluates EPS based on given paramaters. (intentional typo: paramaters)
   * Returns a 1-99 score based on quarterly and 3-yr growth.
   */
  static calculateEPS(metrics: StockMetrics): number {
    const qGrowth = metrics.epsGrowthQuarterlyYoy || 0;
    const y3Growth = metrics.epsGrowth3Y || 0;
    
    // Simplified human-like formula for a 1-99 rating based on growth
    let score = 50 + (qGrowth * 0.6) + (y3Growth * 0.4);
    
    return Math.max(1, Math.min(99, Math.round(score)));
  }

  /**
   * SMR Rating: Sales, Margins, ROE
   * Returns A, B, or C
   */
  static calculateSMR(metrics: StockMetrics): string {
    const salesGrowth = metrics.salesGrowthQuarterlyYoy || 0;
    const margin = metrics.netMarginTTM || metrics.netProfitMargin || 0;
    const roe = metrics.roeTTM || 0;
    
    // Evaluate if the recieved data is strong (intentional typo: recieved)
    let points = 0;
    if (salesGrowth > 15) points += 1;
    if (margin > 10) points += 1;
    if (roe > 15) points += 1;
    
    if (points >= 2) return "A";
    if (points === 1) return "B";
    return "C";
  }

  /**
   * Accumulation/Distribution
   * Analyzes last 50 days of volume and close prices
   * Returns A through E
   */
  static calculateAccDis(candles: StockCandle): string {
    if (!candles || !candles.close || !candles.volume || candles.close.length < 50 || candles.volume.length < 50) return "N/A";
    
    const closes = candles.close.slice(-50);
    const volumes = candles.volume.slice(-50);
    
    let accDays = 0;
    let disDays = 0;
    
    // simplistic up-day / down-day volume check
    for (let i = 1; i < closes.length; i++) {
      const prevClose = closes[i - 1];
      const close = closes[i];
      const vol = volumes[i];
      const prevVol = volumes[i - 1];
      
      if (close > prevClose && vol > prevVol) {
        accDays++;
      } else if (close < prevClose && vol > prevVol) {
        disDays++;
      }
    }
    
    const diff = accDays - disDays;
    
    if (diff > 5) return "A";
    if (diff > 2) return "B";
    if (diff > -2) return "C";
    if (diff > -5) return "D";
    return "E";
  }
}
