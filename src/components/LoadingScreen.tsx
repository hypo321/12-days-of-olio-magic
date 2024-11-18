import React from 'react';

interface Props {
  progress?: number;
}

export const LoadingScreen: React.FC<Props> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-red-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-4">
          Loading Christmas Magic...
        </div>
        {progress !== undefined && (
          <div className="w-64 h-2 bg-red-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
