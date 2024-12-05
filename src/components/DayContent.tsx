import React from 'react';
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
  const ContentComponent = DAY_CONTENT[day];
  const dayEffect = DAY_EFFECTS[day];

  if (!ContentComponent) {
    return null;
  }

  const isVideoDay = [12].includes(day);
  const bgColor = DAY_BACKGROUNDS[day] || 'bg-olio-yellow';
  const textColor = 'text-gray-900';

  if (isVideoDay) {
    return ContentComponent();
  }

  return (
    <div className="relative w-full h-full">
      <div
        className={`absolute inset-0 ${bgColor} rounded-lg opacity-95`}
      />
      <div className="relative z-10 w-full h-full grid place-items-center p-8">
        <div className="relative w-full max-w-4xl max-h-full overflow-y-auto scrollbar-hide">
          {isVisible && dayEffect && (
            <ScreenEffect
              effect={dayEffect.effect}
              className="absolute inset-0"
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
