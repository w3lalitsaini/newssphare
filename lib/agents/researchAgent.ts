import { generateText } from '@/lib/services/aiService';
import { logAgentStep } from '@/lib/services/logger';

/**
 * Research Agent
 * Uses LLM to brainstorm a title, sub-topics, and search intent for a keyword.
 */
export async function researchAgent(keyword: string) {
  const prompt = `You are an expert SEO content strategist.
Given the seed keyword: "${keyword}"
Return a valid JSON object with the following structure:
{
  "topic": "Proposed Blog Title",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "search_intent": "informational"
}
Ensure the output is ONLY the JSON object, no other text.`;

  try {
    await logAgentStep('ResearchAgent', 'Starting Research', keyword);
    const raw = await generateText(prompt);
    
    let parsed = { topic: `Expert Guide: ${keyword}`, keywords: [keyword], search_intent: "informational" };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch (parseErr) {
       console.warn("[ResearchAgent] JSON Parse failed, using fallback.");
    }
    
    await logAgentStep('ResearchAgent', 'Research Complete', keyword, { topic: parsed.topic });
    return { ...parsed, fallback_used: false };

  } catch (err: any) {
    return {
      topic: `Mastering ${keyword}: The Complete 2026 Guide`,
      keywords: [keyword, "guide", "tips"],
      search_intent: "informational",
      fallback_used: true
    };
  }
}
