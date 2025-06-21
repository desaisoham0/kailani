import { useState, useEffect, useCallback, memo } from 'react';
import type { Offer } from '../../firebase/offerService';
import { getCurrentOffersOptimized, getUpcomingOffersOptimized } from '../../services/optimizedOfferService';
import OptimizedImage from '../UI/OptimizedImage';

// Cache keys
const CACHE_KEYS = {
  CURRENT_OFFERS: 'kailani_current_offers',
  UPCOMING_OFFERS: 'kailani_upcoming_offers',
  CACHE_TIMESTAMP: 'kailani_offers_timestamp',
};

// Cache expiration time (in milliseconds) - 1 hour
const CACHE_EXPIRATION = 60 * 60 * 1000;

// Cache utility functions
const cacheUtils = {
  // Save offers to localStorage
  saveToCache: (currentOffers: Offer[], upcomingOffers: Offer[]) => {
    try {
      localStorage.setItem(CACHE_KEYS.CURRENT_OFFERS, JSON.stringify(currentOffers));
      localStorage.setItem(CACHE_KEYS.UPCOMING_OFFERS, JSON.stringify(upcomingOffers));
      localStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache offers:', error);
    }
  },

  // Load offers from localStorage
  loadFromCache: () => {
    try {
      const cachedCurrentOffers = localStorage.getItem(CACHE_KEYS.CURRENT_OFFERS);
      const cachedUpcomingOffers = localStorage.getItem(CACHE_KEYS.UPCOMING_OFFERS);
      const cachedTimestamp = localStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);

      if (!cachedCurrentOffers || !cachedUpcomingOffers || !cachedTimestamp) {
        return null;
      }

      // Check if cache is expired
      const now = Date.now();
      const timestamp = parseInt(cachedTimestamp, 10);
      if (now - timestamp > CACHE_EXPIRATION) {
        return null;
      }

      return {
        currentOffers: JSON.parse(cachedCurrentOffers),
        upcomingOffers: JSON.parse(cachedUpcomingOffers),
      };
    } catch (error) {
      console.warn('Failed to load cached offers:', error);
      return null;
    }
  },

  // Clear cache
  clearCache: () => {
    try {
      localStorage.removeItem(CACHE_KEYS.CURRENT_OFFERS);
      localStorage.removeItem(CACHE_KEYS.UPCOMING_OFFERS);
      localStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
    } catch (error) {
      console.warn('Failed to clear offers cache:', error);
    }
  }
};

// We're now using the more optimized OptimizedImage component imported above

// Main component
const OffersDisplay = memo(() => {
  const [currentOffers, setCurrentOffers] = useState<Offer[]>([]);
  const [upcomingOffers, setUpcomingOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming'>('current');
  const [fromCache, setFromCache] = useState(false);

  // Load offers from either API or cache
  const loadOffers = useCallback(async () => {
    setLoading(true);
    
    try {
      // Try to load from cache first
      const cachedData = cacheUtils.loadFromCache();
      
      if (cachedData) {
        // Use cached data
        setCurrentOffers(cachedData.currentOffers);
        setUpcomingOffers(cachedData.upcomingOffers);
        setFromCache(true);
        
        // If there are no current offers but there are upcoming ones,
        // switch the active tab to upcoming
        if (cachedData.currentOffers.length === 0 && cachedData.upcomingOffers.length > 0) {
          setActiveTab('upcoming');
        }
        
        // Attempt to refresh data in the background
        fetchFreshData();
      } else {
        // No valid cache, fetch fresh data
        await fetchFreshData();
      }
    } catch (err) {
      console.error('Error in loadOffers:', err);
      setError('Failed to load offers');
      
      // Try to load from cache as a fallback even if it's expired
      try {
        const currentOffersString = localStorage.getItem(CACHE_KEYS.CURRENT_OFFERS);
        const upcomingOffersString = localStorage.getItem(CACHE_KEYS.UPCOMING_OFFERS);
        
        if (currentOffersString && upcomingOffersString) {
          const currentOffersData = JSON.parse(currentOffersString);
          const upcomingOffersData = JSON.parse(upcomingOffersString);
          
          setCurrentOffers(currentOffersData);
          setUpcomingOffers(upcomingOffersData);
          setFromCache(true);
          
          if (currentOffersData.length === 0 && upcomingOffersData.length > 0) {
            setActiveTab('upcoming');
          }
        }
      } catch (cacheErr) {
        console.error('Error loading from cache fallback:', cacheErr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch fresh data from Firebase
  const fetchFreshData = async () => {
    try {
      // Use Promise.all for parallel requests
      const [currentOffersData, upcomingOffersData] = await Promise.all([
        getCurrentOffersOptimized(),
        getUpcomingOffersOptimized()
      ]);
      
      setCurrentOffers(currentOffersData);
      setUpcomingOffers(upcomingOffersData);
      setFromCache(false);
      
      // Cache the new data
      cacheUtils.saveToCache(currentOffersData, upcomingOffersData);
      
      // If there are no current offers but there are upcoming ones,
      // switch the active tab to upcoming
      if (currentOffersData.length === 0 && upcomingOffersData.length > 0) {
        setActiveTab('upcoming');
      }
      
      // Clear any previous error since we succeeded
      if (error) setError(null);
      
      return { currentOffersData, upcomingOffersData };
    } catch (err) {
      console.error('Error fetching fresh offers data:', err);
      // Don't set error state here since we're already displaying cached data
      throw err;
    }
  };

  // Initial load effect
  useEffect(() => {
    loadOffers();
    
    // Optional: Set up a refresh interval (e.g., every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchFreshData().catch(console.error);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [loadOffers]);

  // If there are no offers of either type, don't render the component
  if (!loading && currentOffers.length === 0 && upcomingOffers.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-amber-50 border-b-2 border-[#ffe0f0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-amber-800">
          {currentOffers.length > 0 ? 'Special Offers' : 'Coming Soon'}
        </h2>
        
        {fromCache && error && (
          <div className="text-sm text-amber-600 mb-4 text-center">
            Showing cached offers. Try refreshing the page for the latest updates.
          </div>
        )}
        
        {/* Tab navigation - only show if both types of offers exist */}
        {currentOffers.length > 0 && upcomingOffers.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                aria-label="View current offers"
                className={`px-6 py-2 text-sm font-medium border border-r-0 rounded-l-lg focus:z-10 focus:outline-none ${
                  activeTab === 'current'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('current')}
              >
                Current Offers
              </button>
              <button
                type="button"
                aria-label="View upcoming offers"
                className={`px-6 py-2 text-sm font-medium border rounded-r-lg focus:z-10 focus:outline-none ${
                  activeTab === 'upcoming'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                Coming Soon
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-amber-500"></div>
            <span className="ml-3 text-amber-600">Loading offers...</span>
          </div>
        ) : error && currentOffers.length === 0 && upcomingOffers.length === 0 ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(activeTab === 'current' ? currentOffers : upcomingOffers).map(offer => (
              <div 
                key={offer.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {offer.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
                    <OptimizedImage 
                      src={offer.imageUrl} 
                      alt={offer.title} 
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {offer.isUpcoming && offer.availabilityDate && (
                      <div className="absolute top-0 right-0 bg-amber-600 text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                        Available {new Date(offer.availabilityDate.seconds * 1000).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  
                  {offer.isUpcoming ? (
                    <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                  ) : (
                    <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Available Now
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default OffersDisplay;
