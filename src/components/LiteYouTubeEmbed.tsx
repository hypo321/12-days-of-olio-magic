import React from 'react';

interface LiteYouTubeEmbedProps {
  videoId: string;
}

export const LiteYouTubeEmbed: React.FC<LiteYouTubeEmbedProps> = ({ videoId }) => (
  <div className="w-full h-full bg-black">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1&enablejsapi=0&playsinline=1&iv_load_policy=3`}
      title="YouTube video player"
      allow="autoplay"
      loading="lazy"
      sandbox="allow-scripts allow-presentation allow-same-origin"
      referrerPolicy="strict-origin"
      allowFullScreen
    />
  </div>
);
