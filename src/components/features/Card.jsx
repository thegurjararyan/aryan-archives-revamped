import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { supabase } from '../../lib/supabase'; // Import DB for comments
import { formatDate, generateCoolName } from '../../lib/utils';

export default function Card({ post, onLike, onDelete, onEdit, isAdmin, vaultUnlocked, triggerVault }) {
  const cardRef = useRef(null);
  const [likes, setLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // --- AGING LOGIC ---
const getAgeStyle = (dateStr) => {
  if (dateStr === 'Unknown') return "sepia-[.3] opacity-90 contrast-[0.9]"; // Ancient
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 730) return "sepia-[.15] opacity-95"; // > 2 Years (Old)
  return "bg-white"; // Fresh
};

// Add this class to your `container` variable in the Card component:
// container += ` ${getAgeStyle(post.created_at)} `;
  
  
  
  
  // --- COMMENT LOGIC ---
  useEffect(() => {
    if (showComments && supabase) {
      supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: false })
        .then(({ data }) => setComments(data || []));
    }
  }, [showComments, post.id]);

  const handleComment = async () => {
    if (!newComment.trim() || !supabase) return;
    const author = localStorage.getItem('anonName') || generateCoolName();
    localStorage.setItem('anonName', author); // Remember name
    
    // Optimistic Update
    const commentObj = { id: Date.now(), author_name: author, content: newComment };
    setComments([commentObj, ...comments]);
    setNewComment('');

    await supabase.from('comments').insert({ post_id: post.id, author_name: author, content: commentObj.content });
  };

  const handleLike = () => {
    onLike(post.id, likes);
    setLikes(prev => prev + 1);
  };

  const exportImage = async () => {
    if (!cardRef.current) return;
    const actions = cardRef.current.querySelector('.actions');
    const commentsDiv = cardRef.current.querySelector('.comments-section');
    if(actions) actions.style.display = 'none';
    if(commentsDiv) commentsDiv.style.display = 'none'; // Don't screenshot comments
    
    const wm = document.createElement('div');
    wm.innerText = "AryanArchives";
    wm.className = "absolute bottom-2 right-2 text-[8px] font-mono opacity-50";
    cardRef.current.appendChild(wm);

    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement('a');
      link.download = `Aryan-${post.title || 'Memory'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch(e) { console.error(e); } 
    finally {
      if(actions) actions.style.display = 'flex';
      if(commentsDiv) commentsDiv.style.display = 'block';
      cardRef.current.removeChild(wm);
    }
  };

  // --- STYLES ---
  let container = "relative mb-8 transition-all duration-300 break-inside-avoid hover:-translate-y-1 hover:shadow-lg ";
  let content = null;

  if (post.is_locked && !vaultUnlocked) {
    container += "bg-black text-white text-center p-12 border border-gray-800 rounded-sm";
    content = (
      <div className="flex flex-col items-center">
        <i className="fas fa-lock text-3xl text-accent mb-4"></i>
        <h3 className="font-mono text-xs tracking-[0.2em] mb-2 text-gray-400">RESTRICTED_ACCESS</h3>
        <button onClick={triggerVault} className="text-[10px] bg-accent px-4 py-2 font-bold hover:bg-red-700 transition-colors">UNLOCK (18+)</button>
      </div>
    );
  } else if (post.type === 'Poetry') {
    container += "bg-white dark:bg-[#1a1a1a] p-8 border border-dashed border-gray-400 dark:border-gray-600 text-center";
    content = (
      <>
        {post.is_pinned && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white px-3 py-0.5 text-[10px] font-mono -rotate-2 shadow-sm">PINNED</div>}
        <h2 className="font-hand text-4xl text-accent -rotate-2 mb-6 mt-2 leading-none">{post.title}</h2>
        <p className="font-serif italic text-lg text-ink/80 dark:text-white/80 whitespace-pre-line leading-relaxed">{post.content}</p>
      </>
    );
  } else if (post.type === 'Tech') {
    container += "bg-[#0c0c0c] border border-gray-800 rounded-md overflow-hidden font-mono text-sm shadow-xl";
    content = (
      <>
        <div className="bg-[#1f1f1f] px-3 py-2 flex items-center gap-2 border-b border-gray-800 mb-4">
           <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div></div>
           <span className="ml-2 text-[10px] text-gray-500 opacity-60">~/archives/{post.title?.toLowerCase().replace(/ /g, '_')}</span>
        </div>
        <div className="p-5 pt-0 text-green-400/90 whitespace-pre-wrap leading-relaxed">
          <span className="text-gray-600 select-none mr-2">$ cat log.txt</span><br/>{post.content}<span className="animate-pulse ml-1 inline-block w-2 h-4 bg-green-500 align-middle"></span>
        </div>
      </>
    );
  } else if (post.type === 'Book Review') {
    // BOOK REVIEW STYLE
    container += "bg-[#f4f4f4] dark:bg-[#222] border border-gray-400 dark:border-gray-700 p-0 font-serif";
    content = (
      <>
        <div className="bg-[#1a1a1a] text-white p-2 text-center text-[10px] font-mono uppercase tracking-widest">LIBRARY ARCHIVE</div>
        <div className="p-6">
          {post.image_url && (
            <div className="w-24 h-36 bg-gray-300 float-left mr-4 mb-2 shadow-md border border-white dark:border-gray-600">
               <img src={post.image_url} className="w-full h-full object-cover" alt="Book" />
            </div>
          )}
          <h2 className="font-serif font-bold text-xl mb-1 dark:text-white">{post.title}</h2>
          <div className="text-accent text-xs mb-3 font-mono">★★★★☆ VERDICT: READ</div>
          <p className="text-sm leading-relaxed text-ink/90 dark:text-gray-300 whitespace-pre-line">{post.content}</p>
          <div className="clear-both"></div>
        </div>
      </>
    );
  } else {
    container += "bg-white dark:bg-[#151515] p-6 border-l-4 border-accent shadow-md";
    content = (
      <>
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-mono border-b border-gray-200 dark:border-gray-800 pb-2">
           <span>{post.type}</span><span>{formatDate(post.created_at)}</span>
        </div>
        {post.image_url && <img src={post.image_url} className="w-full h-auto mb-4 grayscale hover:grayscale-0 transition-all duration-500" />}
        <h2 className="font-serif text-2xl font-bold mb-3 dark:text-white leading-tight">{post.title}</h2>
        <p className={`whitespace-pre-wrap text-sm leading-relaxed text-ink/90 dark:text-gray-300 ${/[\u0900-\u097F]/.test(post.content) ? 'font-hindi text-base' : 'font-serif'}`}>{post.content}</p>
      </>
    );
  }

  return (
    <div ref={cardRef} className={container}>
      {content}
      
      {!post.is_locked && (
        <>
          <div className="actions mt-6 pt-4 border-t border-ink/5 dark:border-white/5 flex justify-end gap-4 text-gray-400 text-xs font-mono">
             <button onClick={handleLike} className={`hover:text-accent transition-colors flex items-center gap-1 ${localStorage.getItem(`liked-${post.id}`) ? 'text-accent' : ''}`}>
               <i className={`${localStorage.getItem(`liked-${post.id}`) ? 'fas' : 'far'} fa-heart`}></i> {likes}
             </button>
             <button onClick={() => setShowComments(!showComments)} className="hover:text-blue-500"><i className="far fa-comment"></i></button>
             <button onClick={exportImage} className="hover:text-ink dark:hover:text-white transition-colors"><i className="fas fa-camera"></i></button>
             {isAdmin && <><button onClick={() => onEdit(post)} className="hover:text-yellow-500"><i className="fas fa-edit"></i></button><button onClick={() => onDelete(post.id)} className="hover:text-red-500"><i className="fas fa-trash"></i></button></>}
          </div>

          {/* COMMENTS SECTION */}
          {showComments && (
            <div className="comments-section mt-4 bg-gray-50 dark:bg-black/30 p-3 rounded border border-gray-100 dark:border-gray-800 animate-[fadeIn_0.2s]">
              <div className="max-h-32 overflow-y-auto mb-3 space-y-2 no-scrollbar">
                {comments.length === 0 ? <p className="text-[10px] opacity-50 italic">No echoes yet...</p> : comments.map(c => (
                  <div key={c.id} className="text-xs border-b border-gray-200 dark:border-gray-700 pb-1">
                    <span className="font-bold text-accent">{c.author_name}: </span>
                    <span className="dark:text-gray-300">{c.content}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleComment()} placeholder="Leave a trace..." className="flex-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 dark:text-white px-2 py-1 text-xs outline-none" />
                <button onClick={handleComment} className="bg-ink dark:bg-white dark:text-black text-white px-3 text-[10px] font-mono hover:bg-accent">POST</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}