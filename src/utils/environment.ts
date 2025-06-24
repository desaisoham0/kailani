// Environment configuration and logging utilities for production
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * Development-only logging that gets stripped in production
 */
export const devLog = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args);
  }
};

/**
 * Validate required environment variables
 */
export function validateEnvironment() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  devLog.log('✅ All required environment variables are present');
}

/**
 * Safe error handler for async operations
 */
export function handleAsyncError(error: unknown, context: string): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`Error in ${context}:`, errorMessage);
  
  // In production, you might want to send to error tracking service
  if (isProduction) {
    const windowWithGtag = window as Window & { gtag?: (command: string, action: string, parameters?: object) => void };
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'exception', {
        description: `${context}: ${errorMessage}`,
        fatal: false
      });
    }
  }
}

/**
 * Performance monitoring helper
 */
export function measurePerformance<T>(
  operation: () => T | Promise<T>,
  label: string
): T | Promise<T> {
  if (!isDevelopment) {
    return operation();
  }

  const start = performance.now();
  const result = operation();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      devLog.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
    });
  } else {
    const end = performance.now();
    devLog.log(`⏱️ ${label} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
}
