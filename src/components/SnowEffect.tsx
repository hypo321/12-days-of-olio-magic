import { useState, useMemo } from 'react';
import '../styles/snow.css';

interface Snowflake {
  id: number;
  startX: number;
  size: number;
  speed: number;
  delay: number;
  drift: number;
  spin: number;
}

export const SnowEffect = () => {
  const [snowflakeCount] = useState(300); // Reduced count for better performance

  const snowflakes = useMemo(() => {
    return Array.from({ length: snowflakeCount }, (_, i) => ({
      id: i,
      startX: Math.random() * 100, // Random start position (0-100%)
      size: 0.2 + Math.random() * 0.4, // Random size (0.2-0.6vw)
      speed: 8 + Math.random() * 12, // Random speed (8-20s)
      delay: Math.random() * -20, // Random start delay (-20-0s)
      drift: -15 + Math.random() * 30, // Random horizontal drift (-15-15vw)
      spin: Math.random() < 0.5 ? -360 : 360, // Random spin direction
    }));
  }, [snowflakeCount]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake: Snowflake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.startX}%`,
            width: `${flake.size}vw`,
            height: `${flake.size}vw`,
            animation: `snowfall ${flake.speed}s linear infinite`,
            animationDelay: `${flake.delay}s`,
            '--drift': `${flake.drift}vw`,
            '--spin': `${flake.spin}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};
