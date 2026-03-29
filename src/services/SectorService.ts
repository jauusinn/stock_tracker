import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

// Simulated delay helper for rate-limit backoffs
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class SectorService {
  /**
   * Fetches the 30-day historical closing prices for a given ticker,
   * handling rate limits with try/catch backoff retries.
   */
  async get30DayHistoricalClose(ticker: string): Promise<number[]> {
    let retries = 3;
    while (retries > 0) {
      try {
        const queryOptions = {
          period1: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // ~45 calendar days to ensure 30 active trading days
          period2: new Date().toISOString(),
          interval: '1d' as const,
        };
        // Fetch via chart to bypass strict null validation in historical module
        const result = await yahooFinance.chart(ticker, queryOptions as any) as any;
        const quotes = result.quotes || [];
        
        // Grab the last 30 valid closes
        const closes = quotes
          .map((entry: any) => entry.close)
          .filter((close: any) => close !== null && close !== undefined)
          .slice(-30);

        return closes;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw new Error(`Failed to fetch historical data for ${ticker}: ${error}`);
        }
        await delay(1500); // 1.5-second backoff
      }
    }
    return [];
  }

  /**
   * Retrieves the top 5 largest market-cap stocks categorized underneath
   * the winning sector industry by scraping the ETF's top component holdings.
   */
  async getTopStocksBySector(sectorIdentifier: string): Promise<any[]> {
    let retries = 3;
    while (retries > 0) {
      try {
        // Fetch ETF top holdings proxy to find largest market cap underlying components
        const quote = await yahooFinance.quoteSummary(sectorIdentifier, { modules: ['topHoldings'] } as any) as any;
        const holdings = quote.topHoldings?.holdings || [];
        
        // Return top 5 constituent symbols
        const top5Symbols = holdings.slice(0, 5).map((h: any) => h.symbol);
        
        // Get quotes for these 5 to retrieve current price and explicit names
        const quotePromises = top5Symbols.map((sym: string) => (yahooFinance.quote(sym) as any).catch(() => null));
        const quotes = await Promise.all(quotePromises);
        
        return quotes.filter((q: any) => q !== null);
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw new Error(`Failed to fetch top sector stocks for ${sectorIdentifier}: ${error}`);
        }
        await delay(1500); // 1.5-second backoff
      }
    }
    return [];
  }
}

export const sectorService = new SectorService();
