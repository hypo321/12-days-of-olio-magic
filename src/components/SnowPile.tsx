import React from 'react';

export const SnowPile: React.FC = () => {
  if (import.meta.env.VITE_ENABLE_SNOW_PILE === 'false') {
    return null;
  }

  const generateSnowSections = () => {
    const sections = [
      { pos: 0, width: 5, anim: 'snow-fast' },
      { pos: 5, width: 15, anim: 'snow-medium' },
      { pos: 20, width: 15, anim: 'snow-medium' },
      { pos: 35, width: 15, anim: 'snow-slow' },
      { pos: 50, width: 15, anim: 'snow-medium' },
      { pos: 65, width: 15, anim: 'snow-medium' },
      { pos: 80, width: 15, anim: 'snow-medium' },
      { pos: 95, width: 5, anim: 'snow-fast' },
    ];

    return sections.map(({ pos, width, anim }, index) => (
      <div
        key={index}
        className={`absolute bottom-0 origin-bottom ${anim}`}
        style={{
          left: `${pos}%`,
          width: `${width}%`,
          height: '100%',
          background:
            'linear-gradient(to top, rgba(255, 255, 255, 0.6), transparent)',
          maskImage: 'linear-gradient(to top, white, transparent)',
          WebkitMaskImage:
            'linear-gradient(to top, white, transparent)',
          transformOrigin: 'bottom',
        }}
      />
    ));
  };

  return (
    <div className="hidden md:block absolute bottom-0 left-0 right-0 z-40 pointer-events-none h-[10%]">
      {/* Snow sections */}
      <div className="relative h-full">{generateSnowSections()}</div>

      {/* Left snow drift */}
      <div
        className="absolute bottom-0 left-0 w-[20%] h-[130%] origin-bottom animate-snow-drift"
        style={{
          background:
            'linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4), transparent)',
          maskImage: 'linear-gradient(to top, white, transparent)',
          WebkitMaskImage:
            'linear-gradient(to top, white, transparent)',
          transformOrigin: 'bottom',
          transform: 'translateX(-30%) scaleY(0)',
          animation: 'driftGrow 45s ease-out forwards',
        }}
      />

      {/* Right snow drift */}
      <div
        className="absolute bottom-0 right-0 w-[20%] h-[130%] origin-bottom animate-snow-drift"
        style={{
          background:
            'linear-gradient(to left, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4), transparent)',
          maskImage: 'linear-gradient(to top, white, transparent)',
          WebkitMaskImage:
            'linear-gradient(to top, white, transparent)',
          transformOrigin: 'bottom',
          transform: 'translateX(30%) scaleY(0)',
          animation: 'driftGrow 45s ease-out forwards',
        }}
      />

      {/* Base snow layer */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%]">
        <div
          className="w-full h-full origin-bottom"
          style={{
            background:
              'linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.6))',
            transform: 'scaleY(0)',
            animation: 'snowGrowFast 40s ease-out forwards',
            transformOrigin: 'bottom',
          }}
        />
      </div>
    </div>
  );
};
