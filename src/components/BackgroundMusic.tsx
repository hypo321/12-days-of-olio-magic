import React, { useRef, useState, useEffect } from 'react';
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/solid';

interface BackgroundMusicProps {
  fileName: string;
  volume?: number;
  initiallyEnabled?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  fileName,
  volume = 0.3,
  initiallyEnabled = false,
}) => {
  if (import.meta.env.VITE_ENABLE_BACKGROUND_MUSIC === 'false') {
    return null;
  }

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(initiallyEnabled);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = true;
    }
  }, [volume]);

  // Sync with initiallyEnabled prop changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (initiallyEnabled && !isPlaying) {
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else if (!initiallyEnabled && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
    }
  }, [initiallyEnabled]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="relative">
        {/* Multiple ripple elements with different delays */}
        {isPlaying && (
          <>
            <div className="hidden md:block absolute inset-0 bg-white/80 rounded-full animate-music-ripple" />
            <div className="hidden md:block absolute inset-0 bg-white/60 rounded-full animate-music-ripple [animation-delay:0.5s]" />
            <div className="hidden md:block absolute inset-0 bg-white/50 rounded-full animate-music-ripple [animation-delay:1s]" />
          </>
        )}
        <button
          onClick={togglePlay}
          className="relative p-3 bg-white/30 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none  group z-10"
          aria-label={
            isPlaying
              ? 'Mute background music'
              : 'Play background music'
          }
        >
          {isPlaying ? (
            <SpeakerWaveIcon className="w-6 h-6 text-white group-hover:text-pink-200 transition-colors" />
          ) : (
            <SpeakerXMarkIcon className="w-6 h-6 text-white group-hover:text-pink-200 transition-colors" />
          )}
        </button>
      </div>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
