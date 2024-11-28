import { useState } from 'react';
import '../styles/snow.css';

export const SnowEffect = () => {
  const [snowflakeCount] = useState(100); // Adjust for more or less snow

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: snowflakeCount }).map((_, i) => (
        <div key={i} className="snowflake" />
      ))}
    </div>
  );
};
