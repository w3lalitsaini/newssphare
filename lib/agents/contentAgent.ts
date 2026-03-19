import { generateText } from '@/lib/services/aiService';
import { logAgentStep } from '@/lib/services/logger';

/**
 * Content Agent
 * Generates a full-length, SEO-optimized blog post in HTML format.
 */
export async function contentAgent({ topic, keywords }: { topic: string; keywords: string[] }) {
  const prompt = `You are a professional tech blogger and SEO expert.
Write a comprehensive, high-quality blog post about: "${topic}".
Include these keywords naturally: ${keywords.join(", ")}.

REQUIREMENTS:
1. Format: Use ONLY clean HTML (h2, h3, p, ul, li, strong). NO <html> or <body> tags.
2. Length: Minimum 1000 words.
3. Tone: Professional, engaging, and authoritative.
4. Structure: Introduction, several detailed sections with H2/H3, and a conclusion.

Ensure the content is up-to-date for 2026 trends.
Response must be ONLY the HTML content.`;

  try {
    await logAgentStep('ContentAgent', 'Generating Content', topic);
    const content = await generateText(prompt);
    
    if (!content || content.length < 500) throw new Error("Content too short");

    await logAgentStep('ContentAgent', 'Content Generated', topic);
    return { content, fallback_used: false };

  } catch (err: any) {
     return { 
       content: `<p>We are currently updating our analysis on <strong>${topic}</strong>. Please check back shortly for the full report on ${keywords[0]}.</p>`,
       fallback_used: true 
     };
  }
}
