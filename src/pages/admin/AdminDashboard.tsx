import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../firebase/authService';
import { useAuth } from '../../contexts/AuthContext';
import AdminFoodList from './AdminFoodList';
import AdminFoodForm from './AdminFoodForm';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
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
    setActiveTab('add');
  };

  const handleFormComplete = () => {
    setEditingFoodId(null);
    setActiveTab('list');
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
                  activeTab === 'list'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('list')}
              >
                Food Items
              </button>
              <button
                className={`${
                  activeTab === 'add'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => {
                  setEditingFoodId(null);
                  setActiveTab('add');
                }}
              >
                {editingFoodId ? 'Edit Food Item' : 'Add Food Item'}
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'list' ? (
              <AdminFoodList onEditFood={handleEditFood} />
            ) : (
              <AdminFoodForm 
                foodId={editingFoodId} 
                onComplete={handleFormComplete} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
