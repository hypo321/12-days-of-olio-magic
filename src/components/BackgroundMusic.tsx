import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
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
  const fadeRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(initiallyEnabled);
  const [isTemporarilyPaused, setIsTemporarilyPaused] =
    useState(false);
  const { registerVolumeControl } = useBackgroundMusicVolume();
  const { registerMusicControl, registerTemporaryPauseCallback } =
    useBackgroundMusicState();

  const MAX_VOLUME = 0.2;
  const FADE_DURATION = 500; // 500ms fade

  // Handle fading audio
  const fadeAudio = useCallback(
    (
      _startTime: number, // Keep parameter to maintain compatibility but mark as unused
      startVolume: number,
      endVolume: number,
      onComplete?: () => void
    ) => {
      const audio = audioRef.current;
      if (!audio) return;

      let animationFrame: number;
      const actualStartTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - actualStartTime;
        const progress = Math.min(1, elapsed / FADE_DURATION);

        const easeProgress =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const newVolume =
          startVolume + (endVolume - startVolume) * easeProgress;
        audio.volume = Math.min(MAX_VOLUME, Math.max(0, newVolume));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          onComplete?.();
        }
      };

      if (fadeRef.current) {
        cancelAnimationFrame(fadeRef.current);
      }

      animationFrame = requestAnimationFrame(animate);
      fadeRef.current = animationFrame;

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame);
        }
      };
    },
    []
  );

  // Handle temporary pausing
  const handleTemporaryPause = useCallback(
    (paused: boolean) => {
      setIsTemporarilyPaused(paused);
      const audio = audioRef.current;
      if (!audio) return;

      if (paused) {
        const currentVolume = audio.volume;
        fadeAudio(Date.now(), currentVolume, 0, () => {
          audio.pause();
        });
      } else if (isPlaying) {
        audio.play().catch(console.error);
        fadeAudio(Date.now(), 0, MAX_VOLUME);
      }
    },
    [isPlaying, fadeAudio]
  );

  // Handle keyboard volume controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return; // Only adjust volume when music is playing

      const audio = audioRef.current;
      if (!audio) return;

      let newVolume = audio.volume;

      if (e.key === 'ArrowUp') {
        newVolume = Math.min(MAX_VOLUME, audio.volume + 0.05);
      } else if (e.key === 'ArrowDown') {
        newVolume = Math.max(0, audio.volume - 0.05);
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
          const clampedVolume = Math.max(
            0,
            Math.min(MAX_VOLUME, newVolume)
          );
          audioRef.current.volume = clampedVolume;
        }
      },
    });
    return () => registerVolumeControl(null);
  }, [registerVolumeControl]);

  // Handle playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.pause();
    }
  }, [isPlaying, isTemporarilyPaused]);

  // Register music control
  useEffect(() => {
    registerMusicControl({
      setIsPlaying: (newIsPlaying: boolean) => {
        const audio = audioRef.current;
        if (!audio) return;

        setIsPlaying(newIsPlaying);

        if (newIsPlaying && !isTemporarilyPaused) {
          audio.play().catch(console.error);
          fadeAudio(Date.now(), 0, MAX_VOLUME);
        } else {
          const currentVolume = audio.volume;
          fadeAudio(Date.now(), currentVolume, 0, () => {
            audio.pause();
          });
        }
      },
      getIsPlaying: () => {
        const playing = isPlaying && !isTemporarilyPaused;

        return playing;
      },
    });
    return () => registerMusicControl(null);
  }, [isPlaying, isTemporarilyPaused, fadeAudio]);

  // Register temporary pause handler
  useEffect(() => {
    registerTemporaryPauseCallback(handleTemporaryPause);
    return () => registerTemporaryPauseCallback(null);
  }, [handleTemporaryPause, registerTemporaryPauseCallback]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      setIsPlaying(false);
      trackMusicToggle(false);
      const currentVolume = audio.volume;
      fadeAudio(Date.now(), currentVolume, 0, () => {
        audio.pause();
      });
    } else {
      setIsPlaying(true);
      trackMusicToggle(true);

      // Reset audio state
      audio.currentTime = 0;
      audio.volume = 0; // Start silent
      audio.muted = false;

      // First ensure we can play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Start fade from 0 to MAX_VOLUME
            fadeAudio(Date.now(), 0, MAX_VOLUME);
          })
          .catch(() => {
            setIsPlaying(false);
            trackMusicToggle(false);
          });
      }
    }
  };

  // Handle resuming from temporary pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isTemporarilyPaused && isPlaying) {
      audio.volume = 0; // Start silent
      audio
        .play()
        .then(() => {
          fadeAudio(Date.now(), 0, MAX_VOLUME);
        })
        .catch(console.error);
    }
  }, [isTemporarilyPaused, isPlaying, fadeAudio]);

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
    }
  }, [volume]);

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
