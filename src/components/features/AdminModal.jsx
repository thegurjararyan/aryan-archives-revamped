import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminModal({ session, onClose, onRefresh, postToEdit }) {
  // --- STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Tabs: 'posts' or 'vips'
  const [activeTab, setActiveTab] = useState('posts'); 

  // Post Editor State
  const [formData, setFormData] = useState(postToEdit || { 
    title: '', content: '', type: 'Poetry', status: 'published', is_pinned: false, is_locked: false, image_url: '' 
  });

  // VIP Editor State
  const [vips, setVips] = useState([]);
  const [vipForm, setVipForm] = useState({ names: '', date: '', message: '' });

  // --- EFFECTS ---
  useEffect(() => {
    // Fetch VIPs only when looking at that tab
    if (session && activeTab === 'vips') fetchVips();
  }, [session, activeTab]);

  // --- ACTIONS ---
  const fetchVips = async () => {
    const { data } = await supabase.from('vips').select('*').order('created_at', { ascending: false });
    if (data) setVips(data);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  // Save Post
  const handleSavePost = async () => {
    if (!formData.content.trim()) return;
    
    const payload = { ...formData };
    delete payload.id; 
    delete payload.created_at;

    if (postToEdit) {
      await supabase.from('posts').update(payload).eq('id', postToEdit.id);
    } else {
      await supabase.from('posts').insert(payload);
    }
    
    onRefresh();
    onClose();
  };

  // Save VIP
  const handleSaveVip = async () => {
    if (!vipForm.names || !vipForm.message) return;
    
    await supabase.from('vips').insert(vipForm);
    setVipForm({ names: '', date: '', message: '' }); // Reset form
    fetchVips(); // Refresh list
  };

  // Delete VIP
  const handleDeleteVip = async (id) => {
    if (confirm("Remove this person from the VIP list?")) {
      await supabase.from('vips').delete().eq('id', id);
      fetchVips();
    }
  };

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#111] border border-gray-700 w-full max-w-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        
        {/* === HEADER === */}
        <div className="bg-[#1a1a1a] p-4 flex justify-between items-center border-b border-gray-700">
          <div className="flex gap-4">
             {session ? (
               <>
                 <button onClick={() => setActiveTab('posts')} className={`font-mono text-xs ${activeTab==='posts' ? 'text-green-500 font-bold' : 'text-gray-500 hover:text-white'}`}>POSTS</button>
                 <button onClick={() => setActiveTab('vips')} className={`font-mono text-xs ${activeTab==='vips' ? 'text-accent font-bold' : 'text-gray-500 hover:text-white'}`}>VIP_LIST</button>
               </>
             ) : (
               <span className="text-green-500 font-mono text-sm tracking-widest">SYSTEM_AUTH</span>
             )}
          </div>
          <button onClick={onClose} className="text-red-500 hover:text-white font-mono">[CLOSE]</button>
        </div>

        {/* === BODY === */}
        <div className="p-6">
          {!session ? (
            // 1. LOGIN FORM
            <div className="space-y-4 max-w-sm mx-auto py-8">
              <input className="w-full bg-black border border-gray-700 p-3 text-white font-mono outline-none focus:border-green-500" placeholder="ADMIN_ID" value={email} onChange={e => setEmail(e.target.value)} />
              <input className="w-full bg-black border border-gray-700 p-3 text-white font-mono outline-none focus:border-green-500" type="password" placeholder="PASSCODE" value={password} onChange={e => setPassword(e.target.value)} />
              <button onClick={handleLogin} className="w-full bg-green-900/20 border border-green-500 text-green-500 py-3 font-mono hover:bg-green-500 hover:text-black transition-all">AUTHENTICATE</button>
            </div>
          ) : (
            <>
              {/* 2. POST EDITOR TAB */}
              {activeTab === 'posts' && (
                <div className="space-y-4 font-mono text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="bg-black border border-gray-700 p-3 text-white outline-none focus:border-accent" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    <select className="bg-black border border-gray-700 p-3 text-white outline-none focus:border-accent" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      {['Poetry', 'Diary Entry', 'Story', 'Confession', 'Tech', 'Book Review'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  
                  <textarea className="w-full bg-black border border-gray-700 p-3 text-white outline-none focus:border-accent h-64 font-serif text-base" placeholder="Write your memory here..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
                  
                  <input className="w-full bg-black border border-gray-700 p-3 text-white outline-none focus:border-accent" placeholder="Image URL (Optional)" value={formData.image_url || ''} onChange={e => setFormData({...formData, image_url: e.target.value})} />

                  <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-800 text-xs uppercase tracking-widest text-gray-400">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white"><input type="checkbox" checked={formData.is_pinned} onChange={e => setFormData({...formData, is_pinned: e.target.checked})} /> Pinned</label>
                    <label className="flex items-center gap-2 cursor-pointer hover:text-red-400"><input type="checkbox" checked={formData.is_locked} onChange={e => setFormData({...formData, is_locked: e.target.checked})} /> Locked (18+)</label>
                    <select className="bg-black border border-gray-700 text-yellow-500 p-1" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="published">PUBLISHED</option>
                      <option value="draft">DRAFT</option>
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button onClick={handleSavePost} className="flex-1 bg-accent text-white py-3 font-bold hover:bg-red-700 transition-colors">
                      {postToEdit ? 'SAVE CHANGES' : 'PUBLISH ENTRY'}
                    </button>
                    <button onClick={() => supabase.auth.signOut()} className="px-6 border border-gray-700 text-gray-500 hover:text-white">
                      LOGOUT
                    </button>
                  </div>
                </div>
              )}

              {/* 3. VIP EDITOR TAB */}
              {activeTab === 'vips' && (
                <div className="space-y-6">
                   {/* Add New Form */}
                   <div className="bg-black/50 p-4 border border-dashed border-gray-700">
                      <h3 className="text-white font-mono text-xs mb-3 text-accent">ADD NEW SOUL</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                         <input 
                           className="bg-black border border-gray-700 p-2 text-white text-xs outline-none focus:border-accent" 
                           placeholder="Names (e.g. aditi, adu)" 
                           value={vipForm.names} 
                           onChange={e => setVipForm({...vipForm, names: e.target.value})} 
                         />
                         {/* DATE PICKER */}
                         <input 
                           type="date" 
                           className="bg-black border border-gray-700 p-2 text-white text-xs outline-none focus:border-accent [color-scheme:dark]" 
                           value={vipForm.date} 
                           onChange={e => setVipForm({...vipForm, date: e.target.value})} 
                         />
                      </div>
                      <textarea 
                        className="w-full bg-black border border-gray-700 p-2 text-white text-xs outline-none h-20 focus:border-accent" 
                        placeholder="Secret Message..." 
                        value={vipForm.message} 
                        onChange={e => setVipForm({...vipForm, message: e.target.value})} 
                      />
                      <button onClick={handleSaveVip} className="w-full bg-accent text-white py-2 text-xs font-bold mt-2 hover:bg-red-700">GRANT ACCESS</button>
                   </div>

                   {/* List Existing VIPs */}
                   <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                      {vips.length === 0 && <p className="text-gray-500 text-xs italic text-center">No VIPs yet.</p>}
                      {vips.map(vip => (
                        <div key={vip.id} className="flex justify-between items-center bg-[#1a1a1a] p-3 border-l-2 border-green-500">
                           <div className="text-xs text-gray-300">
                              <span className="font-bold text-white block uppercase">{vip.names}</span>
                              <span className="opacity-50 font-mono">Date: {vip.date}</span>
                           </div>
                           <button onClick={() => handleDeleteVip(vip.id)} className="text-red-500 hover:text-white"><i className="fas fa-trash"></i></button>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}