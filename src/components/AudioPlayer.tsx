import React, { useRef, useState, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';

interface AudioPlayerProps {
  fileName: string;
  play: boolean; // Control playback from parent component
}

const FADE_DURATION = 500; // Duration of fade in milliseconds

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  fileName,
  play,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const { adjustVolume } = useBackgroundMusicVolume();

  const fadeAudio = (
    startTime: number,
    audioStart: number,
    audioEnd: number,
    musicStart: number,
    musicEnd: number,
    onComplete?: () => void
  ) => {
    const audio = audioRef.current;
    if (!audio) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / FADE_DURATION);

    // Smooth easing function
    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Update volumes
    audio.volume =
      audioStart + (audioEnd - audioStart) * easeProgress;
    adjustVolume(musicStart + (musicEnd - musicStart) * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(() =>
        fadeAudio(
          startTime,
          audioStart,
          audioEnd,
          musicStart,
          musicEnd,
          onComplete
        )
      );
    } else {
      onComplete?.();
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      // Set initial volume to 0
      audio.volume = 0;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        fadeAudio(Date.now(), 0.3, 0, 0.1, 0.3, () => {
          setIsPlaying(false);
          setHasEnded(true);
        });
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata
        );
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [fileName]);

  // Listen for changes in the 'play' prop
  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      if (play) {
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
          setIsPlaying(false);
        });
        fadeAudio(Date.now(), 0, 0.3, 0.3, 0.1);
        setIsPlaying(true);
        setHasEnded(false);
      } else {
        fadeAudio(Date.now(), 0.3, 0, 0.1, 0.3, () => {
          audio.pause();
          setIsPlaying(false);
        });
      }
    }
  }, [play]);

  const togglePlayPause = () => {
    const audio = audioRef.current;

    if (audio) {
      if (hasEnded) {
        // Replay the audio
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
        });
        fadeAudio(Date.now(), 0, 0.3, 0.3, 0.1);
        setIsPlaying(true);
        setHasEnded(false);
      } else if (isPlaying) {
        fadeAudio(Date.now(), 0.3, 0, 0.1, 0.3, () => {
          audio.pause();
          setIsPlaying(false);
        });
      } else {
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
        });
        fadeAudio(Date.now(), 0, 0.3, 0.3, 0.1);
        setIsPlaying(true);
      }
    }
  };

  const handleProgressClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const audio = audioRef.current;

    if (audio) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;

      audio.currentTime = newTime;
      setCurrentTime(newTime);
      if (hasEnded) {
        setHasEnded(false);
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex items-center max-w-2xl space-x-4 w-full">
      <button
        onClick={togglePlayPause}
        className="p-2 bg-pink-700 text-white rounded-full hover:bg-pink-600 focus:outline-none transition-colors duration-300"
        aria-label={
          hasEnded ? 'Replay' : isPlaying ? 'Pause' : 'Play'
        }
      >
        {hasEnded ? (
          <ArrowPathIcon className="w-6 h-6" />
        ) : isPlaying ? (
          <PauseIcon className="w-6 h-6" />
        ) : (
          <PlayIcon className="w-6 h-6" />
        )}
      </button>
      <div
        className="flex-1 h-2 bg-gray-300 rounded cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-pink-700 rounded"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
