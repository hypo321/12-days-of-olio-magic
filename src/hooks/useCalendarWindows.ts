// src/hooks/useCalendarWindows.ts

import { useState, useEffect } from 'react';
import { generateNewWindows } from '../utils/windowGenerator';
import { WindowData } from '../types';

interface ViewportSize {
  width: number;
  height: number;
}

export const useCalendarWindows = (containerSize: ViewportSize) => {
  const [windows, setWindows] = useState<WindowData[]>([]);

  useEffect(() => {
    const newWindows = generateNewWindows(
      containerSize.width,
      containerSize.height
    );
    setWindows(newWindows);
  }, [containerSize]);

  return [windows, setWindows] as const;
};
