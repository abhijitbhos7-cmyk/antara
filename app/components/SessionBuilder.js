"use client";

import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const SESSION_TOPICS = [
  "Focus",
  "Calm",
  "Confidence",
  "Sleep",
  "Self-love",
  "Devotion",
  "Spirituality"
];

export default function SessionBuilder({ topic, duration, sound, onTopicChange, onDurationChange, onSoundChange, onClose, onCreate }) {
  const [dynamicSounds, setDynamicSounds] = useState([]);

  
  useEffect(() => {
    const fetchAmbience = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data, error } = await supabase.from("ambience_tracks").select("*");
      if (data && !error) {
        setDynamicSounds(data);
      }
    };
    fetchAmbience();
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-overlay">
      
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#F8F5F0] bg-paper-texture p-8 md:p-10 shadow-[0_20px_50px_-10px_rgba(11,61,51,0.3)] border border-[#0b3d33]/15 animate-modal">
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-black tracking-tight text-[#0f172a]">Build Session</h2>
          <button 
            onClick={onClose} 
            className="rounded-full bg-white/60 p-2.5 text-gray-500 hover:bg-white hover:text-gray-900 hover:scale-105 active:scale-95 transition shadow-sm border border-[#0b3d33]/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="relative z-10 space-y-6">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#0b3d33]/70">What do you need today?</span>
            <select 
              value={topic} 
              onChange={(e) => onTopicChange(e.target.value)} 
              className="w-full cursor-pointer rounded-2xl border border-[#0b3d33]/15 bg-white/60 px-4 py-3.5 font-medium text-[#0f172a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
            >
              {SESSION_TOPICS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#0b3d33]/70">Session length (minutes)</span>
            <input 
              type="number" 
              min="1" 
              max="180" 
              placeholder="e.g. 15"
              value={duration} 
              onChange={(e) => onDurationChange(e.target.value)} 
              className="w-full rounded-2xl border border-[#0b3d33]/15 bg-white/60 px-4 py-3.5 font-medium text-[#0f172a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#0b3d33]/70">Background sound</span>
            <select 
              value={sound} 
              onChange={(e) => onSoundChange(e.target.value)} 
              className="w-full cursor-pointer rounded-2xl border border-[#0b3d33]/15 bg-white/60 px-4 py-3.5 font-medium text-[#0f172a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
            >
             
              <option value="Soft rain">Soft rain</option>
              <option value="Ocean waves">Ocean waves</option>
              <option value="Gentle tanpura">Gentle tanpura</option>
              <option value="Focus ambience">Focus ambience</option>

              
              {dynamicSounds.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title} (Cloud)
                </option>
              ))}
            </select>
          </label>
        </div>

        <button 
          onClick={onCreate} 
          className="relative z-10 mt-10 flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#041c17] bg-gradient-to-b from-[#0b3d33] to-[#072a23] text-base font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_6px_12px_rgba(11,61,51,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_8px_16px_rgba(11,61,51,0.4)] active:scale-[0.98]"
        >
          <Play className="ml-1 h-5 w-5 fill-current drop-shadow-md" /> Start my session
        </button>
      </div>
    </div>
  );
}