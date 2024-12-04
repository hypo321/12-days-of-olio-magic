import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayContent } from './DayContent';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  day: number;
  onClose: () => void;
}

export const ContentModal: React.FC<Props> = ({
  isOpen,
  day,
  onClose,
}) => {
  const navigate = useNavigate();
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleClose = () => {
    // First close the modal which will trigger the fade out animation
    onClose();
    // Then navigate back, which will trigger the zoom out animation
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 300); // Match the modal exit animation duration
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // Only consider horizontal swipes
    // Use absolute deltaX to handle both left and right swipes
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > 50
    ) {
      handleClose();
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
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
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bg-black bg-opacity-90 rounded-lg w-full h-full overflow-hidden relative">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 p-2 rounded-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white transition-all z-50"
                aria-label="Close modal"
              >
                <svg
                  className="w-4 h-4 md:w-6 md:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
