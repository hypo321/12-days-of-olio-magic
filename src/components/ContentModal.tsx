import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayContent } from './DayContent';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  day: number;
  onClose: () => void;
}

const AutoAdvanceButton: React.FC<{
  currentDay: number;
  onAdvance: () => void;
}> = ({ currentDay, onAdvance }) => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show button after 5 seconds
    const showTimer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (visible) {
      // Start progress animation
      const duration = 5000;
      const interval = 16; // ~60fps
      const steps = duration / interval;
      const increment = 100 / steps;

      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + increment;
          if (next >= 100) {
            clearInterval(progressTimer);
            // Add a small delay before advancing to let the animation complete
            setTimeout(onAdvance, 500);
            return 100;
          }
          return next;
        });
      }, interval);

      return () => clearInterval(progressTimer);
    }
  }, [visible, onAdvance]);

  if (!visible || currentDay >= 12) return null;

  return (
    <div 
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm px-6 py-3 text-white font-medium hover:bg-white/20 transition-all duration-300 min-w-[200px]"
        onClick={(e) => {
          e.stopPropagation();
          onAdvance();
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-50"
          style={{
            width: `${progress}%`,
            transition: 'width 300ms ease-out',
            clipPath:
              'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)',
          }}
        />
        <span className="relative z-10 flex items-center justify-center gap-2">
          Move to door {currentDay + 1}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </button>
    </div>
  );
};

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
    onClose();
    setTimeout(() => {
      navigate('/', { replace: true });
    }, 300);
  };

  const handleAdvance = useCallback(() => {
    handleClose();
    setTimeout(() => {
      navigate(`/day/${day + 1}`, { replace: true });
    }, 300);
  }, [day, handleClose, navigate]);

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
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
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
              {import.meta.env.VITE_ENABLE_AUTO_ADVANCE === 'true' && (
                <AutoAdvanceButton
                  currentDay={day}
                  onAdvance={handleAdvance}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
