import { runBlogAgent } from './blogAgent';
import { getTrendingKeywords } from '@/lib/services/keywordService';
import { isKeywordUsed } from '@/lib/services/blogService';
import { logInfo, logWarn, logError } from '@/lib/services/logger';

/**
 * Intelligent Automation Engine
 * Processes multiple keywords in parallel with throttling and retries.
 */
export async function runAutoBlogEngine() {
  const start = Date.now();
  await logInfo('AutoBlogEngine', 'Automation cycle triggered.');

  const summary = { total: 0, success: 0, failed: 0, duration: 0, results: [] as any[] };

  try {
    // 1. Fetch Daily Trends
    const keywords = await getTrendingKeywords();
    summary.total = keywords.length;

    if (summary.total === 0) {
      await logWarn('AutoBlogEngine', 'No new keywords to process.');
      return summary;
    }

    // 2. Batch Processing (2 results at a time to stay within LLM limits)
    const BATCH_SIZE = 2;
    for (let i = 0; i < keywords.length; i += BATCH_SIZE) {
      const batch = keywords.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (keyword) => {
         try {
           // Skip if already used
           if (await isKeywordUsed(keyword)) return { keyword, status: 'skipped' };

           const res = await runBlogAgent(keyword, { useCache: true, autoSave: true });
           if (res.postId || res.cached) {
             summary.success++;
             return { keyword, status: 'success' };
           }
           throw new Error("No Article ID returned");

         } catch (err: any) {
            summary.failed++;
            await logError('AutoBlogEngine', `Failed for "${keyword}": ${err.message}`);
            return { keyword, status: 'failed', error: err.message };
         }
      });

      const batchResults = await Promise.all(batchPromises);
      summary.results.push(...batchResults);

      // Throttling between batches
      if (i + BATCH_SIZE < keywords.length) await new Promise(r => setTimeout(r, 2000));
    }

    summary.duration = Number(((Date.now() - start) / 1000).toFixed(1));
    await logInfo('AutoBlogEngine', `Cycle Complete: ${summary.success} Success, ${summary.failed} Failed.`, summary);
    
    return summary;

  } catch (criticalError: any) {
    await logError('AutoBlogEngine', `CRITICAL SYSTEM ERROR: ${criticalError.message}`);
    throw criticalError;
  }
}
