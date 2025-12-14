import React, { useState, useEffect } from 'react';

export default function Hero() {
  const [text, setText] = useState('');
  const fullText = "Poet -> Coder -> Observer";

  // Typewriter
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(typing);
    }, 100);
    return () => clearInterval(typing);
  }, []);

  return (
    <div className="relative mb-20 mt-8 pt-4 pl-8 md:pl-16">
      
      {/* 1. THE RULER (Scale) - Running down the left */}
      <div className="absolute top-0 left-0 bottom-0 w-8 ruler-pattern opacity-30 pointer-events-none hidden md:block"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        
        {/* 2. THE POLAROID AVATAR */}
        <div className="relative group rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
          {/* The Tape */}
          <div className="scotch-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 z-20"></div>
          
          {/* The Photo Frame */}
          <div className="bg-white p-3 pb-8 shadow-xl border border-gray-200 w-48 transform transition-transform group-hover:scale-105">
            <div className="w-full h-40 bg-gray-100 overflow-hidden grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700">
               <img src="https://imagefa.st/images/2025/12/05/Gemini_Generated_Image_lp55i0lp55i0lp55.png" className="w-full h-full object-cover mix-blend-multiply" alt="Profile" />
            </div>
            <div className="font-hand text-center mt-3 text-ink text-xl rotate-1">
              me😁
            </div>
          </div>
        </div>

        {/* 3. THE SKETCH TITLE */}
        <div className="relative pt-4 text-center md:text-left">
          
          <div className="relative inline-block">
            {/* The Name */}
            <h1 className="text-8xl md:text-9xl leading-[0.8] font-hand text-accent tracking-tighter relative z-10 mix-blend-multiply">
              Aryan
            </h1>
            
            {/* The Red Sketch/Scribble Overlay */}
            <svg className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none opacity-50 overflow-visible" viewBox="0 0 200 60">
               {/* Messy scribble fill */}
               <path 
                 d="M10,30 Q50,10 90,30 T180,30 M15,35 Q55,15 95,35 T185,35 M20,25 Q60,5 100,25 T190,25" 
                 fill="none" 
                 stroke="#a62a2a" 
                 strokeWidth="2" 
                 className="scribble-path"
               />
            </svg>
            
            {/* Little 'Annotation' Arrow */}
            <svg className="absolute -right-12 -top-4 w-12 h-12 text-ink opacity-60 hidden md:block" viewBox="0 0 50 50">
               <path d="M10,40 Q20,10 40,10" fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
               <defs>
                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                   <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
                 </marker>
               </defs>
            </svg>
            <span className="absolute -right-24 -top-8 font-hand text-sm text-ink opacity-60 rotate-12 hidden md:block">
              (that's me)
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-serif text-ink dark:text-white mt-2 -ml-1">
            Archives.
          </h2>

          {/* 4. TYPEWRITER BIO */}
          <p className="font-mono text-xs text-gray-500 mt-6 tracking-[0.2em] uppercase border-l-2 border-accent pl-4">
            {text}<span className="animate-pulse">_</span>
          </p>

        {/* 5. HAND-DRAWN SOCIALS */}
<div className="flex justify-center md:justify-start gap-6 mt-8 text-2xl text-ink/70">
   
   {/* INSTAGRAM */}
   <a href="https://instagram.com/thegurjararyan" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform relative group">
      <i className="fab fa-instagram relative z-10"></i>
      <svg className="absolute -top-2 -left-2 w-10 h-10 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" viewBox="0 0 40 40">
         <path d="M5,20 Q10,5 20,5 Q35,5 35,20 Q35,35 20,35 Q5,35 5,20" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
   </a>

   {/* GITHUB */}
   <a href="https://github.com/thegurjararyan" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform relative group">
      <i className="fab fa-github relative z-10"></i>
      <svg className="absolute -top-2 -left-2 w-10 h-10 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" viewBox="0 0 40 40">
         {/* Slightly different random path for organic feel */}
         <path d="M2,20 Q5,0 20,2 Q38,5 36,20 Q35,38 20,36 Q0,35 2,20" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
   </a>

   {/* TWITTER / X */}
   <a href="https://twitter.com/thegurjararyan" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform relative group">
      <i className="fab fa-twitter relative z-10"></i>
      <svg className="absolute -top-2 -left-2 w-10 h-10 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" viewBox="0 0 40 40">
         <path d="M5,22 Q10,2 22,5 Q38,2 35,20 Q38,38 20,35 Q2,35 5,22" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
   </a>

   {/* TELEGRAM */}
   <a href="https://t.me/thegurjararyan" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform relative group">
      <i className="fab fa-telegram relative z-10"></i>
      <svg className="absolute -top-2 -left-2 w-10 h-10 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" viewBox="0 0 40 40">
         <path d="M4,18 Q8,4 20,4 Q36,4 36,20 Q36,36 20,36 Q4,36 4,18" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
   </a>

</div>

        </div>
      </div>
    </div>
  );
}