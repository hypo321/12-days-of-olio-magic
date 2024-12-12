import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import CanvasHearts from './CanvasHearts';
import './ScreenEffect.css';

type EffectType = 'confetti' | 'hearts';

interface ScreenEffectProps {
  effect: EffectType;
  className?: string;
}

export const ScreenEffect: React.FC<ScreenEffectProps> = ({
  effect,
}) => {
  useEffect(() => {
    if (effect === 'confetti') {
      const duration = 5 * 1000;
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
          origin: { x: 0.2, y: 0.8 },
          colors: [
            '#FFCE00',
            '##FFB000',
            '#F75996',
            '#F4226E',
            '#FB6501',
          ],
          scalar: 1.5,
        });

        confetti({
          particleCount,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 0.8, y: 0.8 },
          colors: [
            '#FFCE00',
            '##FFB000',
            '#F75996',
            '#F4226E',
            '#FB6501',
          ],
          scalar: 1.5,
        });
      }, 250);

      return () => {
        clearInterval(interval);
      };
    }
  }, [effect]);

  if (effect === 'hearts') {
    return (
      <CanvasHearts
        duration={null}
        heartCount={30}
        heartEmoji="❤️"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none', // so clicks go through to parent
          zIndex: 999,
        }}
      />
    );
  }

  return null;
};
