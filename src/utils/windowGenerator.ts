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
  const availableWidth = width * 0.92;
  const availableHeight = height * 0.92;

  // Calculate cell dimensions
  const cellWidth = availableWidth / columns;
  const cellHeight = availableHeight / rows;

  const maxWidth = cellWidth * 0.9; // 90% of cell width
  const maxHeight = cellHeight * 0.9; // 85% of cell height

  // Calculate window dimensions based on aspect ratio while respecting max sizes
  let windowWidth: number;
  let windowHeight: number;

  windowWidth = maxWidth;
  windowHeight = maxHeight;

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
