'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Smartphone, Lock, Zap, CheckCircle } from 'lucide-react';

interface MPesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSubmit: (phoneNumber: string, pin: string, customMessage: string) => Promise<void>;
  amount: number;
  productName: string;
}

export const MPesaPaymentModal: React.FC<MPesaPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSubmit,
  amount,
  productName
}) => {
  const [phoneNumber, setPhoneNumber] = useState('254');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPushSent, setIsPushSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber || !pin) {
      setError('Please enter both phone number and PIN');
      return;
    }

    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    setLoading(true);
    try {
      const finalMessage = `Pay KSh ${Math.round(amount)} - ${productName}`;
      await onPaymentSubmit(phoneNumber, pin, finalMessage);
      setSuccess(true);
      setTimeout(() => {
        setPhoneNumber('254');
        setPin('');
        setSuccess(false);
        setIsPushSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPay = async () => {
    setLoading(true);
    setError('');
    setIsPushSent(true);
    
    try {
      const defaultMessage = `Pay KSh ${Math.round(amount)} - ${productName}`;
      await onPaymentSubmit('254712345678', '0000', defaultMessage);
      setSuccess(true);
      setTimeout(() => {
        setPhoneNumber('');
        setPin('');
        setCustomMessage('');
        setSuccess(false);
        setIsPushSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initiation failed');
      setIsPushSent(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-5 rounded-full" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Zap size={24} />
                      M-Pesa Payment
                    </h2>
                    <p className="text-orange-100 text-sm">Instant payment to your account</p>
                  </div>
                  <motion.button
                    onClick={onClose}
                    whileHover={{ rotate: 90 }}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">✓</span>
                      </div>
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">Your order for {productName} has been processed.</p>
                  </motion.div>
                ) : isPushSent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >
                      📱
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">PIN Prompt Sent!</h3>
                    <p className="text-gray-600 mb-4">Check your phone for the M-Pesa popup</p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-sm text-blue-800 font-semibold">
                        Enter your M-Pesa PIN to complete the payment
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6 border border-orange-200">
                      <p className="text-sm text-gray-600">Purchasing</p>
                      <h3 className="font-bold text-gray-800">{productName}</h3>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-orange-200">
                        <span className="text-gray-600 font-semibold">Amount:</span>
                        <span className="text-2xl font-bold text-orange-600">KSh {Math.round(amount).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Quick Pay Option */}
                    <motion.button
                      type="button"
                      onClick={handleDirectPay}
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all mb-4 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending PIN Prompt...
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          Quick Pay - Direct to PIN
                        </>
                      )}
                    </motion.button>

                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or enter details manually</span>
                      </div>
                    </div>

                    {/* Phone Number Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Smartphone className="inline mr-2" size={16} />
                        M-Pesa Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="254712345678"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-all"
                        maxLength="13"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave blank to use default phone</p>
                    </div>

                    {/* PIN Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Lock className="inline mr-2" size={16} />
                        M-Pesa PIN (Optional)
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-all text-center text-2xl tracking-widest"
                        maxLength="4"
                      />
                      <p className="text-xs text-gray-500 mt-1">Leave blank to enter on phone</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Manual Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-700 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all"
                    >
                      {loading ? 'Processing...' : 'Send Payment Prompt'}
                    </motion.button>

                    {/* Info */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      ✓ No confirmation needed • Just PIN on your phone • Fast & Secure
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
