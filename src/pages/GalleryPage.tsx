import React from 'react';
import FoodGallery from '../components/Food/FoodGallery';
import { galleryImages } from '../data/galleryImages';

const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="py-8 px-4 bg-indigo-800 text-white text-center">
        <h1 className="text-4xl font-bold font-navigation jua-regular">Kailani Food Gallery</h1>
        <p className="text-lg nunito-sans mt-2">Explore our delicious creations</p>
      </div>
      
      <FoodGallery 
        images={galleryImages}
        title="Our Delicious Creations"
        subtitle="Browse through our mouthwatering dishes and treats"
      />
      
      <div className="py-12 px-4 bg-stone-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 font-navigation jua-regular text-center text-indigo-900">About Our Food</h2>
          <p className="text-lg mb-6 nunito-sans text-center">
            At Kailani, we take pride in creating dishes that fuse traditional Hawaiian 
            flavors with modern culinary techniques. Each item is crafted with care 
            using fresh, locally-sourced ingredients whenever possible.
          </p>
          <p className="text-lg nunito-sans text-center">
            Whether you're craving a comforting bowl of ramen, a refreshing shave ice, 
            or a gourmet hot dog with island-inspired toppings, our diverse menu offers 
            something for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
