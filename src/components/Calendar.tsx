import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarWindow as CalendarWindowType } from '../types';
import { CalendarWindow } from './CalendarWindow';
import { LoadingScreen } from './LoadingScreen';
import { BACKGROUND_IMAGE_URL } from '../constants';
import { canOpenDoor } from '../utils';

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

export const Calendar = () => {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [containerSize, setContainerSize] = useState(() => ({
    width: window.visualViewport?.width || window.innerWidth,
    height: window.visualViewport?.height || window.innerHeight,
  }));
  const [isZooming, setIsZooming] = useState(false);
  const { day } = useParams<{ day?: string }>();
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Add state for zoom transform
  const [zoomTransform, setZoomTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });

  const generateNewWindows = (
    width: number,
    height: number
  ): WindowData[] => {
    // Determine if we're in portrait mode
    const isPortrait = height > width;
    const columns = isPortrait ? 3 : 4;
    const rows = isPortrait ? 4 : 3;

    // Calculate available space
    const availableWidth = width;
    const availableHeight = height;

    // Calculate cell dimensions
    const cellWidth = availableWidth / columns;
    const cellHeight = availableHeight / rows;

    // Calculate window size to fit within cells
    // Make windows match the viewport's aspect ratio more closely
    const viewportAspectRatio = width / height;
    const aspectRatio = isPortrait
      ? Math.min(1.1, viewportAspectRatio * 1.2) // In portrait, slightly taller
      : Math.max(1.2, viewportAspectRatio * 0.8); // In landscape, slightly wider

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

    // Create an array of scrambled day numbers (1-12)
    const scrambledDays = Array.from(
      { length: 12 },
      (_, i) => i + 1
    ).sort(() => Math.random() - 0.5);

    return Array.from({ length: 12 }, (_, i) => {
      const row = Math.floor(i / columns);
      const col = i % columns;

      // Calculate base position, centering the entire grid
      const gridWidth = cellWidth * columns;
      const gridHeight = cellHeight * rows;
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

      return {
        day: scrambledDays[i],
        isOpen: false,
        x: finalX,
        y: finalY,
        width: `${windowWidth}px`,
        height: `${windowHeight}px`,
        imageUrl: `/thumbnails/day${scrambledDays[i]}.jpg`,
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
      if (!activeDay) {
        setIsZooming(true);
        setActiveDay(clickedDay.toString());
        navigate(`/day/${clickedDay}`, { replace: true });
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
            'advent-calendar-windows',
            JSON.stringify({
              windows: newWindows,
              viewportSize: containerSize,
            })
          );
          return newWindows;
        });
      }
    },
    [containerSize, activeDay, navigate]
  );

  const handleBackgroundClick = useCallback(() => {
    if (activeDay) {
      setIsZooming(true);
      setActiveDay(null);
      navigate('/', { replace: true });
    }
  }, [activeDay, navigate]);

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
          'advent-calendar-windows',
          JSON.stringify({
            windows: newWindows,
            viewportSize: containerSize,
          })
        );
        return newWindows;
      });

      // Reset zoom state and navigate
      setIsZooming(true);
      setActiveDay(null);
      navigate('/', { replace: true });
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
            { length: 12 },
            (_, i) => `/thumbnails/day${i + 1}.jpg`
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
                loaded++;
                setLoadingProgress((loaded / imageUrls.length) * 100);
              })
          )
        );

        // Initialize windows
        const savedData = localStorage.getItem(
          'advent-calendar-windows'
        );
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
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setAllImagesLoaded(true);
        setIsLoading(false);
      }
    };

    loadAllImages();
  }, [containerSize]);

  // Handle initial load and URL changes
  useEffect(() => {
    if (!allImagesLoaded || windows.length === 0 || !isInitialLoad)
      return;

    // Always start with zoomed out view
    setZoomTransform({ scale: 1, translateX: 0, translateY: 0 });

    if (day) {
      // Wait a bit to show the full calendar before zooming
      const timer = setTimeout(() => {
        setIsZooming(true);
        setActiveDay(day);
      }, 1000); // Give more time to see the full calendar
      return () => clearTimeout(timer);
    }
    setIsInitialLoad(false);
  }, [allImagesLoaded, windows.length, day, isInitialLoad]);

  // Handle URL changes after initial load
  useEffect(() => {
    if (isInitialLoad) return;

    if (!day && activeDay) {
      // When URL changes to home, zoom out
      setIsZooming(true);
      setActiveDay(null);
    } else if (day && day !== activeDay) {
      // When URL changes to a different day, update active day
      setIsZooming(true);
      setActiveDay(day);
    }
    setIsInitialLoad(false);
  }, [day, activeDay, isInitialLoad]);

  const handleTransitionEnd = useCallback(() => {
    setIsZooming(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.visualViewport?.width || window.innerWidth;
      const height =
        window.visualViewport?.height || window.innerHeight;

      setContainerSize({ width, height });
      setWindows(generateNewWindows(width, height));
    };

    // Handle both window resize and viewport changes (e.g., mobile browser UI showing/hiding)
    window.addEventListener('resize', handleResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          'resize',
          handleResize
        );
      }
    };
  }, []);

  // Handle zoom animations
  useEffect(() => {
    if (!windows.length) return;

    if (activeDay) {
      const dayNumber = parseInt(activeDay);
      const selectedWindow = windows.find((w) => w.day === dayNumber);
      if (selectedWindow) {
        // Calculate zoom transform using visualViewport
        const windowX = selectedWindow.x;
        const windowY = selectedWindow.y;
        const windowWidth = parseFloat(selectedWindow.width);
        const windowHeight = parseFloat(selectedWindow.height);

        const viewportWidth =
          window.visualViewport?.width || containerSize.width;
        const viewportHeight =
          window.visualViewport?.height || containerSize.height;

        const targetWidth = viewportWidth * 0.8;
        const targetHeight = viewportHeight * 0.8;
        const scaleX = targetWidth / windowWidth;
        const scaleY = targetHeight / windowHeight;
        const scale = Math.min(scaleX, scaleY);

        const containerCenterX = viewportWidth / 2;
        const containerCenterY = viewportHeight / 2;
        const windowCenterX = windowX + windowWidth / 2;
        const windowCenterY = windowY + windowHeight / 2;

        const offsetX = containerCenterX - windowCenterX;
        const offsetY = containerCenterY - windowCenterY;

        const translateX = offsetX * scale;
        const translateY = offsetY * scale;

        setZoomTransform({ scale, translateX, translateY });
      }
    } else {
      // Reset zoom when no active day
      setZoomTransform({ scale: 1, translateX: 0, translateY: 0 });
    }
  }, [activeDay, windows, containerSize]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (activeDay) {
        e.preventDefault();
        setIsZooming(true);
        setActiveDay(null);
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeDay, navigate]);

  // Add keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeDay) return;

      const currentDay = parseInt(activeDay);

      // Handle ESC, Space, or Return
      if (
        e.key === 'Escape' ||
        e.key === ' ' ||
        e.key === 'Enter' ||
        e.key === 'Backspace'
      ) {
        e.preventDefault();
        setIsZooming(true);
        setActiveDay(null);
        navigate('/', { replace: true });
        return;
      }

      // Handle left arrow
      if (e.key === 'ArrowLeft' && currentDay > 1) {
        e.preventDefault();
        const prevDay = currentDay - 1;
        // First zoom out
        setIsZooming(true);
        setActiveDay(null);
        navigate('/', { replace: true });
        // Then zoom into the previous day after a short delay
        setTimeout(() => {
          setIsZooming(true);
          setActiveDay(prevDay.toString());
          navigate(`/day/${prevDay}`, { replace: true });
        }, 1000);
        return;
      }

      // Handle right arrow
      if (e.key === 'ArrowRight' && currentDay < 12) {
        e.preventDefault();
        const nextDay = currentDay + 1;
        // First zoom out
        setIsZooming(true);
        setActiveDay(null);
        navigate('/', { replace: true });
        // Then zoom into the next day after a short delay
        setTimeout(() => {
          setIsZooming(true);
          setActiveDay(nextDay.toString());
          navigate(`/day/${nextDay}`, { replace: true });
        }, 1000);
        return;
      }

      // Handle number keys 1-9
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= 9) {
        e.preventDefault();
        if (num === currentDay) return; // Don't do anything if it's the same day

        // First zoom out
        setIsZooming(true);
        setActiveDay(null);
        navigate('/', { replace: true });
        // Then zoom into the selected day after a short delay
        setTimeout(() => {
          setIsZooming(true);
          setActiveDay(num.toString());
          navigate(`/day/${num}`, { replace: true });
        }, 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDay, navigate]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {isLoading ? (
        <LoadingScreen progress={loadingProgress} />
      ) : (
        <div
          onClick={handleBackgroundClick}
          onTransitionEnd={handleTransitionEnd}
          className={`relative w-full h-full transition-all duration-1000 ${
            isZooming ? 'ease-in-out' : ''
          } pointer-events-none`}
          style={{
            willChange: 'transform',
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
              cursor: activeDay ? 'pointer' : 'default',
            }}
          />
          {allImagesLoaded && (
            <div className="relative w-full h-full">
              {windows.map((window) => (
                <div
                  key={window.day}
                  className={`transition-transform duration-1000 ${
                    isZooming ? 'ease-in-out' : ''
                  }`}
                  style={{
                    willChange: 'transform',
                    transform:
                      activeDay && parseInt(activeDay) === window.day
                        ? 'translateZ(20px)'
                        : 'none',
                  }}
                >
                  <CalendarWindow
                    window={window}
                    onWindowClick={handleWindowClick}
                    onWindowClose={handleWindowClose}
                    day={day || null}
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
