import * as cheerio from "cheerio";
import db from "../db/database.js";

// Derives Screener.in company path from NSE ticker
function screenerSlug(ticker) {
  return ticker.replace(".NS", "").replace(".BO", "");
}

function parseNumber(str) {
  if (!str) return null;
  const n = parseFloat(str.replace(/,/g, "").trim());
  return isNaN(n) ? null : n;
}

async function scrapeScreener(ticker) {
  const slug = screenerSlug(ticker);
  const urls = [
    `https://www.screener.in/company/${slug}/consolidated/`,
    `https://www.screener.in/company/${slug}/`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
          "Accept": "text/html",
        },
      });
      if (!res.ok) continue;
      const html = await res.text();
      const $    = cheerio.load(html);

      let roce = null, roe = null, salesGrowth = null;

      // ROCE and ROE are in the #top-ratios list
      $("#top-ratios li").each((_, el) => {
        const label = $(el).find(".name").text().trim();
        const value = $(el).find(".number").first().text().trim();
        if (/^ROCE$/i.test(label))    roce = parseNumber(value);
        if (/^ROE$/i.test(label))     roe  = parseNumber(value);
      });

      // Sales growth: look for "Compounded Sales Growth" section, grab 3-year figure
      $("table").each((_, table) => {
        const caption = $(table).closest("section, div").find("h2, h3, .sub, strong").first().text();
        if (!/sales growth/i.test(caption) && !/compounded/i.test(caption)) return;
        $(table).find("tr").each((_, row) => {
          const cells = $(row).find("td");
          const label = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim();
          if (/3\s*year/i.test(label)) salesGrowth = parseNumber(value);
        });
      });

      // Fallback: search all text for "3 Years:" pattern near a sales growth heading
      if (salesGrowth === null) {
        const bodyText = $("body").text();
        const match = bodyText.match(/Compounded Sales Growth[\s\S]{0,300}3 Years[:\s]+(-?\d+\.?\d*)/i);
        if (match) salesGrowth = parseNumber(match[1]);
      }

      if (roce !== null || roe !== null || salesGrowth !== null) {
        return { roce, roe, salesGrowth };
      }
    } catch (err) {
      console.error(`[fundamentals] Fetch error for ${ticker}:`, err.message);
    }
  }
  return null;
}

async function runFundamentalsPipeline() {
  const companies = db.prepare("SELECT * FROM watchlist").all();
  if (!companies.length) return;

  console.log(`[fundamentals] Starting daily run for ${companies.length} companies...`);

  await Promise.allSettled(companies.map(async (company) => {
    try {
      // Skip if updated within last 20 hours
      const existing = db.prepare("SELECT last_updated FROM fundamentals WHERE company_id = ?").get(company.id);
      if (existing?.last_updated) {
        const ageHours = (Date.now() - new Date(existing.last_updated).getTime()) / 3600000;
        if (ageHours < 20) {
          console.log(`[fundamentals] ${company.name}: fresh (${Math.round(ageHours)}h old), skipping.`);
          return;
        }
      }

      const data = await scrapeScreener(company.ticker);
      if (!data) {
        console.warn(`[fundamentals] ${company.name}: no data found on Screener.`);
        return;
      }

      db.prepare(`
        INSERT INTO fundamentals (company_id, roce, roe, sales_growth, last_updated)
        VALUES (:id, :roce, :roe, :salesGrowth, :now)
        ON CONFLICT(company_id) DO UPDATE SET
          roce         = excluded.roce,
          roe          = excluded.roe,
          sales_growth = excluded.sales_growth,
          last_updated = excluded.last_updated
      `).run({ id: company.id, roce: data.roce, roe: data.roe, salesGrowth: data.salesGrowth, now: new Date().toISOString() });

      console.log(`[fundamentals] ${company.name}: ROCE=${data.roce}% ROE=${data.roe}% SalesGrowth=${data.salesGrowth}%`);
    } catch (err) {
      console.error(`[fundamentals] ${company.name} error:`, err.message);
    }
  }));

  console.log("[fundamentals] Daily run complete.");
}

export { runFundamentalsPipeline };
