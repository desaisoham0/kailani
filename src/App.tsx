import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RestaurantHeader } from './components/Restaurant/RestaurantHeader';
import { useState } from 'react';
import JobsPage from './pages/JobsPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BestSellers from './components/BestSellers/BestSellers';
import HomeFoodGallery from './components/Food/HomeFoodGallery';
import CustomerReviews from './components/Reviews/CustomerReviews';
import KailaniFooter from './components/Footer/KailaniFooter';
import BackToTopButton from './components/UI/BackToTopButton';
import FloatingOrderButton from './components/UI/FloatingOrderButton';
import { bestSellerProducts } from './data/bestSellerProducts';
import { galleryImages } from './data/galleryImages';
import { customerReviews } from './data/reviews';

function App() {
  // Using a simple name for the restaurant
  const [restaurantName] = useState('KAILANI');
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Restaurant Header (responsive for both mobile and desktop) */}
        <RestaurantHeader restaurantName={restaurantName} />
        
        <BackToTopButton />
        <FloatingOrderButton />
        
        <Routes>
          <Route path="/" element={
            <main className="w-full flex-grow flex flex-col">

              {/* Best Sellers Showcase */}
              <BestSellers 
                products={bestSellerProducts}
                title="Customers Favorites"
                subtitle="Explore our yummy food adventures!"
              />
              
              {/* Food Gallery Preview */}
              <HomeFoodGallery 
                images={galleryImages}
                title="Our Food Gallery" 
                subtitle="Take a peek at our mouthwatering creations"
                maxImages={6}
              />
              
              {/* Customer Reviews */}
              <CustomerReviews 
                reviews={customerReviews}
                title="What Our Customers Say"
                subtitle="Read reviews from our happy customers"
              />
            </main>
          } />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        
        <KailaniFooter restaurantName={restaurantName} />
      </div>
    </Router>
  );
}

export default App;