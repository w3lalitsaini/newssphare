/**
 * Next.js Instrumentation
 * Boots background services when the server starts.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Only run on the server-side node runtime
    try {
      const { initBlogCron } = await import("./lib/cron/autoBlog");
      const { default: connectDB } = await import("./lib/db");

      // 1. Ensure DB Connection
      await connectDB();
      console.log("[Instrumentation] DB Connected for Background Services.");

      // 2. Start Cron Job
      initBlogCron();
      console.log("[Instrumentation] Auto-Blog background services initialized.");
      
    } catch (error) {
       console.error("[Instrumentation] Failed to initialize background services:", error);
    }
  }
}
