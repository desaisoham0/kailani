import { useState, memo, useEffect } from 'react';
import { getCurrentOffers, getUpcomingOffers, type Offer } from '../../firebase/offerService';
import OptimizedImage from '../UI/OptimizedImage';

// Add custom styles for animations
const customStyles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slideInUp {
    animation: slideInUp 0.6s ease-out forwards;
  }
`;

// Main component
const OffersDisplay = memo(() => {
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming'>('current');
  const [currentOffers, setCurrentOffers] = useState<Offer[]>([]);
  const [upcomingOffers, setUpcomingOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch offers data
  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch both types of offers in parallel
        const [currentOffersData, upcomingOffersData] = await Promise.all([
          getCurrentOffers(),
          getUpcomingOffers()
        ]);
        
        setCurrentOffers(currentOffersData);
        setUpcomingOffers(upcomingOffersData);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch offers'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOffers();
  }, []); // Empty dependency array - fetch once on component mount

  const [hasInitialized, setHasInitialized] = useState(false);

  // Inject custom styles
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('offers-custom-styles')) {
      const style = document.createElement('style');
      style.id = 'offers-custom-styles';
      style.textContent = customStyles;
      document.head.appendChild(style);
    }
    
    return () => {
      // Cleanup styles on unmount
      if (typeof document !== 'undefined') {
        const styleEl = document.getElementById('offers-custom-styles');
        if (styleEl) {
          styleEl.remove();
        }
      }
    };
  }, []);

  // If there are no offers of either type, don't render the component
  // Only return null after loading is complete to avoid flash of loading UI
  if (!isLoading && currentOffers.length === 0 && upcomingOffers.length === 0) {
    return null;
  }

  // If there are no current offers but there are upcoming ones,
  // show upcoming by default (only run this effect once)
  if (!hasInitialized && !isLoading && currentOffers.length === 0 && upcomingOffers.length > 0 && activeTab === 'current') {
    setActiveTab('upcoming');
    setHasInitialized(true);
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-pink-100 via-purple-50 to-amber-100 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-300 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-300 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-rose-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Playful Header */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-transparent mb-4 animate-pulse">
              {currentOffers.length > 0 ? '🎉 Special Offers!' : '✨ Coming Soon!'}
            </h2>
            <div className="absolute -bottom-2 -left-6 text-2xl animate-spin" style={{animationDuration: '3s'}}>⭐</div>
          </div>
          <p className="text-lg text-purple-700 font-medium max-w-2xl mx-auto">
            Discover amazing deals and treats that will make your taste buds dance with joy!
          </p>
        </div>
        
        {/* Enhanced Tab navigation */}
        {currentOffers.length > 0 && upcomingOffers.length > 0 && (
          <div className="flex justify-center mb-12">
            <div className="relative bg-white rounded-full p-2 shadow-2xl border-4 border-gradient-to-r from-pink-300 to-purple-300">
              <div className="flex rounded-full overflow-hidden" role="group">
                <button
                  type="button"
                  aria-label="View current offers"
                  className={`relative px-8 py-4 text-lg font-bold transition-all duration-300 transform ${
                    activeTab === 'current'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105 rounded-full'
                      : 'text-purple-700 hover:bg-purple-50 hover:scale-105 rounded-full'
                  }`}
                  onClick={() => setActiveTab('current')}
                >
                  <span className="relative z-10">🔥 Hot Deals</span>
                  {activeTab === 'current' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse opacity-75"></div>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="View upcoming offers"
                  className={`relative px-8 py-4 text-lg font-bold transition-all duration-300 transform ${
                    activeTab === 'upcoming'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 rounded-full'
                      : 'text-purple-700 hover:bg-purple-50 hover:scale-105 rounded-full'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  <span className="relative z-10">🚀 Coming Soon</span>
                  {activeTab === 'upcoming' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse opacity-75"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-8 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-8 border-pink-500 absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-bounce">🍴</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                Loading delicious offers...
              </span>
              <div className="flex justify-center mt-2 space-x-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <div className="text-xl font-bold text-red-500 mb-2">Oops! Something went wrong</div>
            <div className="text-gray-600">{error?.message}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {(activeTab === 'current' ? currentOffers : upcomingOffers).map((offer, index) => (
              <div 
                key={offer.id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 border-4 border-transparent hover:border-gradient-to-r hover:from-pink-300 hover:to-purple-300 animate-slideInUp"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Magical shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-all duration-1000"></div>
                
                {/* Floating decorative elements */}
                <div className="absolute top-4 right-4 text-2xl animate-bounce opacity-70">
                  {offer.isUpcoming ? '🔮' : '💎'}
                </div>
                <div className="absolute top-4 left-4 text-xl animate-pulse opacity-60">
                  {offer.isUpcoming ? '⏰' : '⚡'}
                </div>

                {offer.imageUrl && (
                  <div className="relative h-56 overflow-hidden">
                    <OptimizedImage 
                      src={offer.imageUrl} 
                      alt={offer.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {offer.isUpcoming && offer.availabilityDate && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse border-2 border-white">
                        <span className="mr-1">📅</span>
                        Available {new Date(offer.availabilityDate.seconds * 1000).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-8 relative">
                  {/* Title with gradient */}
                  <h3 className="text-2xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600 transition-all duration-300">
                    {offer.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed text-lg">{offer.description}</p>
                  
                  {/* Status badge with enhanced design */}
                  <div className="flex items-center justify-between">
                    {offer.isUpcoming ? (
                      <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                        <span className="mr-2 text-lg">🚀</span>
                        Coming Soon
                        <div className="ml-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform animate-pulse">
                        <span className="mr-2 text-lg">✨</span>
                        Available Now!
                        <div className="ml-2 w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Bottom decorative border */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default OffersDisplay;
