import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "stock_news.db");

const db = new DatabaseSync(DB_PATH);

db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS watchlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ticker TEXT NOT NULL UNIQUE,
    aliases TEXT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL UNIQUE,
    summary TEXT,
    verdict TEXT,
    verdict_reason TEXT,
    articles_used INTEGER DEFAULT 0,
    article_links TEXT DEFAULT '[]',
    last_updated DATETIME,
    FOREIGN KEY (company_id) REFERENCES watchlist(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS stock_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL UNIQUE,
    current_price REAL,
    day_change REAL,
    day_change_pct REAL,
    currency TEXT DEFAULT 'INR',
    last_updated DATETIME,
    FOREIGN KEY (company_id) REFERENCES watchlist(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS verdict_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    verdict TEXT NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES watchlist(id) ON DELETE CASCADE
  );
`);

// Add article_links column to existing DBs that predate this schema
try { db.exec("ALTER TABLE news_summaries ADD COLUMN article_links TEXT DEFAULT '[]'"); } catch (_) {}

export default db;
