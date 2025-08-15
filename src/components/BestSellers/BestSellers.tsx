import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getFavoriteFoodItems,
  type FoodItem,
} from '../../firebase/foodService';
import logo from '../../assets/Kailani_logo.png';
import { SocialMediaLinks } from '../Navigation/SocialMediaLinks';

type FoodCategory =
  | 'Shave Ice'
  | 'Ramen'
  | 'Homemade Ice Cream'
  | 'Soft Serve'
  | 'Hot Dogs'
  | 'Musubi';

interface ProductItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly category: FoodCategory;
}

interface BestSellersProps {
  readonly title?: string;
}

// Firebase adapter functions (isolated)
const foodDataAdapter = {
  normalizeCategoryName: (category: string): FoodCategory => {
    const normalized = category.toLowerCase().trim();
    const categoryMap: Record<string, FoodCategory> = {
      'shave ice': 'Shave Ice',
      ramen: 'Ramen',
      'homemade ice cream': 'Homemade Ice Cream',
      'soft serve': 'Soft Serve',
      'hot dogs': 'Hot Dogs',
      musubi: 'Musubi',
    };
    return categoryMap[normalized] ?? 'Ramen';
  },

  transformFoodItemToProduct: (item: {
    id?: string;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
  }): ProductItem => ({
    id: item.id || '',
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    category: foodDataAdapter.normalizeCategoryName(item.category),
  }),
};

// ===== CENTRALIZED CATEGORY SYSTEM =====
// 🎯 CHANGE THESE NUMBERS TO REORDER CATEGORIES ON DASHBOARD
// Lower numbers = higher priority (1 shows first, 2 shows second, etc.)
const CATEGORY_ORDER_CONFIG: Record<FoodCategory, number> = {
  'Shave Ice': 1,
  Ramen: 2,
  'Homemade Ice Cream': 3,
  'Soft Serve': 4,
  'Hot Dogs': 5,
  Musubi: 6,
};

// Centralized list of all categories (derived from config)
const ALL_CATEGORIES: readonly FoodCategory[] = Object.keys(
  CATEGORY_ORDER_CONFIG
).sort(
  (a, b) =>
    CATEGORY_ORDER_CONFIG[a as FoodCategory] -
    CATEGORY_ORDER_CONFIG[b as FoodCategory]
) as FoodCategory[];

// Central function to get category order (memoized for performance)
const getCategoryOrder = (category: FoodCategory): number => {
  return CATEGORY_ORDER_CONFIG[category] ?? 999; // Unknown categories go to the end
};

// Get the default (first) category based on order
const getDefaultCategory = (): FoodCategory => {
  return ALL_CATEGORIES[0];
};

// UI utility functions
const createCategoryButtonStyles = (category: FoodCategory): string => {
  const styleMap: Record<FoodCategory, string> = {
    Ramen:
      'baloo-regular bg-yellow-400 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(202,138,4)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(202,138,4)] hover:ring-yellow-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(202,138,4)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 select-none touch-manipulation',
    'Shave Ice':
      'baloo-regular bg-blue-300 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(59,130,246)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(59,130,246)] hover:ring-blue-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(59,130,246)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 select-none touch-manipulation',
    'Homemade Ice Cream':
      'baloo-regular bg-blue-300 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(59,130,246)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(59,130,246)] hover:ring-blue-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(59,130,246)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 select-none touch-manipulation',
    'Soft Serve':
      'baloo-regular bg-blue-300 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(59,130,246)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(59,130,246)] hover:ring-blue-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(59,130,246)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 select-none touch-manipulation',
    'Hot Dogs':
      'baloo-regular bg-yellow-400 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(202,138,4)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(202,138,4)] hover:ring-yellow-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(202,138,4)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 select-none touch-manipulation',
    Musubi:
      'baloo-regular bg-yellow-400 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(202,138,4)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(202,138,4)] hover:ring-yellow-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(202,138,4)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 select-none touch-manipulation',
  };
  return (
    styleMap[category] ??
    'baloo-regular bg-blue-400 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(96,165,250)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(96,165,250)] hover:ring-blue-500 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(96,165,250)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 select-none touch-manipulation'
  );
};

