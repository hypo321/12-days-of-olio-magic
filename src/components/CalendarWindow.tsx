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
    transform: `translate(${-window.x}px, ${-window.y}px) scale(1.005)`, // Slight scale to prevent edge artifacts
    width: '100vw',
    height: '100vh',
    position: 'absolute' as const,
    top: '0',
    left: '0',
    transformOrigin: '0 0',
  };

  return (
    <div className="calendar-window">
      <div className={`door ${window.isOpen ? 'open' : ''}`}>
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
          onClick={(e) => {
            e.stopPropagation();
            onWindowClose(window.day);
          }}
        />
      </div>
      <div className="content-behind">
        <img
          src={window.imageUrl}
          alt={`Day ${window.day}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
};
