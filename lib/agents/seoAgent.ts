import { generateText } from '@/lib/services/aiService';
import { logAgentStep } from '@/lib/services/logger';

/**
 * SEO Agent
 * Optimizes the meta titles, descriptions, and slugs.
 */
export async function seoAgent({ topic, content }: { topic: string; content: string }) {
  const prompt = `You are an SEO specialist.
Given the blog topic: "${topic}" and the start of the content: "${content.substring(0, 500)}..."
Return a valid JSON object:
{
  "title": "Optimized SEO Title",
  "slug": "optimized-url-slug",
  "excerpt": "Compelling 150-character meta description",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Technology"
}
Output ONLY JSON.`;

  try {
    await logAgentStep('SEOAgent', 'Optimizing SEO', topic);
    const raw = await generateText(prompt);
    
    let parsed = { title: topic, slug: "", excerpt: "", tags: [], category: "Tech", fallback_used: false };
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
       parsed.fallback_used = true;
    }
    
    await logAgentStep('SEOAgent', 'SEO Optimized', topic, { slug: parsed.slug });
    return parsed;

  } catch (err: any) {
    return {
      title: topic,
      slug: topic.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
      excerpt: `Everything you need to know about ${topic}.`,
      tags: ["tech", "guide"],
      category: "Tech",
      fallback_used: true
    };
  }
}
