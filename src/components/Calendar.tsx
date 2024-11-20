import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarWindow as CalendarWindowType } from '../types';
import { CalendarWindow } from './CalendarWindow';
import { LoadingScreen } from './LoadingScreen';
import { BACKGROUND_IMAGE_URL } from '../constants';
import { canOpenDoor } from '../utils';

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
  const [containerSize, setContainerSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { day } = useParams();
  const navigate = useNavigate();

  // Add state for zoom transition
  const [zoomTransform, setZoomTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const generateNewWindows = (
    width: number,
    height: number
  ): WindowData[] => {
    const gridSize = 5; // 5x5 grid for 25 windows

    // Calculate available space
    const availableWidth = width;
    const availableHeight = height;

    // Calculate cell dimensions
    const cellWidth = availableWidth / gridSize;
    const cellHeight = availableHeight / gridSize;

    // Calculate window size to fit within cells
    // Make windows wider when there's more horizontal space
    const aspectRatio = 1.4; // wider than tall
    const maxWidth = cellWidth * 0.9; // 90% of cell width
    const maxHeight = cellHeight * 0.85; // 85% of cell height

    // Calculate window dimensions based on aspect ratio while respecting max sizes
    let windowWidth: number;
    let windowHeight: number;

    if (maxWidth / aspectRatio <= maxHeight) {
      // Width is the limiting factor
      windowWidth = maxWidth;
      windowHeight = maxWidth / aspectRatio;
    } else {
      // Height is the limiting factor
      windowHeight = maxHeight;
      windowWidth = maxHeight * aspectRatio;
    }

    // Create an array of scrambled day numbers (1-25)
    const scrambledDays = Array.from(
      { length: 25 },
      (_, i) => i + 1
    ).sort(() => Math.random() - 0.5);

    console.log('Grid Debug:', {
      viewport: { width, height },
      cell: { width: cellWidth, height: cellHeight },
      window: { width: windowWidth, height: windowHeight },
      scrambledDays,
    });

    return Array.from({ length: 25 }, (_, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;

      // Calculate base position, centering the entire grid
      const gridWidth = cellWidth * gridSize;
      const gridHeight = cellHeight * gridSize;
      const gridLeft = (width - gridWidth) / 2;
      const gridTop = (height - gridHeight) / 2;

      // Position within the grid, centering windows in their cells
      const baseX =
        gridLeft + col * cellWidth + (cellWidth - windowWidth) / 2;
      const baseY =
        gridTop + row * cellHeight + (cellHeight - windowHeight) / 2;

      // Add small random offset
      const maxOffsetX = (cellWidth - windowWidth) * 0.1;
      const maxOffsetY = (cellHeight - windowHeight) * 0.1;
      const offsetX = (Math.random() - 0.5) * maxOffsetX;
      const offsetY = (Math.random() - 0.5) * maxOffsetY;

      const finalX = baseX + offsetX;
      const finalY = baseY + offsetY;

      if (i === 0) {
        console.log('Window 1 Position Debug:', {
          gridPosition: { row, col },
          gridOffset: { left: gridLeft, top: gridTop },
          basePosition: { x: baseX, y: baseY },
          randomOffset: { x: offsetX, y: offsetY },
          finalPosition: { x: finalX, y: finalY },
        });
      }

      return {
        day: scrambledDays[i],
        isOpen: false,
        x: finalX,
        y: finalY,
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
        imageUrl: `/advent-calendar/thumbnails/day${scrambledDays[i]}.jpg`,
      };
    });
  };

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

  const handleWindowClick = useCallback(
    (clickedDay: number) => {
      if (!day) {
        // Set a small delay to allow the CSS transition to start
        requestAnimationFrame(() => {
          navigate(`/day/${clickedDay}`);
        });
      } else {
        // Check if the door can be opened when trying to open it
        if (!canOpenDoor(clickedDay)) {
          return;
        }
        // If we're zoomed in, toggle the window
        setWindows((prevWindows) => {
          const newWindows = [...prevWindows];
          const windowIndex = newWindows.findIndex(
            (w) => w.day === clickedDay
          );
          if (windowIndex !== -1) {
            newWindows[windowIndex] = {
              ...newWindows[windowIndex],
              isOpen: !newWindows[windowIndex].isOpen,
            };
          }
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              windows: newWindows,
              viewportSize: containerSize,
            })
          );
          return newWindows;
        });
      }
    },
    [containerSize, day, navigate]
  );

  const handleWindowClose = useCallback(
    (clickedDay: number) => {
      // Close the window first
      setWindows((prevWindows) => {
        const newWindows = [...prevWindows];
        const windowIndex = newWindows.findIndex(
          (w) => w.day === clickedDay
        );
        if (windowIndex !== -1) {
          newWindows[windowIndex] = {
            ...newWindows[windowIndex],
            isOpen: false,
          };
        }
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            windows: newWindows,
            viewportSize: containerSize,
          })
        );
        return newWindows;
      });
      // Then navigate back
      navigate('/');
    },
    [navigate, containerSize]
  );

  useEffect(() => {
    const loadAllImages = async () => {
      try {
        setIsLoading(true);
        setAllImagesLoaded(false);
        setLoadingProgress(0);

        // Create an array of all image URLs
        const imageUrls = [
          BACKGROUND_IMAGE_URL,
          ...Array.from(
            { length: 25 },
            (_, i) => `/advent-calendar/thumbnails/day${i + 1}.jpg`
          ),
        ];

        // Load all images concurrently
        const imagePromises = imageUrls.map((url) =>
          preloadImage(url)
        );

        // Track progress
        let loaded = 0;
        await Promise.all(
          imagePromises.map((promise) =>
            promise
              .then(() => {
                loaded++;
                setLoadingProgress((loaded / imageUrls.length) * 100);
              })
              .catch((error) => {
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
          const { windows: savedWindows, viewportSize } = JSON.parse(
            savedData
          ) as CachedData;
          if (
            viewportSize.width === containerSize.width &&
            viewportSize.height === containerSize.height
          ) {
            setWindows(savedWindows);
          } else {
            setWindows(
              generateNewWindows(
                containerSize.width,
                containerSize.height
              )
            );
          }
        } else {
          setWindows(
            generateNewWindows(
              containerSize.width,
              containerSize.height
            )
          );
        }

        // Mark all images as loaded and remove loading screen
        setAllImagesLoaded(true);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay to ensure state update
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
    const handleScroll = (e: WheelEvent) => {
      if (day) {
        e.preventDefault();
        navigate('/');
      }
    };

    window.addEventListener('wheel', handleScroll, {
      passive: false,
    });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [day, navigate]);

  useEffect(() => {
    if (day && windows.length > 0) {
      const dayNumber = parseInt(day);
      const selectedWindow = windows.find((w) => w.day === dayNumber);
      if (selectedWindow) {
        console.log('Selected window:', {
          day: selectedWindow.day,
          position: { x: selectedWindow.x, y: selectedWindow.y },
          size: {
            width: selectedWindow.width,
            height: selectedWindow.height,
          },
        });

        // Parse window dimensions
        const windowX = selectedWindow.x;
        const windowY = selectedWindow.y;
        const windowWidth = parseFloat(selectedWindow.width);
        const windowHeight = parseFloat(selectedWindow.height);

        // Calculate the scale needed to make the window fill most of the viewport
        const targetWidth = containerSize.width * 0.8; // 80% of viewport
        const targetHeight = containerSize.height * 0.8;
        const scaleX = targetWidth / windowWidth;
        const scaleY = targetHeight / windowHeight;
        const scale = Math.min(scaleX, scaleY);

        // Calculate the translation needed to center the target window
        // When using center transform-origin, we need to:
        // 1. Calculate the current position relative to the center
        const containerCenterX = containerSize.width / 2;
        const containerCenterY = containerSize.height / 2;
        const windowCenterX = windowX + windowWidth / 2;
        const windowCenterY = windowY + windowHeight / 2;

        // 2. Calculate the offset from center
        const offsetX = containerCenterX - windowCenterX;
        const offsetY = containerCenterY - windowCenterY;

        // 3. Apply the scale factor to the offset
        const translateX = offsetX * scale;
        const translateY = offsetY * scale;

        console.log('Transform calculation:', {
          container: {
            size: containerSize,
            center: { x: containerCenterX, y: containerCenterY },
          },
          window: {
            day: selectedWindow.day,
            position: { x: windowX, y: windowY },
            center: { x: windowCenterX, y: windowCenterY },
            size: { width: windowWidth, height: windowHeight },
          },
          scale: scale,
          offset: { x: offsetX, y: offsetY },
          translate: { x: translateX, y: translateY },
        });

        setZoomTransform({ scale, translateX, translateY });
      }
    } else {
      setZoomTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  }, [day, windows, containerSize]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <div
          onClick={() => {
            if (day) {
              navigate('/');
            }
          }}
          className="relative w-full h-full transition-transform duration-[2000ms] ease-in-out pointer-events-none"
          style={{
            transform: `scale(${zoomTransform.scale}) translate(${
              zoomTransform.translateX / zoomTransform.scale
            }px, ${
              zoomTransform.translateY / zoomTransform.scale
            }px)`,
            transformOrigin: 'center center',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${BACKGROUND_IMAGE_URL}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.7)',
              pointerEvents: 'auto',
              cursor: day ? 'pointer' : 'default',
            }}
          />
          {allImagesLoaded && (
            <div className="relative w-full h-full">
              {windows.map((window) => (
                <div
                  key={window.day}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${window.x}px`,
                    top: `${window.y}px`,
                    width: window.width,
                    height: window.height,
                  }}
                >
                  <CalendarWindow
                    key={window.day}
                    window={window}
                    onWindowClick={handleWindowClick}
                    onWindowClose={handleWindowClose}
                    day={day}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
