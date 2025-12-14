import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

// Components
import Hero from './components/features/Hero';
import Navbar from './components/features/Navbar';
import Card from './components/features/Card';
import AdminModal from './components/features/AdminModal';
import NotificationBar from './components/features/NotificationBar'; 
import GrainOverlay from './components/ui/GrainOverlay';
import SpecialGate from './components/features/SpecialGates'; 

// Effects
import InkCursor from './components/effects/InkCursor';
import VinylSwitch from './components/effects/VinylSwitch';
import TabTitle from './components/effects/TabTitle';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('Home'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Auth & Admin
  const [session, setSession] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Vault
  const [vaultUnlocked, setVaultUnlocked] = useState(() => localStorage.getItem('vaultUnlocked') === 'true');
  const [showVaultModal, setShowVaultModal] = useState(false);

  // VIP GATE STATE
  const [showSpecialGate, setShowSpecialGate] = useState(false);

  useEffect(() => {
    // 1. Theme
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('darkMode', darkMode);

    // 2. Scroll Progress
    const handleScroll = () => {
      const total = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(total / windowHeight);
    }
    window.addEventListener('scroll', handleScroll);

    // 3. Supabase Data
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
      fetchPosts();
      return () => { subscription.unsubscribe(); window.removeEventListener('scroll', handleScroll); };
    } else {
      // Mock Data
      setPosts([
        { id: 1, type: 'Book Review', title: 'Naval Ravikant', content: 'A guide to wealth & happiness.\nRating: 5/5', created_at: new Date().toISOString(), is_pinned: true },
        { id: 2, type: 'Poetry', title: 'Sard Hawayein', content: 'Ye sard hawayein is shehar ki...', created_at: '2022-01-01', is_pinned: true },
        { id: 3, type: 'Tech', title: 'System_Init', content: 'Initializing core modules...', created_at: new Date().toISOString() },
      ]);
    }
  }, [darkMode]);

  const fetchPosts = async () => {
    if (!supabase) return;
    let query = supabase.from('posts').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) query = query.eq('status', 'published');
    const { data } = await query;
    if (data) setPosts(data);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLike = async (id, currentLikes) => {
    if (!supabase || localStorage.getItem(`liked-${id}`)) return;
    localStorage.setItem(`liked-${id}`, 'true');
    await supabase.from('posts').update({ likes: (currentLikes || 0) + 1 }).eq('id', id);
  };

  const handleDelete = async (id) => {
    if (confirm("Burn this memory?")) {
      await supabase.from('posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  const filteredPosts = posts.filter(p => {
    const search = searchQuery.toLowerCase();
    const match = !searchQuery || p.title?.toLowerCase().includes(search) || p.content?.toLowerCase().includes(search);
    if (!match) return false;
    if (filter === 'Locked') return p.is_locked;
    if (filter === 'Home') return p.is_pinned && !p.is_locked;
    if (filter === 'All') return !p.is_locked;
    return p.type === filter;
  });

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* --- EFFECTS & OVERLAYS --- */}
      <TabTitle />
      <InkCursor />
      <GrainOverlay />
      <VinylSwitch />
      
      {/* VIP GATE MODAL */}
      <SpecialGate isOpen={showSpecialGate} onClose={() => setShowSpecialGate(false)} />

      {/* Scroll Bar */}
      <div className="fixed top-0 left-0 h-1 bg-accent z-[100]" style={{ width: `${scrollProgress * 100}%` }} />

      <div className="relative z-10 p-4 md:p-8 pb-32">
        <Hero />
        
        {/* --- NOTIFICATION BAR --- */}
        {(filter === 'Home' || filter === 'All') && (
           <NotificationBar />
        )}

        <Navbar 
          filter={filter} 
          setFilter={(f) => { if (f === 'Locked' && !vaultUnlocked) setShowVaultModal(true); else setFilter(f); }} 
          searchQuery={searchQuery} 
          setSearchQuery={handleSearch} 
          toggleTheme={() => setDarkMode(!darkMode)}
          darkMode={darkMode}
        />

        {/* CONTENT GRID */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 opacity-50 font-mono dark:text-gray-500">
             <p>Nothing found.</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-8">
            {filteredPosts.map(post => {
              const isOld = (new Date() - new Date(post.created_at)) > 31536000000;
              return (
                <div key={post.id} className={`transition-all duration-700 ${isOld ? 'sepia-[.3] contrast-[0.9]' : ''}`}>
                  <Card 
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onEdit={(p) => { setEditingPost(p); setShowAdmin(true); }}
                    isAdmin={!!session}
                    vaultUnlocked={vaultUnlocked}
                    triggerVault={() => setShowVaultModal(true)}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* --- SIGNATURE FOOTER --- */}
        <div className="mt-40 mb-20 text-center relative group" title="Signed by Aryan">
           
           {/* The Signature */}
           <svg width="150" height="60" viewBox="0 0 150 60" className="mx-auto opacity-50 group-hover:opacity-100 transition-opacity">
              <path d="M10,40 Q30,10 50,40 T90,30 T130,40" fill="none" stroke={darkMode ? "white" : "#a62a2a"} strokeWidth="2" className="path-draw" />
           </svg>
           
           <p className="text-[10px] font-mono text-gray-400 mt-2 selection:bg-accent selection:text-white">
             AryanArchives © 2025 
             <span className="text-transparent selection:text-white ml-2">
               (i am still watching)
             </span>
           </p>

           {/* 👇 THE VISIBLE, HANDWRITTEN VIP LINK */}
           <div className="mt-12">
             <button 
               onClick={() => setShowSpecialGate(true)}
               className="font-hand text-2xl text-accent hover:text-red-600 transition-colors transform hover:-rotate-2 hover:scale-110 duration-300 relative group"
             >
               Psst. Are you someone special?
               {/* Little hand-drawn underline effect on hover */}
               <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
             </button>
           </div>
        </div>

        {/* Admin Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <button onClick={() => { setEditingPost(null); setShowAdmin(true); }} className="bg-black text-white dark:bg-white dark:text-black w-10 h-10 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform opacity-50 hover:opacity-100">
            <i className="fas fa-terminal text-xs"></i>
          </button>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showVaultModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
           <div className="bg-[#111] border-2 border-accent p-8 max-w-md text-center shadow-[0_0_50px_rgba(166,42,42,0.3)]">
              <i className="fas fa-triangle-exclamation text-5xl text-accent mb-6 animate-pulse"></i>
              <h2 className="text-xl font-bold text-white mb-2 font-mono">RESTRICTED AREA</h2>
              <div className="flex gap-4 justify-center mt-6">
                 <button onClick={() => setShowVaultModal(false)} className="px-6 py-2 border border-white text-white font-mono hover:bg-white hover:text-black">EXIT</button>
                 <button onClick={() => { setVaultUnlocked(true); localStorage.setItem('vaultUnlocked', 'true'); setShowVaultModal(false); setFilter('Locked'); }} className="px-6 py-2 bg-accent text-white font-mono font-bold hover:bg-red-700">ENTER</button>
              </div>
           </div>
        </div>
      )}

      {showAdmin && <AdminModal session={session} onClose={() => setShowAdmin(false)} onRefresh={fetchPosts} postToEdit={editingPost} />}
    </div>
  );
}