import React, { useRef, useState, useEffect } from 'react';

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
        className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none"
        aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
      >
        {isPlaying ? (
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4L6 10H3v4h3l6 6V4zm4.32 4.32c.28.28.53.6.74.94l1.47-1.47c-.42-.57-.93-1.08-1.5-1.5l-1.47 1.47zM19 12c0 .82-.15 1.61-.41 2.34l1.48 1.48c.45-1.19.71-2.47.71-3.82 0-2.52-.99-4.86-2.64-6.54l-1.42 1.42C17.84 8.37 19 10.07 19 12z" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4L6 10H3v4h3l6 6V4zm4.32 4.32l2.1-2.1c-.16-.18-.33-.35-.51-.51l-2.1 2.1c.18.16.35.33.51.51zM19 12c0 .82-.15 1.61-.41 2.34l1.48 1.48c.45-1.19.71-2.47.71-3.82 0-2.52-.99-4.86-2.64-6.54l-1.42 1.42C17.84 8.37 19 10.07 19 12z M3.28 2L2 3.27 4.73 6H3v4h3l6 6v-7.73l2 2V19c0 .82-.15 1.61-.41 2.34l1.48 1.48c.45-1.19.71-2.47.71-3.82 0-2.52-.99-4.86-2.64-6.54l-1.42 1.42C17.84 8.37 19 10.07 19 12l-2-2-3.73-3.73L16.73 3 15.27 1.54 3.28 2z" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
