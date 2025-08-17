import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { getAllFoodItems, type FoodItem } from '../firebase/foodService';

// ===== TYPES =====
type FoodCategory =
  | 'Shave Ice'
  | 'Ramen'
  | 'Homemade Ice Cream'
  | 'Soft Serve'
  | 'Hot Dogs'
  | 'Musubi';

// ===== CONFIGURATION =====
const CATEGORY_ORDER_CONFIG: Record<FoodCategory, number> = {
  Ramen: 2,
  'Shave Ice': 1,
  'Homemade Ice Cream': 3,
  'Soft Serve': 4,
  'Hot Dogs': 5,
  Musubi: 6,
} as const;

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  Ramen: 'Ramen',
  'Shave Ice': 'Shave Ice',
  'Homemade Ice Cream': 'Homemade Ice Cream',
  'Soft Serve': 'Soft Serve',
  'Hot Dogs': 'Hot Dogs',
  Musubi: 'Musubi',
} as const;

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

const CATEGORY_BUTTON_STYLES: Record<string, string> = {
  all: 'baloo-regular bg-green-400 text-gray-900 rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(22,163,74)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(22,163,74)] hover:ring-green-600 active:translate-y-0.5 active:shadow-[0_2px_0_rgb(22,163,74)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 select-none touch-manipulation',
} as const;

const DEFAULT_BUTTON_STYLE =
  'bg-white text-gray-900 baloo-regular cursor-pointer rounded-full px-4 py-2 text-base font-bold shadow-[0_5px_0_rgb(165,180,252)] ring-1 ring-transparent transition-all duration-150 ease-out hover:shadow-[0_3px_0_rgb(165,180,252)] hover:ring-[#798be0] active:translate-y-0.5 active:shadow-[0_2px_0_rgb(165,180,252)] active:scale-95  active:ease-in active:duration-100 focus-visible:outline-none  focus-visible:ring-2 focus-visible:ring-[#a5b4fc] focus-visible:ring-offset-2 select-none touch-manipulation';

// ===== UTILITY FUNCTIONS =====
const getCategoryOrder = (category: string): number => {
  return CATEGORY_ORDER_CONFIG[category as FoodCategory] ?? 999;
};

const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmedUrl = url.trim();
  return (
    trimmedUrl !== '' &&
    (trimmedUrl.startsWith('http://') ||
      trimmedUrl.startsWith('https://') ||
      trimmedUrl.startsWith('data:image/') ||
      trimmedUrl.startsWith('/'))
  );
};

const sanitizeAltText = (name: string, category: string): string => {
  const cleanName = name?.trim() || 'Food item';
  const cleanCategory = CATEGORY_DISPLAY_NAMES[category] || category || 'Food';
  return `${cleanName} - ${cleanCategory}`;
};

// Custom hook to fetch food items using direct Firebase service
const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const items = await getAllFoodItems();
        setFoodItems(items);
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError(
          err instanceof Error ? err : new Error('Failed to load food items')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  return { foodItems, isLoading, error };
};

// About Our Food component
const AboutOurFood: React.FC = () => {
  return (
    <section
      className="border-t-2 border-b-2 border-pink-100 bg-yellow-400 px-4 py-8 sm:py-12"
      aria-labelledby="about-food-heading"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          id="about-food-heading"
          className="mb-4 text-center text-xl font-bold text-blue-900 sm:mb-6 sm:text-2xl lg:text-3xl"
        >
          About Our Food
        </h2>
        <div className="space-y-4 sm:space-y-6">
          <p className="text-center text-sm leading-relaxed text-gray-900 sm:text-base lg:text-lg">
            At Kailani, we take pride in creating dishes that fuse traditional
            Hawaiian flavors with modern culinary techniques. Each item is
            crafted with care using fresh, locally-sourced ingredients whenever
            possible.
          </p>
          <p className="text-center text-sm leading-relaxed text-gray-900 sm:text-base lg:text-lg">
            Whether you're trying our signature ramen bowls, refreshing shave
            ice, or gourmet hot dogs, you're experiencing the aloha spirit in
            every bite.
          </p>
        </div>
      </div>
    </section>
  );
};

