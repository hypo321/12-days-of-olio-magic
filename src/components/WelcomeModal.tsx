import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMusicChoice: (enableMusic: boolean) => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onMusicChoice,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center ">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-pink-600 to-yellow-500 p-8 rounded-xl shadow-2xl max-w-md mx-4 relative"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">
            Welcome to <br />
            12 Days of Olio Magic! 🎄
          </h2>
          <p className="text-white/90 mb-6">
            Would you like to enable background music for a more
            magical experience?
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                onMusicChoice(true);
                onClose();
              }}
              className="flex-1 bg-gradient-to-r from-pink-700 to-red-700 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Yes, enable music 🎵
            </button>
            <button
              onClick={() => {
                onMusicChoice(false);
                onClose();
              }}
              className="flex-1 bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300"
            >
              No music, thanks 🔇
            </button>
          </div>

          <p className="text-white/100 text-sm mt-4">
            Tip: You can toggle the music using the button in the
            bottom-right corner.
          </p>

          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-white/80 text-sm">
              This site uses cookies to enhance your experience and
              analyze site usage. By continuing to use this site, you
              consent to our use of cookies.
            </p>
            <p className="text-white/80 text-sm">
              Learn more in our{' '}
              <a
                href="/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                privacy policy
              </a>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
