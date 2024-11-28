import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWindowInteractions } from '../useWindowInteractions';

describe('useWindowInteractions', () => {
  const mockProps = {
    day: 1,
    isOpen: false,
    activeDay: null,
    onWindowClick: vi.fn(),
    onWindowClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('handles window click when door can be opened', () => {
    const { result } = renderHook(() => useWindowInteractions(mockProps));

    act(() => {
      result.current.handleDoorFrontClick({ stopPropagation: vi.fn() } as unknown as React.MouseEvent);
    });

    expect(mockProps.onWindowClick).toHaveBeenCalledWith(mockProps.day);
    expect(result.current.showMessage).toBe(false);
  });

  it('shows message when door cannot be opened', () => {
    const { result } = renderHook(() =>
      useWindowInteractions({
        ...mockProps,
        canOpenDoorFn: () => false,
        activeDay: '2', // Simulating zoomed in state
      })
    );

    act(() => {
      result.current.handleDoorFrontClick({ stopPropagation: vi.fn() } as unknown as React.MouseEvent);
    });

    expect(mockProps.onWindowClick).not.toHaveBeenCalled();
    expect(result.current.showMessage).toBe(true);
    expect(result.current.isShaking).toBe(true);
  });

  it('handles back click', () => {
    const { result } = renderHook(() => useWindowInteractions(mockProps));
    const mockEvent = {
      stopPropagation: vi.fn(),
    } as unknown as React.MouseEvent;

    act(() => {
      result.current.handleBackClick(mockEvent);
    });

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(mockProps.onWindowClose).toHaveBeenCalledWith(mockProps.day);
  });

  it('handles touch interactions', () => {
    const { result } = renderHook(() => useWindowInteractions(mockProps));
    const mockTouchStart = {
      touches: [{ clientX: 100, clientY: 100 }],
    } as unknown as React.TouchEvent;

    act(() => {
      result.current.handleTouchStart(mockTouchStart);
    });

    const mockTouchMove = {
      touches: [{ clientX: 150, clientY: 100 }],
      stopPropagation: vi.fn(),
    } as unknown as React.TouchEvent;

    act(() => {
      result.current.handleTouchMove(mockTouchMove);
    });

    expect(mockProps.onWindowClick).toHaveBeenCalledWith(mockProps.day);
  });

  it('clears message after timeout', async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useWindowInteractions({
        ...mockProps,
        canOpenDoorFn: () => false,
        activeDay: '2', // Simulating zoomed in state
      })
    );

    act(() => {
      result.current.handleDoorFrontClick({ stopPropagation: vi.fn() } as unknown as React.MouseEvent);
    });

    expect(result.current.showMessage).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isShaking).toBe(false);
    vi.useRealTimers();
  });

  it('handles shake animation', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useWindowInteractions({
        ...mockProps,
        canOpenDoorFn: () => false,
        activeDay: '2', // Simulating zoomed in state
      })
    );

    act(() => {
      result.current.handleDoorFrontClick({ stopPropagation: vi.fn() } as unknown as React.MouseEvent);
    });

    expect(result.current.isShaking).toBe(true);

    act(() => {
      vi.advanceTimersByTime(820); // Animation duration + buffer
    });

    expect(result.current.isShaking).toBe(false);
    vi.useRealTimers();
  });
});
