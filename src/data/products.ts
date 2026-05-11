export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality sound with active noise cancellation, 30-hour battery life, and premium comfort.",
    price: 2500,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.8,
    reviews: 2543
  },
  {
    id: 2,
    name: "Luxury Watch",
    description: "Elegant Swiss-made timepiece with sapphire crystal and premium leather strap.",
    price: 2900,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop",
    category: "Accessories",
    rating: 4.9,
    reviews: 1823
  },
  {
    id: 3,
    name: "Smartphone Pro",
    description: "Latest flagship smartphone with advanced camera system and blazing-fast processor.",
    price: 2800,
    image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.7,
    reviews: 5421
  },
  {
    id: 4,
    name: "Designer Sunglasses",
    description: "Premium UV-protected designer sunglasses with elegant frame design.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Accessories",
    rating: 4.6,
    reviews: 892
  },
  {
    id: 5,
    name: "Professional Camera",
    description: "Full-frame DSLR camera with 4K video recording and advanced autofocus system.",
    price: 2700,
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.9,
    reviews: 2134
  },
  {
    id: 6,
    name: "Leather Backpack",
    description: "Premium leather backpack perfect for work or travel with multiple compartments.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.5,
    reviews: 1456
  },
  {
    id: 7,
    name: "Smartwatch Elite",
    description: "Advanced smartwatch with fitness tracking, heart rate monitor, and 7-day battery.",
    price: 2200,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.7,
    reviews: 3267
  },
  {
    id: 8,
    name: "Wireless Speaker",
    description: "Portable premium Bluetooth speaker with 360-degree sound and waterproof design.",
    price: 1200,
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.6,
    reviews: 2876
  }
];
