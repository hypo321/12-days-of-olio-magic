import React, { useRef, useState, useEffect } from 'react';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

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
