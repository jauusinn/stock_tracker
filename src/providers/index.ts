import type { Quote, CompanyProfile, StockCandle, SymbolLookupInfo } from "@/types/stock";

// ─── Stock Provider Interface (Dependency Inversion) ─────────────────
// All data providers (Finnhub, Alpha Vantage, mock, etc.) must implement
// this interface. The UI and hooks depend on this abstraction — never on
// a concrete provider class.

export interface IStockProvider {
  /** Fetch real-time quote for a symbol */
  getQuote(symbol: string): Promise<Quote>;

  /** Fetch company profile for a symbol */
  getProfile(symbol: string): Promise<CompanyProfile>;

  /** Fetch historical OHLCV candles for a date range */
  getCandles(
    symbol: string,
    from: number,
    to: number,
    resolution?: string
  ): Promise<StockCandle>;

  /** Search for stock symbols by name or ticker */
  searchSymbols(query: string): Promise<SymbolLookupInfo[]>;
}
