'use client';

import { motion } from 'framer-motion';
import { Product } from '@/data/products';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onBuyNow, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, scale: 1.05 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer group h-full flex flex-col"
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

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{product.category}</p>
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

        <div className="mt-auto pt-4">
          <div className="text-3xl font-bold text-orange-600 mb-3">KSh {product.price.toLocaleString()}</div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => onAddToCart(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-white border-2 border-orange-600 hover:bg-orange-50 text-orange-600 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
            <motion.button
              onClick={() => onBuyNow && onBuyNow(product)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition-all"
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
