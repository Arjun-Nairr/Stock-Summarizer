import { Router } from "express";
import db from "../db/database.js";
import COMPANIES from "../data/companies.js";

const router = Router();

// GET /api/companies/search?q=reliance
router.get("/search", (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q || q.length < 2) return res.json([]);

  const matches = COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.ticker.toLowerCase().includes(q.replace(".ns", "")) ||
    c.aliases.some((a) => a.toLowerCase().includes(q))
  ).slice(0, 10);

  res.json(matches);
});

// GET /api/companies/suggestions — returns companies not yet in watchlist (first 12 from master list)
router.get("/suggestions", (req, res) => {
  const inWatchlist = new Set(
    db.prepare("SELECT ticker FROM watchlist").all().map(r => r.ticker)
  );
  const suggestions = COMPANIES
    .filter(c => !inWatchlist.has(c.ticker))
    .slice(0, 12)
    .map(c => ({ name: c.name, ticker: c.ticker, aliases: c.aliases }));
  res.json(suggestions);
});

export default router;
