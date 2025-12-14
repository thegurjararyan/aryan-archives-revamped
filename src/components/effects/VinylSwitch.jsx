import React, { useState, useRef } from 'react';

export default function VinylSwitch() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggle = () => {
    if (isPlaying) audioRef.current.pause();
    else {
      audioRef.current.volume = 0.2; // Keep it subtle
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-4 left-20 z-50">
      <audio ref={audioRef} loop src="https://assets.mixkit.co/active_storage/sfx/2513/2513-preview.mp3" /> {/* Generic Vinyl Crackle */}
      <button 
        onClick={toggle} 
        className={`
          w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
          ${isPlaying ? 'border-accent bg-accent text-white rotate-180 shadow-[0_0_15px_rgba(166,42,42,0.6)]' : 'border-gray-400 text-gray-400 bg-transparent'}
        `}
        title="Lofi Mode"
      >
        <i className="fas fa-music text-xs"></i>
      </button>
    </div>
  );
}