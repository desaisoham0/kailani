import type { ProductItem } from '../components/BestSellers/BestSellers';

export const bestSellerProducts: ProductItem[] = [
  // Ramen category
  {
    id: 1,
    name: "Tonkotsu Ramen",
    description: "Rich, creamy pork-based broth with tender chashu pork, soft-boiled egg, green onions, and thin noodles. Our most popular ramen dish.",
    imageUrl: "/src/assets/images/ramen2.jpg",
    category: "ramen",
  },
  {
    id: 2,
    name: "Spicy Miso Ramen",
    description: "Savory miso broth with a spicy kick, topped with ground pork, corn, bean sprouts, and wavy noodles.",
    imageUrl: "/src/assets/images/ramen1.jpg",
    category: "ramen",
  },
  {
    id: 3,
    name: "Vegetable Ramen",
    description: "Light vegetable broth with seasonal vegetables, tofu, and thin noodles. A refreshing vegetarian option.",
    imageUrl: "/src/assets/images/ramen.jpg",
    category: "ramen",
  },
  
  // Ice Cream category
  {
    id: 4,
    name: "Hawaiian Shave Ice",
    description: "Fine shaved ice topped with your choice of tropical fruit syrups and sweetened condensed milk.",
    imageUrl: "/src/assets/images/shave_ice.jpg",
    category: "ice-cream",
  },
  {
    id: 5,
    name: "Chocolate Fudge",
    description: "Creamy chocolate ice cream with chunks of fresh peanuts.",
    imageUrl: "src/assets/images/Chocolate Fudge.jpg", // You'll need more images
    category: "ice-cream",
  },
  
  // Hotdog category
  {
    id: 6,
    name: "Hawaiian Dog",
    description: "All-beef hotdog topped with grilled pineapple, teriyaki sauce, and crunchy onions on a toasted bun.",
    imageUrl: "/src/assets/images/hot2.jpg",
    category: "hotdog",
  },
  {
    id: 7,
    name: "Loco Moco Dog",
    description: "Our twist on a Hawaiian classic: a hotdog topped with a beef patty, fried egg, and rich gravy.",
    imageUrl: "/src/assets/images/hot1.jpg", // You'll need more images
    category: "hotdog",
  },
];
