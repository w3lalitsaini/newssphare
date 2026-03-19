import { researchAgent } from '@/lib/agents/researchAgent';
import { contentAgent } from '@/lib/agents/contentAgent';
import { seoAgent } from '@/lib/agents/seoAgent';
import { linkingAgent } from '@/lib/agents/linkingAgent';
import { getCache, setCache } from '@/lib/services/cacheService';
import { saveBlog } from '@/lib/services/blogService';
import { logInfo, logError } from '@/lib/services/logger';

/**
 * Blog Agent Workflow: Orchestrates multi-agent blog generation.
 */
export async function runBlogAgent(keyword: string, options: { useCache?: boolean; autoSave?: boolean } = {}) {
  const { useCache = true, autoSave = false } = options;
  await logInfo('BlogAgent', `[Cycle Started] Keyword: "${keyword}"`);

  if (!keyword || keyword.trim().length === 0) throw new Error('Keyword is required');

  // 1. Cache Check
  if (useCache) {
    const cacheKey = `blog:${keyword.toLowerCase().trim()}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      await logInfo('BlogAgent', `[Cache Hit] ${cacheKey}`);
      return { ...cached, cached: true };
    }
  }

  let fallback_used = false;

  try {
    // 2. Research
    const research = await researchAgent(keyword);
    if (research.fallback_used) fallback_used = true;

    // 3. Content 
    const contentResult = await contentAgent({
       topic: research.topic,
       keywords: research.keywords
    });
    if (contentResult.fallback_used) fallback_used = true;

    // 4. Link Injection
    const withLinks = await linkingAgent({
      content: contentResult.content,
      keywords: research.keywords
    });

    // 5. SEO & Metadata
    const seo = await seoAgent({
      topic: research.topic,
      content: withLinks.content
    });
    if (seo.fallback_used) fallback_used = true;

    const result = {
      topic: research.topic,
      content: withLinks.content,
      title: seo.title,
      slug: seo.slug,
      meta_description: seo.excerpt,
      tags: seo.tags,
      category: seo.category,
      featured_image: "", // Cloudinary logic omitted for brevity in base agent
      fallback_used,
      cached: false,
      status: "published"
    };

    // 6. Cache & Save
    const cacheKey = `blog:${keyword.toLowerCase().trim()}`;
    if (useCache && !fallback_used) {
       await setCache(cacheKey, result);
    }

    if (autoSave && !fallback_used) {
       try {
         const saved = await saveBlog(result);
         await logInfo('BlogAgent', `[Auto-Published] ID: ${saved._id}`);
         return { ...result, postId: saved._id };
       } catch (err: any) {
         await logError('BlogAgent', `[Save Failed] ${err.message}`);
       }
    }

    await logInfo('BlogAgent', `[Cycle Complete] "${keyword}"`);
    return result;

  } catch (error: any) {
    await logError('BlogAgent', `[Fatal Error] ${error.message}`);
    throw error;
  }
}
