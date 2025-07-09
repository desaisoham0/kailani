// Food categories used throughout the application
export const foodCategories = [
  'Ramen',
  'Shave Ice',
  'Homemade Ice Cream',
  'Soft Serve',
  'Hot Dogs',
  'Musubi',
];

// Helper function to get food items by category from the database
export const getCategoryDisplay = (category: string): string => {
  // You could have custom display names here if needed
  return category;
};
