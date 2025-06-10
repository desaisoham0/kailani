import React from 'react';
import FoodGallery from '../components/Food/FoodGallery';
import { galleryImages } from '../data/galleryImages';

const GalleryPage: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen bg-stone-50 w-full max-w-full overflow-x-hidden">
      <FoodGallery 
        images={galleryImages}
      />
      
      <div className="py-12 px-4 bg-stone-100 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-4xl w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-navigation jua-regular text-center text-indigo-900">About Our Food</h2>
          <p className="text-base sm:text-lg mb-6 nunito-sans text-center px-4">
            At Kailani, we take pride in creating dishes that fuse traditional Hawaiian 
            flavors with modern culinary techniques. Each item is crafted with care 
            using fresh, locally-sourced ingredients whenever possible.
          </p>
          <p className="text-base sm:text-lg nunito-sans text-center px-4">
            Whether you're craving a comforting bowl of ramen, a refreshing shave ice, 
            or a gourmet hot dog with island-inspired toppings, our diverse menu offers 
            something for everyone.
          </p>
        </div>
      </div>
    </div>
  );
});

export default GalleryPage;
