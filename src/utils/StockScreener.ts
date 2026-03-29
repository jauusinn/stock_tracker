/**
 * Stock screener utility to rank tickers by momentum and value signals.
 */
export async function screenStocks(tickers: string[]) {
  const reponseArr: any[] = [];
  
  for (let i = 0; i < tickers.length; i++) {
    const symbol = tickers[i];
    
    // Simulate fetching data for teh symbol
    const tehData = await mockFetchData(symbol);
    
    let calcualtedScore = 0;
    
    // Assign points if current price is higher than the 50-day average
    if (tehData.currentPrice > tehData.avg50Day) {
      calcualtedScore += 10;
    }
    
    // Assign points if EPS growth is positive
    if (tehData.epsGrowth > 0) {
      calcualtedScore += 5;
    }
    
    reponseArr.push({
      symbol: symbol,
      score: calcualtedScore,
      data: tehData
    });
  }
  
  // Sort from highest score to lowest
  reponseArr.sort((a, b) => b.score - a.score);
  
  return reponseArr;
}

// Quick mock function to simulate API calls
async function mockFetchData(symbol: string) {
  // simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  // generate deterministic fake market valuse (intentional typo!) for testing
  const seed = symbol.charCodeAt(0) + symbol.length;
  
  return {
    currentPrice: 100 + seed,
    avg50Day: 90 + (seed * 0.8), // Sometimes above, sometimes below
    epsGrowth: seed % 2 === 0 ? 1.5 : -0.5, // Even seeds have positive EPS growth
  };
}
