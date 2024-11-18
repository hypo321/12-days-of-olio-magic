import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarWindow as CalendarWindowType } from '../types';
import { CalendarWindow } from './CalendarWindow';
import { LoadingScreen } from './LoadingScreen';
import { BACKGROUND_IMAGE_URL } from '../constants';

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
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
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
    const gridSize = 5; // 5x5 grid for 25 windows
    const padding = 16; // padding around the entire grid
    
    // Calculate available space, accounting for the container offset
    const availableWidth = width;
    const availableHeight = height;
    
    // Calculate cell dimensions
    const cellWidth = availableWidth / gridSize;
    const cellHeight = availableHeight / gridSize;
    
    // Calculate window size to fit within cells
    const windowSize = Math.min(cellWidth, cellHeight) * 0.85;
    
    return Array.from({ length: 25 }, (_, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Calculate base position, centering the entire grid
      const gridWidth = cellWidth * gridSize;
      const gridHeight = cellHeight * gridSize;
      const gridLeft = (width - gridWidth) / 2;
      const gridTop = (height - gridHeight) / 2;
      
      // Position within the grid
      const baseX = gridLeft + (col * cellWidth) + ((cellWidth - windowSize) / 2);
      const baseY = gridTop + (row * cellHeight) + ((cellHeight - windowSize) / 2);
      
      // Add small random offset
      const maxOffset = Math.min(cellWidth, cellHeight) * 0.05;
      const offsetX = (Math.random() - 0.5) * maxOffset;
      const offsetY = (Math.random() - 0.5) * maxOffset;
      
      return {
        day: i + 1,
        isOpen: false,
        x: baseX + offsetX,
        y: baseY + offsetY,
        width: `${windowSize}px`,
        height: `${windowSize}px`,
        imageUrl: `/advent-calendar/images/day${i + 1}.jpg`,
      };
    });
  };

  useEffect(() => {
    const loadAllImages = async () => {
      try {
        setIsLoading(true);
        setAllImagesLoaded(false);
        setLoadingProgress(0);
        
        // Create an array of all image URLs
        const imageUrls = [
          BACKGROUND_IMAGE_URL,
          ...Array.from({ length: 25 }, (_, i) => `/advent-calendar/images/day${i + 1}.jpg`)
        ];
        
        // Load all images concurrently
        const imagePromises = imageUrls.map(url => preloadImage(url));
        
        // Track progress
        let loaded = 0;
        await Promise.all(
          imagePromises.map(promise =>
            promise.then(() => {
              loaded++;
              setLoadingProgress((loaded / imageUrls.length) * 100);
            }).catch(error => {
              console.error('Failed to load image:', error);
              // Continue loading other images even if one fails
              loaded++;
              setLoadingProgress((loaded / imageUrls.length) * 100);
            })
          )
        );

        // Initialize windows
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const { windows: savedWindows, viewportSize } = JSON.parse(savedData) as CachedData;
          if (
            viewportSize.width === containerSize.width &&
            viewportSize.height === containerSize.height
          ) {
            setWindows(savedWindows);
          } else {
            setWindows(generateNewWindows(containerSize.width, containerSize.height));
          }
        } else {
          setWindows(generateNewWindows(containerSize.width, containerSize.height));
        }

        // Mark all images as loaded and remove loading screen
        setAllImagesLoaded(true);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure state update
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setAllImagesLoaded(true);
        setIsLoading(false);
      }
    };

    loadAllImages();
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

  const preloadImage = async (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const handleLoad = () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        resolve();
      };
      
      const handleError = () => {
        img.removeEventListener('load', handleLoad);
        img.removeEventListener('error', handleError);
        console.warn(`Failed to load image: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);
      img.src = url;
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
    <div className="fixed inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 bg-[#f8f8f8]"
        style={{
          backgroundImage: allImagesLoaded ? `url(${BACKGROUND_IMAGE_URL})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: allImagesLoaded ? 1 : 0,
        }}
      />
      {allImagesLoaded && (
        <div className="relative w-full h-full">
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
      )}
    </div>
  );
};
