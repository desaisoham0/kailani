import type { ProductItem } from '../components/BestSellers/BestSellers';

// Import images
import ramen2Img from '../assets/images/ramen2.jpg';
import ramen1Img from '../assets/images/ramen1.jpg';
import ramenImg from '../assets/images/ramen.jpg';
import shaveIceImg from '../assets/images/shave_ice.jpg';
import shaveIce2Img from '../assets/images/Shave_Ice1.jpg';
import shaveIce3Img from '../assets/images/Blue_lagoon.jpg';
import chocolateFudgeImg from '../assets/images/Chocolate Fudge.jpg';
import hot2Img from '../assets/images/hot2.jpg';
import hot1Img from '../assets/images/hot1.jpg';
import iceCreamImg from '../assets/images/Honey Lavender Swirl.jpg';
import acaiBowlImg from '../assets/images/Mango Acai Twist Bowl.png';
import softServeImg from '../assets/images/Vanilla Swirl.jpg';

export const bestSellerProducts: ProductItem[] = [
  // Ramen category
  {
    id: 1,
    name: "Tonkotsu Ramen",
    description: "Rich, creamy pork-based broth with tender chashu pork, soft-boiled egg, green onions, and thin noodles. Our most popular ramen dish.",
    imageUrl: ramen2Img,
    category: "ramen",
  },
  {
    id: 2,
    name: "Spicy Miso Ramen",
    description: "Savory miso broth with a spicy kick, topped with ground pork, corn, bean sprouts, and wavy noodles.",
    imageUrl: ramen1Img,
    category: "ramen",
  },
  {
    id: 3,
    name: "Vegetable Ramen",
    description: "Light vegetable broth with seasonal vegetables, tofu, and thin noodles. A refreshing vegetarian option.",
    imageUrl: ramenImg,
    category: "ramen",
  },
  
  // Shave Ice category
  {
    id: 4,
    name: "Hawaiian Shave Ice",
    description: "Fine shaved ice topped with your choice of tropical fruit syrups and sweetened condensed milk.",
    imageUrl: shaveIceImg,
    category: "shave-ice",
  },
  {
    id: 5,
    name: "Chocolate Fudge",
    description: "Creamy chocolate ice cream with chunks of fresh peanuts.",
    imageUrl: chocolateFudgeImg,
    category: "homemade-ice-cream",
  },
  
  // Hotdog category
  {
    id: 6,
    name: "Hawaiian Dog",
    description: "All-beef hotdog topped with grilled pineapple, teriyaki sauce, and crunchy onions on a toasted bun.",
    imageUrl: hot2Img,
    category: "hotdog",
  },
  {
    id: 7,
    name: "Loco Moco Dog",
    description: "Our twist on a Hawaiian classic: a hotdog topped with a beef patty, fried egg, and rich gravy.",
    imageUrl: hot1Img,
    category: "hotdog",
  },

  {
    id: 8,
    name: "Tropical Sunset Shave Ice",
    description: "A vibrant fusion of mango, passionfruit, and strawberry syrups over finely shaved ice, crowned with a sprinkle of toasted coconut.",
    imageUrl: shaveIce2Img,
    category: "shave-ice"
  },
  {
    id: 9,
    name: "Blue Lagoon Chill",
    description: "A cool blend of blue raspberry and pineapple syrups cascading over soft ice, finished with a zesty citrus twist.",
    imageUrl: shaveIce3Img,
    category: "shave-ice"
  },
  {
    id: 10,
    name: "Honey Lavender Swirl",
    description: "Creamy vanilla ice cream infused with honey and lavender buds, with a delicate floral swirl throughout.",
    imageUrl: iceCreamImg,
    category: "homemade-ice-cream"
  },
  {
    id: 11,
    name: "Mango Acai Twist Bowl",
    description: "Blended acai and mango purée topped with fresh banana slices, granola, chia seeds, and a drizzle of honey for a tropical kick.",
    imageUrl: acaiBowlImg,
    category: "acai-twist-bowl"
  },
  {
    id: 12,
    name: "Vanilla Cloud Swirl",
    description: "Ultra-creamy vanilla soft serve twirled into a perfect peak, finished with a light dusting of rainbow sprinkles.",
    imageUrl: softServeImg,
    category: "soft-server-ice-cream"
  }
];
