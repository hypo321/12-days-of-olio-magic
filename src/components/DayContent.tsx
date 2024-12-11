import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { itemVariants, contentVariants } from '../utils/animations';
import { ScreenEffect } from './ScreenEffect';
import {
  PlayCircleIcon,
  ArrowPathIcon,
  ShareIcon,
  CheckIcon,
} from '@heroicons/react/24/solid';
import {
  trackVideoRewatch,
  trackRestart,
  trackShareAtEnd,
} from '../utils/analytics';
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
  const [isCopied, setIsCopied] = useState(false);
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

  if (!ContentComponent) {
    return null;
  }

  const isVideoDay = [12].includes(day);
  const bgColor = DAY_BACKGROUNDS[day] || 'bg-olio-lilac';
  const textColor = 'text -gray-900';

  if (isVideoDay) {
    return (
      <div className={`relative w-full h-full ${bgColor}`}>
        {!videoEnded && (
          <>
            <button
              onClick={() => setVideoEnded(true)}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 rounded-full bg-black bg-opacity-100 hover:bg-opacity-50 text-white transition-all z-[60]"
              aria-label="Skip video"
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
            {ContentComponent({
              onVideoEnd: () => setVideoEnded(true),
              reload: reloadVideo,
            })}
          </>
        )}
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-olio-purple to-olio-yellow grid place-items-center p-8"
          >
            <div className="text-center space-y-4">
              <motion.h2 className="h2" variants={itemVariants}>
                Thank you for watching!
              </motion.h2>
              <motion.h3 className="h3" variants={itemVariants}>
                We hope you enjoyed our 12 Days of Olio Magic
              </motion.h3>
              <motion.div
                className="flex flex-col gap-4 pt-4"
                variants={itemVariants}
              >
                <motion.button
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setVideoEnded(false);
                    setReloadVideo(true);
                    trackVideoRewatch(day);
                  }}
                  className="px-6 py-3 bg-pink-700/70 hover:bg-pink-700/90 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  Rewatch Video
                </motion.button>

                <motion.button
                  onClick={() => {
                    trackRestart();
                    window.location.href = '/';
                  }}
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-pink-700/70 hover:bg-pink-700/90 rounded-lg text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  Reload the 12 Days
                </motion.button>

                <motion.button
                  initial={{ opacity: 0.6, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className={`px-6 py-3 rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${
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
                      Share the Joy
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className={` ${bgColor} z-10 p-4 w-full h-full`}>
      {isVisible && dayEffect && (
        <ScreenEffect
          effect={dayEffect.effect}
          className="absolute inset-8"
        />
      )}
      <motion.div
        className={`max-h-full h-full w-full p-2 flex flex-col items-center justify-center text-center  ${textColor} gap-4 md:gap-6 lg:gap-8`}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={contentVariants}
      >
        {ContentComponent()}
      </motion.div>
    </div>
  );
};
