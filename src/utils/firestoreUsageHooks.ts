import React from 'react';
import { firestoreUsageTracker } from './firestoreUsageTracker';

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
