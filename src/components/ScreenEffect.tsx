import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import './ScreenEffect.css';

type EffectType = 'confetti' | 'hearts';

interface ScreenEffectProps {
  effect: EffectType;
  className?: string;
}

const HEART_COLORS = ['#FF69B4', '#FF1493', '#FF0000', '#FF4500'];

export const ScreenEffect: React.FC<ScreenEffectProps> = ({
  effect,
  className = '',
}) => {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    if (effect === 'hearts') {
      const itemCount = 60;
      setItems(Array.from({ length: itemCount }, (_, i) => i));
    }

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

  if (effect === 'hearts') {
    return (
      <div className={`screen-effect-container ${className}`}>
        {items.map((index) => {
          const randomColor =
            HEART_COLORS[
              Math.floor(Math.random() * HEART_COLORS.length)
            ];
          const randomSize = Math.random() * (3 - 1.5) + 1.5;

          return (
            <span
              key={index}
              className="heart"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '0',
                fontSize: `${randomSize}rem`,
                color: randomColor,
                filter: 'drop-shadow(0 0 5px rgba(255,105,180,0.3))',
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              ❤️
            </span>
          );
        })}
      </div>
    );
  }

  return null;
};
