# Admin Panel Usage Guide

This document provides an overview of how to use the admin panel for managing food items on the Kailani Restaurant website.

## Accessing the Admin Panel

1. Navigate to `/admin/login` in your browser
2. Log in with your administrator credentials
3. You will be redirected to `/admin/dashboard` upon successful authentication

## Managing Food Items

The admin dashboard allows you to:

### View All Food Items

- All food items are displayed in a table with their details
- You can see the image, name, category, favorite status, and creation date
- Items are sorted by creation date (newest first)

### Add New Food Items

1. Click the "Add Food Item" tab
2. Fill in the required fields:
   - Name
   - Description
   - Category (from the dropdown)
   - Choose whether it's a "favorite" item
   - Upload an image (PNG, JPG, or GIF up to 5MB)
3. Click "Save Food Item"

### Edit Food Items

1. In the food items list, click "Edit" for the item you want to modify
2. Make your changes in the form
3. Click "Update Food Item"
4. The image is optional when editing – if you don't upload a new one, the existing image will remain

### Delete Food Items

1. In the food items list, click "Delete" for the item you want to remove
2. Confirm the deletion when prompted
3. The food item and its associated image will be permanently deleted

## Security Notes

- Only authenticated administrators can access the admin panel
- Food images are stored in Firebase Storage
- Food data is stored in Firestore Database
- The Admin panel uses protected routes that require authentication

## Best Practices

1. Use descriptive names and detailed descriptions
2. Choose appropriate categories
3. Mark special items as favorites to feature them prominently
4. Use high-quality, appealing food images
5. Remember to log out when finished

## Data Structure

Food items follow this structure:
- Name: The name of the food item
- Description: Detailed description of the food item
- Category: The category the food belongs to
- Favorite: Boolean indicating if it's a featured item
- Image: A photo of the food item
