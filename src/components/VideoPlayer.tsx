import React, { useRef, useEffect, useState } from 'react';

import { useBackgroundMusicState } from '../hooks/useBackgroundMusicState';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
  onVideoEnd?: () => void;
  reload?: boolean;
}

const FADE_DURATION = 2000; // 2 seconds for a more gradual fade

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  loop = false,
  className = 'w-full h-full rounded-lg',
  onVideoEnd,
  reload = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { adjustVolume } = useBackgroundMusicVolume();
  const { isMusicPlaying, setTemporarilyPaused } = useBackgroundMusicState();
  const musicEnabled = isMusicPlaying();

  const fadeAudio = (
    startTime: number,
    videoStart: number,
    videoEnd: number,
    onComplete?: () => void
  ) => {
    const video = videoRef.current;
    if (!video) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / FADE_DURATION);

    // Cubic easing function for even smoother transitions
    const easeProgress =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    video.volume =
      videoStart + (videoEnd - videoStart) * easeProgress;

    if (progress < 1) {
      requestAnimationFrame(() =>
        fadeAudio(startTime, videoStart, videoEnd, onComplete)
      );
    } else {
      onComplete?.();
    }
  };

  // Set initial muted state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Always mute video if background music is not playing
    video.muted = !musicEnabled;
  }, [musicEnabled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handlePlay = () => {
      setIsPlaying(true);
      
      // Only handle audio if background music is enabled
      if (musicEnabled) {
        if (isMobile) {
          setTemporarilyPaused(true);
        } else {
          adjustVolume(0.01);
        }
        video.muted = false;
        fadeAudio(Date.now(), 0, 1);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (musicEnabled) {
        if (isMobile) {
          setTemporarilyPaused(false);
        } else {
          // Restore background music volume
          adjustVolume(0.2);
        }
        // Fade video out
        fadeAudio(Date.now(), 1, 0);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (musicEnabled) {
        if (isMobile) {
          setTemporarilyPaused(false);
        } else {
          // Restore background music volume
          adjustVolume(0.2);
        }
        // Fade video out
        fadeAudio(Date.now(), 1, 0, () => {
          if (!loop) {
            video.currentTime = 0;
          }
        });
      }
    };

    const handleLoadedMetadata = () => {
      if (autoPlay) {
        // Always start with volume 0
        video.volume = 0;

        // Only handle audio if background music is enabled
        if (musicEnabled) {
          if (isMobile) {
            setTemporarilyPaused(true);
          } else {
            adjustVolume(0.01);
          }
          video.muted = false;
        }

        // Always autoplay
        video.play().catch(console.error);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      // Restore background music volume on unmount if needed
      if (musicEnabled) {
        if (isMobile) {
          setTemporarilyPaused(false);
        } else {
          adjustVolume(0.2);
        }
      }
    };
  }, [autoPlay, musicEnabled, loop, onVideoEnd, adjustVolume, setTemporarilyPaused]);

  // Handle changes in music enabled state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    if (musicEnabled) {
      // If music was re-enabled while video is playing, fade in video sound
      fadeAudio(Date.now(), 0, 1);
    } else {
      // If music was disabled while video is playing, mute video immediately
      video.volume = 0;
    }
  }, [musicEnabled, isPlaying]);

  // Handle reload prop
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !reload) return;

    video.currentTime = 0;
    video.play().catch((error) => {
      console.error('Failed to play video:', error);
    });
  }, [reload]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop={loop}
      playsInline
      controls
      className={className}
    />
  );
};
