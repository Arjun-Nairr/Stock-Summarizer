import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Takes a company name and array of article objects, returns { summary, verdict, reason }
async function summarizeNews(companyName, articles) {
  if (!articles.length) return null;

  // Cap at 8 articles to stay within token limits
  const topArticles = articles.slice(0, 8);
  const articleText = topArticles
    .map((a, i) => `[${i + 1}] ${a.title}${a.snippet ? ": " + a.snippet.slice(0, 200) : ""}`)
    .join("\n");

  const prompt = `You are a financial news analyst summarizing Indian stock market news for a retail investor.

Company: ${companyName}

Recent news articles:
${articleText}

Instructions:
- Write a summary in exactly 3 clear sentences that a non-expert retail investor can understand.
- Then give a verdict: Bullish, Bearish, or Neutral — based only on the news above.
- Give one short sentence as the reason for your verdict.

Respond with ONLY valid JSON in this exact format, nothing else:
{
  "summary": "...",
  "verdict": "Bullish" | "Bearish" | "Neutral",
  "reason": "..."
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 400,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("Empty response from Groq");

  // Extract JSON even if the model wraps it in markdown code fences
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in Groq response");

  const parsed = JSON.parse(jsonMatch[0]);

  // Normalise verdict to exactly one of three values
  const validVerdicts = ["Bullish", "Bearish", "Neutral"];
  const verdict = validVerdicts.find(
    (v) => v.toLowerCase() === (parsed.verdict || "").toLowerCase()
  ) || "Neutral";

  return {
    summary: parsed.summary || "",
    verdict,
    reason: parsed.reason || "",
  };
}

export { summarizeNews };
