import { Router } from "express";
import COMPANIES from "../data/companies.js";

const router = Router();

async function searchYahoo(q) {
  try {
    const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&lang=en-IN&region=IN&quotesCount=10&newsCount=0&enableFuzzyQuery=true&quotesQueryId=tss_match_phrase_query`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
        "Accept": "application/json",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.quotes ?? [])
      .filter(q => q.symbol?.endsWith(".NS") && q.quoteType === "EQUITY")
      .map(q => ({
        name:    q.longname || q.shortname || q.symbol,
        ticker:  q.symbol,
        aliases: [q.shortname || "", q.symbol.replace(".NS", "")].filter(Boolean),
      }));
  } catch {
    return [];
  }
}

// GET /api/companies/search?q=apollo
// Searches local curated list first (better aliases), fills gaps with Yahoo Finance
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q || q.length < 2) return res.json([]);

  const local = COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.ticker.toLowerCase().includes(q.replace(".ns", "")) ||
    c.aliases.some((a) => a.toLowerCase().includes(q))
  ).slice(0, 10);

  // If local has enough results, return immediately without hitting Yahoo
  if (local.length >= 3) return res.json(local);

  // Otherwise merge with Yahoo results, local entries take priority
  const localTickers = new Set(local.map(c => c.ticker));
  const yahoo = await searchYahoo(q);
  const merged = [
    ...local,
    ...yahoo.filter(c => !localTickers.has(c.ticker)),
  ].slice(0, 10);

  res.json(merged);
});

export default router;
