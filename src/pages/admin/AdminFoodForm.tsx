import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { 
  addFoodItem, 
  updateFoodItem, 
  type FoodItem,
} from '../../firebase/foodService';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { foodCategories } from '../../data/categories';

interface AdminFoodFormProps {
  foodId: string | null;
  onComplete: () => void;
}

export default function AdminFoodForm({ foodId, onComplete }: AdminFoodFormProps) {
  const [formData, setFormData] = useState<Omit<FoodItem, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    category: '',
    favorite: false,
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  // Categories are imported at the top of the file

  useEffect(() => {
    if (foodId) {
      setIsEditMode(true);
      fetchFoodItem(foodId);
    } else {
      resetForm();
      setIsEditMode(false);
    }
  }, [foodId]);

  const fetchFoodItem = async (id: string) => {
    try {
      setFetchLoading(true);
      const foodRef = doc(db, 'food-items', id);
      const foodDoc = await getDoc(foodRef);
      
      if (foodDoc.exists()) {
        const foodData = foodDoc.data() as Omit<FoodItem, 'id'>;
        setFormData({
          name: foodData.name || '',
          description: foodData.description || '',
          category: foodData.category || '',
          favorite: foodData.favorite || false,
          imageUrl: foodData.imageUrl || ''
        });
        
        if (foodData.imageUrl) {
          setImagePreview(foodData.imageUrl);
        }
      } else {
        setError('Food item not found');
      }
    } catch (err) {
      setError('Failed to load food item');
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      favorite: false,
      imageUrl: ''
    });
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'favorite' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      setLoading(true);
      
      if (isEditMode && foodId) {
        await updateFoodItem(foodId, formData, imageFile);
      } else {
        await addFoodItem(formData, imageFile);
      }
      
      resetForm();
      onComplete();
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'add'} food item. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading food item...</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
        </h3>
        
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Food Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select a category</option>
                {foodCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <div className="flex items-center">
              <input
                id="favorite"
                name="favorite"
                type="checkbox"
                checked={formData.favorite}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="favorite" className="ml-2 block text-sm text-gray-900">
                Feature as a favorite item
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Food Image {isEditMode ? '' : '*'}
            </label>
            
            {imagePreview && (
              <div className="mt-2 mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-auto object-cover rounded-md"
                />
              </div>
            )}
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      accept="image/*"
                      required={!isEditMode && !imagePreview}
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onComplete}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEditMode ? 'Update Food Item' : 'Save Food Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
