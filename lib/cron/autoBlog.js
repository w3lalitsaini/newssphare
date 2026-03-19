import cron from "node-cron";
import { runAutoBlogEngine } from "../workflows/autoBlogEngine";
import { logInfo, logError } from "../services/logger";

/**
 * Initialize NewsSphare Auto-Blog Scheduler
 * Runs every 10 minutes to check for new trends and generate articles.
 */
export function initBlogCron() {
  console.log("-----------------------------------------");
  console.log("Initializing NewsSphare Auto-Blog Cron...");
  console.log("Frequency: Every 10 Minutes");
  console.log("-----------------------------------------");

  // Every 10 minutes
  cron.schedule("*/10 * * * *", async () => {
    try {
      await logInfo("CronJob", "NewsSphare: Starting 10-minute automation tick...");
      const summary = await runAutoBlogEngine();
      await logInfo("CronJob", `NewsSphare: Automation tick finished. Success: ${summary.success}`);
    } catch (err) {
      await logError("CronJob", "NewsSphare: Global cron failure: " + err.message);
    }
  });

  console.log("NewsSphare Blog Cron Scheduled successfully.");
}
