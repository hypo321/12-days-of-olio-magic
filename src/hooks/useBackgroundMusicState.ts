import { useCallback } from 'react';

type MusicControl = {
  setIsPlaying: (isPlaying: boolean) => void;
  getIsPlaying: () => boolean;
} | null;

let globalMusicControl: MusicControl = null;

export const useBackgroundMusicState = () => {
  // This is used by the BackgroundMusic component to register its state control
  const registerMusicControl = useCallback((control: MusicControl) => {
    globalMusicControl = control;
  }, []);

  // This is used by any component that needs to control the music state
  const setMusicPlaying = useCallback((isPlaying: boolean) => {
    globalMusicControl?.setIsPlaying(isPlaying);
  }, []);

  // This is used by any component that needs to check if music is playing
  const isMusicPlaying = useCallback(() => {
    return globalMusicControl?.getIsPlaying() ?? false;
  }, []);

  return {
    registerMusicControl,
    setMusicPlaying,
    isMusicPlaying,
  };
};
