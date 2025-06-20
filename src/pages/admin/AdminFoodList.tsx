import { useState, useEffect } from 'react';
import { getAllFoodItems, deleteFoodItem, type FoodItem } from '../../firebase/foodService';
import type { Timestamp } from 'firebase/firestore';

interface AdminFoodListProps {
  onEditFood: (foodId: string) => void;
}

export default function AdminFoodList({ onEditFood }: AdminFoodListProps) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await getAllFoodItems();
      setFoodItems(items);
    } catch (err) {
      setError('Failed to load food items. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setDeleteInProgress(id);
      await deleteFoodItem(id);
      setFoodItems(foodItems.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete the item. Please try again.');
      console.error(err);
    } finally {
      setDeleteInProgress(null);
    }
  };

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading food items...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">{error}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={() => fetchFoodItems()}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
              >
                <span className="sr-only">Retry</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (foodItems.length === 0) {
    return (
      <div className="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No food items</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new food item.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Image</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Favorite</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {foodItems.map((food) => (
            <tr key={food.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                {food.imageUrl ? (
                  <img 
                    src={food.imageUrl} 
                    alt={food.name} 
                    className="h-12 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-12 w-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{food.name}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{food.category}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {food.favorite ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    No
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDate(food.createdAt)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={() => onEditFood(food.id!)}
                    className="text-blue-600 hover:text-blue-900 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFoodItem(food.id!)}
                    disabled={deleteInProgress === food.id}
                    className={`text-red-600 hover:text-red-900 ${
                      deleteInProgress === food.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {deleteInProgress === food.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
