'use client';

import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer group h-full"
    >
      <div className="relative overflow-hidden h-64 bg-gray-200">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{product.category}</p>
        <h3 className="text-lg font-bold text-gray-800 mt-2 line-clamp-2">{product.name}</h3>
        
        <div className="flex items-center gap-1 mt-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-300 text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 ml-2">({product.reviews})</span>
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold text-purple-600">${product.price.toFixed(2)}</div>
          <motion.button
            onClick={() => onAddToCart(product)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all"
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
