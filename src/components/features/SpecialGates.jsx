import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function SpecialGate({ isOpen, onClose }) {
  const [step, setStep] = useState(0); 
  const [inputName, setInputName] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [error, setError] = useState('');
  const [foundPerson, setFoundPerson] = useState(null);
  const [vipList, setVipList] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError('');
      setFoundPerson(null);
      setInputName('');
      setInputDate('');
      
      if (supabase) {
        supabase.from('vips').select('*').then(({ data }) => {
          if (data) setVipList(data);
        });
      }
    }
  }, [isOpen]);

  const checkName = () => {
    const cleanInput = inputName.trim().toLowerCase();
    const person = vipList.find(p => 
      p.names.toLowerCase().split(',').map(n => n.trim()).includes(cleanInput)
    );

    if (person) {
      setFoundPerson(person);
      setStep(3);
      setError('');
    } else {
      setError("I don't recall that name in these archives.");
    }
  };

  const checkDate = () => {
    if (!foundPerson) return;
    
    // SMART CHECK: IGNORE THE YEAR
    // Input format from picker: "2024-02-14"
    // We only care about the "-02-14" part (Month and Day)
    
    // 1. Get MM-DD from user input
    const userMMDD = inputDate.slice(5); // Removes first 5 chars (YYYY-)
    
    // 2. Get MM-DD from saved VIP date (assuming Admin saved it as YYYY-MM-DD)
    const targetMMDD = foundPerson.date.slice(5); 

    if (userMMDD === targetMMDD) {
      setStep(4);
    } else {
      setError("Name matches, but the timing is wrong.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-[#efe6d5]/95 dark:bg-black/95 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-red-500 font-mono">[ ESC ]</button>

        {/* STEP 1: Intro */}
        {step === 1 && (
          <div className="animate-[fadeIn_0.5s]">
            <h2 className="font-serif text-3xl mb-6 text-ink dark:text-white">Restricted Archives.</h2>
            <p className="font-mono text-xs text-gray-500 mb-8">This section is encrypted.</p>
            <div className="flex gap-4 justify-center font-mono text-sm">
              <button onClick={onClose} className="px-6 py-2 border border-gray-400 hover:bg-gray-200 text-gray-500">Cancel</button>
              <button onClick={() => setStep(2)} className="px-6 py-2 bg-accent text-white shadow-lg hover:scale-105 transition-transform">I have a Key</button>
            </div>
          </div>
        )}

        {/* STEP 2: Name */}
        {step === 2 && (
          <div className="animate-[fadeIn_0.5s]">
            <h2 className="font-hand text-4xl mb-6 text-accent">Identification.</h2>
            <input autoFocus type="text" placeholder="Your Name..." value={inputName} onChange={e => setInputName(e.target.value)} onKeyDown={e => e.key === 'Enter' && checkName()} className="bg-transparent border-b-2 border-ink/20 dark:border-white/20 text-center text-2xl font-serif w-full outline-none focus:border-accent pb-2 mb-6 dark:text-white" />
            <button onClick={checkName} className="font-mono text-xs uppercase tracking-widest hover:text-accent">Next Step</button>
            {error && <p className="text-red-500 font-mono text-xs mt-4 animate-shake">{error}</p>}
          </div>
        )}

        {/* STEP 3: Date (CALENDAR PICKER) */}
        {step === 3 && (
          <div className="animate-[fadeIn_0.5s]">
            <h2 className="font-hand text-4xl mb-6 text-accent">Verification.</h2>
            <p className="font-serif mb-4 dark:text-gray-300">Select the Key Date (Year doesn't matter):</p>
            
            <div className="relative inline-block mx-auto mb-6">
              <input 
                type="date" 
                value={inputDate} 
                onChange={e => setInputDate(e.target.value)} 
                className="bg-transparent border-b-2 border-ink/20 dark:border-white/20 text-center text-xl font-mono p-2 outline-none focus:border-accent dark:text-white dark:[color-scheme:dark] cursor-pointer"
              />
            </div>
            
            <br/>
            <button onClick={checkDate} className="font-mono text-xs uppercase tracking-widest hover:text-accent">Decrypt</button>
            {error && <p className="text-red-500 font-mono text-xs mt-4 animate-shake">{error}</p>}
          </div>
        )}

        {/* STEP 4: Success */}
        {step === 4 && foundPerson && (
          <div className="animate-[fadeIn_1s]">
            <div className="text-6xl text-accent mb-6 animate-pulse">♥</div>
            <h2 className="font-serif text-2xl mb-4 italic text-ink dark:text-white capitalize">Welcome, {inputName}.</h2>
            <div className="relative p-8 border border-dashed border-gray-400 bg-white/50 dark:bg-black/50 rotate-1 shadow-lg">
               <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink text-white px-2 py-0.5 text-[10px] font-mono">ENCRYPTED MSG DECODED</span>
               <p className="font-hand text-3xl leading-relaxed text-gray-800 dark:text-gray-200">"{foundPerson.message}"</p>
            </div>
            <button onClick={onClose} className="mt-8 text-xs font-mono opacity-50 hover:opacity-100 hover:text-accent">[ Close Connection ]</button>
          </div>
        )}
      </div>
    </div>
  );
}
