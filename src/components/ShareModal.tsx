import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShareIcon, CheckIcon } from '@heroicons/react/24/solid';
import { trackShareAtEnd } from '../utils/analytics';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url = 'https://12days.olioapp.com';
    trackShareAtEnd();
    if (navigator.share) {
      try {
        await navigator.share({
          title: '12 Days of Olio Magic',
          text: 'Check out the 12 Days of Olio Magic!',
          url,
        });
      } catch (error) {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 5000);
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
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 right-4 z-50 bg-white rounded-xl p-6 shadow-lg w-72"
          >
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white transform rotate-45" />

            <h2 className="text-xl font-bold mb-3">Share the Joy</h2>
            <p className="mb-4 text-sm text-gray-600">
              Spread the magic of the 12 Days of Olio with your
              friends and family!
            </p>

            <motion.button
              initial={{ opacity: 0.6, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className={`w-full px-4 py-2 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${
                isCopied
                  ? 'bg-green-600'
                  : 'bg-pink-700/70 hover:bg-pink-700/90'
              }`}
            >
              {isCopied ? (
                <>
                  <CheckIcon className="w-5 h-5" />
                  URL Copied!
                </>
              ) : (
                <>
                  <ShareIcon className="w-5 h-5" />
                  Share
                </>
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
