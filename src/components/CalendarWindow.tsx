import React, { useState, useEffect } from 'react';
import { CalendarWindow as CalendarWindowType } from '../types';
import { BACKGROUND_IMAGE_URL } from '../constants';
import { canOpenDoor, getOpeningDateMessage } from '../utils';
import { useParams } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';

interface Props {
  window: CalendarWindowType;
  onWindowClick: (day: number) => void;
  onWindowClose: (day: number) => void;
  day: string | null;
}

export const CalendarWindow: React.FC<Props> = ({
  window,
  onWindowClick,
  onWindowClose,
  day,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const { openModal, closeModal } = useModal();
  const { day: activeDay } = useParams();
  const isActiveDay = activeDay === String(window.day);

  const backgroundStyle = {
    backgroundImage: `url("${BACKGROUND_IMAGE_URL}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transform: `translate(${-window.x}px, ${-window.y}px)`,
    width: '100vw',
    height: '100vh',
    position: 'absolute' as const,
    top: '0',
    left: '0',
    transformOrigin: '0 0',
  };

  const thumbnailStyle = {
    backgroundImage: `url("/content/day${window.day}-thumb.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    height: '100%',
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Door back clicked for window:', window.day);
    onWindowClose(window.day);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touchStart.x - touch.clientX;
    const deltaY = Math.abs(touchStart.y - touch.clientY);
    
    // If horizontal movement is greater than vertical and exceeds threshold
    if (deltaX > 50 && deltaY < 30) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSwiping && day && !window.isOpen && canOpenDoor(window.day)) {
      console.log('Swipe detected, opening door:', window.day);
      onWindowClick(window.day);
    }
    setTouchStart(null);
    setIsSwiping(false);
  };

  useEffect(() => {
    if (!day) {
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
  }, [day, showMessage]);

  useEffect(() => {
    if (window.isOpen) {
      setShowContent(true);
    } else {
      const timer = setTimeout(() => {
        setShowContent(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [window.isOpen]);

  useEffect(() => {
    console.log('Door state changed:', {
      windowDay: window.day,
      isOpen: window.isOpen,
      activeDay,
      isActiveDay,
      day,
    });

    if (window.isOpen && activeDay === String(window.day)) {
      console.log('Opening modal for day:', window.day);
      const timer = setTimeout(() => {
        openModal(window.day);
      }, 700); // Match the door opening animation duration
      return () => clearTimeout(timer);
    }
  }, [window.isOpen, activeDay, window.day, openModal]);

  useEffect(() => {
    if (!day) {
      console.log('Closing modal - zoomed out');
      closeModal();
    }
  }, [day, closeModal]);

  return (
    <div
      className="calendar-window absolute pointer-events-auto"
      style={{
        perspective: '1000px',
        left: `${window.x}px`,
        top: `${window.y}px`,
        width: window.width,
        height: window.height,
        willChange: 'transform',
      }}
    >
      <div
        className={`door ${window.isOpen ? 'open' : ''} ${
          !canOpenDoor(window.day) ? 'locked' : ''
        } ${isShaking ? 'shake' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="door-front"
          onClick={(e) => {
            e.stopPropagation();
            const isZoomedIn = !!day;
            if (isZoomedIn && !canOpenDoor(window.day)) {
              setIsFadingOut(false);
              setIsShaking(true);
              setShowMessage(true);
              setTimeout(() => setIsShaking(false), 820);
              return;
            }
            onWindowClick(window.day);
          }}
        >
          <div className="door-front-image" style={backgroundStyle} />
          <div className="door-number">{window.day}</div>
          {showMessage && !canOpenDoor(window.day) && (
            <div
              className={`date-message ${
                isFadingOut ? 'fade-out' : ''
              }`}
            >
              {getOpeningDateMessage(window.day)}
            </div>
          )}
        </div>
        <div
          className="door-back"
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            inset: '0',
            cursor: 'pointer',
            transform: 'rotateY(180deg)',
            backgroundColor: window.isOpen
              ? 'rgba(255, 0, 0, 0.3)'
              : undefined,
            zIndex: 10,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
      <div
        className="content-behind rounded-lg"
        onClick={(e) => {
          e.stopPropagation();
          console.log('Content behind clicked:', {
            isOpen: window.isOpen,
            isZoomedOut: !day,
            day: window.day
          });
          if (!day && window.isOpen) {
            onWindowClick(window.day);
          }
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!day && window.isOpen) {
            console.log('Touch end on content-behind, triggering zoom for day:', window.day);
            onWindowClick(window.day);
          }
        }}
        style={{
          cursor: window.isOpen ? 'pointer' : 'default',
          touchAction: window.isOpen ? 'none' : 'auto',
        }}
      >
        {showContent && (
          <div style={thumbnailStyle} className="rounded-lg" />
        )}
      </div>
    </div>
  );
};
