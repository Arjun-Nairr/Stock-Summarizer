import Parser from "rss-parser";

const parser = new Parser({ timeout: 10000 });

// Both feeds cover Indian markets well and are publicly available RSS
const RSS_FEEDS = [
  "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms",
  "https://economictimes.indiatimes.com/industry/rssfeeds/13352306.cms",
  "https://www.moneycontrol.com/rss/latestnews.xml",
  "https://www.moneycontrol.com/rss/marketreports.xml",
];

// Fetch all feeds and merge into one flat list of articles
async function fetchAllArticles() {
  const results = await Promise.allSettled(RSS_FEEDS.map((url) => parser.parseURL(url)));

  const articles = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const item of result.value.items) {
        articles.push({
          title: item.title || "",
          snippet: item.contentSnippet || item.content || item.summary || "",
          link: item.link || "",
          pubDate: item.pubDate || item.isoDate || null,
        });
      }
    }
  }
  return articles;
}

// Filter the full article list to those mentioning a specific company.
// aliases is the array stored in the DB (JSON-parsed).
function filterArticlesForCompany(articles, aliases) {
  const lowerAliases = aliases.map((a) => a.toLowerCase());

  return articles.filter((article) => {
    const haystack = (article.title + " " + article.snippet).toLowerCase();
    return lowerAliases.some((alias) => haystack.includes(alias.toLowerCase()));
  });
}

export { fetchAllArticles, filterArticlesForCompany };
