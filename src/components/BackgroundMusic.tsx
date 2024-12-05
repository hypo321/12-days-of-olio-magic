import React, { useRef, useState, useEffect } from 'react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(initiallyEnabled);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = true;
      
      if (initiallyEnabled) {
        audio.play().catch(error => {
          console.error('Playback prevented:', error);
          setIsPlaying(false);
        });
      }
    }
  }, [volume, initiallyEnabled]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => {
          console.error('Playback prevented:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={togglePlay}
        className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none group"
        aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      >
        {isPlaying ? (
          <SpeakerWaveIcon className="w-6 h-6 text-white group-hover:text-pink-200 transition-colors" />
        ) : (
          <SpeakerXMarkIcon className="w-6 h-6 text-white group-hover:text-pink-200 transition-colors" />
        )}
      </button>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
