import { Router } from "express";
import db from "../db/database.js";
import { runPipeline } from "../services/scheduler.js";

const router = Router();

// GET /api/watchlist — return all companies with their latest summary + price
router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT
      w.id, w.name, w.ticker,
      ns.summary, ns.verdict, ns.verdict_reason,
      ns.article_links, ns.last_updated AS news_last_updated,
      sp.current_price, sp.day_change, sp.day_change_pct
    FROM watchlist w
    LEFT JOIN news_summaries ns ON ns.company_id = w.id
    LEFT JOIN stock_prices sp ON sp.company_id = w.id
    ORDER BY w.added_at ASC
  `).all();

  // Fetch verdict history for all companies in one query
  const allHistory = db.prepare(`
    SELECT company_id, verdict, recorded_at
    FROM verdict_history
    ORDER BY recorded_at DESC
  `).all();

  const historyMap = {};
  for (const row of allHistory) {
    if (!historyMap[row.company_id]) historyMap[row.company_id] = [];
    if (historyMap[row.company_id].length < 7) historyMap[row.company_id].push(row.verdict);
  }

  const result = rows.map((r) => ({
    ...r,
    article_links:   JSON.parse(r.article_links ?? "[]"),
    verdict_history: (historyMap[r.id] ?? []).reverse(),
  }));

  res.json(result);
});

// POST /api/watchlist — add a company
router.post("/", (req, res) => {
  const { name, ticker, aliases } = req.body;
  if (!name || !ticker || !aliases) {
    return res.status(400).json({ error: "name, ticker, and aliases are required" });
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO watchlist (name, ticker, aliases) VALUES (?, ?, ?)"
    );
    const info = stmt.run(name, ticker, JSON.stringify(aliases));
    res.json({ id: info.lastInsertRowid, name, ticker });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint")) {
      return res.status(409).json({ error: "Company already in watchlist" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/watchlist/:id — remove a company
router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM watchlist WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// POST /api/watchlist/refresh — manually trigger the pipeline now
router.post("/refresh", async (req, res) => {
  try {
    // Run in background, respond immediately so UI doesn't hang
    // forceAI=false: skips Groq if summary is <50min old, saving tokens on manual refreshes
    runPipeline(false).catch((err) => console.error("[manual refresh] Error:", err));
    res.json({ message: "Refresh started. Cards will update in ~30 seconds." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
