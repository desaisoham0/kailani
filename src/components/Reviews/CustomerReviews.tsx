import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Review {
  id: number;
  author: string;
  avatar?: string;
  rating: number; // 1-5
  text: string;
  date: string;
  source: 'google' | 'yelp' | 'tripadvisor'; // Where the review comes from
}

interface CustomerReviewsProps {
  reviews: Review[];
  title?: string;
  subtitle?: string;
}

const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  title = "Customer Reviews",
  subtitle = "See what our customers say about us"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  // Source icons
  const sourceIcons = {
    google: (
      <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    yelp: (
      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.16 12.5c-.77-.7-1.54-1.4-2.31-2.1-.33-.3-.65-.59-.98-.89-.2-.18-.31-.43-.28-.7.04-.37.27-.63.59-.77.36-.15.72-.3 1.08-.45l4.28-1.75c.92-.38 1.24-1.36.72-2.18-.47-.74-1.39-.93-2.5-.05L16.29 6.4c-.47.37-.94.74-1.42 1.1-.26.2-.52.25-.84.13-.37-.14-.61-.42-.62-.81-.03-.74-.04-1.49-.06-2.23l-.06-3.5c-.02-1.02-.73-1.73-1.75-1.75-1.03-.02-1.75.7-1.78 1.72-.07 2.11-.13 4.22-.19 6.33 0 .14-.01.27-.03.4-.04.39-.22.7-.57.87-.36.18-.71.14-1.03-.07-.25-.16-.5-.33-.74-.5l-5.3-3.6C.68 3.22-.24 3.37.06 4.84l1.71 7.45c.15.66.36 1.32.54 1.98.15.52.56.82 1.1.82.52 0 .92-.29 1.09-.8.07-.21.13-.43.19-.64.11-.36.23-.71.36-1.08.15.15.27.28.39.4l3.41 3.19c.23.21.45.42.68.62.49.43 1.06.46 1.58.07.5-.38.7-.93.48-1.48-.08-.2-.17-.39-.26-.58-.28-.57-.55-1.15-.83-1.72.19-.08.34-.15.49-.2 2.82-.92 5.65-1.84 8.47-2.76.56-.18.93-.65.97-1.3.05-.83-.39-1.35-1.17-1.31zM6.05 13.07l-1.74-.93c-.24-.14-.42-.34-.47-.64l-.88-4.12 3.09 2.13zm4.32 3.25l-4.08-3.85 3.95-1.32 1.4 2.94-.38.84c-.13.29-.34.51-.62.6-.1.04-.22.03-.27.79zm2.92-8.41c-.01.79-.01 1.56 0 2.35.03 1.19.95 1.93 2.13 1.6 1.32-.37 2.63-.75 3.95-1.12.19-.05.45-.1.57-.23.17-.18.28-.45.36-.7.07-.24-.07-.39-.24-.48-.74-.41-1.47-.83-2.21-1.25l-3.28-1.86c-.27-.15-.5-.14-.76 0-.28.16-.48.4-.52.69z" />
      </svg>
    ),
    tripadvisor: (
      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        <circle cx="7" cy="12" r="1.5"/>
        <circle cx="17" cy="12" r="1.5"/>
      </svg>
    )
  };

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Variants for animation
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    })
  };

  const backgroundPatterns = [
    "radial-gradient(circle at 10% 20%, rgba(216, 241, 230, 0.46) 0.1%, rgba(233, 226, 226, 0.28) 90.1%)",
    "linear-gradient(120deg, rgba(249, 244, 235, 0.6) 0%, rgba(248, 247, 216, 0.6) 100%)",
    "linear-gradient(120deg, rgba(240, 235, 253, 0.6) 0%, rgba(233, 251, 255, 0.6) 100%)"
  ];

  // Auto-scroll interval (uncomment to enable auto-scroll)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     handleNext();
  //   }, 5000);
  //   
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <section className="py-16 relative overflow-hidden bg-gradient-to-br from-white to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300 rounded-full opacity-20 translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
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

        <div className="flex flex-col items-center">
          {/* Review carousel */}
          <div className="w-full max-w-4xl overflow-hidden">
            <AnimatePresence custom={direction} initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                {reviews[currentIndex] && (
                  <div className="mx-4">
                    <div 
                      className="p-8 md:p-12 rounded-2xl shadow-lg relative"
                      style={{ 
                        background: backgroundPatterns[currentIndex % backgroundPatterns.length],
                        borderRadius: "2rem",
                        position: "relative"
                      }}
                    >
                      {/* Speech bubble arrow */}
                      <div 
                        className="absolute w-8 h-8 rotate-45"
                        style={{
                          bottom: "-1rem",
                          left: "3rem",
                          background: backgroundPatterns[currentIndex % backgroundPatterns.length],
                          zIndex: -1
                        }}
                      ></div>
                    
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {sourceIcons[reviews[currentIndex].source]}
                          </motion.div>
                          <div>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              <StarRating rating={reviews[currentIndex].rating} />
                            </motion.div>
                            <motion.span 
                              className="text-sm text-gray-600 nunito-sans"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              {reviews[currentIndex].date}
                            </motion.span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <motion.blockquote
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <p className="text-lg text-gray-700 italic nunito-sans leading-relaxed">
                            "{reviews[currentIndex].text}"
                          </p>
                        </motion.blockquote>
                      </div>
                    </div>
                    
                    {/* Author info below the speech bubble */}
                    <div className="flex items-center mt-6 ml-8">
                      <motion.div 
                        className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        {reviews[currentIndex].avatar ? (
                          <img 
                            src={reviews[currentIndex].avatar} 
                            alt={reviews[currentIndex].author} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          reviews[currentIndex].author.charAt(0)
                        )}
                      </motion.div>
                      <motion.div 
                        className="ml-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <h3 className="text-xl font-bold text-gray-900 font-navigation jua-regular">
                          {reviews[currentIndex].author}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">Verified Customer</span>
                          {reviews[currentIndex].source === 'google' && (
                            <span className="flex items-center ml-2 text-sm text-blue-600 hover:underline">
                              <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              via Google
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="flex justify-center mt-8 gap-4">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#E5E7EB" }}
              whileTap={{ scale: 0.9, backgroundColor: "#D1D5DB" }}
              onClick={handlePrevious}
              className="bg-white p-3 rounded-full shadow-lg border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-200"
              aria-label="Previous review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            {/* Indicators */}
            <div className="flex items-center gap-2 px-4">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 
                    ${currentIndex === i 
                      ? 'bg-indigo-600 w-8' 
                      : 'bg-indigo-300 hover:bg-indigo-400'}`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#E5E7EB" }}
              whileTap={{ scale: 0.9, backgroundColor: "#D1D5DB" }}
              onClick={handleNext}
              className="bg-white p-3 rounded-full shadow-lg border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-200"
              aria-label="Next review"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
          
          {/* Link to Google Reviews and overall rating */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center"
          >
            {/* Overall Rating Display */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-md mb-6">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-indigo-900">4.9</div>
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="text-sm text-gray-600">Average rating</div>
              </div>
              
              <div className="h-12 border-l border-gray-300 hidden sm:block"></div>
              
              <div className="flex flex-col">
                <span className="text-gray-700">Based on <strong>177 reviews</strong></span>
                <div className="flex items-center">
                  {sourceIcons.google}
                  <span className="ml-1 text-sm text-gray-600">Google Reviews</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.google.com/search?gs_ssp=eJzj4tVP1zc0LMnIK0hPycgyYLRSNaiwsEw2SjNMTDUySjFOTTY1tDKoMDVMMzEzMUs2S002STYyMPISzE7MzEnMy1QozkgsS1XITE4FAB2hFiQ&q=kailani+shave+ice&oq=kailani+&gs_lcrp=EgZjaHJvbWUqFQgBEC4YJxivARjHARiABBiKBRiOBTIPCAAQIxgnGOMCGIAEGIoFMhUIARAuGCcYrwEYxwEYgAQYigUYjgUyBggCEEUYOTIHCAMQABiABDINCAQQLhivARjHARiABDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDIyNjVqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8#lrd=0x89c2f1ae22d3ec51:0x51f4646c6ec4c202,3,,,,"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-full transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                {sourceIcons.google}
                <span>Leave us a Google Review</span>
              </a>
              
              <a
                href="https://maps.app.goo.gl/KWjLfCxkkYvf7qYh8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-indigo-600 border-2 border-indigo-600 py-3 px-6 rounded-full transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Find us on Google Maps</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
