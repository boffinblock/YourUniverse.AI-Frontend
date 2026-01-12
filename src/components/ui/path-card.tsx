// components/BiscottiCard.tsx
import React from 'react';

const BiscottiCard: React.FC = () => {
  return (
    <div className="w-[450px] h-[200px] bg-gradient-to-b from-gray-300 to-gray-400 p-4 rounded overflow-hidden relative font-sans">
      {/* Outer container with the frosted glass background effect */}
      <div className="relative w-full h-full bg-gradient-to-b from-gray-700 to-gray-800 rounded-[20px] border border-gray-400 shadow-lg">
      
        {/* Arrow icon container top-left */}
        <div className="absolute top-3 left-3 w-10 h-10 bg-gray-800 border-2 border-gray-400 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17l-6-6m0 0V7m0 4h6" />
          </svg>
        </div>

        {/* Main text */}
        <div className="flex justify-center items-center h-full">
          <h1 className="text-gray-200 text-6xl font-bold font-[cursive] drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] select-none">
            Biscotti
          </h1>
        </div>

        {/* Bottom right rounded rectangle with "ifonts.xyz" */}
        <div className="absolute bottom-3 right-3 bg-gray-900 border border-gray-400 rounded-tl-lg rounded-br-lg px-4 py-1">
          <p className="text-gray-300 text-sm font-mono select-none">ifonts.xyz</p>
        </div>
      </div>
    </div>
  );
};

export default BiscottiCard;
