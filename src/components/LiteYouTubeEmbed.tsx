import React, { useEffect, useRef } from 'react';

interface LiteYouTubeEmbedProps {
  videoId: string;
  onVideoEnd?: () => void;
  reload?: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const LiteYouTubeEmbed: React.FC<LiteYouTubeEmbedProps> = ({ 
  videoId, 
  onVideoEnd,
  reload = false 
}) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const createPlayer = () => {
    if (!containerRef.current) return;
    
    // Cleanup existing player if any
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        iv_load_policy: 3
      },
      events: {
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            onVideoEnd?.();
          }
        }
      }
    });
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onVideoEnd]);

  useEffect(() => {
    if (reload && window.YT) {
      createPlayer();
    }
  }, [reload]);

  return (
    <div className="w-full h-full aspect-video">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
