import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { getFavoriteFoodItems } from '../../firebase/foodService';
import logo from '../../assets/Kailani_logo.png';

type FoodCategory = 'Ramen' | 'Shave Ice' | 'Acai' | 'Homemade Soft Serve' | 'Hot Dogs' | 'Musubi';

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
      'ramen': 'Ramen',
      'shave ice': 'Shave Ice',
      'acai': 'Acai',
      'homemade soft serve': 'Homemade Soft Serve',
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

// UI utility functions
const createCategoryButtonStyles = (category: FoodCategory): string => {
  const styleMap: Record<FoodCategory, string> = {
    'Ramen': 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
    'Shave Ice': 'bg-blue-300 text-indigo-900 border-indigo-500 shadow-[0_8px_0_rgb(79,70,229)] hover:shadow-[0_4px_0px_rgb(79,70,229)] hover:translate-y-1',
    'Acai': 'bg-blue-300 text-indigo-900 border-indigo-500 shadow-[0_8px_0_rgb(79,70,229)] hover:shadow-[0_4px_0px_rgb(79,70,229)] hover:translate-y-1',
    'Homemade Soft Serve': 'bg-blue-300 text-indigo-900 border-indigo-500 shadow-[0_8px_0_rgb(79,70,229)] hover:shadow-[0_4px_0px_rgb(79,70,229)] hover:translate-y-1',
    'Hot Dogs': 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
    'Musubi': 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1'
  };
  return styleMap[category] ?? 'bg-blue-400 text-indigo-900 border-blue-600';
};

const getAvailableCategories = (products: readonly ProductItem[]): readonly FoodCategory[] => {
  const categories: FoodCategory[] = ['Ramen', 'Shave Ice', 'Acai', 'Homemade Soft Serve', 'Hot Dogs', 'Musubi'];
  return categories.filter(category => 
    products.some(product => product.category === category)
  );
};

