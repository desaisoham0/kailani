import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import {
  getAllFoodItems,
  deleteFoodItem,
  type FoodItem,
} from '../../firebase/foodService';
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
    } catch {
      setError('Failed to load food items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFoodItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setDeleteInProgress(id);
      await deleteFoodItem(id);
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch {
      setError('Failed to delete the item. Please try again.');
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
      <div className="flex items-center justify-center py-16">
        <div
          className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"
          aria-hidden="true"
        />
        <span className="ml-3" role="status" aria-live="polite">
          Loading food items...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
        <div className="flex items-start gap-3">
          <svg
            className="h-5 w-5 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchFoodItems}
            className="cursor-pointer rounded-2xl px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (foodItems.length === 0) {
    return (
      <div className="py-10 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No food items
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new food item.
        </p>
      </div>
    );
  }

  return (
    <Transition
      as={Fragment}
      appear
      show
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 -translate-y-1"
      enterTo="opacity-100 translate-y-0"
    >
      <div className="overflow-x-auto rounded-2xl shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
          <h2 className="text-sm font-semibold text-gray-900">Food items</h2>
          <button
            type="button"
            onClick={fetchFoodItems}
            className="inline-flex cursor-pointer items-center rounded-2xl px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition ring-inset hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Refresh list"
          >
            Refresh
          </button>
        </div>

        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pr-3 pl-4 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:pl-6"
                >
                  Image
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase sm:table-cell"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase lg:table-cell"
                >
                  Favorite
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-700 uppercase lg:table-cell"
                >
                  Created
                </th>
                <th scope="col" className="py-3.5 pr-4 pl-3 text-right sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {foodItems.map(food => (
                <tr key={food.id} className="hover:bg-gray-50">
                  <td className="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
                    {food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        alt={food.name}
                        className="h-12 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-16 items-center justify-center rounded bg-gray-200">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    <span className="block max-w-[18ch] truncate sm:max-w-[28ch]">
                      {food.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-gray-500 sm:hidden">
                      {food.category}
                    </span>
                  </td>
                  <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell">
                    {food.category}
                  </td>
                  <td className="hidden px-3 py-4 text-sm whitespace-nowrap lg:table-cell">
                    {food.favorite ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 lg:table-cell">
                    {formatDate(food.createdAt)}
                  </td>
                  <td className="py-4 pr-4 pl-3 text-right text-sm whitespace-nowrap sm:pr-6">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEditFood(food.id!)}
                        className="cursor-pointer rounded-2xl px-3 py-1.5 font-medium text-blue-600 shadow-sm ring-1 ring-blue-200 transition ring-inset hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFoodItem(food.id!)}
                        disabled={deleteInProgress === food.id}
                        className={`rounded-2xl px-3 py-1.5 font-medium text-red-600 shadow-sm ring-1 ring-red-200 transition ring-inset hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none ${
                          deleteInProgress === food.id
                            ? 'cursor-not-allowed opacity-50 hover:bg-transparent'
                            : 'cursor-pointer'
                        }`}
                        aria-busy={deleteInProgress === food.id}
                        aria-disabled={deleteInProgress === food.id}
                      >
                        {deleteInProgress === food.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Transition>
  );
}
