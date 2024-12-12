import { useCallback } from 'react';

type VolumeControl = {
  setVolume: (volume: number) => void;
} | null;

let globalVolumeControl: VolumeControl = null;

export const useBackgroundMusicVolume = () => {
  // This is used by the BackgroundMusic component to register its volume control
  const registerVolumeControl = useCallback(
    (control: VolumeControl) => {
      globalVolumeControl = control;
    },
    []
  );

  // This is used by any component that needs to adjust the volume
  const adjustVolume = useCallback((volume: number) => {
    globalVolumeControl?.setVolume(volume);
  }, []);

  return {
    registerVolumeControl,
    adjustVolume,
  };
};
