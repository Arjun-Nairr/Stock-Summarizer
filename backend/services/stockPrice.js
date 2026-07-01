// Tries query1 first, falls back to query2 if 404 (some tickers only resolve on one subdomain)
async function fetchStockPrice(ticker) {
  for (const host of ["query1", "query2"]) {
    try {
      const url = `https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
          "Accept": "application/json",
        },
      });
      if (!res.ok) continue; // try next host
      const json = await res.json();
      const meta = json?.chart?.result?.[0]?.meta;
      if (!meta) continue;

      const currentPrice  = meta.regularMarketPrice ?? null;
      const prevClose     = meta.chartPreviousClose ?? meta.previousClose ?? null;
      const dayChange     = currentPrice != null && prevClose != null ? currentPrice - prevClose : null;
      const dayChangePct  = dayChange != null && prevClose ? (dayChange / prevClose) * 100 : null;
      return { currentPrice, dayChange, dayChangePct, currency: meta.currency ?? "INR" };
    } catch (err) {
      console.error(`[stockPrice] ${host} error for ${ticker}:`, err.message);
    }
  }
  console.error(`[stockPrice] Both hosts failed for ${ticker}`);
  return null;
}

export { fetchStockPrice };
