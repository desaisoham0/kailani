import React, { useState, useMemo, useEffect, useCallback } from 'react';
import useCachedFoodItems from '../../hooks/useCachedFoodItems';
import logo from '../../assets/Kailani_logo.png';
import { SocialMediaLinks } from '../Navigation/SocialMediaLinks';

type FoodCategory = 'Shave Ice' | 'Ramen' | 'Homemade Ice Cream' | 'Soft Serve' | 'Hot Dogs' | 'Musubi';

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

interface BouncyPillButtonProps {
  readonly text: React.ReactNode;
  readonly isActive?: boolean;
  readonly activeStyle?: string;
  readonly onClick: () => void;
  readonly className?: string;
  readonly 'aria-label'?: string;
}

// Firebase adapter functions (isolated)
const foodDataAdapter = {
  normalizeCategoryName: (category: string): FoodCategory => {
    const normalized = category.toLowerCase().trim();
    const categoryMap: Record<string, FoodCategory> = {
      'shave ice': 'Shave Ice',
      'ramen': 'Ramen',
      'homemade ice cream': 'Homemade Ice Cream',
      'soft serve': 'Soft Serve',
      'hot dogs': 'Hot Dogs',
      'musubi': 'Musubi'
    };
    return categoryMap[normalized] ?? 'Ramen';
  },

  transformFoodItemToProduct: (item: { id?: string; name: string; description: string; imageUrl: string; category: string }): ProductItem => ({
    id: item.id || '',
    name: item.name,
    description: item.description,
    imageUrl: item.imageUrl,
    category: foodDataAdapter.normalizeCategoryName(item.category)
  })
};

// ===== CENTRALIZED CATEGORY SYSTEM =====
// 🎯 CHANGE THESE NUMBERS TO REORDER CATEGORIES ON DASHBOARD
// Lower numbers = higher priority (1 shows first, 2 shows second, etc.)
const CATEGORY_ORDER_CONFIG: Record<FoodCategory, number> = {
  'Shave Ice': 1,
  'Ramen': 2,
  'Homemade Ice Cream': 3,
  'Soft Serve': 4,
  'Hot Dogs': 5,
  'Musubi': 6
};

// Centralized list of all categories (derived from config)
const ALL_CATEGORIES: readonly FoodCategory[] = Object.keys(CATEGORY_ORDER_CONFIG)
  .sort((a, b) => CATEGORY_ORDER_CONFIG[a as FoodCategory] - CATEGORY_ORDER_CONFIG[b as FoodCategory]) as FoodCategory[];

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
    'Ramen': 'bg-yellow-400 text-[#000000] border-yellow-600 border-b-4 active:border-b-1 rounded-full shadow-lg hover:bg-yellow-500 hover:shadow-xl active:shadow-md active:translate-y-1 transition-all duration-200 transform',
    'Shave Ice': 'bg-blue-300 text-[#000000] border-indigo-500 border-b-4 active:border-b-2 rounded-full shadow-lg hover:bg-blue-400 hover:shadow-xl active:scale-95 active:shadow-md active:translate-y-1 transition-all duration-300 transform',
    'Homemade Ice Cream': 'bg-blue-300 text-[#000000] border-indigo-500 border-b-4 active:border-b-2 rounded-full shadow-lg hover:bg-blue-400 hover:shadow-xl active:scale-95 active:shadow-md active:translate-y-1 transition-all duration-300 transform',
    'Soft Serve': 'bg-blue-300 text-[#000000] border-indigo-500 border-b-4 active:border-b-2 rounded-full shadow-lg hover:bg-blue-400 hover:shadow-xl active:scale-95 active:shadow-md active:translate-y-1 transition-all duration-300 transform',
    'Hot Dogs': 'bg-yellow-400 text-[#000000] border-yellow-600 border-b-4 active:border-b-1 rounded-full shadow-lg hover:bg-yellow-500 hover:shadow-xl active:shadow-md active:translate-y-1 transition-all duration-200 transform',
    'Musubi': 'bg-yellow-400 text-[#000000] border-yellow-600 border-b-4 active:border-b-1 rounded-full shadow-lg hover:bg-yellow-500 hover:shadow-xl active:shadow-md active:translate-y-1 transition-all duration-200 transform'
  };
  return styleMap[category] ?? 'bg-blue-400 border-blue-600 rounded-full shadow-lg hover:bg-blue-500 hover:shadow-xl active:scale-95 active:shadow-md transition-all duration-300 transform';
};

const getAvailableCategories = (products: readonly ProductItem[]): readonly FoodCategory[] => {
  if (!products.length) return [];
  
  const productCategorySet = new Set(products.map(product => product.category));
  return ALL_CATEGORIES.filter(category => productCategorySet.has(category));
};

