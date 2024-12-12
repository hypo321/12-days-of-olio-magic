import React, { useEffect, useRef } from 'react';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';

interface VideoPlayerProps {
  src: string;
  onVideoEnd?: () => void;
  reload?: boolean;
}

const FADE_DURATION = 500; // Duration of fade in milliseconds

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  onVideoEnd,
  reload = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { adjustVolume } = useBackgroundMusicVolume();

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

    // Update volumes
    video.volume =
      videoStart + (videoEnd - videoStart) * easeProgress;
    adjustVolume(musicStart + (musicEnd - musicStart) * easeProgress);

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
    video.volume = 0;

    const handlePlay = () => {
      // Fade video in and background music out
      fadeAudio(Date.now(), 0, 0.3, 0.3, 0);
    };

    const handlePause = () => {
      // Fade video out and background music in
      fadeAudio(Date.now(), 0.3, 0, 0, 0.3);
    };

    const handleEnded = () => {
      // Fade video out and background music in
      fadeAudio(Date.now(), 0.3, 0, 0, 0.3, onVideoEnd);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [adjustVolume, onVideoEnd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reload) {
      video.currentTime = 0;
      video.play();
    }
  }, [reload]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full rounded-lg"
      controls
      autoPlay
      playsInline
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};
