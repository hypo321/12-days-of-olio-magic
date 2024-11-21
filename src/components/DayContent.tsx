import React from 'react';

interface DayContentProps {
  day: number;
  isVisible: boolean;
}

export const DayContent: React.FC<DayContentProps> = ({ day, isVisible }) => {
  // For now, we'll just implement day 1
  if (day !== 1) return null;

  const backgroundStyle = {
    backgroundImage: `url("/advent-calendar/content/day1.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
    position: 'absolute' as const,
    inset: 0,
    zIndex: 1, // Ensure it's above the thumbnail
  };

  return (
    <div 
      className="absolute inset-0 rounded-lg overflow-hidden"
      style={backgroundStyle}
    />
  );
};
