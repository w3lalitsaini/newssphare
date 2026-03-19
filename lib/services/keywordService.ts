// @ts-ignore
import googleTrends from "google-trends-api";
import { logInfo, logWarn } from "./logger";

const FALLBACK_KEYWORDS = [
  "AI tools for productivity 2026",
  "Latest tech news today India",
  "How to make money with AI blogs",
  "Digital marketing trends 2026",
  "Remote work tools for developers",
  "Future of quantum computing",
  "Cybersecurity best practices 2026"
];

/**
 * Fetches real-time trending keywords from Google Trends
 */
export async function getTrendingKeywords(geo: string = "IN"): Promise<string[]> {
  try {
    await logInfo("KeywordService", `Fetching daily trends (geo: ${geo})...`);

    const response = await googleTrends.dailyTrends({ geo });
    const data = JSON.parse(response);
    const trendingSearches = data.default?.trendingSearchesDays?.[0]?.trendingSearches || [];

    if (trendingSearches.length === 0) throw new Error("No trends found");

    const keywords = trendingSearches.map((item: any) => item.title.query.toLowerCase().trim());
    const cleanKeywords = Array.from(new Set(keywords)).filter((k: any) => k.length >= 5).slice(0, 8);

    await logInfo("KeywordService", `Successfully fetched ${cleanKeywords.length} keywords.`);
    return cleanKeywords as string[];

  } catch (error: any) {
    await logWarn("KeywordService", `Google Trends API failed: ${error.message}. Using fallback.`);
    return FALLBACK_KEYWORDS.sort(() => 0.5 - Math.random()).slice(0, 5);
  }
}
