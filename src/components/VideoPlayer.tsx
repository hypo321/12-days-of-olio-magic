import React, { useEffect, useRef } from 'react';

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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      onVideoEnd?.();
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [onVideoEnd]);

  // Reset video when reload prop changes
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
