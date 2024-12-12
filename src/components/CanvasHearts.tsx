import React, { useRef, useEffect, CSSProperties } from 'react';

interface CanvasHeartsProps {
  duration?: number | null;
  heartCount?: number;
  heartEmoji?: string;
  style?: CSSProperties;
}

interface Heart {
  x: number;
  y: number;
  opacity: number;
  speedY: number;
  fadeRate: number;
  size: number;
}

const CanvasHearts: React.FC<CanvasHeartsProps> = ({
  duration = null,
  heartCount = 20,
  heartEmoji = '❤️',
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // We store hearts and configuration outside useEffect so we can re-init easily.
  let hearts: Heart[] = [];
  let width = 0;
  let height = 0;

  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parentEl = canvas.parentElement;
    if (!parentEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    width = parentEl.clientWidth;
    height = parentEl.clientHeight;
    canvas.width = width;
    canvas.height = height;

    hearts = [];
    for (let i = 0; i < heartCount; i++) {
      hearts.push(createHeart(width, height));
    }

    startTimeRef.current = null;
    if (animationRef.current !== null)
      cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame((t) => draw(t, ctx));
  };

  function createHeart(
    canvasWidth: number,
    canvasHeight: number
  ): Heart {
    const margin = 70; // You can adjust this margin
    const startX =
      margin + Math.random() * (canvasWidth - 2 * margin);
    const startY = canvasHeight / 2 + Math.random() * 200;

    return {
      x: startX,
      y: startY,
      opacity: 1,
      speedY: 0.5 + Math.random() * 0.5,
      fadeRate: 0.005 + Math.random() * 0.005,
      size: 32 + Math.random() * 20,
    };
  }

  function draw(timestamp: number, ctx: CanvasRenderingContext2D) {
    if (startTimeRef.current === null)
      startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    if (duration && elapsed > duration) {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    hearts.forEach((heart, index) => {
      heart.y -= heart.speedY;
      heart.opacity -= heart.fadeRate;

      if (heart.opacity <= 0) {
        if (duration === null) {
          hearts[index] = createHeart(width, height);
        }
        return;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, heart.opacity);
      ctx.font = `${heart.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(heartEmoji, heart.x, heart.y);
      ctx.restore();
    });

    animationRef.current = requestAnimationFrame((t) => draw(t, ctx));
  }

  useEffect(() => {
    init();
    // On resize, reinit the canvas and hearts
    const handleResize = () => {
      init();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [duration, heartCount, heartEmoji]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        pointerEvents: 'none', // Make canvas non-interactive
        ...style,
      }}
    />
  );
};

export default CanvasHearts;
