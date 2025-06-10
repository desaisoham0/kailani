import React, { useState, useMemo } from 'react';

// Define the product item interface
export interface ProductItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: 'shave-ice' | 'homemade-ice-cream' | 'ramen' | 'acai-twist-bowl' | 'soft-server-ice-cream' | 'hotdog';
}

interface BestSellersProps {
  products: ProductItem[];
  title?: string;
}

const BestSellers: React.FC<BestSellersProps> = React.memo(({
  products,
  title = "Our Best Sellers"
}) => {
  const [currentCategory, setCurrentCategory] = useState<'shave-ice' | 'homemade-ice-cream' | 'ramen' | 'acai-twist-bowl' | 'soft-server-ice-cream' | 'hotdog'>('shave-ice');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize filtered products by current category
  const categoryProducts = useMemo(() =>
    products.filter(product => product.category === currentCategory),
    [products, currentCategory]
  );
  
  // Memoize background patterns for each category
  const categoryBackgrounds = useMemo(() => ({
    'shave-ice': "radial-gradient(circle at 60% 40%, #fafdff 0%, #e0f7fa 40%, #a8edea 80%, #e3f0fc 100%)",
    'homemade-ice-cream': "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
    'ramen': "radial-gradient(circle at 10% 20%, rgb(221, 173, 115) 0%, rgb(245, 222, 179) 90%)",
    'acai-twist-bowl': "linear-gradient(120deg, #667eea 0%, #764ba2 100%)",
    'soft-server-ice-cream': "linear-gradient(120deg, #ffecd2 0%, #fcb69f 100%)",
    'hotdog': "radial-gradient(circle at 10% 20%, rgb(254, 144, 144) 0%, rgb(255, 193, 150) 90%)"
  }), []);

  const handlePrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? categoryProducts.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === categoryProducts.length - 1 ? 0 : prevIndex + 1
    );
  };

  const switchCategory = (category: 'shave-ice' | 'homemade-ice-cream' | 'ramen' | 'acai-twist-bowl' | 'soft-server-ice-cream' | 'hotdog') => {
    if (currentCategory === category) return;
    setCurrentCategory(category);
    setCurrentIndex(0);
  };

  // Auto-rotate products every 6 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex, categoryProducts.length]);

  return (
    <section className="py-16 relative overflow-hidden w-full max-w-full" 
      style={{ 
        background: categoryBackgrounds[currentCategory],
        transition: "background 0.5s ease-in-out"
      }}
    >
      <div className="container mx-auto px-4 relative z-10 max-w-full">
        <div className="text-center mb-10">
          <h2 
            className="text-4xl text-indigo-900 font-bold mb-2 font-navigation jua-regular"
          >
            {title}
          </h2>
        </div>

        {/* Kid-friendly Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentCategory === 'shave-ice' 
                  ? 'bg-cyan-400 text-indigo-900 border-cyan-600 shadow-[0_8px_0_rgb(6,182,212)] hover:shadow-[0_4px_0px_rgb(6,182,212)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('shave-ice')}
            >
              <span className="inline-block">🧊</span>{" "}
              Shave Ice
            </button>
            <button
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentCategory === 'homemade-ice-cream' 
                  ? 'bg-purple-400 text-indigo-900 border-purple-600 shadow-[0_8px_0_rgb(147,51,234)] hover:shadow-[0_4px_0px_rgb(147,51,234)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('homemade-ice-cream')}
            >
              <span className="inline-block">🍨</span>{" "}
              Homemade Ice Cream
            </button>
            <button
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentCategory === 'ramen' 
                  ? 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('ramen')}
            >
              <span className="inline-block">🍜</span>{" "}
              Ramen
            </button>
            <button
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentCategory === 'acai-twist-bowl' 
                  ? 'bg-purple-500 text-white border-purple-700 shadow-[0_8px_0_rgb(109,40,217)] hover:shadow-[0_4px_0px_rgb(109,40,217)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('acai-twist-bowl')}
            >
              <span className="inline-block">🍇</span>{" "}
              Acai Twist Bowl
            </button>
            <button
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentCategory === 'soft-server-ice-cream' 
                  ? 'bg-orange-400 text-indigo-900 border-orange-600 shadow-[0_8px_0_rgb(234,88,12)] hover:shadow-[0_4px_0px_rgb(234,88,12)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('soft-server-ice-cream')}
            >
              <span className="inline-block">🍦</span>{" "}
              Soft Server Ice Cream
            </button>
            <button
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                currentCategory === 'hotdog' 
                  ? 'bg-red-400 text-indigo-900 border-red-600 shadow-[0_8px_0_rgb(220,38,38)] hover:shadow-[0_4px_0px_rgb(220,38,38)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('hotdog')}
            >
              <span className="inline-block">🌭</span>{" "}
              Hot Dog
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Current product */}
          {categoryProducts.length > 0 ? (
            <div 
              className="overflow-hidden rounded-3xl shadow-2xl bg-white backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                    <img
                      src={categoryProducts[currentIndex].imageUrl}
                      alt={categoryProducts[currentIndex].name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      srcSet={categoryProducts[currentIndex].imageUrl + ' 1x, ' + categoryProducts[currentIndex].imageUrl + ' 2x'}
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
                  <h3 
                    className="text-2xl text-indigo-900 font-bold mb-2 font-navigation jua-regular"
                  >
                    {categoryProducts[currentIndex].name}
                  </h3>
                  <p 
                    className="text-indigo-700 mb-6 nunito-sans"
                  >
                    {categoryProducts[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="text-center py-10 bg-white rounded-lg shadow"
            >
              <p className="text-gray-500">No products available in this category.</p>
            </div>
          )}

          {/* Bottom navigation controls */}
          {categoryProducts.length > 1 && (
            <div className="flex items-center justify-center mt-6 space-x-4">
              <button
                onClick={handlePrevious}
                className="bg-pink-100 hover:bg-gray-100 rounded-2xl p-3 shadow-lg transition-all duration-200 border-l-2 border-b-4 border-indigo-300 active:border-b-2 active:translate-y-0.5 cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Previous product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div 
                className="bg-pink-100 bg-opacity-80 backdrop-blur-sm rounded-full px-6 py-2 text-indigo-700 text-sm font-navigation jua-regular"
              >
                {currentIndex + 1} / {categoryProducts.length}
              </div>
              <button
                onClick={handleNext}
                className="bg-pink-100 hover:bg-gray-100 rounded-2xl p-3 shadow-lg transition-all duration-200 border-r-2 border-b-4 border-indigo-300 active:border-b-2 active:translate-y-0.5 cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Next product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default BestSellers;
