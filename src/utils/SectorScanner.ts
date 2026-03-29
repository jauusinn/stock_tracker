import { sectorService } from '../services/SectorService';

export interface SectorStockPerformance {
  ticker: string;
  companyName: string;
  currentPrice: number;
  "30DayMomentum": number;
}

export class SectorScanner {
  /**
   * Phase 1: Calculates the 30-day percentage change and returns the sorted array of momentums.
   * @param tickers Array of major sector ETF tickers (e.g., ['XLK', 'XLE', 'XLF', 'XLV', 'SOXX'])
   */
  static async getSectorMomentum(tickers: string[]): Promise<Array<{ ticker: string, momentum: number }>> {
    const performances: Array<{ ticker: string, momentum: number }> = [];

    for (const ticker of tickers) {
      try {
        const closes = await sectorService.get30DayHistoricalClose(ticker);
        if (closes.length < 2) continue;

        const oldestClose = closes[0];
        const newestClose = closes[closes.length - 1];
        
        // Calculate percentage change between 30-day ago close and current close
        const pctChange = ((newestClose - oldestClose) / oldestClose) * 100;

        performances.push({ ticker, momentum: Number(pctChange.toFixed(2)) });
      } catch (e) {
        console.error(`Error calculating momentum for Sector ETF ${ticker}`, e);
      }
    }

    return performances.sort((a, b) => b.momentum - a.momentum);
  }

  /**
   * Phase 2: Drill down into winning sector ETF to retrieve top 5 largest stocks and their momentums.
   * Returns a clean JSON array directly matching the requested output format.
   * @param winningSectorTicker Output from Phase 1
   */
  static async getTopSectorPerformers(winningSectorTicker: string): Promise<SectorStockPerformance[]> {
    const performances: SectorStockPerformance[] = [];
    
    if (!winningSectorTicker) return performances;

    try {
      // Get the top 5 largest holdings / market cap constituents of the winning ETF
      const topQuotes = await sectorService.getTopStocksBySector(winningSectorTicker);
      
      for (const quote of topQuotes) {
        if (!quote || !quote.symbol) continue;

        let momentum30Day = 0;

        try {
          // Fetch their specific 30-day historical prices for momentum calculation
          const closes = await sectorService.get30DayHistoricalClose(quote.symbol);
          if (closes.length >= 2) {
            const oldest = closes[0];
            const newest = closes[closes.length - 1];
            momentum30Day = ((newest - oldest) / oldest) * 100;
          }
        } catch (err) {
          console.warn(`Could not compute momentum for stock ${quote.symbol}`);
        }
        
        performances.push({
          ticker: quote.symbol,
          companyName: quote.longName || quote.shortName || quote.symbol,
          currentPrice: quote.regularMarketPrice || 0,
          "30DayMomentum": Number(momentum30Day.toFixed(2))
        });
      }

      // Final sort of returned JSON array by highest momentum 
      performances.sort((a, b) => b["30DayMomentum"] - a["30DayMomentum"]);
      
    } catch (e) {
      console.error(`Error calculating performers for winning sector ${winningSectorTicker}`, e);
    }

    return performances;
  }
}
