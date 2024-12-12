import { useCallback, useRef } from 'react';

type MusicControl = {
  setIsPlaying: (isPlaying: boolean) => void;
  getIsPlaying: () => boolean;
} | null;

let globalMusicControl: MusicControl = null;
let temporaryPauseCallback: ((paused: boolean) => void) | null = null;

export const useBackgroundMusicState = () => {
  const pauseCallbackRef = useRef<((paused: boolean) => void) | null>(null);

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

  // Register temporary pause callback
  const registerTemporaryPauseCallback = useCallback((callback: ((paused: boolean) => void) | null) => {
    temporaryPauseCallback = callback;
    pauseCallbackRef.current = callback;
  }, []);

  // Set temporary pause state
  const setTemporarilyPaused = useCallback((paused: boolean) => {
    temporaryPauseCallback?.(paused);
  }, []);

  return {
    registerMusicControl,
    setMusicPlaying,
    isMusicPlaying,
    registerTemporaryPauseCallback,
    setTemporarilyPaused,
  };
};
