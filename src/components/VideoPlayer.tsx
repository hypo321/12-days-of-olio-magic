import React, { useEffect, useRef } from 'react';
import { useBackgroundMusicVolume } from '../hooks/useBackgroundMusicVolume';

interface VideoPlayerProps {
  src: string;
  onVideoEnd?: () => void;
  reload?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  onVideoEnd,
  reload = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { adjustVolume } = useBackgroundMusicVolume();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => adjustVolume(0.0); // Lower volume when video plays
    const handlePause = () => adjustVolume(0.3); // Restore volume when video pauses
    const handleEnded = () => {
      adjustVolume(0.3); // Restore volume when video ends
      onVideoEnd?.();
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