const getAvailableCategories = (
  products: readonly ProductItem[]
): readonly FoodCategory[] => {
  if (!products.length) return [];

  const productCategorySet = new Set(products.map(product => product.category));
  return ALL_CATEGORIES.filter(category => productCategorySet.has(category));
};

const selectDefaultCategory = (
  products: readonly ProductItem[]
): FoodCategory => {
  if (!products.length) return getDefaultCategory();

  // Find the first available category based on centralized order
  for (const category of ALL_CATEGORIES) {
    if (products.some(product => product.category === category)) {
      return category;
    }
  }

  // Fallback to first product's category if no match found
  return products[0].category;
};

// Reusable UI components
const ChevronLeft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const BrandHeader: React.FC = () => (
  <header className="py-0">
    <div className="mx-auto flex max-w-screen-xl justify-center px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row items-center gap-4 sm:gap-6">
        <img
          src={logo}
          alt="Kailani Logo"
          className="h-28 w-28 flex-shrink-0 sm:h-32 sm:w-32 md:h-36 md:w-36"
        />
        <div className="space-y-1">
          <h3 className="milkshake-regular text-lg font-bold tracking-wide text-[#f7d34f] drop-shadow-sm sm:text-xl">
            Hawaiian
          </h3>
          <h1 className="baloo-regular -mt-3 truncate pr-4 text-4xl font-extrabold tracking-wider text-[#f7d34f] drop-shadow-[-4px_4px_0_#7F4F00] sm:text-5xl">
            SHAVE ICE
          </h1>
          <h2 className="baloo-regular truncate text-2xl font-bold tracking-wide text-white drop-shadow-[-2px_2px_0_#e85fa8] sm:text-3xl">
            &amp; Ramen
          </h2>
        </div>
      </div>
    </div>

    {/* Social Media Links */}
    <div className="mt-4 flex justify-center">
      <SocialMediaLinks />
    </div>
  </header>
);

// Data fetching hook using direct service with error handling
const useFavoriteFoodItems = () => {
  const [favoriteItems, setFavoriteItems] = useState<FoodItem[]>([]);
  const [products, setProducts] = useState<readonly ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch favorite items from Firebase
  useEffect(() => {
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

  // Memoize the transformation to prevent unnecessary recalculations
  const transformedProducts = useMemo(() => {
    try {
      if (!favoriteItems.length) return [];

      return favoriteItems
        .map(foodDataAdapter.transformFoodItemToProduct)
        .sort((a, b) => {
          // First sort by category order using centralized system
          const categorySort =
            getCategoryOrder(a.category) - getCategoryOrder(b.category);
          if (categorySort !== 0) return categorySort;

          // Then sort by name within category
          return a.name.localeCompare(b.name);
        });
    } catch (err) {
      console.error('Error transforming favorite items:', err);
      return [];
    }
  }, [favoriteItems]);

  useEffect(() => {
    setProducts(transformedProducts);

    if (transformedProducts.length > 0) {
      console.log(
        `🍕 BestSellers: Updated with ${transformedProducts.length} favorite items (sorted by centralized order system)`
      );
    }
  }, [transformedProducts]);

  return { products, isLoading, error };
};

// Carousel state management hook with improved safety and keyboard support
const useCarouselState = (categoryProducts: readonly ProductItem[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Validate and clamp index to prevent out-of-bounds errors
  const validateIndex = useCallback(
    (index: number) => {
      if (categoryProducts.length === 0) return 0;
      return Math.max(0, Math.min(index, categoryProducts.length - 1));
    },
    [categoryProducts.length]
  );

  const navigatePrevious = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const newIndex =
        prevIndex === 0 ? categoryProducts.length - 1 : prevIndex - 1;
      return validateIndex(newIndex);
    });
  }, [categoryProducts.length, validateIndex]);

  const navigateNext = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const newIndex =
        prevIndex === categoryProducts.length - 1 ? 0 : prevIndex + 1;
      return validateIndex(newIndex);
    });
  }, [categoryProducts.length, validateIndex]);

  const resetIndex = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (categoryProducts.length <= 1) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigatePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateNext();
          break;
      }
    },
    [navigatePrevious, navigateNext, categoryProducts.length]
  );

  // Validate current index when products change
  useEffect(() => {
    setCurrentIndex(prevIndex => validateIndex(prevIndex));
  }, [categoryProducts.length, validateIndex]);

  // Auto-rotation effect with proper cleanup
  useEffect(() => {
    if (categoryProducts.length <= 1) return;

    const interval = setInterval(navigateNext, 6000);
    return () => clearInterval(interval);
  }, [navigateNext, categoryProducts.length]);

  return {
    currentIndex: validateIndex(currentIndex),
    navigatePrevious,
    navigateNext,
    resetIndex,
    handleKeyDown,
  };
};

