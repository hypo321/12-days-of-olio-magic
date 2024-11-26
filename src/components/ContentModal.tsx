import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayContent } from './DayContent';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  day: number;
  onClose: () => void;
}

export const ContentModal: React.FC<Props> = ({ isOpen, day, onClose }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ 
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
          >
            <div className="bg-black bg-opacity-90 rounded-lg w-full h-full overflow-hidden relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <DayContent day={day} isVisible={isOpen} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
