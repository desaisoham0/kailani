import { Suspense, lazy, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { RestaurantHeader } from './components/Restaurant/RestaurantHeader';
import BestSellers from './components/BestSellers/BestSellers';
import HomeFoodGallery from './components/Food/HomeFoodGallery';
import CustomerReviews from './components/Reviews/CustomerReviews';
import KailaniFooter from './components/Footer/KailaniFooter';
import BackToTopButton from './components/UI/BackToTopButton';
import FloatingOrderButton from './components/UI/FloatingOrderButton';
import { AuthProvider } from './contexts/AuthContext';
import { CacheProvider } from './contexts/CacheContext';
import OffersDisplay from './components/Offers/OffersDisplay';
import ErrorBoundary from './components/ErrorBoundary';

const JobsPage = lazy(() => import('./pages/JobsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminProtectedRoute = lazy(
  () => import('./pages/admin/AdminProtectedRoute')
);
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  const [restaurantName] = useState('KAILANI');
  return (
    <ErrorBoundary>
      <CacheProvider>
        <AuthProvider>
          <Router>
            <div className="flex min-h-screen w-full max-w-full flex-col overflow-x-hidden">
              {/* Restaurant Header (responsive for both mobile and desktop) */}
              <RestaurantHeader restaurantName={restaurantName} />

              <BackToTopButton />
              <FloatingOrderButton />

              <Routes>
                <Route
                  path="/"
                  element={
                    <main className="flex w-full max-w-full flex-grow flex-col overflow-x-hidden">
                      {/* Best Sellers Showcase - Now loading from Firebase */}
                      <BestSellers title="We proudly serve" />

                      {/* Special Offers & Upcoming Items - Conditionally renders if there are active offers */}
                      <OffersDisplay />

                      {/* Food Gallery Preview - Now loading from Firebase */}
                      <HomeFoodGallery
                        title="Food Gallery"
                        subtitle="Take a peek at our mouthwatering creations"
                        maxImages={6}
                      />

                      {/* Customer Reviews - Featured Section */}
                      <CustomerReviews
                        title="Google Reviews"
                        subtitle="See what our customers are saying about us on Google"
                      />
                    </main>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <JobsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/menu"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <GalleryPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <AboutPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <ContactPage />
                    </Suspense>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <div className="container mx-auto flex-grow px-4 py-12">
                      <h1 className="mb-8 text-center text-4xl font-bold">
                        Customer Testimonials
                      </h1>
                      <CustomerReviews
                        title=""
                        subtitle="All of our Google reviews in one place"
                      />
                      <div className="mt-8 flex justify-center">
                        <a
                          href="https://g.page/review/kailani-restaurant"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition duration-300 hover:bg-blue-700"
                        >
                          Write a Review on Google
                        </a>
                      </div>
                    </div>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/login"
                  element={
                    <Suspense fallback={<div>Loading...</div>}>
                      <AdminLogin />
                    </Suspense>
                  }
                />

                {/* Direct admin dashboard route for debugging */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <Suspense fallback={<div>Loading admin...</div>}>
                      <AdminProtectedRoute />
                    </Suspense>
                  }
                >
                  <Route
                    index
                    element={
                      <Suspense fallback={<div>Loading dashboard...</div>}>
                        <AdminDashboard />
                      </Suspense>
                    }
                  />
                </Route>

                {/* Redirect /admin to /admin/dashboard */}
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Routes>

              <KailaniFooter restaurantName={restaurantName} />
            </div>
          </Router>
        </AuthProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default App;
