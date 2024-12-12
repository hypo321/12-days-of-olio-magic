import React, { useRef, useEffect, useState } from 'react';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';
import { useBackgroundMusicState } from '../hooks/useBackgroundMusicState';

interface VideoPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
  onVideoEnd?: () => void;
  reload?: boolean;
}

const FADE_DURATION = 500; // Duration of fade in milliseconds

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  autoPlay = false,
  loop = false,
  className = 'w-full h-full rounded-lg',
  onVideoEnd,
  reload = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const { adjustVolume } = useBackgroundMusicVolume();
  const { isMusicPlaying } = useBackgroundMusicState();
  const musicEnabled = isMusicPlaying();

  const fadeAudio = (
    startTime: number,
    videoStart: number,
    videoEnd: number,
    musicStart: number,
    musicEnd: number,
    onComplete?: () => void
  ) => {
    const video = videoRef.current;
    if (!video) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / FADE_DURATION);

    // Smooth easing function
    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    // Only adjust volumes if background music is enabled
    if (musicEnabled) {
      video.volume =
        videoStart + (videoEnd - videoStart) * easeProgress;
      adjustVolume(
        musicStart + (musicEnd - musicStart) * easeProgress
      );
    } else {
      video.volume = 0;
    }

    if (progress < 1) {
      requestAnimationFrame(() =>
        fadeAudio(
          startTime,
          videoStart,
          videoEnd,
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
    const video = videoRef.current;
    if (!video) return;

    // Set initial volume
    video.volume = musicEnabled ? 0 : 0;

    const handlePlay = () => {
      setIsPlaying(true);
      // Fade video in and background music out, only if music is enabled
      fadeAudio(Date.now(), 0, musicEnabled ? 1 : 0, 0.2, 0.1);
    };

    const handlePause = () => {
      setIsPlaying(false);
      // Fade video out and background music in, only if music is enabled
      fadeAudio(Date.now(), musicEnabled ? 1 : 0, 0, 0.1, 0.2);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Fade video out and background music in, only if music is enabled
      fadeAudio(
        Date.now(),
        musicEnabled ? 1 : 0,
        0,
        0.1,
        0.2,
        onVideoEnd
      );
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      if (musicEnabled) {
        adjustVolume(0.2);
      }
    };
  }, [adjustVolume, musicEnabled, onVideoEnd]);

  // Handle changes in music enabled state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    if (musicEnabled) {
      // If music was re-enabled while video is playing, fade in video sound
      fadeAudio(Date.now(), 0, 1, 0.2, 0.1);
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
