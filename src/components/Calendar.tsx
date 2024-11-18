import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarWindow as CalendarWindowType } from '../types';
import { CalendarWindow } from './CalendarWindow';
import { LoadingScreen } from './LoadingScreen';

const BACKGROUND_IMAGE_URL = "/advent-calendar/background.jpg";
const STORAGE_KEY = 'advent-calendar-windows';

interface Position {
  x: number;
  y: number;
  width: string;
  height: string;
}

interface WindowData extends CalendarWindowType, Position {}

interface CachedData {
  windows: WindowData[];
  viewportSize: { width: number; height: number };
}

export const Calendar: React.FC = () => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { day } = useParams();
  const navigate = useNavigate();

  const generateNewWindows = (width: number, height: number): WindowData[] => {
    const gridSize = 5;
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    return Array.from({ length: 24 }, (_, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const baseX = col * cellWidth;
      const baseY = row * cellHeight;
      
      // Add some random offset within the cell
      const offsetX = Math.random() * (cellWidth * 0.3);
      const offsetY = Math.random() * (cellHeight * 0.3);
      
      return {
        day: i + 1,
        isOpen: false,
        x: baseX + offsetX,
        y: baseY + offsetY,
        width: '120px',
        height: '120px',
        imageUrl: `https://source.unsplash.com/random/400x400/?christmas,${i + 1}`,
      };
    });
  };

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      setBackgroundLoaded(false);

      // Step 1: Load background image (50% of progress)
      try {
        await preloadImage(BACKGROUND_IMAGE_URL);
        setBackgroundLoaded(true);
        setLoadingProgress(50);
      } catch (error) {
        console.error('Failed to load background image:', error);
        setBackgroundLoaded(false);
        setLoadingProgress(50);
      }

      // Step 2: Generate or load window data
      const savedData = localStorage.getItem(STORAGE_KEY);
      let initialWindows: WindowData[];
      
      if (savedData) {
        const parsed = JSON.parse(savedData) as CachedData;
        if (parsed.viewportSize.width === containerSize.width && 
            parsed.viewportSize.height === containerSize.height) {
          initialWindows = parsed.windows;
        } else {
          initialWindows = generateNewWindows(containerSize.width, containerSize.height);
        }
      } else {
        initialWindows = generateNewWindows(containerSize.width, containerSize.height);
      }

      // Cache the windows
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        windows: initialWindows,
        viewportSize: containerSize
      }));

      // Set initial window state
      setWindows(initialWindows);

      // Step 3: Load window images in sequence (remaining 50%)
      for (let i = 0; i < initialWindows.length; i++) {
        try {
          await preloadImage(initialWindows[i].imageUrl);
          setLoadingProgress(50 + ((i + 1) / initialWindows.length) * 50);
        } catch (error) {
          console.error(`Failed to load image for window ${i + 1}:`, error);
        }
      }

      setIsLoading(false);
    };

    loadImages();
  }, [containerSize]);

  useEffect(() => {
    const handleResize = () => {
      setContainerSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (day && windows.length > 0) {
      const dayNumber = parseInt(day);
      const targetWindow = windows.find(w => w.day === dayNumber);
      if (targetWindow && !targetWindow.isOpen) {
        handleWindowClick(dayNumber);
      }
    }
  }, [day, windows]);

  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const handleWindowClick = (day: number) => {
    setWindows(prev => {
      const newWindows = prev.map(w =>
        w.day === day ? { ...w, isOpen: true } : w
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        windows: newWindows,
        viewportSize: containerSize
      }));
      return newWindows;
    });
    navigate(`/day/${day}`);
  };

  const handleWindowClose = (day: number) => {
    setWindows(prev => {
      const newWindows = prev.map(w =>
        w.day === day ? { ...w, isOpen: false } : w
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        windows: newWindows,
        viewportSize: containerSize
      }));
      return newWindows;
    });
    navigate('/');
  };

  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div className="relative w-full min-h-screen">
      <div 
        className="fixed inset-0 bg-[#f8f8f8] transition-opacity duration-500"
        style={{
          backgroundImage: backgroundLoaded ? `url(${BACKGROUND_IMAGE_URL})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: backgroundLoaded ? 1 : 0.5,
        }}
      />
      {windows.map((window) => (
        <div
          key={window.day}
          className="absolute"
          style={{
            left: `${window.x}px`,
            top: `${window.y}px`,
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
      ))}
    </div>
  );
};
