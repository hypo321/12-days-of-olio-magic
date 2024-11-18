import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarWindow as CalendarWindowType } from '../types';
import { CalendarWindow } from './CalendarWindow';

interface Position {
  x: number;
  y: number;
  width: string;
  height: string;
}

interface CachedWindowsData {
  windows: (CalendarWindowType & Position)[];
  viewportSize: { width: number; height: number };
}

const STORAGE_KEY = 'advent-calendar-windows';

const generateNewWindows = (containerWidth: number, containerHeight: number): (CalendarWindowType & Position)[] => {
  const newWindows: (CalendarWindowType & Position)[] = [];
  const gridSize = 5;
  const cellWidth = containerWidth / gridSize;
  const cellHeight = containerHeight / gridSize;

  for (let day = 1; day <= 25; day++) {
    const col = (day - 1) % gridSize;
    const row = Math.floor((day - 1) / gridSize);

    const baseX = col * cellWidth;
    const baseY = row * cellHeight;

    const randomX = Math.random() * (cellWidth * 0.2);
    const randomY = Math.random() * (cellHeight * 0.2);

    const x = baseX + randomX;
    const y = baseY + randomY;

    const windowWidth = cellWidth * 0.8;
    const windowHeight = cellHeight * 0.8;

    const widthPercent = `${(windowWidth / containerWidth) * 100}%`;
    const heightPercent = `${(windowHeight / containerHeight) * 100}%`;

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

  return newWindows;
};

export const Calendar = () => {
  const { day: urlDay } = useParams<{ day?: string }>();
  const navigate = useNavigate();
  const [windows, setWindows] = useState<(CalendarWindowType & Position)[]>([]);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load cached windows or generate new ones
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    const cachedData = localStorage.getItem(STORAGE_KEY);
    let windowsToUse: (CalendarWindowType & Position)[] = [];

    if (cachedData) {
      const parsed = JSON.parse(cachedData) as CachedWindowsData;
      // Only use cached data if viewport size matches
      if (parsed.viewportSize.width === containerSize.width && 
          parsed.viewportSize.height === containerSize.height) {
        windowsToUse = parsed.windows;
      }
    }

    if (windowsToUse.length === 0) {
      windowsToUse = generateNewWindows(containerSize.width, containerSize.height);
      // Cache the new windows
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        windows: windowsToUse,
        viewportSize: containerSize
      }));
    }

    setWindows(windowsToUse);

    // Handle URL-based window opening
    if (urlDay && isInitialLoad) {
      const dayNumber = parseInt(urlDay, 10);
      if (!isNaN(dayNumber) && dayNumber >= 1 && dayNumber <= 25) {
        setTimeout(() => {
          setWindows(prev =>
            prev.map(window =>
              window.day === dayNumber ? { ...window, isOpen: true } : window
            )
          );
        }, 500);
      }
      setIsInitialLoad(false);
    }
  }, [containerSize, urlDay, isInitialLoad]);

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

  const handleWindowClick = (day: number) => {
    navigate(`/day/${day}`);
    setWindows(prev => {
      const newWindows = prev.map(window =>
        window.day === day ? { ...window, isOpen: true } : window
      );
      // Update cache with new window states
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        windows: newWindows,
        viewportSize: containerSize
      }));
      return newWindows;
    });
  };

  const handleWindowClose = (day: number) => {
    navigate('/');
    setWindows(prev => {
      const newWindows = prev.map(window =>
        window.day === day ? { ...window, isOpen: false } : window
      );
      // Update cache with new window states
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        windows: newWindows,
        viewportSize: containerSize
      }));
      return newWindows;
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-background" />
      {windows.map((window) => {
        const xPercent = `${(window.x / containerSize.width) * 100}%`;
        const yPercent = `${(window.y / containerSize.height) * 100}%`;

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
