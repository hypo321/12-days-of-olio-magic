// src/hooks/useCalendarWindows.ts

import { useState, useEffect } from 'react';
import {
  getWindowData,
  saveWindowData,
} from '../utils/localStorageUtils';
import { generateNewWindows } from '../utils/windowGenerator';
import { WindowData } from '../types';

interface ViewportSize {
  width: number;
  height: number;
}

export const useCalendarWindows = (containerSize: ViewportSize) => {
  const [windows, setWindows] = useState<WindowData[]>([]);

  useEffect(() => {
    const savedData = getWindowData();
    if (
      savedData &&
      savedData.viewportSize.width === containerSize.width &&
      savedData.viewportSize.height === containerSize.height
    ) {
      setWindows(savedData.windows);
    } else {
      const newWindows = generateNewWindows(
        containerSize.width,
        containerSize.height
      );
      setWindows(newWindows);
      saveWindowData({
        windows: newWindows,
        viewportSize: containerSize,
      });
    }
  }, [containerSize]);

  return [windows, setWindows] as const;
};
