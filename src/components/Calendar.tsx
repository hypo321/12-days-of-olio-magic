import { useState, useEffect } from 'react';
import { CalendarWindow as CalendarWindowType } from '../types';
import { CalendarWindow } from './CalendarWindow';

interface Position {
  x: number;
  y: number;
  width: string;
  height: string;
}

export const Calendar = () => {
  const [windows, setWindows] = useState<
    (CalendarWindowType & Position)[]
  >([]);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0)
      return;

    const newWindows: (CalendarWindowType & Position)[] = [];
    const gridSize = 5;
    const cellWidth = containerSize.width / gridSize;
    const cellHeight = containerSize.height / gridSize;

    for (let day = 1; day <= 25; day++) {
      const col = (day - 1) % gridSize;
      const row = Math.floor((day - 1) / gridSize);

      // Calculate base position in pixels
      const baseX = col * cellWidth;
      const baseY = row * cellHeight;

      // Add some randomness within the cell (in pixels)
      const randomX = Math.random() * (cellWidth * 0.2);
      const randomY = Math.random() * (cellHeight * 0.2);

      // Calculate window position
      const x = baseX + randomX;
      const y = baseY + randomY;

      // Calculate window size
      const windowWidth = cellWidth * 0.8;
      const windowHeight = cellHeight * 0.8;

      // Convert to percentage for positioning
      const widthPercent = `${
        (windowWidth / containerSize.width) * 100
      }%`;
      const heightPercent = `${
        (windowHeight / containerSize.height) * 100
      }%`;

      newWindows.push({
        day,
        isOpen: false,
        x: Math.round(x),
        y: Math.round(y),
        width: widthPercent,
        height: heightPercent,
        imageUrl: `https://picsum.photos/seed/${day}/400/400`,
      });
    }

    setWindows(newWindows);
  }, [containerSize]);

  const handleWindowClick = (day: number) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.day === day ? { ...window, isOpen: true } : window
      )
    );
  };

  const handleWindowClose = (day: number) => {
    setWindows((prev) =>
      prev.map((window) =>
        window.day === day ? { ...window, isOpen: false } : window
      )
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-background" />
      {windows.map((window) => {
        const xPercent = `${(window.x / containerSize.width) * 100}%`;
        const yPercent = `${
          (window.y / containerSize.height) * 100
        }%`;

        return (
          <div
            key={window.day}
            className="calendar-window-container absolute"
            style={{
              left: xPercent,
              top: yPercent,
              width: window.width,
              height: window.height,
            }}
          >
            <CalendarWindow
              window={window}
              onWindowClick={handleWindowClick}
              onWindowClose={handleWindowClose}
            />
          </div>
        );
      })}
    </div>
  );
};
