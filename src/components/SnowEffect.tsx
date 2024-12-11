import { useEffect, useRef, useState } from 'react';
import { getViewportSize } from '../utils/windowUtils';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number; // in px/sec
  drift: number; // in px/sec
}

export const SnowEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track the container size instead of window size
  const [containerSize, setContainerSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  // Recalculate the number of flakes based on container width
  const snowflakeCount = containerSize.width < 600 ? 100 : 200;

  // Generate snowflakes whenever dimensions change
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < snowflakeCount; i++) {
      flakes.push({
        x: Math.random() * containerSize.width,
        y: Math.random() * containerSize.height,
        radius: 1 + Math.random() * 3,
        speed: 40 + Math.random() * 60,
        drift: -20 + Math.random() * 40,
      });
    }
    return flakes;
  });

  // Update container size once mounted and on resize
  useEffect(() => {
    const updateSize = () => {
      const size = getViewportSize();
      setContainerSize(size);
    };

    // Initial size
    updateSize();

    // Update on resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    // Whenever the container size changes, regenerate flakes
    const flakes: Snowflake[] = [];
    for (let i = 0; i < snowflakeCount; i++) {
      flakes.push({
        x: Math.random() * containerSize.width,
        y: Math.random() * containerSize.height,
        radius: 1 + Math.random() * 3,
        speed: 40 + Math.random() * 60,
        drift: -20 + Math.random() * 40,
      });
    }
    setSnowflakes(flakes);
  }, [containerSize.width, containerSize.height, snowflakeCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = containerSize.width;
    canvas.height = containerSize.height;

    let animationFrameId: number;
    let lastTime = performance.now();
    let isRunning = true;

    const draw = (time: number) => {
      if (!isRunning) return;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let flake of snowflakes) {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        flake.y += flake.speed * delta;
        flake.x += flake.drift * delta;

        // Reset if out of screen
        if (flake.y > canvas.height) {
          flake.y = -flake.radius * 2;
          flake.x = Math.random() * canvas.width;
        }

        if (flake.x > canvas.width) {
          flake.x = -flake.radius * 2;
        } else if (flake.x < -flake.radius * 2) {
          flake.x = canvas.width + flake.radius * 2;
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
      } else {
        isRunning = true;
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [snowflakes, containerSize.width, containerSize.height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 50,
        filter: 'blur(1px)',
        width: '100%',
        height: '100%',
      }}
    />
  );
};
