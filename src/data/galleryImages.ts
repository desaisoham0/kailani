import type { GalleryImage } from '../components/Food/FoodGallery';

// Import all images
import ramenImg from '../assets/images/ramen.jpg';
import hotdogImg from '../assets/images/hotdog.jpg';
import shaveIceImg from '../assets/images/shave_ice.jpg';
import ramen1Img from '../assets/images/ramen1.jpg';
import hot1Img from '../assets/images/hot1.jpg';
import chocolateFudgeImg from '../assets/images/Chocolate Fudge.jpg';
import ramen2Img from '../assets/images/ramen2.jpg';
import hot2Img from '../assets/images/hot2.jpg';
import strawberryDelightImg from '../assets/images/Strawberry Delight.jpg';
import ramen3Img from '../assets/images/ramen3.jpg';
import hot3Img from '../assets/images/hot3.jpg';
import vanillaSwirlImg from '../assets/images/Vanilla Swirl.jpg';

export const galleryImages: GalleryImage[] = [
  {
    id: 1,
    imageUrl: ramenImg,
    title: 'Tonkotsu Ramen',
    category: 'ramen',
  },
  {
    id: 2,
    imageUrl: hotdogImg,
    title: 'Hawaiian Dog',
    category: 'hotdog',
  },
  {
    id: 3,
    imageUrl: shaveIceImg,
    title: 'Rainbow Shave Ice',
    category: 'ice-cream',
  },
  {
    id: 4,
    imageUrl: ramen1Img,
    title: 'Spicy Miso Ramen',
    category: 'ramen',
  },
  {
    id: 5,
    imageUrl: hot1Img,
    title: 'Teriyaki Dog',
    category: 'hotdog',
  },
  {
    id: 6,
    imageUrl: chocolateFudgeImg,
    title: 'Chocolate Fudge',
    category: 'ice-cream',
  },
  {
    id: 7,
    imageUrl: ramen2Img,
    title: 'Vegetable Ramen',
    category: 'ramen',
  },
  {
    id: 8,
    imageUrl: hot2Img,
    title: 'Kimchi Dog',
    category: 'hotdog',
  },
  {
    id: 9,
    imageUrl: strawberryDelightImg,
    title: 'Strawberry Delight',
    category: 'ice-cream',
  },
  {
    id: 10,
    imageUrl: ramen3Img,
    title: 'Shoyu Ramen',
    category: 'ramen',
  },
  {
    id: 11,
    imageUrl: hot3Img,
    title: 'Avocado Dog',
    category: 'hotdog',
  },
  {
    id: 12,
    imageUrl: vanillaSwirlImg,
    title: 'Vanilla Swirl',
    category: 'ice-cream',
  },
];
