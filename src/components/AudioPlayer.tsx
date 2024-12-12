import React, { useRef, useState, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';
import { useBackgroundMusicState } from '../hooks/useBackgroundMusicState';

interface AudioPlayerProps {
  fileName: string;
  play?: boolean;
  onAudioEnd?: () => void;
  volume?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  fileName,
  play = false,
  onAudioEnd,
  volume = 1,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const animationFrameRef = useRef<number>();

  const { adjustVolume } = useBackgroundMusicVolume();
  const { isMusicPlaying, setTemporarilyPaused } =
    useBackgroundMusicState();
  const musicEnabled = isMusicPlaying();

  const DRAG_TOLERANCE = 5; // pixels

  const updateAudioTime = (clientX: number) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const position = Math.max(
      0,
      Math.min(clientX - rect.left, rect.width)
    );
    const percentage = position / rect.width;
    const newTime = Math.max(
      0,
      Math.min(percentage * duration, duration)
    );

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    if (hasEnded) {
      setHasEnded(false);
    }
  };

  const handleDragStart = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const point = 'touches' in e ? e.touches[0] : e;
    setDragStart({ x: point.clientX, y: point.clientY });
    setIsDragging(true);
  };

  const handleDrag = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    if (!isDragging || !dragStart) return;

    e.preventDefault();
    e.stopPropagation();

    const point = 'touches' in e ? e.touches[0] : e;
    const dx = point.clientX - dragStart.x;
    const dy = point.clientY - dragStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > DRAG_TOLERANCE) {
      updateAudioTime(point.clientX);
    }
  };

  const handleDragEnd = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const point = 'changedTouches' in e ? e.changedTouches[0] : e;
    const dx = point.clientX - (dragStart?.x ?? 0);
    const dy = point.clientY - (dragStart?.y ?? 0);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If we haven't dragged beyond tolerance, treat as a click
    if (distance <= DRAG_TOLERANCE) {
      togglePlayback();
    }

    setIsDragging(false);
    setDragStart(null);
  };

  const handleProgressClick = (
    e:
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const point = 'touches' in e ? e.touches[0] : e;
    const rect = progressBar.getBoundingClientRect();
    const clickX = point.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    if (hasEnded) {
      setHasEnded(false);
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    // Handle only double clicks, single clicks are handled in dragEnd
    if (e.detail === 2) {
      e.stopPropagation();
      togglePlayback();
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      const audio = audioRef.current;
      if (!audio) return;

      setCurrentTime(audio.currentTime);
      animationFrameRef.current =
        requestAnimationFrame(updateProgress);
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateAudioTime(e.clientX);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, duration]);

  useEffect(() => {
    if (!musicEnabled) return;

    console.log('Volume effect triggered:', {
      isPlaying,
      musicEnabled,
      hasEnded,
      'audioRef.current?.paused': audioRef.current?.paused,
    });

    // On mobile, temporarily pause background music instead of adjusting volume
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    );

    if (isPlaying) {
      if (isMobile) {
        setTemporarilyPaused(true);
      } else {
        adjustVolume(0.08);
      }
    }

    return () => {
      if (isMobile) {
        setTemporarilyPaused(false);
      } else if (!isPlaying) {
        adjustVolume(0.2);
      }
    };
  }, [isPlaying, musicEnabled, adjustVolume, setTemporarilyPaused]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Toggle playback:', {
      'audio.paused': audio.paused,
      hasEnded,
      isPlaying,
    });

    if (hasEnded) {
      audio.currentTime = 0;
      setHasEnded(false);
    }

    if (audio.paused) {
      audio.volume = volume;
      audio.play().catch(console.error);
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('Play prop effect:', {
      play,
      'audio.paused': audio.paused,
      isPlaying,
      musicEnabled,
    });

    // Only autoplay if music is enabled
    if (play && musicEnabled) {
      audio.volume = volume;
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [play, volume, musicEnabled]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
      setHasEnded(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      setCurrentTime(duration);
      onAudioEnd?.();
      // Move volume adjustment here to ensure it happens after playback ends
      if (musicEnabled) {
        adjustVolume(0.2);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      );
      audio.removeEventListener('ended', handleEnded);
    };
  }, [duration, musicEnabled, onAudioEnd, adjustVolume]);

  return (
    <div className="flex items-center max-w-2xl space-x-4 w-full">
      <div className="relative flex-1 flex items-center">
        <div
          ref={progressRef}
          className="h-5 bg-gray-300 rounded-xl cursor-pointer w-full"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-pink-700 rounded-xl"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: `${(currentTime / duration) * 100}%`,
            transform: 'translateX(-50%)',
            width: '56px',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="z-10"
        >
          <button
            onClick={handleButtonClick}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDrag}
            onTouchEnd={handleDragEnd}
            onTouchCancel={handleDragEnd}
            className={`p-2 bg-pink-700 text-white rounded-full hover:bg-pink-600 focus:outline-none transition-colors duration-150 animate-pulse-gentle  ${
              isDragging ? 'cursor-grabbing' : 'cursor-pointer'
            } touch-none`}
            aria-label={
              hasEnded ? 'Replay' : isPlaying ? 'Pause' : 'Play'
            }
          >
            {hasEnded ? (
              <ArrowPathIcon className="w-6 h-6 md:w-8 md:h-8" />
            ) : isPlaying ? (
              <PauseIcon className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <PlayIcon className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </button>
        </div>
      </div>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
