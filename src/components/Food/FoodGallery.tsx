import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion'; // Add framer-motion import for button animation

export interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string;
  category: 'shave-ice' | 'homemade-ice-cream' | 'ramen' | 'acai-twist-bowl' | 'soft-server-ice-cream' | 'hotdog';
}

interface FoodGalleryProps {
  images: GalleryImage[];
}

// Hand-drawn style icon (emoji placeholder) for each category
const categoryIcons: Record<string, string> = {
  'shave-ice': '🍧',
  'homemade-ice-cream': '🍨',
  'ramen': '🍜',
  'acai-twist-bowl': '🍇',
  'soft-server-ice-cream': '🍦',
  'hotdog': '🌭',
  'all': '🌈',
};

const FoodGallery: React.FC<FoodGalleryProps> = React.memo(({
  images
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'shave-ice' | 'homemade-ice-cream' | 'ramen' | 'acai-twist-bowl' | 'soft-server-ice-cream' | 'hotdog'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Memoize filtered images
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return images;
    return images.filter(img => img.category === selectedCategory);
  }, [selectedCategory, images]);

  // Add emoji animation variants
  const emojiVariants = {
    hover: { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.6 } }
  };

  // Memoize category buttons
  const categoryButtons = useMemo(() => [
    {
      key: 'all',
      label: 'All',
      emoji: '🌈',
      activeClass: 'bg-lime-300 text-indigo-900 border-lime-500 shadow-[0_8px_0_rgb(132,204,22)] hover:shadow-[0_4px_0px_rgb(132,204,22)] hover:translate-y-1',
    },
    {
      key: 'shave-ice',
      label: 'Shave Ice',
      emoji: '🧊',
      activeClass: 'bg-cyan-400 text-indigo-900 border-cyan-600 shadow-[0_8px_0_rgb(6,182,212)] hover:shadow-[0_4px_0px_rgb(6,182,212)] hover:translate-y-1',
    },
    {
      key: 'homemade-ice-cream',
      label: 'Homemade Ice Cream',
      emoji: '🍨',
      activeClass: 'bg-purple-400 text-indigo-900 border-purple-600 shadow-[0_8px_0_rgb(147,51,234)] hover:shadow-[0_4px_0px_rgb(147,51,234)] hover:translate-y-1',
    },
    {
      key: 'ramen',
      label: 'Ramen',
      emoji: '🍜',
      activeClass: 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1',
    },
    {
      key: 'acai-twist-bowl',
      label: 'Acai Twist Bowl',
      emoji: '🍇',
      activeClass: 'bg-purple-500 text-white border-purple-700 shadow-[0_8px_0_rgb(109,40,217)] hover:shadow-[0_4px_0px_rgb(109,40,217)] hover:translate-y-1',
    },
    {
      key: 'soft-server-ice-cream',
      label: 'Soft Server Ice Cream',
      emoji: '🍦',
      activeClass: 'bg-orange-400 text-indigo-900 border-orange-600 shadow-[0_8px_0_rgb(234,88,12)] hover:shadow-[0_4px_0px_rgb(234,88,12)] hover:translate-y-1',
    },
    {
      key: 'hotdog',
      label: 'Hot Dog',
      emoji: '🌭',
      activeClass: 'bg-red-400 text-indigo-900 border-red-600 shadow-[0_8px_0_rgb(220,38,38)] hover:shadow-[0_4px_0px_rgb(220,38,38)] hover:translate-y-1',
    },
  ], []);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-yellow-50 to-blue-50 min-h-screen w-full">
      <div className="mx-auto px-4 max-w-7xl">
        {/* Category filters - animated buttons */}
        <motion.div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-4">
            {categoryButtons.map(btn => (
              <motion.button
                key={btn.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-2 transform transition-all duration-200 ${
                  selectedCategory === btn.key
                    ? btn.activeClass
                    : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
                }`}
                onClick={() => setSelectedCategory(btn.key as typeof selectedCategory)}
              >
                <motion.span
                  className="inline-block"
                  variants={emojiVariants}
                  whileHover="hover"
                >
                  {btn.emoji}
                </motion.span>{' '}
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2 sm:px-0">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white rounded-3xl shadow-lg border border-indigo-50 p-4 flex flex-col items-center cursor-pointer transition-all hover:shadow-xl hover:border-pink-200 group"
              onClick={() => handleImageClick(image)}
              style={{ minHeight: 320 }}
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 border-4 border-pink-100 bg-pink-50 flex items-center justify-center">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover object-center rounded-2xl transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-2xl"
                  style={{ maxHeight: 240 }}
                  loading="lazy"
                  srcSet={image.imageUrl + ' 1x, ' + image.imageUrl + ' 2x'}
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-indigo-800 font-navigation jua-regular mb-1 text-center truncate w-full">
                {image.title}
              </h3>
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mt-1">
                <span>{categoryIcons[image.category]}</span>
                <span className="capitalize">{image.category.replace(/-/g, ' ')}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {isZoomed && selectedImage && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={closeZoom}>
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden border-4 border-pink-100" onClick={e => e.stopPropagation()}>
              <button
                className="absolute top-4 right-4 bg-pink-100 hover:bg-pink-200 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                onClick={closeZoom}
                aria-label="Close"
              >
                <span className="text-2xl text-pink-500">✖️</span>
              </button>
              <div className="md:w-2/3 h-64 md:h-auto flex items-center justify-center bg-pink-50">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  className="w-full h-full object-cover rounded-2xl"
                  style={{ maxHeight: 400 }}
                  loading="lazy"
                  srcSet={selectedImage.imageUrl + ' 1x, ' + selectedImage.imageUrl + ' 2x'}
                />
              </div>
              <div className="md:w-1/3 p-6 flex flex-col justify-center bg-white">
                <h3 className="text-2xl font-bold mb-2 font-navigation jua-regular text-indigo-800">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-600 mb-4 text-base nunito-sans">
                  Delicious <span className="lowercase">{selectedImage.title}</span> prepared with love and fresh ingredients for you and your family!
                </p>
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <span>{categoryIcons[selectedImage.category]}</span>
                  <span className="capitalize">{selectedImage.category.replace(/-/g, ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

// For large galleries, consider virtualization (e.g., react-window) for further performance improvements.

export default FoodGallery;
