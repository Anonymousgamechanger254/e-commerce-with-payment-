'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartItemCount, onCartClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white sticky top-0 z-20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 bg-white rounded-full opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">⚡</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">LuxeStore</h1>
              <p className="text-xs text-purple-200">Premium Marketplace</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="text-white hover:text-purple-200 transition-all font-semibold"
            >
              Home
            </motion.a>
            <motion.a
              href="#products"
              whileHover={{ y: -2 }}
              className="text-white hover:text-purple-200 transition-all font-semibold"
            >
              Products
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              className="text-white hover:text-purple-200 transition-all font-semibold"
            >
              About
            </motion.a>
          </div>

          {/* Cart Button */}
          <motion.button
            onClick={onCartClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all hidden md:block"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                {cartItemCount}
              </motion.span>
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-purple-400"
          >
            <div className="flex flex-col gap-3 pt-4">
              <a href="#" className="text-white hover:text-purple-200 transition-all font-semibold">
                Home
              </a>
              <a href="#products" className="text-white hover:text-purple-200 transition-all font-semibold">
                Products
              </a>
              <a href="#" className="text-white hover:text-purple-200 transition-all font-semibold">
                About
              </a>
              <motion.button
                onClick={onCartClick}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg py-2 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingCart size={20} />
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};
