import { DAY_ONE_DATE } from './constants';

const MESSAGE_VARIATIONS = [
  "Come back and open me",
  "Not yet! You can open me",
  "I'll be ready for you",
  "You'll find my surprise",
  "Check back with me"
] as const;

function getMessageForDoor(doorNumber: number): string {
  // Use the door number to consistently select a message variation
  const index = (doorNumber - 1) % MESSAGE_VARIATIONS.length;
  return MESSAGE_VARIATIONS[index];
}

export function canOpenDoor(doorNumber: number): boolean {
  const today = new Date();
  const targetDate = new Date(DAY_ONE_DATE);
  targetDate.setDate(DAY_ONE_DATE.getDate() + doorNumber - 1);
  
  return today >= targetDate;
}

export function getCurrentAdventDay(): number | null {
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - DAY_ONE_DATE.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceStart < 0) return null;
  if (daysSinceStart >= 25) return 25;
  return daysSinceStart + 1;
}

export function getOpeningDateMessage(doorNumber: number): string {
  const targetDate = new Date(DAY_ONE_DATE);
  targetDate.setDate(DAY_ONE_DATE.getDate() + doorNumber - 1);
  
  const today = new Date();
  const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const messagePrefix = getMessageForDoor(doorNumber);
  
  if (daysUntil === 1) {
    return `${messagePrefix} tomorrow!`;
  }
  
  if (daysUntil <= 6) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${messagePrefix} on ${dayNames[targetDate.getDay()]}!`;
  }
  
  const month = targetDate.toLocaleString('en-US', { month: 'long' });
  const day = targetDate.getDate();
  const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3 ? 0 : day % 10)];
  
  return `${messagePrefix} on ${day}${suffix} ${month}!`;
}