const selectDefaultCategory = (products: readonly ProductItem[]): FoodCategory => {
  const hasRamen = products.some(product => product.category === 'Ramen');
  return hasRamen ? 'Ramen' : products[0]?.category ?? 'Ramen';
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
  const defaultStyle = 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50';
  
  return (
    <button
      className={`px-6 py-3 font-bold text-lg font-navigation baloo-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
        isActive ? activeStyle : defaultStyle
      } ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
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
  <header className="py-4">
    <div className="container mx-auto flex justify-center px-4">
      <div className="flex flex-row items-center">
        <img
          src={logo}
          alt="Kailani Logo"
          className="h-36 w-36 mr-4 flex-shrink-0"
        />
        <div className="space-y-1">
          <h3 className="baloo-regular text-[#f7d34f] font-bold text-lg sm:text-xl drop-shadow-sm px-1">
            Hawaiian
          </h3>
          <h1 
            className="baloo-regular text-[#f7d34f] font-extrabold text-4xl sm:text-5xl px-1"
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
            className="baloo-regular text-white font-bold text-2xl sm:text-3xl px-1"
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
  </header>
);

// Data fetching hook
const useFavoriteFoodItems = () => {
  const [products, setProducts] = useState<readonly ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavoriteItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const favorites = await getFavoriteFoodItems();
        const transformedProducts = favorites.map(foodDataAdapter.transformFoodItemToProduct);
        
        setProducts(transformedProducts);
      } catch (err) {
        setError('Failed to load favorite items');
        console.error('Error fetching favorite items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteItems();
  }, []);

  return { products, isLoading, error };
};

// Carousel state management hook
const useCarouselState = (categoryProducts: readonly ProductItem[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigatePrevious = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? categoryProducts.length - 1 : prevIndex - 1
    );
  }, [categoryProducts.length]);

  const navigateNext = useCallback(() => {
    setCurrentIndex(prevIndex => 
      prevIndex === categoryProducts.length - 1 ? 0 : prevIndex + 1
    );
  }, [categoryProducts.length]);

  const resetIndex = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (categoryProducts.length <= 1) return;

    const interval = setInterval(navigateNext, 6000);
    return () => clearInterval(interval);
  }, [navigateNext, categoryProducts.length]);

  return {
    currentIndex,
    navigatePrevious,
    navigateNext,
    resetIndex
  };
};

const BestSellers: React.FC<BestSellersProps> = React.memo(({
  title = "Our Best Sellers"
}) => {
  const { products, isLoading, error } = useFavoriteFoodItems();
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('Ramen');
  
  const availableCategories = useMemo(() => 
    getAvailableCategories(products), [products]
  );
  
  const categoryProducts = useMemo(() =>
    products.filter(product => product.category === selectedCategory),
    [products, selectedCategory]
  );

  const { currentIndex, navigatePrevious, navigateNext, resetIndex } = useCarouselState(categoryProducts);

  // Initialize category when products load
  useEffect(() => {
    if (products.length === 0) return;
    
    const defaultCategory = selectDefaultCategory(products);
    setSelectedCategory(defaultCategory);
  }, [products]);

  const handleCategoryChange = useCallback((category: FoodCategory) => {
    if (selectedCategory === category) return;
    setSelectedCategory(category);
    resetIndex();
  }, [selectedCategory, resetIndex]);

  if (isLoading) {
    return <LoadingDisplay title={title} />;
  }

  if (error) {
    return <ErrorDisplay title={title} />;
  }

  if (products.length === 0) {
    return <EmptyDisplay title={title} />;
  }

  return (
    <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd] transition-all duration-500 border-b-2 border-[#ffe0f0]">
      <div className="container mx-auto px-4 relative z-10 max-w-full">
        <BrandHeader />
        
        <div className="text-center mb-10 mt-6">
          <h2 className="text-4xl text-[#0A2463] font-bold mb-2 font-navigation baloo-regular">
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

const LoadingDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <BrandHeader />
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl text-[#0A2463] font-bold mb-2 font-navigation baloo-regular">
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

const ErrorDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <BrandHeader />
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl text-[#0A2463] font-bold mb-2 font-navigation baloo-regular">
          {title}
        </h2>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-xl mx-auto">
        <p className="text-red-800">We couldn't load our favorites right now. Please check back later!</p>
      </div>
    </div>
  </section>
);

const EmptyDisplay: React.FC<{ title: string }> = ({ title }) => (
  <section className="py-16 relative overflow-hidden w-full max-w-full bg-[#19b4bd]">
    <div className="container mx-auto px-4 relative z-10 max-w-full">
      <BrandHeader />
      <div className="text-center mb-10 mt-6">
        <h2 className="text-4xl text-[#0A2463] font-bold mb-2 font-navigation baloo-regular">
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
}> = ({ products, currentIndex, onPrevious, onNext }) => {
  const currentProduct = products[currentIndex];
  const showNavigation = products.length > 1;

  return (
    <div className="relative max-w-4xl mx-auto">
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
          <BouncyPillButton
            text={<ChevronLeft className="h-6 w-6 text-indigo-700" />}
            onClick={onPrevious}
            className="p-2 bg-pink-100 hover:bg-gray-100 border-indigo-300"
            aria-label="Previous product"
          />
          <BouncyPillButton
            text={`${currentIndex + 1} / ${products.length}`}
            onClick={() => {}}
            className="bg-pink-100 bg-opacity-80 backdrop-blur-sm px-6 py-2 text-indigo-700 text-sm"
          />
          <BouncyPillButton
            text={<ChevronRight className="h-6 w-6 text-indigo-700" />}
            onClick={onNext}
            className="p-2 bg-pink-100 hover:bg-gray-100 border-indigo-300"
            aria-label="Next product"
          />
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
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <BouncyPillButton
          key={category}
          text={category}
          isActive={selectedCategory === category}
          activeStyle={createCategoryButtonStyles(category)}
          onClick={() => onCategorySelect(category)}
        />
      ))}
    </div>
  </div>
);

export default BestSellers;
