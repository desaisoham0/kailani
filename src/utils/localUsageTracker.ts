/**
 * Firestore Usage Tracker - Monitor reads/writes to stay within free tier limits
 * Firebase Free Tier Limits:
 * - 50,000 reads per day
 * - 20,000 writes per day
 * - 1 GB storage
 */

class FirestoreUsageTracker {
  private reads = 0;
  private writes = 0;
  private deletes = 0;
  private startTime = Date.now();

  trackRead(count = 1, operation = 'unknown') {
    this.reads += count;
    if (import.meta.env.DEV) {
      console.log(
        `📊 Firestore reads: ${this.reads} (+${count} from ${operation})`
      );
      this.checkLimits();
    }
  }

  trackWrite(count = 1, operation = 'unknown') {
    this.writes += count;
    if (import.meta.env.DEV) {
      console.log(
        `✍️ Firestore writes: ${this.writes} (+${count} from ${operation})`
      );
      this.checkLimits();
    }
  }

  trackDelete(count = 1, operation = 'unknown') {
    this.deletes += count;
    if (import.meta.env.DEV) {
      console.log(
        `🗑️ Firestore deletes: ${this.deletes} (+${count} from ${operation})`
      );
      this.checkLimits();
    }
  }

  private checkLimits() {
    const freeReadsLimit = 50000;
    const freeWritesLimit = 20000;

    if (this.reads > freeReadsLimit * 0.8) {
      console.warn(
        `⚠️ Approaching read limit: ${this.reads}/${freeReadsLimit} (${((this.reads / freeReadsLimit) * 100).toFixed(1)}%)`
      );
    }

    if (this.writes > freeWritesLimit * 0.8) {
      console.warn(
        `⚠️ Approaching write limit: ${this.writes}/${freeWritesLimit} (${((this.writes / freeWritesLimit) * 100).toFixed(1)}%)`
      );
    }
  }

  getUsage() {
    const runtime = Date.now() - this.startTime;
    return {
      reads: this.reads,
      writes: this.writes,
      deletes: this.deletes,
      runtime: Math.round(runtime / 1000), // seconds
      readsPerMinute: Math.round((this.reads / runtime) * 60000),
      writesPerMinute: Math.round((this.writes / runtime) * 60000),
    };
  }

  getDailySummary() {
    const usage = this.getUsage();
    const freeReadsLimit = 50000;
    const freeWritesLimit = 20000;

    return {
      ...usage,
      readPercentage: ((usage.reads / freeReadsLimit) * 100).toFixed(2),
      writePercentage: ((usage.writes / freeWritesLimit) * 100).toFixed(2),
      remainingReads: Math.max(0, freeReadsLimit - usage.reads),
      remainingWrites: Math.max(0, freeWritesLimit - usage.writes),
    };
  }

  reset() {
    this.reads = 0;
    this.writes = 0;
    this.deletes = 0;
    this.startTime = Date.now();
    console.log('🔄 Usage tracker reset');
  }
}

export const usageTracker = new FirestoreUsageTracker();

// Development helper to show usage stats
if (import.meta.env.DEV) {
  // Show usage every 5 minutes in development
  setInterval(
    () => {
      const summary = usageTracker.getDailySummary();
      if (summary.reads > 0 || summary.writes > 0) {
        console.log('📈 Firestore Usage Summary:');
        console.log(
          `  Reads: ${summary.reads} (${summary.readPercentage}% of daily limit)`
        );
        console.log(
          `  Writes: ${summary.writes} (${summary.writePercentage}% of daily limit)`
        );
        console.log(`  Runtime: ${summary.runtime}s`);
        console.log(
          `  Rate: ${summary.readsPerMinute} reads/min, ${summary.writesPerMinute} writes/min`
        );
      }
    },
    5 * 60 * 1000
  ); // 5 minutes
}
