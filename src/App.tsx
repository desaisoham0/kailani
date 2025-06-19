import { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RestaurantHeader } from './components/Restaurant/RestaurantHeader';
import BestSellers from './components/BestSellers/BestSellers';
import HomeFoodGallery from './components/Food/HomeFoodGallery';
import CustomerReviews from './components/Reviews/CustomerReviews';
import KailaniFooter from './components/Footer/KailaniFooter';
import BackToTopButton from './components/UI/BackToTopButton';
import FloatingOrderButton from './components/UI/FloatingOrderButton';
import { customerReviews } from './data/reviews';
import { AuthProvider } from './contexts/AuthContext';

const JobsPage = lazy(() => import('./pages/JobsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminProtectedRoute = lazy(() => import('./pages/admin/AdminProtectedRoute'));
// Import AdminDashboard directly since it's used inside the protected route
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [restaurantName] = useState('KAILANI');
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden">
          {/* Restaurant Header (responsive for both mobile and desktop) */}
          <RestaurantHeader restaurantName={restaurantName} />
          
          <BackToTopButton />
          <FloatingOrderButton />
          
          <Routes>
            <Route path="/" element={
            <main className="w-full max-w-full flex-grow flex flex-col overflow-x-hidden">

              {/* Best Sellers Showcase - Now loading from Firebase */}
              <BestSellers 
                title="We proudly serve"
              />
              
              {/* Food Gallery Preview - Now loading from Firebase */}
              <HomeFoodGallery 
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
          <Route path="/jobs" element={<Suspense fallback={<div>Loading...</div>}><JobsPage /></Suspense>} />
          <Route path="/gallery" element={<Suspense fallback={<div>Loading...</div>}><GalleryPage /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<div>Loading...</div>}><AboutPage /></Suspense>} />
          <Route path="/contact" element={<Suspense fallback={<div>Loading...</div>}><ContactPage /></Suspense>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Suspense fallback={<div>Loading...</div>}><AdminLogin /></Suspense>} />
          
          {/* Direct admin dashboard route for debugging */}
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<div>Loading admin...</div>}>
              <AdminProtectedRoute />
            </Suspense>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>
          
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
        
        <KailaniFooter restaurantName={restaurantName} />
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;