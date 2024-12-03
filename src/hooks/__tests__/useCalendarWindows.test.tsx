import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCalendarWindows } from '../useCalendarWindows';
import * as localStorageUtils from '../../utils/localStorageUtils';
import * as windowGenerator from '../../utils/windowGenerator';

vi.mock('../../utils/localStorageUtils');
vi.mock('../../utils/windowGenerator');

describe('useCalendarWindows', () => {
  const mockContainerSize = { width: 1000, height: 800 };
  const mockWindows = [
    { 
      day: 1, 
      x: 100, 
      y: 100, 
      width: '100px', 
      height: '100px', 
      isOpen: false,
      imageUrl: '/images/day1.jpg'
    },
    { 
      day: 2, 
      x: 200, 
      y: 200, 
      width: '100px', 
      height: '100px', 
      isOpen: false,
      imageUrl: '/images/day2.jpg'
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads saved windows when viewport size matches', () => {
    vi.mocked(localStorageUtils.getWindowData).mockReturnValue({
      windows: mockWindows,
      viewportSize: mockContainerSize,
    });

    const { result } = renderHook(() => useCalendarWindows(mockContainerSize));

    expect(result.current[0]).toEqual(mockWindows);
    expect(localStorageUtils.getWindowData).toHaveBeenCalled();
    expect(windowGenerator.generateNewWindows).not.toHaveBeenCalled();
  });

  it('generates new windows when viewport size differs', () => {
    vi.mocked(localStorageUtils.getWindowData).mockReturnValue({
      windows: mockWindows,
      viewportSize: { width: 800, height: 600 }, // Different size
    });

    vi.mocked(windowGenerator.generateNewWindows).mockReturnValue(mockWindows);

    const { result } = renderHook(() => useCalendarWindows(mockContainerSize));

    expect(result.current[0]).toEqual(mockWindows);
    expect(windowGenerator.generateNewWindows).toHaveBeenCalledWith(
      mockContainerSize.width,
      mockContainerSize.height
    );
    expect(localStorageUtils.saveWindowData).toHaveBeenCalledWith({
      windows: mockWindows,
      viewportSize: mockContainerSize,
    });
  });

  it('generates new windows when no saved data exists', () => {
    vi.mocked(localStorageUtils.getWindowData).mockReturnValue(null);
    vi.mocked(windowGenerator.generateNewWindows).mockReturnValue(mockWindows);

    const { result } = renderHook(() => useCalendarWindows(mockContainerSize));

    expect(result.current[0]).toEqual(mockWindows);
    expect(windowGenerator.generateNewWindows).toHaveBeenCalledWith(
      mockContainerSize.width,
      mockContainerSize.height
    );
    expect(localStorageUtils.saveWindowData).toHaveBeenCalledWith({
      windows: mockWindows,
      viewportSize: mockContainerSize,
    });
  });
});
