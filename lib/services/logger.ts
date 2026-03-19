import Log from "@/models/Log";
import connectDB from "@/lib/db";

/**
 * Production-Level Logger Service
 */
async function writeLog(level: 'info' | 'warn' | 'error' | 'debug', source: string, message: string, metadata: any = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${level.toUpperCase()}] [${source}] ${message}`;

  // 1. Console Logging
  if (level === 'error') {
    console.error(logEntry, metadata);
  } else if (level === 'warn') {
    console.warn(logEntry, metadata);
  } else {
    console.log(logEntry);
  }

  // 2. Database Logging
  try {
    await connectDB();
    await Log.create({
      level,
      source,
      message,
      metadata,
      timestamp: new Date()
    });
  } catch (err: any) {
    console.warn('[Logger] Failed to save log to DB:', err.message);
  }
}

export const logInfo = (source: string, message: string, metadata: any = {}) => 
  writeLog('info', source, message, metadata);

export const logError = (source: string, message: string, error: any = {}) => {
  const metadata = error instanceof Error 
    ? { stack: error.stack, message: error.message }
    : error;
  return writeLog('error', source, message, metadata);
};

export const logWarn = (source: string, message: string, metadata: any = {}) => 
  writeLog('warn', source, message, metadata);

export const logAgentStep = (agentName: string, step: string, keyword: string, details: any = {}) => {
  const message = `Step: ${step} | Keyword: ${keyword}`;
  return writeLog('debug', agentName, message, details);
};
