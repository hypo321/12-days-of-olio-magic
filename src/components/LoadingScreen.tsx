import React from 'react';

interface Props {
  progress?: number;
}

export const LoadingScreen: React.FC<Props> = ({ progress }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 conic-gradient">
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-4">
          Loading Christmas Magic...
        </div>
        {progress !== undefined && (
          <div className="w-full h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
