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
  };

  const handleFoodFormComplete = () => {
    setEditingFoodId(null);
    setActiveTab('food-list');
  };
  
  const handleEditReview = (reviewId: string) => {
    setEditingReviewId(reviewId);
    setActiveTab('reviews-add');
  };

  const handleReviewFormComplete = () => {
    setEditingReviewId(null);
    setActiveTab('reviews-list');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Kailani Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'food-list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('food-list')}
              >
                Food Items
              </button>
              <button
                className={`${
                  activeTab === 'food-add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => {
                  setEditingFoodId(null);
                  setActiveTab('food-add');
                }}
              >
                {editingFoodId && activeTab === 'food-add' ? 'Edit Food Item' : 'Add Food Item'}
              </button>
              <button
                className={`${
                  activeTab === 'reviews-list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('reviews-list')}
              >
                Reviews
              </button>
              <button
                className={`${
                  activeTab === 'reviews-add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => {
                  setEditingReviewId(null);
                  setActiveTab('reviews-add');
                }}
              >
                {editingReviewId && activeTab === 'reviews-add' ? 'Edit Review' : 'Add Review'}
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
