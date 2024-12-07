// src/utils/windowGenerator.ts
import { WindowData } from '../types';

export const generateNewWindows = (
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
  const maxHeight = cellHeight * 0.9; // 85% of cell height

  // Calculate window dimensions based on aspect ratio while respecting max sizes
  let windowWidth: number;
  let windowHeight: number;

  if (maxWidth / aspectRatio <= maxHeight) {
    // Width is the limiting factor
    windowWidth = maxWidth;
    windowHeight = maxHeight; //maxWidth / aspectRatio;
  } else {
    // Height is the limiting factor
    windowHeight = maxHeight;
    windowWidth = maxWidth; //maxHeight * aspectRatio;
  }

  // Create an array of scrambled day numbers (1-12)
  const scrambledDays = [1, 9, 8, 10, 2, 11, 3, 4, 5, 12, 6, 7];

  const windows: WindowData[] = Array.from({ length: 12 }, (_, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;

    // Calculate base position, centering the entire grid
    const gridWidth = cellWidth * columns;
    const gridHeight = cellHeight * rows;
    const gridLeft = (width - gridWidth) / 2;
    const gridTop = (height - gridHeight) / 2;

    // Position within the grid, centering windows in their cells
    const finalX =
      gridLeft + col * cellWidth + (cellWidth - windowWidth) / 2;
    const finalY =
      gridTop + row * cellHeight + (cellHeight - windowHeight) / 2;

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
  return windows;
};