const BestSellers: React.FC<BestSellersProps> = React.memo(
  ({ title = 'We proudly serve' }) => {
    const { products, isLoading, error } = useFavoriteFoodItems();
    const [selectedCategory, setSelectedCategory] =
      useState<FoodCategory>(getDefaultCategory());

    const availableCategories = useMemo(
      () => getAvailableCategories(products),
      [products]
    );

    const categoryProducts = useMemo(
      () => products.filter(product => product.category === selectedCategory),
      [products, selectedCategory]
    );

    const {
      currentIndex,
      navigatePrevious,
      navigateNext,
      resetIndex,
      handleKeyDown,
    } = useCarouselState(categoryProducts);

    // Initialize category when products load with validation
    useEffect(() => {
      if (products.length === 0) return;

      const defaultCategory = selectDefaultCategory(products);
      // Only update if the current category is not available
      if (!products.some(product => product.category === selectedCategory)) {
        setSelectedCategory(defaultCategory);
      }
    }, [products, selectedCategory]);

    const handleCategoryChange = useCallback(
      (category: FoodCategory) => {
        if (selectedCategory === category) return;
        setSelectedCategory(category);
        resetIndex();
      },
      [selectedCategory, resetIndex]
    );

    if (isLoading) {
      return <LoadingDisplay title={title} />;
    }

    if (error) {
      return <ErrorDisplay title={title} error={error} />;
    }

    if (products.length === 0) {
      return <EmptyDisplay title={title} />;
    }

    return (
      <section className="relative w-full max-w-full overflow-hidden border-b-2 border-[#ffe0f0] bg-[#19b4bd] py-16 transition-all duration-500">
        <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <BrandHeader />

          <div className="mt-6 mb-10 text-center">
            <h2 className="font-navigation baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#f7d34f] md:text-5xl">
              {title}
            </h2>
          </div>

          <CategorySelector
            categories={availableCategories}
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategoryChange}
          />

          {categoryProducts.length > 0 ? (
            <ProductCarousel
              products={categoryProducts}
              currentIndex={currentIndex}
              onPrevious={navigatePrevious}
              onNext={navigateNext}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <div className="mx-auto max-w-4xl rounded-lg bg-white py-10 text-center shadow">
              <p className="text-gray-500">
                No products available in this category.
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }
);

BestSellers.displayName = 'BestSellers';

const LoadingDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="relative w-full max-w-full overflow-hidden bg-[#19b4bd] py-16">
    <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <BrandHeader />
      <div className="mt-6 mb-10 text-center">
        <h2 className="font-navigation baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#003F47] md:text-5xl">
          {title}
        </h2>
      </div>
      <div className="flex h-64 items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg leading-relaxed text-indigo-800">
          Loading our favorites...
        </p>
      </div>
    </div>
  </section>
);

const ErrorDisplay: React.FC<{ title: string; error?: string }> = ({
  title,
  error,
}) => (
  <section className="relative w-full max-w-full overflow-hidden bg-[#19b4bd] py-16">
    <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <BrandHeader />
      <div className="mt-6 mb-10 text-center">
        <h2 className="font-navigation baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#003F47] md:text-5xl">
          {title}
        </h2>
      </div>
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="leading-relaxed text-red-800">
          {error ||
            "We couldn't load our favorites right now. Please check back later!"}
        </p>
      </div>
    </div>
  </section>
);

const EmptyDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="relative w-full max-w-full overflow-hidden bg-[#19b4bd] py-16">
    <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <BrandHeader />
      <div className="mt-6 mb-10 text-center">
        <h2 className="font-navigation baloo-regular mb-2 text-4xl font-bold tracking-tight text-[#003F47] md:text-5xl">
          {title}
        </h2>
      </div>
      <div className="mx-auto max-w-xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="leading-relaxed text-gray-600">
          No featured items available at the moment. Please check back soon!
        </p>
      </div>
    </div>
  </section>
);

