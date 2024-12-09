import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contentVariants } from '../utils/animations';
import { ScreenEffect } from './ScreenEffect';
import {
  DAY_CONTENT,
  DAY_BACKGROUNDS,
  DAY_EFFECTS,
} from '../config/dayContent';

interface DayContentProps {
  day: number;
  isVisible: boolean;
}

export const DayContent: React.FC<DayContentProps> = ({
  day,
  isVisible,
}) => {
  const [videoEnded, setVideoEnded] = useState(false);
  const [reloadVideo, setReloadVideo] = useState(false);
  const ContentComponent = DAY_CONTENT[day];
  const dayEffect = DAY_EFFECTS[day];

  // Reset video state when modal visibility changes
  useEffect(() => {
    if (!isVisible) {
      setVideoEnded(false);
      setReloadVideo(true);
    } else {
      setReloadVideo(false);
    }
  }, [isVisible]);

  if (!ContentComponent) {
    return null;
  }

  const isVideoDay = [12].includes(day);
  const bgColor = DAY_BACKGROUNDS[day] || 'bg-olio-lilac';
  const textColor = 'text-gray-900';

  if (isVideoDay) {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-olio-purple to-olio-yellow">
        {!videoEnded &&
          ContentComponent({
            onVideoEnd: () => setVideoEnded(true),
            reload: reloadVideo,
          })}
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-olio-purple to-olio-yellow text-white grid place-items-center p-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                Thank you for watching!
              </h2>
              <p className="text-xl">
                We hope you enjoyed our 12 Days of Olio Magic.
              </p>
              <div className="flex flex-col gap-4">
                <motion.button
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setVideoEnded(false);
                    setReloadVideo(true);
                  }}
                  className="px-6 py-3 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors"
                >
                  Rewatch Video
                </motion.button>
                <motion.a
                  href="/"
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors text-center"
                >
                  Reload the 12 Days
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 ${bgColor} rounded-xl opacity-95`}
      />
      <div className="relative z-10 w-full h-full grid place-items-center p-8">
        <div className="relative w-full h-full max-w-4xl max-h-full grid place-items-center overflow-y-auto scrollbar-hide">
          {isVisible && dayEffect && (
            <ScreenEffect
              effect={dayEffect.effect}
              className="absolute inset-8"
            />
          )}
          <motion.div
            className={`relative grid gap-6 ${textColor} text-center`}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={contentVariants}
          >
            {ContentComponent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
