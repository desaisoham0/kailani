import { useState, memo, useEffect } from 'react';
import {
  getCurrentOffers,
  getUpcomingOffers,
  type Offer,
} from '../../firebase/offerService';
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
          getUpcomingOffers(),
        ]);

        setCurrentOffers(currentOffersData);
        setUpcomingOffers(upcomingOffersData);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to fetch offers')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []); // Empty dependency array - fetch once on component mount

  const [hasInitialized, setHasInitialized] = useState(false);

  // Inject custom styles
  useEffect(() => {
    if (
      typeof document !== 'undefined' &&
      !document.getElementById('offers-custom-styles')
    ) {
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
  if (
    !hasInitialized &&
    !isLoading &&
    currentOffers.length === 0 &&
    upcomingOffers.length > 0 &&
    activeTab === 'current'
  ) {
    setActiveTab('upcoming');
    setHasInitialized(true);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-50 to-amber-100 px-4 py-16">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
        <div className="absolute top-10 left-10 h-20 w-20 animate-pulse rounded-full bg-pink-300 opacity-20"></div>
        <div className="absolute top-32 right-20 h-16 w-16 animate-bounce rounded-full bg-purple-300 opacity-25"></div>
        <div className="absolute bottom-20 left-1/4 h-12 w-12 animate-ping rounded-full bg-amber-300 opacity-30"></div>
        <div className="absolute right-1/3 bottom-32 h-8 w-8 animate-pulse rounded-full bg-rose-300 opacity-20"></div>
        <div
          className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform animate-spin rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-10"
          style={{ animationDuration: '20s' }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Playful Header */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <h2 className="mb-4 animate-pulse bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 bg-clip-text text-5xl font-black text-transparent md:text-6xl">
              {currentOffers.length > 0
                ? '🎉 Special Offers!'
                : '✨ Coming Soon!'}
            </h2>
            <div
              className="absolute -bottom-2 -left-6 animate-spin text-2xl"
              style={{ animationDuration: '3s' }}
            >
              ⭐
            </div>
          </div>
          <p className="mx-auto max-w-2xl text-lg font-medium text-purple-700">
            Discover amazing deals and treats that will make your taste buds
            dance with joy!
          </p>
        </div>

        {/* Enhanced Tab navigation */}
        {currentOffers.length > 0 && upcomingOffers.length > 0 && (
          <div className="mb-12 flex justify-center">
            <div className="border-gradient-to-r relative rounded-full border-4 bg-white from-pink-300 to-purple-300 p-2 shadow-2xl">
              <div className="flex overflow-hidden rounded-full" role="group">
                <button
                  type="button"
                  aria-label="View current offers"
                  className={`relative transform px-8 py-4 text-lg font-bold transition-all duration-300 ${
                    activeTab === 'current'
                      ? 'scale-105 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                      : 'rounded-full text-purple-700 hover:scale-105 hover:bg-purple-50'
                  }`}
                  onClick={() => setActiveTab('current')}
                >
                  <span className="relative z-10">🔥 Hot Deals</span>
                  {activeTab === 'current' && (
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-75"></div>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="View upcoming offers"
                  className={`relative transform px-8 py-4 text-lg font-bold transition-all duration-300 ${
                    activeTab === 'upcoming'
                      ? 'scale-105 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'rounded-full text-purple-700 hover:scale-105 hover:bg-purple-50'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  <span className="relative z-10">🚀 Coming Soon</span>
                  {activeTab === 'upcoming' && (
                    <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-75"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-8 border-purple-200"></div>
              <div className="absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-t-8 border-pink-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="animate-bounce text-2xl">🍴</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <span className="animate-pulse bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                Loading delicious offers...
              </span>
              <div className="mt-2 flex justify-center space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-pink-400"></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-amber-400"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">😔</div>
            <div className="mb-2 text-xl font-bold text-red-500">
              Oops! Something went wrong
            </div>
            <div className="text-gray-600">{error?.message}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {(activeTab === 'current' ? currentOffers : upcomingOffers).map(
              (offer, index) => (
                <div
                  key={offer.id}
                  className="group hover:border-gradient-to-r animate-slideInUp relative transform overflow-hidden rounded-3xl border-4 border-transparent bg-white shadow-xl transition-all duration-500 hover:scale-105 hover:-rotate-1 hover:from-pink-300 hover:to-purple-300 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Magical shine effect */}
                  <div className="absolute inset-0 translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-all duration-1000 group-hover:translate-x-[-200%] group-hover:opacity-30"></div>

                  {/* Floating decorative elements */}
                  <div className="absolute top-4 right-4 animate-bounce text-2xl opacity-70">
                    {offer.isUpcoming ? '🔮' : '💎'}
                  </div>
                  <div className="absolute top-4 left-4 animate-pulse text-xl opacity-60">
                    {offer.isUpcoming ? '⏰' : '⚡'}
                  </div>

                  {offer.imageUrl && (
                    <div className="relative h-56 overflow-hidden">
                      <OptimizedImage
                        src={offer.imageUrl}
                        alt={offer.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                      {offer.isUpcoming && offer.availabilityDate && (
                        <div className="absolute top-4 right-4 animate-pulse rounded-full border-2 border-white bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                          <span className="mr-1">📅</span>
                          Available{' '}
                          {new Date(
                            offer.availabilityDate.seconds * 1000
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="relative p-8">
                    {/* Title with gradient */}
                    <h3 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-2xl font-black text-transparent transition-all duration-300 group-hover:from-pink-600 group-hover:to-purple-600">
                      {offer.title}
                    </h3>

                    <p className="mb-6 text-lg leading-relaxed text-gray-700">
                      {offer.description}
                    </p>

                    {/* Status badge with enhanced design */}
                    <div className="flex items-center justify-between">
                      {offer.isUpcoming ? (
                        <div className="inline-flex transform items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
                          <span className="mr-2 text-lg">🚀</span>
                          Coming Soon
                          <div className="ml-2 h-2 w-2 animate-ping rounded-full bg-white"></div>
                        </div>
                      ) : (
                        <div className="inline-flex transform animate-pulse items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105">
                          <span className="mr-2 text-lg">✨</span>
                          Available Now!
                          <div className="ml-2 h-2 w-2 animate-bounce rounded-full bg-white"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom decorative border */}
                  <div className="absolute right-0 bottom-0 left-0 h-2 scale-x-0 transform bg-gradient-to-r from-pink-400 via-purple-400 to-amber-400 transition-transform duration-500 group-hover:scale-x-100"></div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
});

export default OffersDisplay;
