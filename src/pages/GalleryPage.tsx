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

// About Our Food component
const AboutOurFood: React.FC = () => {
  return (
    <div className="py-12 px-4 bg-[#f0c91f] w-full max-w-full overflow-x-hidden border-t-2 border-b-2 border-[#ffe0f0]">
      <div className="mx-auto max-w-4xl w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-navigation jua-regular text-center text-[#002B5B]">About Our Food</h2>
        <p className="text-base text-[#000000] sm:text-lg mb-6 nunito-sans text-center px-4">
          At Kailani, we take pride in creating dishes that fuse traditional Hawaiian 
          flavors with modern culinary techniques. Each item is crafted with care 
          using fresh, locally-sourced ingredients whenever possible.
        </p>
        <p className="text-base text-[#000000] sm:text-lg nunito-sans text-center px-4 pb-4">
          Whether you're trying our signature ramen bowls, refreshing shave ice, or 
          gourmet hot dogs, you're experiencing the aloha spirit in every bite.
        </p>
      </div>
    </div>
  );
};

// Simple category map for display purposes
const categoryDisplayNames: Record<string, string> = {
  'Ramen': 'Ramen',
  'Shave Ice': 'Shave Ice',
  'Acai': 'Acai',
  'Homemade Soft Serve': 'Soft Serve',
  'Hot Dogs': 'Hot Dogs',
  'Musubi': 'Musubi',
};

// Button style map for each category
const categoryButtonStyles: Record<string, string> = {
  'all': 'bg-green-400 text-[#000000]  border-green-600 shadow-[0_6px_0_rgb(22,163,74)] hover:shadow-[0_4px_0px_rgb(22,163,74)] hover:translate-y-1',
  'Ramen': 'bg-yellow-400 text-[#000000] border-yellow-600 shadow-[0_6px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
  'Shave Ice': 'bg-blue-300 text-[#000000] border-indigo-500 shadow-[0_6px_0_rgb(79,70,229)] hover:shadow-[0_4px_0px_rgb(79,70,229)] hover:translate-y-1',
  'Acai': 'bg-blue-300 text-[#000000] border-indigo-500 shadow-[0_6px_0_rgb(79,70,229)] hover:shadow-[0_4px_0px_rgb(79,70,229)] hover:translate-y-1',
  'Homemade Soft Serve': 'bg-blue-300 text-[#000000] border-indigo-500 shadow-[0_6px_0_rgb(79,70,229)] hover:shadow-[0_4px_0px_rgb(79,70,229)] hover:translate-y-1',
  'Hot Dogs': 'bg-yellow-400 text-[#000000] border-yellow-600 shadow-[0_6px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
  'Musubi': 'bg-yellow-400 text-[#000000] border-yellow-600 shadow-[0_6px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
};

// Default button style when not selected
const defaultButtonStyle = 'bg-white text-[#000000] rounded-full shadow-[0_6px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 transition-all duration-200 active:scale-95';

// Define the desired order of categories
const categoryOrder = ['all', 'Ramen', 'Shave Ice', 'Acai', 'Homemade Soft Serve', 'Hot Dogs', 'Musubi'];

const GalleryPage: React.FC = React.memo(() => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all available categories from food items and sort them based on predefined order
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(foodItems.map(item => item.category))];
    const allCategories = ['all', ...uniqueCategories].filter(Boolean);
    
    // Sort categories according to the predefined order
    return allCategories.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      
      // If category is not in the order array, put it at the end
      const posA = indexA === -1 ? 999 : indexA;
      const posB = indexB === -1 ? 999 : indexB;
      
      return posA - posB;
    });
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
      <div className="min-h-screen bg-[#19b4bd] border-b-2 border-[#ffe0f0] w-full max-w-full overflow-x-hidden flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="mt-4 text-lg text-[#003F47]">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error || foodItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#19b4bd] border-b-2 border-[#ffe0f0] w-full max-w-full overflow-x-hidden">
        <div className="py-12 px-4">
          <div className="mx-auto max-w-4xl w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-navigation jua-regular text-center text-[#003F47]">Gallery</h2>
            <p className="text-red-800 text-center">
              {error || "No images available at the moment. Please check back soon!"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#19b4bd]  w-full max-w-full overflow-x-hidden ">
      <div className="container mx-auto px-4 py-12 ">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 font-navigation baloo-regular text-center text-[#003F47]">
          Food Gallery
        </h1>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 text-lg tracking-wide baloo-regular rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                ${activeCategory === category
                ? categoryButtonStyles[category] || defaultButtonStyle
                : defaultButtonStyle
              }`}
            >
              {category === 'all' ? 'All' : categoryDisplayNames[category] || category}
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
      
      <AboutOurFood />
    </div>
  );
});

export default GalleryPage;
