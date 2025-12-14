import React, { useState, useEffect } from 'react';

const NavTab = ({ active, label, icon, onClick, isLocked }) => (
  <button 
    onClick={onClick}
    className={`
      px-4 py-1 text-[10px] md:text-xs font-mono uppercase tracking-widest border transition-all duration-300
      ${active 
        ? 'bg-ink text-white border-ink dark:bg-white dark:text-black shadow-md transform -translate-y-0.5' 
        : 'bg-white/50 text-gray-500 border-transparent hover:border-gray-300 hover:bg-white'}
      ${isLocked ? 'text-accent' : ''}
    `}
  >
    {icon && <i className={`${icon} mr-2`}></i>}
    {label}
  </button>
);

export default function Navbar({ filter, setFilter, searchQuery, setSearchQuery, toggleTheme, darkMode }) {
  const tabs = ['Home', 'All', 'Poetry', 'Tech', 'Diary Entry', 'Book Review'];
  
  // --- SMART SCROLL LOGIC ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show if scrolling UP or at the VERY TOP
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`
      sticky top-0 z-40 py-4 mb-12 transition-transform duration-300 ease-in-out
      ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    `}>
      {/* Added bg-opacity and backdrop-blur to ensure the "Hearts" 
         don't make the text hard to read when scrolling.
      */}
      <div className="max-w-6xl mx-auto bg-paper/90 dark:bg-[#111]/90 backdrop-blur-md border border-ink/10 dark:border-white/10 shadow-sm rounded-sm px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-64">
           <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-gray-400 text-xs">{'>'}</span>
           <input 
             type="text" 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="search_memory..."
             className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 pl-4 py-1 font-mono text-xs focus:border-accent outline-none transition-colors dark:text-white placeholder:text-gray-400/50"
           />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {tabs.map(t => (
            <NavTab key={t} label={t} active={filter === t} onClick={() => setFilter(t)} />
          ))}
          <NavTab 
            label="VAULT" 
            isLocked 
            active={filter === 'Locked'} 
            onClick={() => setFilter('Locked')} 
            icon="fas fa-lock"
          />
          <button onClick={toggleTheme} className="ml-4 text-gray-400 hover:text-accent transition-transform hover:rotate-12">
            <i className={`fas fa-${darkMode ? 'sun' : 'moon'}`}></i>
          </button>
        </div>

      </div>
    </div>
  );
}