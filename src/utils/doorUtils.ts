// src/utils/doorUtils.ts

import { isDev, unlockAllDoors } from './env';

export const isDevelopmentMode = () => {
  return isDev && unlockAllDoors === 'true';
};

export const canOpenDoor = (day: number | string): boolean => {
  if (isDevelopmentMode()) {
    return true;
  }

  const currentDate = new Date();
  const doorDate = new Date(
    currentDate.getFullYear(),
    11,
    Number(day)
  );

  // Compare dates without time
  return (
    currentDate.getDate() >= doorDate.getDate() &&
    currentDate.getMonth() === doorDate.getMonth() &&
    currentDate.getFullYear() === doorDate.getFullYear()
  );
};

export const getOpeningDateMessage = (day: number): string => {
  return `This door will open on December ${day}.`;
};
