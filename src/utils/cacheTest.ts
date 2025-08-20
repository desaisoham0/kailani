/**
 * Development Cache Test - Verify caching system works correctly
 * Run with: npm run dev and check browser console
 */

// Test the cached services in development
if (import.meta.env.DEV) {
  // Test food service
  import('../firebase/cachedFoodService').then(({ cachedFoodService }) => {
    console.log('🧪 Testing cached food service...');

    const unsubscribe = cachedFoodService.subscribe(items => {
      console.log(`✅ Food cache working! ${items.length} items loaded`);
      console.log('Cache stats:', cachedFoodService.getCacheStats());
    });

    // Test search functionality
    setTimeout(() => {
      const favoriteItems = cachedFoodService.getFavoriteItems();
      console.log(`🌟 Favorite items: ${favoriteItems.length}`);

      // Clean up test
      unsubscribe();
    }, 2000);
  });

  // Test reviews service
  import('../firebase/cachedReviewsService').then(
    ({ cachedReviewsService }) => {
      console.log('🧪 Testing cached reviews service...');

      const unsubscribeReviews = cachedReviewsService.subscribeToReviews(
        reviews => {
          console.log(
            `✅ Reviews cache working! ${reviews.length} reviews loaded`
          );
        }
      );

      const unsubscribeStats = cachedReviewsService.subscribeToStats(stats => {
        console.log(
          `📊 Review stats: ${stats.totalReviews} total, ${stats.averageRating.toFixed(1)} avg rating`
        );
      });

      // Clean up tests
      setTimeout(() => {
        unsubscribeReviews();
        unsubscribeStats();
      }, 3000);
    }
  );

  // Test offers service
  import('../firebase/cachedOffersService').then(({ cachedOffersService }) => {
    console.log('🧪 Testing cached offers service...');

    const unsubscribe = cachedOffersService.subscribe(offers => {
      console.log(`✅ Offers cache working! ${offers.length} offers loaded`);
      console.log(
        'Active offers:',
        cachedOffersService.getActiveOffers().length
      );
    });

    // Clean up test
    setTimeout(() => {
      unsubscribe();
    }, 2000);
  });

  // Test usage tracker
  import('../utils/localUsageTracker').then(({ usageTracker }) => {
    console.log('🧪 Testing usage tracker...');

    // Simulate some operations
    usageTracker.trackRead(1, 'test-read');
    usageTracker.trackWrite(1, 'test-write');

    setTimeout(() => {
      const summary = usageTracker.getDailySummary();
      console.log('📈 Usage Summary:', summary);
    }, 1000);
  });
}

export {};
