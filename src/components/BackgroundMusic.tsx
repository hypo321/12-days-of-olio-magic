import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  const [isTemporarilyPaused, setIsTemporarilyPaused] = useState(false);
  const { registerVolumeControl } = useBackgroundMusicVolume();
  const { registerMusicControl, registerTemporaryPauseCallback } = useBackgroundMusicState();

  const MAX_VOLUME = 0.2;

  // Handle temporary pausing
  const handleTemporaryPause = useCallback((paused: boolean) => {
    setIsTemporarilyPaused(paused);
    const audio = audioRef.current;
    if (!audio) return;

    if (paused) {
      audio.pause();
    } else if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [isPlaying]);

  // Handle keyboard volume controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return; // Only adjust volume when music is playing
      
      const audio = audioRef.current;
      if (!audio) return;

      let newVolume = audio.volume;
      
      if (e.key === 'ArrowUp') {
        newVolume = Math.min(MAX_VOLUME, audio.volume + 0.05);
        console.log('Background music volume increased to:', newVolume.toFixed(2));
      } else if (e.key === 'ArrowDown') {
        newVolume = Math.max(0, audio.volume - 0.05);
        console.log('Background music volume decreased to:', newVolume.toFixed(2));
      } else {
        return; // Don't update if not arrow keys
      }

      audio.volume = newVolume;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Register volume control
  useEffect(() => {
    registerVolumeControl({
      setVolume: (newVolume: number) => {
        if (audioRef.current) {
          // Clamp volume to MAX_VOLUME and prevent negative values
          const clampedVolume = Math.max(0, Math.min(MAX_VOLUME, newVolume));
          audioRef.current.volume = clampedVolume;
          console.log(
            'Background music volume set to:',
            clampedVolume.toFixed(2),
            'from requested volume:',
            newVolume.toFixed(2)
          );
        }
      },
    });
    return () => registerVolumeControl(null);
  }, [registerVolumeControl]);

  // Register music control
  useEffect(() => {
    registerMusicControl({
      setIsPlaying: (newIsPlaying: boolean) => {
        const audio = audioRef.current;
        if (!audio) return;

        setIsPlaying(newIsPlaying);
        if (newIsPlaying && !isTemporarilyPaused) {
          audio.play().catch(console.error);
        } else {
          audio.pause();
        }
      },
      getIsPlaying: () => isPlaying && !isTemporarilyPaused
    });
    return () => registerMusicControl(null);
  }, [isPlaying, isTemporarilyPaused]);

  // Register temporary pause handler
  useEffect(() => {
    registerTemporaryPauseCallback(handleTemporaryPause);
    return () => registerTemporaryPauseCallback(null);
  }, [handleTemporaryPause, registerTemporaryPauseCallback]);

  // Handle playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isTemporarilyPaused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, isTemporarilyPaused]);

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
      const clampedVolume = Math.max(0, Math.min(MAX_VOLUME, volume));
      audio.volume = clampedVolume;
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

  // Set initial volume
  useEffect(() => {
    if (audioRef.current) {
      const clampedVolume = Math.max(0, Math.min(MAX_VOLUME, volume));
      audioRef.current.volume = clampedVolume;
      console.log(
        'Initial background music volume set to:',
        clampedVolume.toFixed(2),
        'from prop volume:',
        volume.toFixed(2)
      );
    }
  }, [volume]);

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
