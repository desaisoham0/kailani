import React from 'react';
import { Link } from 'react-router-dom';
import {
  getFavoriteFoodItems,
  type FoodItem,
} from '../../firebase/foodService';

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

// React hook that handles data fetching and state using direct Firebase service
const useRandomFoodItems = (maxCount: number) => {
  const [favoriteItems, setFavoriteItems] = React.useState<FoodItem[]>([]);
  const [randomItems, setRandomItems] = React.useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const initializedRef = React.useRef(false);

  // Fetch favorite items from Firebase
  React.useEffect(() => {
    const fetchFavoriteItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const items = await getFavoriteFoodItems();
        setFavoriteItems(items);
      } catch (err) {
        console.error('Error fetching favorite items:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load favorite items'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteItems();
  }, []);

  React.useEffect(() => {
    // Filter items with valid images
    const validItems = favoriteItems.filter(
      (item: FoodItem) => item.imageUrl && item.imageUrl.trim() !== ''
    );

    // Only shuffle once when we first get data, or if we have no items yet
    if (!initializedRef.current && validItems.length > 0) {
      const randomized = shuffleArray(validItems).slice(0, maxCount);
      setRandomItems(randomized);
      initializedRef.current = true;
    }
  }, [favoriteItems, maxCount]);

  return {
    items: randomItems,
    status: isLoading ? 'loading' : error ? 'error' : 'success',
    error: error || null,
  };
};

// UI Components
const LoadingDisplay: React.FC<GalleryDisplayProps> = ({ title, subtitle }) => (
  <section className="relative w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#f0c91f] py-16">
    <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <header className="mb-10 text-center">
          <h2 className="baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#7d3701] md:text-5xl">
            {title}
          </h2>
          <p className="text-md baloo-regular mx-auto max-w-2xl text-[#b25e00] md:text-xl">
            {subtitle}
          </p>
        </header>
      </div>
      <div className="flex h-64 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-yellow-500"></div>
        <p className="ml-4 text-lg text-indigo-800">Loading gallery...</p>
      </div>
    </div>
  </section>
);

const ErrorDisplay: React.FC<GalleryDisplayProps> = ({ title, subtitle }) => (
  <section className="relative w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#f0c91f] py-16">
    <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h2 className="baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#7d3701] md:text-5xl">
          {title}
        </h2>
        <p className="text-md baloo-regular mx-auto max-w-2xl text-[#b25e00] md:text-xl">
          {subtitle}
        </p>
      </header>
      <div className="mx-auto max-w-xl rounded-2xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
        <p className="text-amber-800">
          We couldn’t load the gallery. Please try again later.
        </p>
      </div>
    </div>
  </section>
);

const EmptyDisplay: React.FC<GalleryDisplayProps> = ({ title, subtitle }) => (
  <section className="relative w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#f0c91f] py-16">
    <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h2 className="baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#7d3701] md:text-5xl">
          {title}
        </h2>
        <p className="text-md baloo-regular mx-auto max-w-2xl text-[#b25e00] md:text-xl">
          {subtitle}
        </p>
      </header>
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-gray-700">
          No gallery images available right now. Check back soon.
        </p>
      </div>
    </div>
  </section>
);

const GalleryItem: React.FC<{ item: FoodItem; isHighlighted: boolean }> = ({
  item,
  isHighlighted,
}) => (
  <div
    className={`relative overflow-hidden ${isHighlighted ? 'lg:col-span-2 lg:row-span-2' : ''} group transform rounded-2xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl`}
    style={{
      aspectRatio: '1/1',
    }}
  >
    <img
      src={item.imageUrl}
      alt={item.name}
      className="h-full w-full rounded-2xl border-[3px] border-[#fff8e1] object-cover shadow-inner"
      draggable="false"
      loading="lazy"
    />
    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#7d3701]/80 via-[#7d3701]/40 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-4">
      <div className="translate-y-4 transform transition-transform duration-300 group-hover:translate-y-0">
        <h3 className="font-navigation jua-regular mb-1 truncate text-sm font-bold text-white md:text-base">
          {item.name}
        </h3>
        <div className="h-1 w-10 origin-left scale-x-0 transform rounded-full bg-[#f0c91f] transition-transform delay-150 duration-300 group-hover:scale-x-100"></div>
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
        className="font-navigation baloo-regular transform cursor-pointer rounded-3xl border-b-4 border-[#bab7c9] bg-white px-8 py-4 text-lg font-bold text-[#000000] shadow-lg transition-all duration-200 hover:bg-white/80 hover:shadow-xl active:translate-y-1 active:border-b-1 active:shadow-md"
      >
        <span className="flex items-center justify-center">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="4"
              fill="#e3e1ed"
              stroke="#002B5B"
              strokeWidth="1.5"
            />
            <circle cx="7.5" cy="10" r="1.5" fill="#002B5B" />
            <path
              d="M2 16l4-4c1-1 2-1 3 0l2 2 1.5-1.5c1-1 2-1 3 0L22 16"
              stroke="#002B5B"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          View Full Gallery
        </span>
      </button>
    </Link>
  </div>
);

// Main component
const HomeFoodGallery: React.FC<HomeFoodGalleryProps> = React.memo(
  ({
    title = 'Our Food Gallery',
    subtitle = 'Take a peek at our mouthwatering creations',
    maxImages = 6,
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
      <section className="relative w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#f0c91f] py-16">
        <div className="relative z-10 container mx-auto max-w-full px-4">
          <div className="mb-12 text-center">
            <h2 className="baloo-regular mb-2 text-5xl font-bold tracking-tight text-[#002B5B] md:text-5xl">
              {title}
            </h2>
            <p className="text-md baloo-regular font-regular mx-auto mb-2 max-w-2xl text-[#002B5B] md:text-xl">
              {subtitle}
            </p>
          </div>

          <div className="grid auto-rows-[1fr] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
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
  }
);

export default HomeFoodGallery;
