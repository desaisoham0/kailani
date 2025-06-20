import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../firebase/authService';
import { useAuth } from '../../hooks/useAuth';
import AdminFoodList from './AdminFoodList';
import AdminFoodForm from './AdminFoodForm';
import AdminReviews from './AdminReviews';
import AdminReviewForm from './AdminReviewForm';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'food-list' | 'food-add' | 'reviews-list' | 'reviews-add'>('food-list');
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/admin/login');
    }
  }, [currentUser, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleEditFood = (foodId: string) => {
    setEditingFoodId(foodId);
    setActiveTab('food-add');
    setIsMobileMenuOpen(false);
  };

  const handleFoodFormComplete = () => {
    setEditingFoodId(null);
    setActiveTab('food-list');
  };
  
  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId);
    setActiveTab('reviews-add');
    setIsMobileMenuOpen(false);
  };

  const handleReviewFormComplete = () => {
    setEditingReviewId(null);
    setActiveTab('reviews-list');
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Define navigation items
  const navItems = [
    {
      id: 'food-list' as const,
      label: 'Food Items',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      ),
      onClick: () => {},
    },
    {
      id: 'food-add' as const,
      label: editingFoodId && activeTab === 'food-add' ? 'Edit Food Item' : 'Add Food Item',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      onClick: () => setEditingFoodId(null),
    },
    {
      id: 'reviews-list' as const,
      label: 'Reviews',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      ),
      onClick: () => {},
    },
    {
      id: 'reviews-add' as const,
      label: editingReviewId && activeTab === 'reviews-add' ? 'Edit Review' : 'Add Review',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      ),
      onClick: () => setEditingReviewId(null),
    },
  ];

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'food-list':
        return <AdminFoodList onEditFood={handleEditFood} />;
      case 'food-add':
        return <AdminFoodForm foodId={editingFoodId} onComplete={handleFoodFormComplete} />;
      case 'reviews-list':
        return <AdminReviews onEditReview={handleEditReview} />;
      case 'reviews-add':
        return <AdminReviewForm reviewId={editingReviewId} onComplete={handleReviewFormComplete} />;
      default:
        return <AdminFoodList onEditFood={handleEditFood} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 md:hidden rounded-md p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Kailani Admin
              </h1>
            </div>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-[0_6px_0_rgb(185,28,28)] hover:shadow-[0_3px_0_rgb(185,28,28)] hover:translate-y-1 transition-all duration-200 cursor-pointer"
              aria-label="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg z-20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${
                  activeTab === item.id
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center w-full px-3 py-3 text-left text-sm font-medium rounded-md transition-all cursor-pointer`}
                onClick={() => {
                  handleTabChange(item.id);
                  item.onClick();
                }}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* Desktop side navigation */}
        <div className="hidden md:block md:w-64 bg-white shadow-md h-[calc(100vh-65px)] sticky top-[65px]">
          <div className="px-6 pt-6 pb-3">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Dashboard</h2>
          </div>
          <nav className="space-y-1 px-3 pb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`${
                  activeTab === item.id
                    ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center w-full px-3 py-3 text-left text-sm font-medium rounded-md transition-all duration-200 hover:translate-x-1 cursor-pointer`}
                onClick={() => {
                  handleTabChange(item.id);
                  item.onClick();
                }}
              >
                <span className={`mr-3 ${activeTab === item.id ? 'text-blue-500' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:hidden border-b border-gray-200 mb-4 pb-1">
            <h2 className="text-xl font-medium text-gray-800">
              {navItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
