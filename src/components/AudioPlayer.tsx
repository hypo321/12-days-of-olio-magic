import React, { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
  fileName: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  fileName,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      // Update duration when metadata is loaded
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      // Update current time as audio plays
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      // Event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      // Cleanup on unmount
      return () => {
        audio.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata
        );
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [fileName]);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }

      setIsPlaying(!isPlaying);
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
    }
  };

  return (
    <div className="flex items-center space-x-4 px-8 w-full ">
      <button
        onClick={handlePlayPause}
        className="p-2 bg-pink-600 text-white rounded-full focus:outline-none"
      >
        {isPlaying ? (
          // Pause Icon
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          // Play Icon
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <div className="flex-1">
        <div
          className="w-full h-2 bg-gray-300 rounded cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-pink-600 rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>
      <audio ref={audioRef} src={`/content/${fileName}`} />
    </div>
  );
};
