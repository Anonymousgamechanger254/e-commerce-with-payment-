'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Smartphone, Zap, CheckCircle } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isPushSent, setIsPushSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    setLoading(true);
    setIsPushSent(true);
    
    try {
      const finalMessage = `Pay KSh ${Math.round(amount)} - ${productName}`;
      await onPaymentSubmit(phoneNumber, '0000', finalMessage);
      setSuccess(true);
      setTimeout(() => {
        setPhoneNumber('254');
        setSuccess(false);
        setIsPushSent(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
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
                    <p className="text-orange-100 text-sm">Fast & Secure Payment</p>
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
                      <CheckCircle size={40} className="text-green-500" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-green-600 mb-2">Payment Request Sent!</h3>
                    <p className="text-gray-600">Check your phone for the M-Pesa prompt. Enter your PIN to complete the payment.</p>
                  </motion.div>
                ) : isPushSent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      📱
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">PIN Prompt Sent!</h3>
                    <p className="text-gray-600 mb-6">Check your phone for the M-Pesa popup</p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                      <p className="text-sm text-blue-800 font-semibold">
                        👉 Enter your M-Pesa PIN on your phone to complete the payment
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Payment for: <span className="font-bold">{productName}</span>
                    </p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      KSh {Math.round(amount).toLocaleString()}
                    </p>
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

                    {/* Phone Number Input - ONLY INPUT NEEDED */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Smartphone className="inline mr-2" size={18} />
                        Your M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="254712345678"
                        className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:border-orange-600 focus:outline-none transition-all text-lg font-semibold"
                        maxLength="13"
                        autoFocus
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Format: 254XXXXXXXXX (with country code)
                      </p>
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
                          ❌ {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* How It Works */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-2">How it works:</p>
                      <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Enter your phone number</li>
                        <li>Click "Send Payment Request"</li>
                        <li>M-Pesa popup appears on your phone</li>
                        <li>Enter your PIN to complete payment</li>
                      </ol>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading || phoneNumber.length < 10}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 text-lg"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Sending Payment Request...
                        </>
                      ) : (
                        <>
                          <Zap size={20} />
                          Send Payment Request
                        </>
                      )}
                    </motion.button>

                    {/* Info */}
                    <p className="text-xs text-gray-500 text-center mt-4">
                      ✓ No PIN entry on website • Just phone number • User enters PIN on their phone • Fast & Secure
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
