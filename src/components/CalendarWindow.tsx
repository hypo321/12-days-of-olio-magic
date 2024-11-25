import React, { useState, useEffect } from 'react';
import { CalendarWindow as CalendarWindowType } from '../types';
import { BACKGROUND_IMAGE_URL } from '../constants';
import { canOpenDoor, getOpeningDateMessage } from '../utils';
import { DayContent } from './DayContent';
import { useParams } from 'react-router-dom';

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
  const { day: activeDay } = useParams();
  const isActiveDay = activeDay === window.day.toString();

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
        className={`door ${window.isOpen ? 'open' : ''} ${!canOpenDoor(window.day) ? 'locked' : ''} ${isShaking ? 'shake' : ''}`}
        style={{ 
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
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
            <div className={`date-message ${isFadingOut ? 'fade-out' : ''}`}>
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
            backgroundColor: window.isOpen ? 'rgba(255, 0, 0, 0.3)' : undefined,
            zIndex: 10,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
      <div 
        className="content-behind"
        onClick={(e) => {
          e.stopPropagation();
          if (!day && window.isOpen) {
            onWindowClick(window.day);
          }
        }}
        style={{
          cursor: (!day && window.isOpen) ? 'pointer' : 'default'
        }}
      >
        {showContent && (
          <div style={thumbnailStyle} />
        )}
        {showContent && isActiveDay && (
          <DayContent 
            day={window.day} 
            isVisible={!!day}
          />
        )}
      </div>
    </div>
  );
};
