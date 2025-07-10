import React from 'react';
import { Link } from 'react-router-dom';
import useCachedFoodItems from '../../hooks/useCachedFoodItems';

// Types
type FoodItem = {
  id?: string;
  name: string;
  imageUrl: string;
  category: string;
};

type GalleryDisplayProps = {
  title: string;
  subtitle: string;
};

type HomeFoodGalleryProps = GalleryDisplayProps & {
  maxImages?: number;
};

// Pure utility function for array shuffling
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// React hook that handles data fetching and state using cached service
const useRandomFoodItems = (maxCount: number) => {
  const { favoriteItems, isLoading, error: cacheError } = useCachedFoodItems();
  const [randomItems, setRandomItems] = React.useState<FoodItem[]>([]);
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    // Filter items with valid images
    const validItems = favoriteItems.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
    
    // Only shuffle once when we first get data, or if we have no items yet
    if (!initializedRef.current && validItems.length > 0) {
      const randomized = shuffleArray(validItems).slice(0, maxCount);
      setRandomItems(randomized);
      initializedRef.current = true;
      
      console.log(`🏠 HomeFoodGallery: Initialized with ${randomized.length} random items from cache`);
    }
  }, [favoriteItems, maxCount]);

  return {
    items: randomItems,
    status: isLoading ? 'loading' : cacheError ? 'error' : 'success',
    error: cacheError?.message || null
  };
};

// UI Components
const LoadingDisplay: React.FC<GalleryDisplayProps> = ({ title, subtitle }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full border-b-2 border-[#ffe0f0] bg-[#f0c91f]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-5xl font-bold mb-2 baloo-regular text-[#7d3701] tracking-tight">
          {title}
        </h2>
        <p className="text-md md:text-xl text-[#b25e00] max-w-2xl mx-auto baloo-regular mb-2">
          {subtitle}
        </p>
      </div>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        <p className="ml-4 text-lg text-indigo-800">Loading gallery...</p>
      </div>
    </div>
  </section>
);

const ErrorDisplay: React.FC<GalleryDisplayProps> = ({ title, subtitle }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full border-b-2 border-[#ffe0f0] bg-[#f0c91f]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-5xl font-bold mb-2 baloo-regular text-[#7d3701] tracking-tight">
          {title}
        </h2>
        <p className="text-md md:text-xl text-[#b25e00] max-w-2xl mx-auto baloo-regular mb-2 font-regular">
          {subtitle}
        </p>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-xl mx-auto">
        <p className="text-amber-800">We couldn't load our gallery right now. Please check back later!</p>
      </div>
    </div>
  </section>
);

const EmptyDisplay: React.FC<GalleryDisplayProps> = ({ title, subtitle }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full border-b-2 border-[#ffe0f0] bg-[#f0c91f]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-5xl font-bold mb-2 baloo-regular text-[#7d3701] tracking-tight">
          {title}
        </h2>
        <p className="text-md md:text-xl text-[#b25e00] max-w-2xl mx-auto baloo-regular mb-2 font-regular">
          {subtitle}
        </p>
      </div>
      <div className="bg-white rounded-lg p-6 max-w-xl mx-auto shadow-md">
        <p className="text-gray-600">No gallery images available at the moment. Please check back soon!</p>
      </div>
    </div>
  </section>
);

const GalleryItem: React.FC<{ item: FoodItem; isHighlighted: boolean }> = ({ item, isHighlighted }) => (
  <div
    className={`relative overflow-hidden ${isHighlighted ? 'lg:col-span-2 lg:row-span-2' : ''} group rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}
    style={{ 
      aspectRatio: '1/1'
    }}
  >
    <img
      src={item.imageUrl}
      alt={item.name}
      className="object-cover w-full h-full rounded-2xl border-[3px] border-[#fff8e1] shadow-inner"
      draggable="false"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-[#7d3701]/80 via-[#7d3701]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-bold font-navigation jua-regular text-sm md:text-base truncate mb-1">
          {item.name}
        </h3>
        <div className="w-10 h-1 bg-[#f0c91f] rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 delay-150"></div>
      </div>
    </div>
  </div>
);

const GalleryFooter: React.FC = () => (
  <div className="mt-12 text-center">
    <Link to="/menu">
      <button 
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="px-8 py-4 text-lg font-bold font-navigation baloo-regular rounded-3xl bg-white text-[#000000] cursor-pointer border-[#bab7c9] border-b-4 active:border-b-1 shadow-lg hover:bg-white/80 hover:shadow-xl active:shadow-md active:translate-y-1 transition-all duration-200 transform"
      >
        <span className="flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
            <rect x="2" y="5" width="20" height="14" rx="4" fill="#e3e1ed" stroke="#002B5B" strokeWidth="1.5"/>
            <circle cx="7.5" cy="10" r="1.5" fill="#002B5B"/>
            <path d="M2 16l4-4c1-1 2-1 3 0l2 2 1.5-1.5c1-1 2-1 3 0L22 16" stroke="#002B5B" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
          View Full Gallery
        </span>
      </button>
    </Link>
  </div>
);

// Main component
const HomeFoodGallery: React.FC<HomeFoodGalleryProps> = React.memo(({
  title = "Our Food Gallery",
  subtitle = "Take a peek at our mouthwatering creations",
  maxImages = 6
}) => {
  const { items, status } = useRandomFoodItems(maxImages);

  if (status === 'loading') {
    return <LoadingDisplay title={title} subtitle={subtitle} />;
  }

  if (status === 'error') {
    return <ErrorDisplay title={title} subtitle={subtitle} />;
  }

  if (items.length === 0) {
    return <EmptyDisplay title={title} subtitle={subtitle} />;
  }

  return (
    <section className="py-16 relative overflow-hidden w-full max-w-full border-b-2 border-[#ffe0f0] bg-[#f0c91f]">
      <div className="container mx-auto px-4 relative z-10 max-w-full">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-5xl font-bold mb-2 baloo-regular text-[#002B5B] tracking-tight">
            {title}
          </h2>
          <p className="text-md md:text-xl text-[#002B5B] max-w-2xl mx-auto baloo-regular mb-2 font-regular">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 auto-rows-[1fr]">
          {items.map((item, index) => (
            <GalleryItem 
              key={item.id || index} 
              item={item} 
              isHighlighted={index % 3 === 0}
            />
          ))}
        </div>

        <GalleryFooter />
      </div>
    </section>
  );
});

export default HomeFoodGallery;
