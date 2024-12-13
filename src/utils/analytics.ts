// Ensure gtag is available globally
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      action: string,
      params?: any
    ) => void;
  }
}

// Event tracking functions
export const trackEvent = (
  eventName: string,
  eventParams: Record<string, any> = {}
) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Specific event tracking functions
export const trackDoorOpen = (dayNumber: number | string) => {
  trackEvent('door_open', {
    day_number: dayNumber,
  });
};

export const trackMusicToggle = (enabled: boolean) => {
  trackEvent('music_toggle', {
    enabled: enabled,
  });
};

export const trackShare = (
  dayNumber: number | string,
  platform: string
) => {
  trackEvent('share', {
    day_number: dayNumber,
    platform: platform,
  });
};

export const trackModalView = (dayNumber: number | string) => {
  trackEvent('modal_view', {
    day_number: dayNumber,
  });
};

export const trackWelcomeModalView = () => {
  trackEvent('welcome_modal_view');
};

export const trackWelcomeMusicChoice = (enabled: boolean) => {
  trackEvent('welcome_music_choice', {
    choice: enabled ? 'enabled' : 'disabled',
  });
};

export const trackAdvance = (dayNumber: number | string) => {
  trackEvent('modal_advance', {
    day_number: dayNumber,
  });
};

export const trackRestart = () => {
  trackEvent('restart_experience');
};

export const trackVideoRewatch = (dayNumber: number | string) => {
  trackEvent('video_rewatch', {
    day_number: dayNumber,
  });
};

export const trackShareAtEnd = () => {
  trackEvent('share_after_video');
};
