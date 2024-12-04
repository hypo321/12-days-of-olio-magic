import React, { useRef, useState, useEffect } from 'react';

interface AudioPlayerProps {
  fileName: string;
  play: boolean; // Control playback from parent component
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  fileName,
  play,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasEnded, setHasEnded] = useState<boolean>(false); // New state variable
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setHasEnded(true); // Audio has finished playing
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded); // Listen for 'ended' event

      // Cleanup on unmount
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
        setIsPlaying(true);
        setHasEnded(false); // Reset 'hasEnded' when starting playback
      } else {
        audio.pause();
        setIsPlaying(false);
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
        setIsPlaying(true);
        setHasEnded(false);
      } else if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play().catch((error) => {
          console.error('Playback prevented:', error);
        });
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
    <div className="flex items-center space-x-4 w-full">
      <button
        onClick={togglePlayPause}
        className="p-2 bg-pink-700 text-white rounded-full focus:outline-none"
        aria-label={
          hasEnded ? 'Replay' : isPlaying ? 'Pause' : 'Play'
        }
      >
        {hasEnded ? (
          // Replay Icon
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 5V1L7 6l5 5V7c3.86 0 7 3.14 7 7 0 1.02-.21 1.98-.58 2.85l1.45 1.45C20.49 16.63 21 14.39 21 12c0-4.97-4.03-9-9-9zM3.51 3.51L2.1 4.92 4.27 7.1C3.5 8.38 3 9.91 3 11.5 3 16.47 7.03 20.5 12 20.5c1.59 0 3.12-.5 4.4-1.27l2.18 2.18 1.41-1.41L3.51 3.51zM12 18.5c-3.86 0-7-3.14-7-7 0-1.59.5-3.12 1.27-4.4l9.13 9.13C15.12 18 13.59 18.5 12 18.5z" />
          </svg>
        ) : isPlaying ? (
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