const selectDefaultCategory = (products: readonly ProductItem[]): FoodCategory => {
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
const BouncyPillButton: React.FC<BouncyPillButtonProps> = ({
  text,
  isActive = false,
  activeStyle = '',
  onClick,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const defaultStyle = 'bg-white text-[#000000] baloo-regular rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl active:shadow-md border-b-4 active:border-b-2 border-[#a5b4fc] transition-all duration-150 active:translate-y-1 transform';
  
  return (
    <button
      className={`px-6 py-3 font-bold text-lg tracking-wide baloo-regular cursor-pointer rounded-full ${
        isActive ? activeStyle : defaultStyle
      } ${className} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      onClick={onClick}
      aria-label={ariaLabel}
      role={isActive ? "tab" : "button"}
      aria-selected={isActive}
      tabIndex={0}
    >
      {text}
    </button>
  );
};

const ChevronLeft: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const BrandHeader: React.FC = () => (
  <header className="py-0">
    <div className="container mx-auto flex justify-center">
      <div className="flex flex-row items-center">
        <img
          src={logo}
          alt="Kailani Logo"
          className="h-36 w-36 flex-shrink-0"
        />
        <div className="space-y-1">
          <h3 className="milkshake-regular text-[#f7d34f] font-bold text-lg sm:text-xl drop-shadow-sm">
            Hawaiian
          </h3>
          <h1 
            className="baloo-regular text-[#f7d34f] font-extrabold text-4xl sm:text-5xl pr-4 -mt-3"
            style={{
              fontFamily: 'Baloo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.06em',
              textShadow: '-4px 4px 0px #7F4F00'
            }}
          >
            SHAVE ICE
          </h1>
          <h2 
            className="baloo-regular text-white font-bold text-2xl sm:text-3xl"
            style={{
              fontFamily: 'Baloo, sans-serif',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.04em',
              textShadow: '-2px 2px 0px #e85fa8'
            }}
          >
            &amp; Ramen
          </h2>
        </div>
      </div>
    </div>
    
    {/* Social Media Links */}
    <div className="flex justify-center mt-4">
      <SocialMediaLinks/>
    </div>
  </header>
);

// Data fetching hook using cached service with better error handling
const useFavoriteFoodItems = () => {
  const { favoriteItems, isLoading, error: cacheError } = useCachedFoodItems();
  const [products, setProducts] = useState<readonly ProductItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Memoize the transformation to prevent unnecessary recalculations
  const transformedProducts = useMemo(() => {
    try {
      if (!favoriteItems.length) return [];
      
      return favoriteItems
        .map(foodDataAdapter.transformFoodItemToProduct)
        .sort((a, b) => {
          // First sort by category order using centralized system
          const categorySort = getCategoryOrder(a.category) - getCategoryOrder(b.category);
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
    setError(cacheError?.message || null);
    
    if (transformedProducts.length > 0) {
      console.log(`🍕 BestSellers: Updated with ${transformedProducts.length} favorite items (sorted by centralized order system)`);
    }
  }, [transformedProducts, cacheError?.message]);

  return { products, isLoading, error };
};

// Carousel state management hook with improved safety and keyboard support
const useCarouselState = (categoryProducts: readonly ProductItem[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Validate and clamp index to prevent out-of-bounds errors
  const validateIndex = useCallback((index: number) => {
    if (categoryProducts.length === 0) return 0;
    return Math.max(0, Math.min(index, categoryProducts.length - 1));
  }, [categoryProducts.length]);

  const navigatePrevious = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === 0 ? categoryProducts.length - 1 : prevIndex - 1;
      return validateIndex(newIndex);
    });
  }, [categoryProducts.length, validateIndex]);

  const navigateNext = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const newIndex = prevIndex === categoryProducts.length - 1 ? 0 : prevIndex + 1;
      return validateIndex(newIndex);
    });
  }, [categoryProducts.length, validateIndex]);

  const resetIndex = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
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
  }, [navigatePrevious, navigateNext, categoryProducts.length]);

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
    handleKeyDown
  };
};

const BestSellers: React.FC<BestSellersProps> = React.memo(({
  title = "We proudly serve"
}) => {
  const { products, isLoading, error } = useFavoriteFoodItems();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>(getDefaultCategory());
  
  const availableCategories = useMemo(() => 
    getAvailableCategories(products), [products]
  );
  
  const categoryProducts = useMemo(() =>
    products.filter(product => product.category === selectedCategory),
    [products, selectedCategory]
  );

  const { currentIndex, navigatePrevious, navigateNext, resetIndex, handleKeyDown } = useCarouselState(categoryProducts);

  // Initialize category when products load with validation
  useEffect(() => {
    if (products.length === 0) return;
    
    const defaultCategory = selectDefaultCategory(products);
    // Only update if the current category is not available
    if (!products.some(product => product.category === selectedCategory)) {
      setSelectedCategory(defaultCategory);
    }
  }, [products, selectedCategory]);

  const handleCategoryChange = useCallback((category: FoodCategory) => {
    if (selectedCategory === category) return;
    setSelectedCategory(category);
    resetIndex();
  }, [selectedCategory, resetIndex]);

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
    <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd] transition-all duration-500 border-b-2 border-[#ffe0f0]">
      <div className="container mx-auto px-4 relative z-10 max-w-full">
        <BrandHeader />
        
        <div className="text-center mb-10 mt-6">
          <h2 className="text-4xl text-[#f7d34f] font-bold mb-2 font-navigation baloo-regular">
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
          <div className="text-center py-10 bg-white rounded-lg shadow max-w-4xl mx-auto">
            <p className="text-gray-500">No products available in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
});

BestSellers.displayName = 'BestSellers';

const LoadingDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <BrandHeader />
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl text-[#003F47 ] font-bold mb-2 font-navigation baloo-regular">
          {title}
        </h2>
      </div>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-indigo-800">Loading our favorites...</p>
      </div>
    </div>
  </section>
);

const ErrorDisplay: React.FC<{ title: string; error?: string }> = ({ title, error }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <BrandHeader />
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl text-[#003F47] font-bold mb-2 font-navigation baloo-regular">
          {title}
        </h2>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-xl mx-auto">
        <p className="text-red-800">
          {error || "We couldn't load our favorites right now. Please check back later!"}
        </p>
      </div>
    </div>
  </section>
);

const EmptyDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <BrandHeader />
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl text-[#003F47] font-bold mb-2 font-navigation baloo-regular">
          {title}
        </h2>
      </div>
      <div className="bg-white rounded-lg p-6 max-w-xl mx-auto shadow-md">
        <p className="text-gray-600">No featured items available at the moment. Please check back soon!</p>
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
      <div className="text-center py-10 bg-white rounded-lg shadow max-w-4xl mx-auto">
        <p className="text-gray-500">No product to display.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative max-w-4xl mx-auto" 
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Product carousel"
      aria-live="polite"
    >
      <div className="overflow-hidden rounded-3xl shadow-2xl bg-white backdrop-blur-sm">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
              <img
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block bg-indigo-900 text-white px-4 py-1 rounded-full text-sm font-bold mb-2 nunito-sans">
                FAVORITE
              </span>
            </div>
            <h3 className="text-2xl text-indigo-900 font-bold mb-2 font-navigation baloo-regular">
              {currentProduct.name}
            </h3>
            <p className="text-indigo-700 mb-6 nunito-sans">
              {currentProduct.description}
            </p>
          </div>
        </div>
      </div>

      {showNavigation && (
        <div className="flex items-center justify-center mt-6 space-x-4">
          <button
            onClick={onPrevious}
            className="p-4 font-bold baloo-regular cursor-pointer rounded-full bg-[#19b4bd] hover:bg-[#0faeb8] text-[#003F47] border-1 border-b-4 active:border-b-2 border-[#bbfaf5] hover:border-[#8dd9d3] shadow-lg hover:shadow-xl active:shadow-md active:translate-y-1 transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Previous product"
            disabled={products.length <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            className="bg-opacity-80 backdrop-blur-sm px-6 py-2 text-sm baloo-regular rounded-full bg-[#19b4bd] text-[#003F47] border-1 border-b-4 border-[#bbfaf5]"
            aria-label={`Product ${currentIndex + 1} of ${products.length}`}
          >
            {`${currentIndex + 1} / ${products.length}`}
          </div>
          <button
            onClick={onNext}
            className="p-4 font-bold baloo-regular cursor-pointer rounded-full bg-[#19b4bd] hover:bg-[#0faeb8] text-[#003F47] border-1 border-b-4 active:border-b-2 border-[#bbfaf5] hover:border-[#8dd9d3] shadow-lg hover:shadow-xl active:shadow-md active:translate-y-1 transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
  <div className="flex justify-center mb-10">
    <div 
      className="flex flex-wrap justify-center gap-4"
      role="tablist"
      aria-label="Product categories"
    >
      {categories.map((category) => (
        <BouncyPillButton
          key={category}
          text={category}
          isActive={selectedCategory === category}
          activeStyle={createCategoryButtonStyles(category)}
          onClick={() => onCategorySelect(category)}
          aria-label={`Show ${category} products`}
        />
      ))}
    </div>
  </div>
);

export default BestSellers;
