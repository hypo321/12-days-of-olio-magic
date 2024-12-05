import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../contexts/ModalContext';

interface WelcomeModalProps {
  onMusicChoice: (enableMusic: boolean) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  onMusicChoice,
}) => {
  const { showWelcomeModal, setShowWelcomeModal } = useModal();

  if (!showWelcomeModal) return null;

  const handleChoice = (enableMusic: boolean) => {
    onMusicChoice(enableMusic);
    setShowWelcomeModal(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-purple-900 to-pink-900 p-8 rounded-xl shadow-2xl max-w-md mx-4 relative"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Welcome to 12 Days of Olio Magic! 🎄
          </h2>
          <p className="text-white/90 mb-6">
            Would you like to enable background music for a more magical experience?
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => handleChoice(true)}
              className="flex-1 bg-gradient-to-r from-pink-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Yes, enable music
            </button>
            <button
              onClick={() => handleChoice(false)}
              className="flex-1 bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
            >
              No, thanks
            </button>
          </div>
          
          <p className="text-white/60 text-sm mt-4">
            You can toggle the music anytime using the button in the bottom-right corner.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
