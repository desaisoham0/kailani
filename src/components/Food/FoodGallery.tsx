import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface GalleryImage {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
}

interface FoodGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

const FoodGallery: React.FC<FoodGalleryProps> = ({
  images,
  title = "Food Gallery",
  subtitle = "Feast your eyes on our delicious creations"
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, images]);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  // Animation variants for the gallery items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    hover: { 
      y: -10, 
      scale: 1.05, 
      boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
      transition: { duration: 0.3 } 
    },
    tap: { scale: 0.95 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { y: "100vh", opacity: 0, transition: { ease: "easeInOut" } }
  };

  return (
    <section className="py-16 relative" style={{ background: "linear-gradient(135deg, #fef9c3 0%, #b784b7 100%)" }}>
      <div className="container mx-auto px-4">
        {/* Floating circles decoration */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              style={{
                width: `${Math.random() * 100 + 30}px`,
                height: `${Math.random() * 100 + 30}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-4 font-navigation jua-regular text-indigo-900"
              animate={{ 
                scale: [1, 1.03, 1],
                transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } 
              }}
            >
              {title}
            </motion.h2>
            <p className="text-lg text-indigo-700 max-w-2xl mx-auto nunito-sans">{subtitle}</p>
          </motion.div>

          {/* Category filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-4 transform 
                  ${selectedCategory === category 
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-[0_6px_0_rgb(67,56,202)]' 
                    : 'bg-white text-indigo-900 border-indigo-200 shadow-[0_6px_0_rgb(199,210,254)]'
                  } hover:shadow-[0_4px_0px_rgb(67,56,202)] hover:translate-y-1`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Gallery grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer bg-white shadow-lg"
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  layout
                  onClick={() => handleImageClick(image)}
                >
                  <div className="aspect-square overflow-hidden">
                    <motion.img 
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                      whileHover={{ scale: 1.1 }}
                    />
                  </div>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-lg font-bold text-white font-navigation jua-regular">{image.title}</h3>
                    <span className="text-sm text-gray-200 nunito-sans">{image.category}</span>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Image Lightbox/Modal */}
          <AnimatePresence>
            {isZoomed && selectedImage && (
              <motion.div 
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={closeZoom}
              >
                <motion.div
                  className="relative bg-white rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh]"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="absolute top-4 right-4 z-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                    onClick={closeZoom}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/3 h-72 md:h-auto">
                      <img 
                        src={selectedImage.imageUrl} 
                        alt={selectedImage.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/3 p-6 bg-white">
                      <h3 className="text-2xl font-bold mb-3 font-navigation jua-regular text-indigo-900">{selectedImage.title}</h3>
                      <p className="text-gray-700 mb-4">
                        Delicious {selectedImage.title.toLowerCase()} prepared by our master chefs using the freshest ingredients.
                      </p>
                      <div className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedImage.category}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FoodGallery;
