import React from 'react';

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

interface UsageStats {
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
      console.warn('Failed to load usage stats:', error);
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
      console.warn('Failed to save usage stats:', error);
    }
  }
  
  /**
   * Track a read operation
   */
  trackRead(count: number = 1): void {
    const stats = this.getStats();
    stats.reads += count;
    this.saveStats(stats);
    this.checkLimits(stats);
  }
  
  /**
   * Track a write operation
   */
  trackWrite(count: number = 1): void {
    const stats = this.getStats();
    stats.writes += count;
    this.saveStats(stats);
    this.checkLimits(stats);
  }
  
  /**
   * Track a delete operation
   */
  trackDelete(count: number = 1): void {
    const stats = this.getStats();
    stats.deletes += count;
    this.saveStats(stats);
    this.checkLimits(stats);
  }
  
  /**
   * Get current usage statistics
   */
  getCurrentStats(): UsageStats & {
    readsPercentage: number;
    writesPercentage: number;
    deletesPercentage: number;
  } {
    const stats = this.getStats();
    return {
      ...stats,
      readsPercentage: (stats.reads / FIRESTORE_LIMITS.READS_PER_DAY) * 100,
      writesPercentage: (stats.writes / FIRESTORE_LIMITS.WRITES_PER_DAY) * 100,
      deletesPercentage: (stats.deletes / FIRESTORE_LIMITS.DELETES_PER_DAY) * 100
    };
  }
  
  /**
   * Check if usage is approaching limits and show warnings
   */
  private checkLimits(stats: UsageStats): void {
    // Check reads
    if (stats.reads >= FIRESTORE_LIMITS.READS_WARNING) {
      console.warn(`🚨 Firestore Usage Warning: ${stats.reads}/${FIRESTORE_LIMITS.READS_PER_DAY} reads used (${Math.round((stats.reads / FIRESTORE_LIMITS.READS_PER_DAY) * 100)}%)`);
    }
    
    // Check writes
    if (stats.writes >= FIRESTORE_LIMITS.WRITES_WARNING) {
      console.warn(`🚨 Firestore Usage Warning: ${stats.writes}/${FIRESTORE_LIMITS.WRITES_PER_DAY} writes used (${Math.round((stats.writes / FIRESTORE_LIMITS.WRITES_PER_DAY) * 100)}%)`);
    }
    
    // Check deletes
    if (stats.deletes >= FIRESTORE_LIMITS.DELETES_WARNING) {
      console.warn(`🚨 Firestore Usage Warning: ${stats.deletes}/${FIRESTORE_LIMITS.DELETES_PER_DAY} deletes used (${Math.round((stats.deletes / FIRESTORE_LIMITS.DELETES_PER_DAY) * 100)}%)`);
    }
  }
  
  /**
   * Log current usage to console (for development)
   */
  logUsage(): void {
    const stats = this.getCurrentStats();
    console.group('📊 Firestore Usage Stats');
    console.log(`Reads: ${stats.reads}/${FIRESTORE_LIMITS.READS_PER_DAY} (${stats.readsPercentage.toFixed(1)}%)`);
    console.log(`Writes: ${stats.writes}/${FIRESTORE_LIMITS.WRITES_PER_DAY} (${stats.writesPercentage.toFixed(1)}%)`);
    console.log(`Deletes: ${stats.deletes}/${FIRESTORE_LIMITS.DELETES_PER_DAY} (${stats.deletesPercentage.toFixed(1)}%)`);
    console.log(`Last reset: ${stats.lastReset.toLocaleString()}`);
    console.groupEnd();
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

/**
 * React hook to monitor usage stats
 */
export const useFirestoreUsage = () => {
  const [stats, setStats] = React.useState(() => firestoreUsageTracker.getCurrentStats());
  
  React.useEffect(() => {
    // Update stats every minute
    const interval = setInterval(() => {
      setStats(firestoreUsageTracker.getCurrentStats());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return {
    stats,
    logUsage: () => firestoreUsageTracker.logUsage(),
    reset: () => {
      firestoreUsageTracker.reset();
      setStats(firestoreUsageTracker.getCurrentStats());
    }
  };
};

// Development-only usage display component
export const FirestoreUsageDisplay: React.FC = () => {
  const { stats, logUsage, reset } = useFirestoreUsage();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-red-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };
  
  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-90 text-white text-xs p-3 rounded-lg font-mono z-50 max-w-xs">
      <div className="font-bold mb-2">📊 Firestore Usage</div>
      
      <div className={`mb-1 ${getUsageColor(stats.readsPercentage)}`}>
        Reads: {stats.reads}/{FIRESTORE_LIMITS.READS_PER_DAY} ({stats.readsPercentage.toFixed(1)}%)
      </div>
      
      <div className={`mb-1 ${getUsageColor(stats.writesPercentage)}`}>
        Writes: {stats.writes}/{FIRESTORE_LIMITS.WRITES_PER_DAY} ({stats.writesPercentage.toFixed(1)}%)
      </div>
      
      <div className={`mb-2 ${getUsageColor(stats.deletesPercentage)}`}>
        Deletes: {stats.deletes}/{FIRESTORE_LIMITS.DELETES_PER_DAY} ({stats.deletesPercentage.toFixed(1)}%)
      </div>
      
      <div className="text-xs text-gray-300 mb-2">
        Reset: {stats.lastReset.toLocaleDateString()}
      </div>
      
      <div className="flex gap-1">
        <button 
          onClick={logUsage}
          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Log
        </button>
        <button 
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
