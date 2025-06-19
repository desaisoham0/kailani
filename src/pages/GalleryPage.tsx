import React, { useState, useEffect } from 'react';
import { getAllFoodItems } from '../firebase/foodService';

interface FoodItem {
  id?: string;
  name: string;
  description: string;
  category: string;
  favorite: boolean;
  imageUrl: string;
}

// Simple category map for display purposes
const categoryDisplayNames: Record<string, string> = {
  'Ramen': 'Ramen',
  'Shave Ice': 'Shave Ice',
  'Acai': 'Acai',
  'Homemade Soft Serve': 'Soft Serve',
  'Hot Dogs': 'Hot Dogs',
  'Musubi': 'Musubi',
};

const GalleryPage: React.FC = React.memo(() => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all available categories from food items
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(foodItems.map(item => item.category))];
    return ['all', ...uniqueCategories].filter(Boolean);
  }, [foodItems]);

  // Filter food items by active category
  const displayItems = React.useMemo(() => {
    if (activeCategory === 'all') return foodItems;
    return foodItems.filter(item => item.category === activeCategory);
  }, [foodItems, activeCategory]);

  useEffect(() => {
    const loadFoodItems = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const items = await getAllFoodItems();
        // Only include items with valid images
        const validItems = items.filter(item => item.imageUrl && item.imageUrl.trim() !== '');
        
        setFoodItems(validItems);
      } catch (err) {
        setError('Failed to load gallery images');
        console.error('Error fetching food items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFoodItems();
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 w-full max-w-full overflow-x-hidden flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-lg text-indigo-800">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error || foodItems.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 w-full max-w-full overflow-x-hidden">
        <div className="py-12 px-4">
          <div className="mx-auto max-w-4xl w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-navigation jua-regular text-center text-indigo-900">Gallery</h2>
            <p className="text-red-800 text-center">
              {error || "No images available at the moment. Please check back soon!"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 w-full max-w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-navigation baloo-regular text-center text-indigo-900">
          Our Food Gallery
        </h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                activeCategory === category
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              {category === 'all' ? '🌈 All' : categoryDisplayNames[category] || category}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {item.favorite && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-indigo-900 px-2 py-1 rounded-full text-xs font-bold">
                    ★ Favorite
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-indigo-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <div className="mt-2">
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                    {categoryDisplayNames[item.category] || item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="py-12 px-4 bg-stone-100 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-4xl w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-navigation jua-regular text-center text-indigo-900">About Our Food</h2>
          <p className="text-base sm:text-lg mb-6 nunito-sans text-center px-4">
            At Kailani, we take pride in creating dishes that fuse traditional Hawaiian 
            flavors with modern culinary techniques. Each item is crafted with care 
            using fresh, locally-sourced ingredients whenever possible.
          </p>
          <p className="text-base sm:text-lg nunito-sans text-center px-4">
            Whether you're trying our signature ramen bowls, refreshing shave ice, or 
            gourmet hot dogs, you're experiencing the aloha spirit in every bite.
          </p>
        </div>
      </div>
    </div>
  );
});

export default GalleryPage;
