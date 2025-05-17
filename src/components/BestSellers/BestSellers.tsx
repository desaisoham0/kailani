import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the product item interface
export interface ProductItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  category: 'ramen' | 'ice-cream' | 'hotdog';
}

interface BestSellersProps {
  products: ProductItem[];
  title?: string;
  subtitle?: string;
}

const BestSellers: React.FC<BestSellersProps> = ({
  products,
  title = "Our Best Sellers",
  subtitle = "Customer favorites you don't want to miss"
}) => {
  const [currentCategory, setCurrentCategory] = useState<'ramen' | 'ice-cream' | 'hotdog'>('ramen');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Filter products by current category
  const categoryProducts = products.filter(product => product.category === currentCategory);
  
  // Background patterns for each category
  const categoryBackgrounds = {
    'ramen': "radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(252, 251, 121) 90%)",
    'ice-cream': "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
    'hotdog': "radial-gradient(circle at 10% 20%, rgb(254, 144, 144) 0%, rgb(255, 193, 150) 90%)"
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? categoryProducts.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prevIndex => 
      prevIndex === categoryProducts.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const switchCategory = (category: 'ramen' | 'ice-cream' | 'hotdog') => {
    if (currentCategory === category) return;
    setIsAnimating(true);
    setCurrentCategory(category);
    setCurrentIndex(0);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate products every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 6000);
    
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating, categoryProducts.length]);

  // Define animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    })
  };
  
  const [swipeDirection, setSwipeDirection] = useState<number>(0);

  // Emoji rotation animation
  const emojiVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  // Background bubble animation
  const bubbleVariants = {
    animate: {
      y: [0, -10, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <section className="py-16 relative overflow-hidden" 
      style={{ 
        background: categoryBackgrounds[currentCategory],
        transition: "background 0.5s ease-in-out"
      }}
    >
      {/* Animated background bubbles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            variants={bubbleVariants}
            animate="animate"
            custom={i}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <motion.h2 
            className="text-4xl text-indigo-900 font-bold mb-2 font-navigation jua-regular"
            animate={{ scale: [1, 1.03, 1], transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-indigo-700 max-w-2xl mx-auto nunito-sans text-lg"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Kid-friendly Category Tabs */}
        <motion.div 
          className="flex justify-center mb-10"
          variants={itemVariants}
        >
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-4 transform transition-all duration-200 ${
                currentCategory === 'ramen' 
                  ? 'bg-yellow-400 text-indigo-900 border-yellow-600 shadow-[0_8px_0_rgb(202,138,4)] hover:shadow-[0_4px_0px_rgb(202,138,4)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('ramen')}
            >
              <motion.span 
                className="inline-block"
                variants={emojiVariants}
                whileHover="hover"
              >
                🍜
              </motion.span>{" "}
              Ramen
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-4 transform transition-all duration-200 ${
                currentCategory === 'ice-cream' 
                  ? 'bg-pink-400 text-indigo-900 border-pink-600 shadow-[0_8px_0_rgb(219,39,119)] hover:shadow-[0_4px_0px_rgb(219,39,119)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('ice-cream')}
            >
              <motion.span 
                className="inline-block"
                variants={emojiVariants}
                whileHover="hover"
              >
                🍦
              </motion.span>{" "}
              Ice Cream
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 font-bold text-lg font-navigation jua-regular cursor-pointer rounded-full border-4 transform transition-all duration-200 ${
                currentCategory === 'hotdog' 
                  ? 'bg-red-400 text-indigo-900 border-red-600 shadow-[0_8px_0_rgb(220,38,38)] hover:shadow-[0_4px_0px_rgb(220,38,38)] hover:translate-y-1' 
                  : 'bg-white text-indigo-900 border-indigo-300 shadow-[0_8px_0_rgb(165,180,252)] hover:shadow-[0_4px_0px_rgb(165,180,252)] hover:translate-y-1 hover:bg-indigo-50'
              }`}
              onClick={() => switchCategory('hotdog')}
            >
              <motion.span 
                className="inline-block"
                variants={emojiVariants}
                whileHover="hover"
              >
                🌭
              </motion.span>{" "}
              Hotdog
            </motion.button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div 
          className="relative max-w-4xl mx-auto"
          variants={itemVariants}
        >
          {/* Current product */}
          {categoryProducts.length > 0 ? (
            <motion.div 
              className="overflow-hidden rounded-3xl shadow-2xl bg-white bg-opacity-50 backdrop-blur-sm"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence custom={swipeDirection} initial={false} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={swipeDirection}
                  variants={cardVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col md:flex-row"
                >
                  <motion.div 
                    className="md:w-1/2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none">
                      <motion.img
                        src={categoryProducts[currentIndex].imageUrl}
                        alt={categoryProducts[currentIndex].name}
                        className="w-full h-full object-cover"
                        layoutId={`image-${currentIndex}`}
                        initial={{ opacity: 0.8, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  </motion.div>
                  <motion.div 
                    className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mb-4"
                    >
                      <motion.span className="inline-block bg-indigo-900 text-white px-4 py-1 rounded-full text-sm font-bold mb-2 nunito-sans">
                        FAVORITE
                      </motion.span>
                    </motion.div>
                    <motion.h3 
                      className="text-2xl text-indigo-900 font-bold mb-2 font-navigation jua-regular"
                      layoutId={`title-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      {categoryProducts[currentIndex].name}
                    </motion.h3>
                    <motion.p 
                      className="text-indigo-700 mb-6 nunito-sans"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      {categoryProducts[currentIndex].description}
                    </motion.p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-10 bg-white rounded-lg shadow"
              variants={itemVariants}
            >
              <p className="text-gray-500">No products available in this category.</p>
            </motion.div>
          )}

          {/* Bottom navigation controls */}
          {categoryProducts.length > 1 && (
            <motion.div 
              className="flex items-center justify-center mt-6 space-x-4"
              variants={itemVariants}
            >
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#E5E7EB" }}
                whileTap={{ scale: 0.9, backgroundColor: "#D1D5DB" }}
                onClick={() => {
                  setSwipeDirection(-1);
                  handlePrevious();
                }}
                className="bg-white hover:bg-gray-100 rounded-2xl p-3 shadow-lg transform transition-all duration-200 border-l-2 border-b-4 border-indigo-300 active:border-b-2 active:translate-y-0.5 cursor-pointer"
                aria-label="Previous product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              {/* Indicator showing current position */}
              <motion.div 
                className="bg-indigo-900 bg-opacity-80 backdrop-blur-sm rounded-full px-6 py-2 text-white text-sm font-navigation jua-regular"
                whileHover={{ scale: 1.1 }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {currentIndex + 1} / {categoryProducts.length}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "#E5E7EB" }}
                whileTap={{ scale: 0.9, backgroundColor: "#D1D5DB" }}
                onClick={() => {
                  setSwipeDirection(1);
                  handleNext();
                }}
                className="bg-white hover:bg-gray-100 rounded-2xl p-3 shadow-lg transform transition-all duration-200 border-r-2 border-b-4 border-indigo-300 active:border-b-2 active:translate-y-0.5 cursor-pointer"
                aria-label="Next product"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BestSellers;
