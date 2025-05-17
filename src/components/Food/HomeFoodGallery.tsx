import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { GalleryImage } from './FoodGallery';

interface HomeFoodGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
  maxImages?: number;
}

const HomeFoodGallery: React.FC<HomeFoodGalleryProps> = ({
  images,
  title = "Food Gallery",
  subtitle = "A glimpse of our delicious creations",
  maxImages = 6
}) => {
  // Take only the specified number of images
  const displayImages = images.slice(0, maxImages);
  
  // Animation variants
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
    show: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  return (
    <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)" }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-500 opacity-10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              x: [0, Math.random() * 8 - 4, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3 font-navigation jua-regular text-indigo-900"
            animate={{ 
              scale: [1, 1.03, 1],
              transition: { duration: 2, repeat: Infinity, repeatType: "reverse" } 
            }}
          >
            {title}
          </motion.h2>
          <p className="text-lg text-indigo-700 max-w-2xl mx-auto nunito-sans mb-2">{subtitle}</p>
          <Link to="/gallery" className="inline-block text-indigo-600 hover:text-indigo-800 font-bold nunito-sans underline underline-offset-2 mt-2">
            View full gallery →
          </Link>
        </motion.div>

        {/* Image gallery grid with masonry-like layout */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {displayImages.map((image, index) => {
            // Create different sized images for visual interest
            const isLarge = index % 3 === 0;
            const isWide = index % 5 === 3;
            
            let spanClasses = "col-span-1";
            if (isLarge) {
              spanClasses = "row-span-2 col-span-1 md:row-span-2";
            } else if (isWide) {
              spanClasses = "col-span-2 md:col-span-2";
            }

            return (
              <motion.div
                key={image.id}
                className={`${spanClasses} overflow-hidden rounded-xl shadow-lg relative group`}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.3 } }}
              >
                <Link to="/gallery" className="block relative h-full">
                  <div className={`${isLarge ? 'aspect-[3/4]' : isWide ? 'aspect-[16/9]' : 'aspect-square'} relative`}>
                    <motion.img
                      src={image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Overlay with title */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-white font-bold font-navigation jua-regular text-lg mb-1">{image.title}</h3>
                        <span className="inline-block bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">{image.category}</span>
                      </motion.div>
                    </div>
                    
                    {/* Playful corner decoration */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-bl-xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center transform rotate-12">
                      <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6 text-white"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </motion.svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* View All Button */}
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/gallery">
            <motion.button 
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-lg shadow-lg 
                transform transition-all duration-300 border-4 border-indigo-700 font-navigation jua-regular"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)", 
                y: -5 
              }}
              whileTap={{ scale: 0.95 }}
            >
              View Full Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeFoodGallery;
