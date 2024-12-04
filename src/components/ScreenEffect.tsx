import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

type EffectType = 'confetti';

interface ScreenEffectProps {
  effect: EffectType;
}

export const ScreenEffect: React.FC<ScreenEffectProps> = ({ effect }) => {
  useEffect(() => {
    if (effect === 'confetti') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50;

        // Launch confetti from both sides
        confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 0 },
          colors: ['#FFCE00', '#DDDBEC', '#FF69B4', '#4CAF50'],
        });

        confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 1 },
          colors: ['#FFCE00', '#DDDBEC', '#FF69B4', '#4CAF50'],
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [effect]);

  // This component doesn't render anything
  return null;
};
