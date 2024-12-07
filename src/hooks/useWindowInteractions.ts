// src/hooks/useWindowInteractions.ts

import { useState, useEffect, useCallback } from 'react';
import {
  canOpenDoor as defaultCanOpenDoor,
  getOpeningDateMessage as defaultGetOpeningDateMessage,
} from '../utils/doorUtils';

interface UseWindowInteractionsProps {
  day: number;
  isOpen: boolean;
  activeDay: string | null;
  onWindowClick: (day: number) => void;
  onWindowClose: (day: number) => void;
  canOpenDoorFn?: (day: number) => boolean;
  getOpeningDateMessageFn?: (day: number) => string;
}

export const useWindowInteractions = ({
  day,
  isOpen,
  activeDay,
  onWindowClick,
  onWindowClose,
  canOpenDoorFn = defaultCanOpenDoor,
  getOpeningDateMessageFn = defaultGetOpeningDateMessage,
}: UseWindowInteractionsProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [swipeStartedOnBack, setSwipeStartedOnBack] = useState(false);

  const canOpen = canOpenDoorFn(day);
  const openingDateMessage = getOpeningDateMessageFn(day);

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, isBack: boolean = false) => {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setSwipeStartedOnBack(isBack);
    },
    [setTouchStart, setSwipeStartedOnBack]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStart.x; // Positive for right swipe
      const deltaY = touch.clientY - touchStart.y; // Positive for down swipe
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // If started on back and swiping right with enough distance
      if (swipeStartedOnBack && deltaX > 50 && isOpen) {
        handleBackClick(e as any);
        setTouchStart(null);
        return;
      }

      // When zoomed out and not starting on back, any significant swipe on a door triggers zoom
      if (!activeDay && !swipeStartedOnBack && distance > 30) {
        onWindowClick(day);
        setTouchStart(null);
        return;
      }

      // If not started on back and swiping left with enough distance while zoomed in
      if (
        !swipeStartedOnBack &&
        deltaX < -50 &&
        activeDay &&
        !isOpen &&
        canOpen
      ) {
        onWindowClick(day);
        setTouchStart(null);
      }
    },
    [
      touchStart,
      swipeStartedOnBack,
      isOpen,
      activeDay,
      onWindowClick,
      day,
      canOpen,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null);
    setSwipeStartedOnBack(false);
  }, [setTouchStart, setSwipeStartedOnBack]);

  const handleBackClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      onWindowClose(day);
    },
    [onWindowClose, day]
  );

  const handleDoorFrontClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const isZoomedIn = !!activeDay;
      if (isZoomedIn && !canOpen) {
        setIsFadingOut(false);
        setIsShaking(true);
        setShowMessage(true);
        setTimeout(() => setIsShaking(false), 820);
        return;
      }
      debugger;
      onWindowClick(day);
    },
    [activeDay, canOpen, onWindowClick, day]
  );

  // Handle message fading when activeDay changes
  useEffect(() => {
    if (!activeDay) {
      setIsShaking(false);
      if (showMessage) {
        setIsFadingOut(true);
        const timer = setTimeout(() => {
          setShowMessage(false);
          setIsFadingOut(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [activeDay, showMessage]);

  // Manage content visibility based on window open state
  useEffect(() => {
    if (isOpen) {
      setShowContent(true);
    } else {
      const timer = setTimeout(() => {
        setShowContent(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return {
    showMessage,
    isShaking,
    isFadingOut,
    showContent,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleBackClick,
    handleDoorFrontClick,
    canOpenDoor: canOpen,
    openingDateMessage,
  };
};
