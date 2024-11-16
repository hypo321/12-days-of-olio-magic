import { CalendarWindow as CalendarWindowType } from '../types';

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
    backgroundImage: 'url("https://images.unsplash.com/photo-1543589077-47d81606c1bf")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    transform: `translate(${-window.x}px, ${-window.y}px)`,
    width: '100vw',
    height: '100vh',
    position: 'absolute' as const,
    top: '0',
    left: '0',
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
        <div className="door-edge" />
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
