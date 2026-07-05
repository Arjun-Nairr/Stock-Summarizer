import cron from "node-cron";
import db from "../db/database.js";
import { fetchAllArticles, filterArticlesForCompany } from "./rssFetcher.js";
import { summarizeNews } from "./aiSummarizer.js";
import { fetchStockPrice } from "./stockPrice.js";
import { runFundamentalsPipeline } from "./fundamentalsScraper.js";

async function processCompany(company, allArticles, forceAI = false) {
  const aliases = JSON.parse(company.aliases);
  const now     = new Date().toISOString();

  // ── AI summary ──
  const summaryTask = (async () => {
    const relevant = filterArticlesForCompany(allArticles, aliases);
    console.log(`[pipeline] ${company.name}: ${relevant.length} relevant articles found.`);
    if (!relevant.length) return null;

    // Skip Groq if we already have a summary from the last 50 minutes AND not forced.
    // This prevents burning tokens on manual refreshes when the news hasn't changed.
    if (!forceAI) {
      const existing = db.prepare("SELECT last_updated FROM news_summaries WHERE company_id = ?").get(company.id);
      if (existing?.last_updated) {
        const ageMinutes = (Date.now() - new Date(existing.last_updated).getTime()) / 60000;
        if (ageMinutes < 50) {
          console.log(`[pipeline] ${company.name}: summary fresh (${Math.round(ageMinutes)}m old), skipping Groq.`);
          return null;
        }
      }
    }

    const result = await summarizeNews(company.name, relevant);
    if (result) {
      result.articlesUsed  = relevant.length;
      result.articleLinks  = relevant.slice(0, 3).map(a => ({ title: a.title, url: a.link })).filter(a => a.url);
    }
    return result;
  })();

  // ── Stock price + AI run in parallel ──
  const [summaryResult, priceResult] = await Promise.allSettled([
    summaryTask,
    fetchStockPrice(company.ticker),
  ]);

  // Save summary if we got one
  if (summaryResult.status === "fulfilled" && summaryResult.value) {
    const r = summaryResult.value;
    db.prepare(`
      INSERT INTO news_summaries (company_id, summary, verdict, verdict_reason, articles_used, article_links, last_updated)
      VALUES (:id, :summary, :verdict, :reason, :articles_used, :links, :now)
      ON CONFLICT(company_id) DO UPDATE SET
        summary        = excluded.summary,
        verdict        = excluded.verdict,
        verdict_reason = excluded.verdict_reason,
        articles_used  = excluded.articles_used,
        article_links  = excluded.article_links,
        last_updated   = excluded.last_updated
    `).run({ id: company.id, summary: r.summary, verdict: r.verdict, reason: r.reason, articles_used: r.articlesUsed ?? 0, links: JSON.stringify(r.articleLinks ?? []), now });

    // Append to verdict history, keep only last 7 per company
    db.prepare("INSERT INTO verdict_history (company_id, verdict, recorded_at) VALUES (?, ?, ?)").run(company.id, r.verdict, now);
    db.prepare(`
      DELETE FROM verdict_history WHERE company_id = ? AND id NOT IN (
        SELECT id FROM verdict_history WHERE company_id = ? ORDER BY recorded_at DESC LIMIT 7
      )
    `).run(company.id, company.id);

    console.log(`[pipeline] ${company.name}: summary saved (${r.verdict})`);
  } else if (summaryResult.status === "rejected") {
    console.error(`[pipeline] ${company.name} summary error:`, summaryResult.reason?.message);
  }

  // Save price
  if (priceResult.status === "fulfilled" && priceResult.value) {
    const p = priceResult.value;
    db.prepare(`
      INSERT INTO stock_prices (company_id, current_price, day_change, day_change_pct, currency, last_updated)
      VALUES (:id, :price, :change, :pct, :currency, :now)
      ON CONFLICT(company_id) DO UPDATE SET
        current_price  = excluded.current_price,
        day_change     = excluded.day_change,
        day_change_pct = excluded.day_change_pct,
        currency       = excluded.currency,
        last_updated   = excluded.last_updated
    `).run({ id: company.id, price: p.currentPrice, change: p.dayChange, pct: p.dayChangePct, currency: p.currency, now });
    console.log(`[pipeline] ${company.name}: price saved (₹${p.currentPrice})`);
  } else if (priceResult.status === "rejected") {
    console.error(`[pipeline] ${company.name} price error:`, priceResult.reason?.message);
  }
}

const BATCH_SIZE  = 8;   // max concurrent Groq calls — keeps us under 30 RPM free tier limit
const BATCH_DELAY = 2000; // ms pause between batches

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// forceAI: true when called by the hourly scheduler (fresh cycle), false for manual refreshes
async function runPipeline(forceAI = false) {
  const companies = db.prepare("SELECT * FROM watchlist").all();
  if (!companies.length) {
    console.log("[pipeline] Watchlist is empty, nothing to process.");
    return;
  }

  console.log(`[pipeline] Starting run for ${companies.length} companies (forceAI=${forceAI})...`);

  let allArticles = [];
  try {
    allArticles = await fetchAllArticles();
    console.log(`[pipeline] Fetched ${allArticles.length} total articles from RSS feeds.`);
  } catch (err) {
    console.error("[pipeline] RSS fetch failed:", err.message);
  }

  // Process in batches to avoid hitting Groq rate limits (30 RPM free tier)
  for (let i = 0; i < companies.length; i += BATCH_SIZE) {
    const batch = companies.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(batch.map(c => processCompany(c, allArticles, forceAI)));
    if (i + BATCH_SIZE < companies.length) {
      console.log(`[pipeline] Batch ${Math.floor(i / BATCH_SIZE) + 1} done, pausing before next...`);
      await sleep(BATCH_DELAY);
    }
  }

  console.log("[pipeline] Run complete.");
}

function startScheduler() {
  // Hourly: news summaries + stock prices
  cron.schedule("0 * * * *", () => {
    console.log("[scheduler] Hourly trigger fired.");
    runPipeline(true).catch(err => console.error("[scheduler] Pipeline error:", err));
  });

  // Daily at 8:00 AM IST (2:30 AM UTC) — fundamentals
  cron.schedule("30 2 * * *", () => {
    console.log("[scheduler] Daily fundamentals trigger fired.");
    runFundamentalsPipeline().catch(err => console.error("[scheduler] Fundamentals error:", err));
  }, { timezone: "UTC" });

  console.log("[scheduler] Hourly + daily schedulers started.");
}

export { startScheduler, runPipeline };