const GalleryPage: React.FC = () => {
  const {
    foodItems: allFoodItems,
    isLoading,
    error: directError,
  } = useFoodItems();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Filter to only include items with valid images
  const foodItems = useMemo(() => {
    return allFoodItems.filter((item: FoodItem) =>
      isValidImageUrl(item.imageUrl)
    );
  }, [allFoodItems]);

  const error = directError?.message || null;

  // Get all available categories from food items and sort them using centralized system
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(foodItems.map((item: FoodItem) => item.category)),
    ].filter(Boolean);
    const allCategories = ['all', ...uniqueCategories];

    // Sort categories according to the centralized order system
    const sortedCategories = allCategories.sort((a: string, b: string) => {
      if (a === 'all') return -1; // 'all' always comes first
      if (b === 'all') return 1;

      const orderA = getCategoryOrder(a);
      const orderB = getCategoryOrder(b);

      return orderA - orderB;
    });

    return sortedCategories;
  }, [foodItems]);

  // Filter food items by active category
  const displayItems = useMemo(() => {
    if (activeCategory === 'all') return foodItems;
    return foodItems.filter(
      (item: FoodItem) => item.category === activeCategory
    );
  }, [foodItems, activeCategory]);

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const handleImageError = useCallback((itemId: string) => {
    setFailedImages(prev => new Set(prev).add(itemId));
  }, []);

  const getCategoryButtonStyle = useCallback(
    (category: string, isActive: boolean) => {
      let colorClasses = '';
      if (isActive) {
        if (category === 'all') {
          colorClasses = CATEGORY_BUTTON_STYLES[category];
        } else {
          colorClasses = createCategoryButtonStyles(category as FoodCategory);
        }
      } else {
        colorClasses = DEFAULT_BUTTON_STYLE;
      }

      return colorClasses;
    },
    []
  );

  const getCategoryDisplayName = useCallback((category: string) => {
    if (category === 'all') return 'All';
    return CATEGORY_DISPLAY_NAMES[category] || category;
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cyan-500 px-4">
        <div
          className="flex flex-col items-center space-y-4"
          role="status"
          aria-label="Loading gallery"
        >
          <div
            className="h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-indigo-500 sm:h-16 sm:w-16"
            aria-hidden="true"
          ></div>
          <p className="text-center text-base text-cyan-900 sm:text-lg">
            Loading gallery...
          </p>
        </div>
      </div>
    );
  }

  if (error || foodItems.length === 0) {
    return (
      <div className="min-h-screen bg-cyan-500 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6">
            <h2 className="mb-4 text-center text-xl font-bold text-cyan-900 sm:mb-6 sm:text-2xl lg:text-3xl">
              Gallery
            </h2>
            <p
              className="text-center text-sm text-red-800 sm:text-base"
              role="alert"
            >
              {error ||
                'No images available at the moment. Please check back soon!'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-cyan-500">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <h1 className="mb-6 text-center text-3xl font-bold text-cyan-900 sm:mb-8 sm:text-4xl lg:text-5xl">
          Menu
        </h1>

        {/* Category Filters */}
        <nav
          aria-label="Food category filters"
          className="mb-10 flex justify-center"
        >
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2 overflow-visible pb-2 sm:gap-3 sm:pb-3">
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={getCategoryButtonStyle(
                  category,
                  activeCategory === category
                )}
                aria-pressed={activeCategory === category}
                aria-label={`Filter by ${getCategoryDisplayName(category)}`}
                type="button"
              >
                {getCategoryDisplayName(category)}
              </button>
            ))}
          </div>
        </nav>

        {/* Gallery Grid */}
        <main>
          {displayItems.length === 0 ? (
            <div className="py-8 text-center sm:py-12">
              <p className="text-base text-cyan-900 sm:text-lg">
                No items found in the {getCategoryDisplayName(activeCategory)}{' '}
                category.
              </p>
            </div>
          ) : (
            <div
              className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
              role="grid"
              aria-label={`${displayItems.length} food items in ${getCategoryDisplayName(activeCategory)} category`}
            >
              {displayItems.map((item: FoodItem) => (
                <article
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:shadow-md"
                  role="gridcell"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {failedImages.has(item.id || '') ? (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <div className="p-4 text-center text-gray-500">
                          <svg
                            className="mx-auto mb-2 h-12 w-12 opacity-50"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-xs">Image unavailable</p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.imageUrl}
                        alt={sanitizeAltText(item.name, item.category)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={() => handleImageError(item.id || '')}
                      />
                    )}
                    {item.favorite && (
                      <span
                        className="absolute top-2 right-2 z-10 rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-indigo-900 shadow-md sm:top-3 sm:right-3"
                        aria-label="Customer favorite"
                      >
                        ★ Favorite
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="mb-1 text-base leading-tight font-bold text-indigo-900 sm:text-lg">
                      {item.name}
                    </h3>
                    <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
                      {item.description}
                    </p>
                    <div className="mt-2">
                      <span className="inline-block rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                        {CATEGORY_DISPLAY_NAMES[item.category] || item.category}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <AboutOurFood />
    </div>
  );
};

export default GalleryPage;
