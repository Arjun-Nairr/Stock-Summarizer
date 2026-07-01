import { Router } from "express";
import COMPANIES from "../data/companies.js";

const router = Router();

// GET /api/companies/search?q=reliance
// Returns up to 10 matches from the master list, fuzzy on name
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

export default router;