const ProductCarousel: React.FC<{
  products: readonly ProductItem[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}> = ({ products, currentIndex, onPrevious, onNext, onKeyDown }) => {
  const currentProduct = products[currentIndex];
  const showNavigation = products.length > 1;

  if (!currentProduct) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg bg-white py-10 text-center shadow">
        <p className="text-gray-500">No product to display.</p>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-screen-lg rounded-xl focus-visible:ring-2 focus-visible:ring-[#003F47] focus-visible:ring-offset-2 focus-visible:outline-none"
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product carousel"
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div className="relative h-64 overflow-hidden rounded-t-2xl md:h-96 md:rounded-l-2xl md:rounded-tr-none">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 md:w-1/2 md:p-8">
            <div className="mb-4">
              <span className="nunito-sans mb-2 inline-block rounded-full bg-indigo-900 px-4 py-1 text-sm font-bold text-white">
                FAVORITE
              </span>
            </div>
            <h3 className="font-navigation baloo-regular mb-2 text-2xl font-bold tracking-tight text-indigo-900 md:text-3xl">
              {currentProduct.name}
            </h3>
            <p className="nunito-sans mb-6 leading-relaxed text-indigo-700">
              {currentProduct.description}
            </p>
          </div>
        </div>
      </div>

      {showNavigation && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={onPrevious}
            className="baloo-regular transform cursor-pointer rounded-full border-1 border-b-4 border-[#bbfaf5] bg-[#19b4bd] p-4 font-bold text-[#003F47] shadow-lg transition duration-200 ease-in-out hover:border-[#8dd9d3] hover:bg-[#0faeb8] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#003F47] focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-1 active:border-b-2 active:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous product"
            disabled={products.length <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            className="baloo-regular bg-opacity-80 rounded-full border-1 border-b-4 border-[#bbfaf5] bg-[#19b4bd] px-6 py-2 text-sm font-medium text-[#003F47] shadow-sm backdrop-blur-sm"
            aria-label={`Product ${currentIndex + 1} of ${products.length}`}
          >
            {`${currentIndex + 1} / ${products.length}`}
          </div>
          <button
            onClick={onNext}
            className="baloo-regular transform cursor-pointer rounded-full border-1 border-b-4 border-[#bbfaf5] bg-[#19b4bd] p-4 font-bold text-[#003F47] shadow-lg transition duration-200 ease-in-out hover:border-[#8dd9d3] hover:bg-[#0faeb8] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#003F47] focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-1 active:border-b-2 active:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next product"
            disabled={products.length <= 1}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

const CategorySelector: React.FC<{
  categories: readonly FoodCategory[];
  selectedCategory: FoodCategory;
  onCategorySelect: (category: FoodCategory) => void;
}> = ({ categories, selectedCategory, onCategorySelect }) => (
  <div className="mb-10 flex justify-center">
    <div
      className="flex flex-wrap justify-center gap-3 sm:gap-4"
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map(category => {
        const isActive = selectedCategory === category;
        const defaultStyle =
          'bg-white text-gray-900 baloo-regular rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(165,180,252)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(165,180,252)] hover:ring-[#798be0] active:translate-y-0.5 active:shadow-[0_2px_0_rgb(165,180,252)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-[#a5b4fc] focus-visible:ring-offset-2 select-none touch-manipulation';

        return (
          <button
            key={category}
            className={`baloo-regular cursor-pointer rounded-full px-6 py-3 text-lg font-medium tracking-wide motion-safe:transition ${
              isActive ? createCategoryButtonStyles(category) : defaultStyle
            }`}
            onClick={() => onCategorySelect(category)}
            aria-label={`Show ${category} products`}
            role={isActive ? 'tab' : 'button'}
            aria-selected={isActive}
            tabIndex={0}
          >
            {category}
          </button>
        );
      })}
    </div>
  </div>
);

export default BestSellers;
