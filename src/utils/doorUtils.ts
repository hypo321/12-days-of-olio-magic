// src/utils/doorUtils.ts

export const isDevelopmentMode = () => {
  return import.meta.env.DEV;
};

export const areAllDoorsUnlocked = () => {
  return import.meta.env.VITE_UNLOCK_ALL_DOORS === 'true';
};

export const canOpenDoor = (day: number | string): boolean => {
  if (areAllDoorsUnlocked()) {
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
