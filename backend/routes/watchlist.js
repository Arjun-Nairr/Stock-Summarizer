import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "../db/database.js";
import { runPipeline } from "../services/scheduler.js";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_PATH = process.env.DB_PATH
  ? path.join(path.dirname(process.env.DB_PATH), "watchlist-backup.json")
  : path.join(__dirname, "../db/watchlist-backup.json");

function saveBackup() {
  try {
    const rows = db.prepare("SELECT name, ticker, aliases FROM watchlist ORDER BY added_at ASC").all();
    const data = rows.map(r => ({ name: r.name, ticker: r.ticker, aliases: JSON.parse(r.aliases) }));
    fs.writeFileSync(BACKUP_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[backup] Failed to save watchlist backup:", err.message);
  }
}

export function restoreFromBackupIfEmpty() {
  try {
    const count = db.prepare("SELECT COUNT(*) as c FROM watchlist").get().c;
    if (count > 0) return;
    if (!fs.existsSync(BACKUP_PATH)) return;
    const companies = JSON.parse(fs.readFileSync(BACKUP_PATH, "utf8"));
    let restored = 0;
    for (const c of companies) {
      if (!c.name || !c.ticker || !c.aliases) continue;
      try {
        db.prepare("INSERT OR IGNORE INTO watchlist (name, ticker, aliases) VALUES (?, ?, ?)").run(c.name, c.ticker, JSON.stringify(c.aliases));
        restored++;
      } catch (_) {}
    }
    if (restored > 0) console.log(`[backup] Restored ${restored} companies from backup.`);
  } catch (err) {
    console.error("[backup] Failed to restore from backup:", err.message);
  }
}

// GET /api/watchlist — return all companies with their latest summary + price
router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT
      w.id, w.name, w.ticker,
      ns.summary, ns.verdict, ns.verdict_reason,
      ns.article_links, ns.last_updated AS news_last_updated,
      sp.current_price, sp.day_change, sp.day_change_pct,
      f.roce, f.roe, f.sales_growth
    FROM watchlist w
    LEFT JOIN news_summaries ns ON ns.company_id = w.id
    LEFT JOIN stock_prices sp ON sp.company_id = w.id
    LEFT JOIN fundamentals f ON f.company_id = w.id
    ORDER BY w.added_at ASC
  `).all();

  const allHistory = db.prepare(`
    SELECT company_id, verdict, recorded_at
    FROM verdict_history
    WHERE company_id IN (SELECT id FROM watchlist)
    ORDER BY recorded_at DESC
    LIMIT 500
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
    const info = db.prepare("INSERT INTO watchlist (name, ticker, aliases) VALUES (?, ?, ?)").run(name, ticker, JSON.stringify(aliases));
    saveBackup();
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
  saveBackup();
  res.json({ success: true });
});

// GET /api/watchlist/export — download watchlist as JSON backup
router.get("/export", (req, res) => {
  const rows = db.prepare("SELECT name, ticker, aliases FROM watchlist ORDER BY added_at ASC").all();
  res.setHeader("Content-Disposition", "attachment; filename=watchlist-backup.json");
  res.json(rows.map(r => ({ name: r.name, ticker: r.ticker, aliases: JSON.parse(r.aliases) })));
});

// POST /api/watchlist/refresh — manually trigger the pipeline now
router.post("/refresh", async (req, res) => {
  try {
    runPipeline(false).catch((err) => console.error("[manual refresh] Error:", err));
    res.json({ message: "Refresh started. Cards will update in ~30 seconds." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
