import { useState, memo } from 'react';
import useCachedOffers from '../../hooks/useCachedOffers';
import OptimizedImage from '../UI/OptimizedImage';

// Main component
const OffersDisplay = memo(() => {
  const [activeTab, setActiveTab] = useState<'current' | 'upcoming'>('current');

  // Use cached offers hook
  const { 
    currentOffers, 
    upcomingOffers, 
    isLoading, 
    error 
  } = useCachedOffers();

  // If there are no offers of either type, don't render the component
  if (!isLoading && currentOffers.length === 0 && upcomingOffers.length === 0) {
    return null;
  }

  // If there are no current offers but there are upcoming ones,
  // show upcoming by default
  if (currentOffers.length === 0 && upcomingOffers.length > 0 && activeTab === 'current') {
    setActiveTab('upcoming');
  }

  return (
    <section className="py-12 px-4 bg-amber-50 border-b-2 border-[#ffe0f0]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-amber-800">
          {currentOffers.length > 0 ? 'Special Offers' : 'Coming Soon'}
        </h2>
        
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

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-amber-500"></div>
            <span className="ml-3 text-amber-600">Loading offers...</span>
          </div>
        ) : error && currentOffers.length === 0 && upcomingOffers.length === 0 ? (
          <div className="text-center text-red-500 py-8">{error?.message}</div>
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
