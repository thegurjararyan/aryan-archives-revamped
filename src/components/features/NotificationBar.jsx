import React, { useState } from 'react';

export default function NotificationBar() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="w-full bg-[#1a1a1a] text-white/80 text-[10px] md:text-xs font-mono py-2 px-4 border-b border-accent/30 flex justify-between items-center animate-[slideDown_0.5s_ease-out]">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span>
          <span className="text-accent font-bold">SYSTEM_UPDATE:</span> "No filters. Just raw memories."
        </span>
      </div>
      <button 
        onClick={() => setIsOpen(false)} 
        className="hover:text-accent transition-colors"
      >
        [CLOSE]
      </button>
    </div>
  );
}