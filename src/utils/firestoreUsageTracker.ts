// Spark plan limits (as of 2024)
export const FIRESTORE_LIMITS = {
  READS_PER_DAY: 50000,
  WRITES_PER_DAY: 20000,
  DELETES_PER_DAY: 20000,
  STORAGE_GB: 1,
  // Warning thresholds (80% of limits)
  READS_WARNING: 40000,
  WRITES_WARNING: 16000,
  DELETES_WARNING: 16000
} as const;

export interface UsageStats {
  reads: number;
  writes: number;
  deletes: number;
  lastReset: Date;
}

/**
 * Simple usage tracking using localStorage
 * Note: This is client-side tracking only and resets with browser data clearing
 * For production, consider server-side tracking
 */
class FirestoreUsageTracker {
  private storageKey = 'firestore_usage_stats';
  
  private getStats(): UsageStats {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const stats = JSON.parse(stored);
        // Check if we need to reset daily stats
        const lastReset = new Date(stats.lastReset);
        const now = new Date();
        const isNewDay = now.getDate() !== lastReset.getDate() || 
                        now.getMonth() !== lastReset.getMonth() || 
                        now.getFullYear() !== lastReset.getFullYear();
        
        if (isNewDay) {
          return this.resetStats();
        }
        
        return {
          reads: stats.reads || 0,
          writes: stats.writes || 0,
          deletes: stats.deletes || 0,
          lastReset: new Date(stats.lastReset)
        };
      }
    } catch (error) {
      console.warn('Failed to load Firestore usage stats:', error);
    }
    
    return this.resetStats();
  }
  
  private resetStats(): UsageStats {
    const stats: UsageStats = {
      reads: 0,
      writes: 0,
      deletes: 0,
      lastReset: new Date()
    };
    
    this.saveStats(stats);
    return stats;
  }
  
  private saveStats(stats: UsageStats): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to save Firestore usage stats:', error);
    }
  }
  
  /**
   * Track Firestore reads
   */
  trackRead(count: number = 1): void {
    const stats = this.getStats();
    stats.reads += count;
    this.saveStats(stats);
    
    // Warn if approaching limits
    if (stats.reads >= FIRESTORE_LIMITS.READS_WARNING) {
      console.warn(`🚨 Firestore reads approaching daily limit: ${stats.reads}/${FIRESTORE_LIMITS.READS_PER_DAY}`);
    }
  }
  
  /**
   * Track Firestore writes
   */
  trackWrite(count: number = 1): void {
    const stats = this.getStats();
    stats.writes += count;
    this.saveStats(stats);
    
    if (stats.writes >= FIRESTORE_LIMITS.WRITES_WARNING) {
      console.warn(`🚨 Firestore writes approaching daily limit: ${stats.writes}/${FIRESTORE_LIMITS.WRITES_PER_DAY}`);
    }
  }
  
  /**
   * Track Firestore deletes
   */
  trackDelete(count: number = 1): void {
    const stats = this.getStats();
    stats.deletes += count;
    this.saveStats(stats);
    
    if (stats.deletes >= FIRESTORE_LIMITS.DELETES_WARNING) {
      console.warn(`🚨 Firestore deletes approaching daily limit: ${stats.deletes}/${FIRESTORE_LIMITS.DELETES_PER_DAY}`);
    }
  }
  
  /**
   * Get current usage statistics
   */
  getCurrentStats(): UsageStats {
    return this.getStats();
  }
  
  /**
   * Log current usage to console (development only)
   */
  logUsage(): void {
    if (process.env.NODE_ENV === 'development') {
      const stats = this.getStats();
      console.log('📊 Firestore Usage Today:', {
        reads: `${stats.reads}/${FIRESTORE_LIMITS.READS_PER_DAY}`,
        writes: `${stats.writes}/${FIRESTORE_LIMITS.WRITES_PER_DAY}`,
        deletes: `${stats.deletes}/${FIRESTORE_LIMITS.DELETES_PER_DAY}`,
        resetTime: stats.lastReset.toLocaleString()
      });
    }
  }
  
  /**
   * Reset usage stats manually
   */
  reset(): void {
    this.resetStats();
    console.log('🔄 Firestore usage stats reset');
  }
}

// Export singleton instance
export const firestoreUsageTracker = new FirestoreUsageTracker();
