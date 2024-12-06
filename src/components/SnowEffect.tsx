import { useEffect, useRef, useState } from 'react';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number; // in px/sec
  drift: number; // in px/sec
}

export const SnowEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track the window width so we can regenerate flakes on resize
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(
    window.innerHeight
  );

  // Recalculate the number of flakes based on window width
  const snowflakeCount = windowWidth < 600 ? 100 : 200;

  // Generate snowflakes whenever dimensions change
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < snowflakeCount; i++) {
      flakes.push({
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        radius: 1 + Math.random() * 3,
        speed: 40 + Math.random() * 60,
        drift: -20 + Math.random() * 40,
      });
    }
    return flakes;
  });

  useEffect(() => {
    // Whenever the window size changes, regenerate flakes
    const flakes: Snowflake[] = [];
    for (let i = 0; i < snowflakeCount; i++) {
      flakes.push({
        x: Math.random() * windowWidth,
        y: Math.random() * windowHeight,
        radius: 1 + Math.random() * 3,
        speed: 40 + Math.random() * 60,
        drift: -20 + Math.random() * 40,
      });
    }
    setSnowflakes(flakes);
  }, [windowWidth, windowHeight, snowflakeCount]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = windowWidth;
    canvas.height = windowHeight;

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

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
      cancelAnimationFrame(animationFrameId);
    };
  }, [snowflakes, windowWidth, windowHeight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
};
