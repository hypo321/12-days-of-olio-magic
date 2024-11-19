import React from 'react';
import { CalendarWindow as CalendarWindowType } from '../types';
import { BACKGROUND_IMAGE_URL } from '../constants';

interface Props {
  window: CalendarWindowType;
  onWindowClick: (day: number) => void;
  onWindowClose: (day: number) => void;
}

export const CalendarWindow: React.FC<Props> = ({
  window,
  onWindowClick,
  onWindowClose,
}) => {
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

  const handleBackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Door back clicked for window:', window.day);
    onWindowClose(window.day);
  };

  return (
    <div className="calendar-window" style={{ perspective: '1000px' }}>
      <div 
        className={`door ${window.isOpen ? 'open' : ''}`}
        style={{ 
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="door-front"
          onClick={(e) => {
            e.stopPropagation();
            if (!window.isOpen) {
              onWindowClick(window.day);
            }
          }}
        >
          <div className="door-front-image" style={backgroundStyle} />
          <div className="door-number">{window.day}</div>
        </div>
        <div
          className="door-back"
          onClick={handleBackClick}
          style={{
            position: 'absolute',
            inset: '0',
            cursor: 'pointer',
            transform: 'rotateY(180deg)',
            backgroundColor: window.isOpen ? 'rgba(255, 0, 0, 0.3)' : undefined, // Debug color
            zIndex: 10,
            backfaceVisibility: 'hidden',
          }}
        />
      </div>
      <div 
        className="content-behind"
        style={{
          position: 'absolute',
          inset: '0',
          zIndex: 1,
        }}
      >
        <img
          src={window.imageUrl}
          alt={`Day ${window.day}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};
