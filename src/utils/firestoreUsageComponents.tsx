import React from 'react';
import { FIRESTORE_LIMITS } from './firestoreUsageTracker';
import { useFirestoreUsage } from './firestoreUsageHooks';

// Development-only usage display component
export const FirestoreUsageDisplay: React.FC = () => {
  const { stats, logUsage, reset } = useFirestoreUsage();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const getUsageColor = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    if (percentage >= 80) return 'text-red-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const formatPercentage = (used: number, limit: number) => {
    return ((used / limit) * 100).toFixed(1);
  };

  return (
    <div className="fixed top-4 left-4 bg-black bg-opacity-90 text-white text-xs p-3 rounded-lg font-mono z-50 min-w-[280px]">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-blue-400">📊 Firestore Usage</span>
        <div className="flex gap-1">
          <button
            onClick={logUsage}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
            title="Log usage to console"
          >
            Log
          </button>
          <button
            onClick={reset}
            className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
            title="Reset usage stats"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className={`flex justify-between ${getUsageColor(stats.reads, FIRESTORE_LIMITS.READS_PER_DAY)}`}>
          <span>Reads:</span>
          <span>{stats.reads}/{FIRESTORE_LIMITS.READS_PER_DAY} ({formatPercentage(stats.reads, FIRESTORE_LIMITS.READS_PER_DAY)}%)</span>
        </div>
        
        <div className={`flex justify-between ${getUsageColor(stats.writes, FIRESTORE_LIMITS.WRITES_PER_DAY)}`}>
          <span>Writes:</span>
          <span>{stats.writes}/{FIRESTORE_LIMITS.WRITES_PER_DAY} ({formatPercentage(stats.writes, FIRESTORE_LIMITS.WRITES_PER_DAY)}%)</span>
        </div>
        
        <div className={`flex justify-between ${getUsageColor(stats.deletes, FIRESTORE_LIMITS.DELETES_PER_DAY)}`}>
          <span>Deletes:</span>
          <span>{stats.deletes}/{FIRESTORE_LIMITS.DELETES_PER_DAY} ({formatPercentage(stats.deletes, FIRESTORE_LIMITS.DELETES_PER_DAY)}%)</span>
        </div>
        
        <div className="border-t border-gray-600 pt-1 mt-2">
          <div className="text-gray-400 text-xs">
            Reset: {stats.lastReset.toLocaleDateString()} {stats.lastReset.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Simple usage warning component that shows alerts
 */
export const FirestoreUsageAlert: React.FC = () => {
  const { stats } = useFirestoreUsage();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const alerts = [];
  
  if (stats.reads >= FIRESTORE_LIMITS.READS_WARNING) {
    alerts.push({
      type: 'reads',
      current: stats.reads,
      limit: FIRESTORE_LIMITS.READS_PER_DAY,
      percentage: (stats.reads / FIRESTORE_LIMITS.READS_PER_DAY) * 100
    });
  }
  
  if (stats.writes >= FIRESTORE_LIMITS.WRITES_WARNING) {
    alerts.push({
      type: 'writes',
      current: stats.writes,
      limit: FIRESTORE_LIMITS.WRITES_PER_DAY,
      percentage: (stats.writes / FIRESTORE_LIMITS.WRITES_PER_DAY) * 100
    });
  }
  
  if (stats.deletes >= FIRESTORE_LIMITS.DELETES_WARNING) {
    alerts.push({
      type: 'deletes',
      current: stats.deletes,
      limit: FIRESTORE_LIMITS.DELETES_PER_DAY,
      percentage: (stats.deletes / FIRESTORE_LIMITS.DELETES_PER_DAY) * 100
    });
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-red-900 bg-opacity-95 text-white text-sm p-4 rounded-lg font-mono z-50 max-w-sm">
      <div className="font-bold text-red-400 mb-2">🚨 Firestore Usage Alert</div>
      {alerts.map((alert) => (
        <div key={alert.type} className="mb-2 last:mb-0">
          <div className="text-red-300">
            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} at {alert.percentage.toFixed(1)}%
          </div>
          <div className="text-xs text-red-200">
            {alert.current}/{alert.limit} operations
          </div>
        </div>
      ))}
    </div>
  );
};
