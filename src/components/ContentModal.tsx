import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayContent } from './DayContent';
import { useNavigate } from 'react-router-dom';
import { trackModalView } from '../utils/analytics';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';

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
  const { adjustVolume } = useBackgroundMusicVolume();

  React.useEffect(() => {
    if (isOpen && day) {
      trackModalView(day);
    }
  }, [isOpen, day]);

  const handleClose = () => {
    adjustVolume(0.3);
    onClose();
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 300);
  };

  const handleAdvance = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(event);
  };

  /*   const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;

    // Only consider horizontal swipes
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
  }; */

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
          >
            <div className="bg-black bg-opacity-90 rounded-xl w-full h-full overflow-hidden relative">
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
              {day < 12 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    delay: 2,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdvance();
                  }}
                  className="absolute bottom-4 right-4 md:bottom-6 md:right-6 rounded-full md:rounded-lg bg-black/30 hover:bg-black/50 text-white  z-50"
                >
                  <div className="p-2 md:px-6 md:py-3 md:font-medium flex items-center gap-2">
                    <span className="hidden md:inline">
                      Continue to door {day + 1}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 md:w-4 md:h-4"
                    >
                      <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v8.122c0 1.44 1.555 2.343 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061C13.555 6.346 12 7.249 12 8.689v2.34L5.055 7.061Z" />
                    </svg>
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
