import React, { useRef, useState, useEffect } from 'react';
import {
  MusicalNoteIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/solid';
import { trackMusicToggle } from '../utils/analytics';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';
import { useBackgroundMusicState } from '../hooks/useBackgroundMusicState';

interface BackgroundMusicProps {
  fileName: string;
  volume?: number;
  initiallyEnabled?: boolean;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  fileName,
  volume = 0.2,
  initiallyEnabled = false,
}) => {
  if (import.meta.env.VITE_ENABLE_BACKGROUND_MUSIC === 'false') {
    return null;
  }

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(initiallyEnabled);
  const { registerVolumeControl } = useBackgroundMusicVolume();
  const { registerMusicControl } = useBackgroundMusicState();

  // Register volume control
  useEffect(() => {
    registerVolumeControl({
      setVolume: (newVolume: number) => {
        if (audioRef.current) {
          audioRef.current.volume = newVolume;
        }
      },
    });
    return () => registerVolumeControl(null);
  }, [registerVolumeControl]);

  // Register music state control
  useEffect(() => {
    registerMusicControl({
      setIsPlaying: (newIsPlaying: boolean) => {
        const audio = audioRef.current;
        if (audio) {
          if (newIsPlaying && !isPlaying) {
            audio.play().catch((error) => {
              console.error('Playback prevented:', error);
            });
            setIsPlaying(true);
          } else if (!newIsPlaying && isPlaying) {
            audio.pause();
            setIsPlaying(false);
          }
        }
      },
      getIsPlaying: () => isPlaying,
    });
    return () => registerMusicControl(null);
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.error('Playback prevented:', error);
        setIsPlaying(false);
      });
    });

    if (initiallyEnabled && !isPlaying) {
      audio.play().catch((error) => {
        console.error('Playback prevented:', error);
        setIsPlaying(false);
      });
      audio.volume = volume;
      setIsPlaying(true);
    } else if (!initiallyEnabled && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }

    return () => {
      audio.pause();
      setIsPlaying(false);
    };
  }, [initiallyEnabled, fileName]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      trackMusicToggle(false);
    } else {
      audio.play().catch((error) => {
        console.error('Playback prevented:', error);
      });
      setIsPlaying(true);
      trackMusicToggle(true);
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
          onClick={togglePlayback}
          className="relative p-3 bg-white/30 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none  group z-10"
          aria-label={
            isPlaying
              ? 'Mute background music'
              : 'Play background music'
          }
        >
          {isPlaying ? (
            <MusicalNoteIcon className="w-8 h-8 text-white group-hover:text-pink-200 transition-colors" />
          ) : (
            <div className="relative w-8 h-8">
              <SpeakerXMarkIcon className="absolute w-12 h-12  -top-2 -left-2 text-white group-hover:text-pink-200 stroke-pink-700/50 transition-colors" />
            </div>
          )}
        </button>
      </div>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
