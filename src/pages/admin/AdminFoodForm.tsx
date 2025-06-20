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
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-3 text-blue-600 font-medium">Loading food item...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">
        {isEditMode ? 'Edit Food Item' : 'Add New Food Item'}
      </h3>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-md p-4 text-sm text-red-700 animate-pulse">
          <div className="flex">
            <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200"
              placeholder="Enter food name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
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
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md transition-colors duration-200"
            placeholder="Enter a detailed description of the food item"
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <input
              id="favorite"
              name="favorite"
              type="checkbox"
              checked={formData.favorite}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200 cursor-pointer"
            />
            <label htmlFor="favorite" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer">
              Feature as a favorite item
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-8">Featured items will be displayed prominently on the website.</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Food Image {isEditMode ? '' : <span className="text-red-500">*</span>}
          </label>
          
          <div className="mt-2">
            {imagePreview && (
              <div className="mb-4 relative group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-auto object-cover rounded-md shadow-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-200 rounded-md">
                  <p className="text-white opacity-0 group-hover:opacity-100 font-medium">Current image</p>
                </div>
              </div>
            )}
            
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors duration-200 cursor-pointer">
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
                <div className="flex text-sm text-gray-600 justify-center">
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
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onComplete}
            className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-[0_4px_0_rgb(203,213,225)] hover:shadow-[0_2px_0_rgb(203,213,225)] hover:translate-y-1 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 shadow-[0_6px_0_rgb(29,78,216)] hover:shadow-[0_3px_0_rgb(29,78,216)] hover:translate-y-1 transition-all duration-200 cursor-pointer"
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
  );
}
