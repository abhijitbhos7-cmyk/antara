"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, X, Activity, Waves, Mic, Shuffle, SkipBack, SkipForward, Repeat } from "lucide-react";
import { useAudio } from "../context/AudioContext"; 
import { createBrowserClient } from "@supabase/ssr"; 
import PremiumModal from "./PremiumModal"; 

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

const brainwaveFrequencies = [
  { label: "None", value: 0 },
  { label: "4 Hz", value: 4 },
  { label: "40 Hz", value: 40 },
  { label: "396 Hz", value: 396 },
  { label: "432 Hz", value: 432 },
  { label: "528 Hz", value: 528 }
];

export default function AudioPlayer({ program, onClose, onComplete }) {
  const { playNext, playPrevious, isShuffled, toggleShuffle, isRepeat, toggleRepeat } = useAudio();

  const programAudioRef = useRef(null);
  const ambienceAudioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [voiceVolume, setVoiceVolume] = useState(0.9);
  const [ambienceVolume, setAmbienceVolume] = useState(0.25);
  const [freqVolume, setFreqVolume] = useState(0.1);
  const [selectedFreq, setSelectedFreq] = useState(0);
  const [selectedAmbience, setSelectedAmbience] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const freqGainRef = useRef(null);

  
  const [tier, setTier] = useState('free');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  
  useEffect(() => {
    const fetchTier = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('subscription_tier').eq('id', session.user.id).single();
        if (data?.subscription_tier) setTier(data.subscription_tier);
      }
    };
    fetchTier();
    setIsVisible(true); 
  }, []);

  useEffect(() => { setSelectedAmbience(program.ambienceUrl || ""); }, [program.id, program.ambienceUrl]);

 
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  
  useEffect(() => {
    
    const durationInSeconds = (program?.duration || 10) * 60; 
    
    if (currentTime >= durationInSeconds && durationInSeconds > 0) {
      if (onComplete) onComplete();
      
      
      if (typeof playNext === 'function') {
        playNext();
      }
    }
  }, [currentTime, program, playNext, onComplete]);

  useEffect(() => {
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.volume = ambienceVolume;
      if (isPlaying && selectedAmbience) ambienceAudioRef.current.play().catch(() => {});
      else ambienceAudioRef.current.pause();
    }
  }, [selectedAmbience, isPlaying]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const customLimit = program.duration ? program.duration * 60 : duration;
          const nextTime = prevTime + 1;
          
         
          if (tier === 'free' && nextTime >= 30) {
            clearInterval(interval); 
            setIsPlaying(false);
            if (programAudioRef.current) programAudioRef.current.pause();
            if (ambienceAudioRef.current) ambienceAudioRef.current.pause();
            
            setShowPremiumModal(true); 
            return 30;
          }

          if (customLimit > 0 && nextTime >= customLimit) {
            if (isRepeat) {
              if (programAudioRef.current) programAudioRef.current.currentTime = 0;
              return 0;
            } else {
              clearInterval(interval); 
              setIsPlaying(false);
              if (programAudioRef.current) programAudioRef.current.pause();
              if (ambienceAudioRef.current) ambienceAudioRef.current.pause();
              
              onComplete?.();
              playNext(); 
              
              return customLimit;
            }
          }
          return nextTime;
        });
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, program.duration, duration, onComplete, isRepeat, playNext, tier]);

  useEffect(() => { if (programAudioRef.current) programAudioRef.current.volume = voiceVolume; }, [voiceVolume]);
  useEffect(() => { if (ambienceAudioRef.current) ambienceAudioRef.current.volume = ambienceVolume; }, [ambienceVolume]);

  useEffect(() => {
    if (selectedFreq === 0) {
      if (oscRef.current) { oscRef.current.stop(); oscRef.current.disconnect(); oscRef.current = null; }
      return;
    }
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    if (!oscRef.current) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine'; osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); oscRef.current = osc; freqGainRef.current = gain;
    }
    oscRef.current.frequency.setValueAtTime(selectedFreq, ctx.currentTime);
    if (freqGainRef.current) freqGainRef.current.gain.setTargetAtTime(freqVolume, ctx.currentTime, 0.015);
  }, [selectedFreq]);

  useEffect(() => { if (freqGainRef.current && audioCtxRef.current) freqGainRef.current.gain.setTargetAtTime(freqVolume, audioCtxRef.current.currentTime, 0.015); }, [freqVolume]);
  
  useEffect(() => {
    if (audioCtxRef.current) {
      if (isPlaying && audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      else if (!isPlaying && audioCtxRef.current.state === 'running') audioCtxRef.current.suspend();
    }
  }, [isPlaying]);

  async function togglePlayback() {
    const programAudio = programAudioRef.current;
    if (!programAudio) return;
    
    
    if (tier === 'free' && currentTime >= 30) {
      setShowPremiumModal(true);
      return;
    }

    if (isPlaying) { programAudio.pause(); setIsPlaying(false); return; }
    if (currentTime >= duration) { setCurrentTime(0); programAudio.currentTime = 0; }
    programAudio.play().catch(() => {});
    setIsPlaying(true);
  }

  function handleClose() {
    setIsVisible(false);
    setTimeout(() => onClose(), 500);
  }

  return (
    <>
     
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}

      <section 
        className={`fixed bottom-0 left-0 right-0 z-[1000] w-full h-[96px] bg-[#0b3d33] border-t border-[#122d22] text-white flex items-center px-3 md:px-6 transition-transform duration-500 ease-out shadow-[0_-10px_30px_rgba(0,0,0,0.2)] ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <audio ref={programAudioRef} src={program.audio_url || program.audioUrl || null} preload="metadata" onLoadedMetadata={(e) => { if (!program.duration) setDuration(e.currentTarget.duration); }} />
        <audio ref={ambienceAudioRef} src={selectedAmbience || null} loop preload="auto" />

        
        <div className="flex items-center gap-3 md:gap-4 w-auto md:w-[30%] md:min-w-[200px] max-w-[140px] sm:max-w-[200px] md:max-w-none">
          <img 
            src={program.image_url || program.image} 
            alt={program.title} 
            className="h-12 w-12 md:h-14 md:w-14 rounded-md object-cover shadow-md border border-white/10 shrink-0" 
          />
          <div className="flex flex-col min-w-0 pr-2 md:pr-4">
            <h3 className="text-white font-bold text-sm truncate tracking-tight hover:underline cursor-pointer">
              {program.title}
            </h3>
            <p className="text-white/60 text-[11px] font-medium truncate mt-0.5 hover:underline cursor-pointer">
              {program.topic || "Antara Session"}
            </p>
          </div>
        </div>

       
        <div className="flex-1 max-w-[722px] mx-auto flex flex-col justify-center items-center px-2 md:px-4 mt-1">
          <div className="flex items-center gap-4 md:gap-7 mb-1.5">
            
            <button onClick={toggleShuffle} className={`relative transition-all hover:text-white active:scale-95 hidden sm:block ${isShuffled ? 'text-white' : 'text-white/50'}`}>
              <Shuffle className="h-4 w-4" />
              {isShuffled && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>}
            </button>
            
            <button onClick={playPrevious} className="text-white/50 hover:text-white transition-all active:scale-95" title="Previous Track">
              <SkipBack className="h-[18px] w-[18px] fill-current" />
            </button>
            
            <button onClick={togglePlayback} className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md">
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
            </button>
            
            <button onClick={playNext} className="text-white/50 hover:text-white transition-all active:scale-95" title="Next Track">
              <SkipForward className="h-[18px] w-[18px] fill-current" />
            </button>
            
            <button onClick={toggleRepeat} className={`relative transition-all hover:text-white active:scale-95 hidden sm:block ${isRepeat ? 'text-white' : 'text-white/50'}`}>
              <Repeat className="h-4 w-4" />
              {isRepeat && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>}
            </button>
          </div>
          
          <div className="flex items-center gap-2 w-full max-w-[600px] text-[10px] md:text-[11px] font-medium text-white/50">
            <span className="w-8 md:w-10 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1 flex items-center group">
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                step="1" 
                value={currentTime} 
                onChange={(e) => { 
                  const val = Number(e.target.value); 
                  
                  
                  if (tier === 'free' && val >= 30) {
                    setShowPremiumModal(true);
                    return;
                  }

                  setCurrentTime(val); 
                  if (programAudioRef.current && val <= (programAudioRef.current.duration || 0)) programAudioRef.current.currentTime = val; 
                }} 
                className="absolute z-20 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden group-hover:h-1.5 transition-all">
                <div className="h-full bg-white group-hover:bg-[#F0EDE6] transition-all duration-100 ease-linear rounded-full" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}></div>
              </div>
            </div>
            <span className="w-8 md:w-10">{formatTime(duration)}</span>
          </div>
        </div>

        
        <div className="hidden md:flex items-center justify-end gap-3 w-[30%] min-w-[280px]">
          <div className="bg-black/20 hover:bg-black/40 transition-colors rounded-xl p-2 flex flex-col items-center justify-between w-[64px] border border-white/5">
            <Mic className="w-3.5 h-3.5 text-white/90 mb-1"/>
            <span className="text-[8px] uppercase tracking-widest font-bold text-white/50 mb-1.5">Guide</span>
            <input type="range" min="0" max="1" step="0.05" value={voiceVolume} onChange={(e) => setVoiceVolume(Number(e.target.value))} className="w-full h-1 cursor-pointer appearance-none rounded-full bg-black/40 accent-white hover:h-1.5 transition-all" />
          </div>

          <div className="bg-black/20 hover:bg-black/40 transition-colors rounded-xl p-2 flex flex-col items-center justify-between w-[72px] border border-white/5">
            <Waves className="w-3.5 h-3.5 text-[#93c5fd] mb-1"/>
            <select value={selectedAmbience} onChange={(e) => setSelectedAmbience(e.target.value)} className="text-[8px] uppercase tracking-widest font-bold text-[#93c5fd] bg-transparent outline-none text-center w-full appearance-none mb-1.5 cursor-pointer hover:text-white transition-colors">
              <option value="" className="bg-[#0b3d33]">None</option>
              <option value="https://tpoilisvdacxgryhoujg.supabase.co/storage/v1/object/public/antara-audio/ambience/rain.mp3" className="bg-[#0b3d33]">Rain</option>
              <option value="https://tpoilisvdacxgryhoujg.supabase.co/storage/v1/object/public/antara-audio/ambience/waves.mp3" className="bg-[#0b3d33]">Waves</option>
              <option value="https://tpoilisvdacxgryhoujg.supabase.co/storage/v1/object/public/antara-audio/sessions/focus.mp3" className="bg-[#0b3d33]">Focus</option>
              <option value="/audio/ambience/tanpura.mp3" className="bg-[#0b3d33]">Tanpura</option>
            </select>
            <input type="range" min="0" max="1" step="0.05" value={ambienceVolume} onChange={(e) => setAmbienceVolume(Number(e.target.value))} className="w-full h-1 cursor-pointer appearance-none rounded-full bg-black/40 accent-[#93c5fd] hover:h-1.5 transition-all" />
          </div>

          <div className="bg-black/20 hover:bg-black/40 transition-colors rounded-xl p-2 flex flex-col items-center justify-between w-[72px] border border-white/5 relative">
            <Activity className={`w-3.5 h-3.5 mb-1 ${tier === 'free' ? 'text-gray-500' : 'text-[#d8b4fe]'}`}/>
            
           
            <select 
              value={selectedFreq} 
              onChange={(e) => {
                if (tier === 'free' && e.target.value !== "0") {
                  setShowPremiumModal(true);
                  return;
                }
                setSelectedFreq(Number(e.target.value));
              }} 
              className={`text-[8px] uppercase tracking-widest font-bold bg-transparent outline-none text-center w-full appearance-none mb-1.5 cursor-pointer transition-colors ${tier === 'free' ? 'text-gray-500' : 'text-[#d8b4fe] hover:text-white'}`}
            >
              {brainwaveFrequencies.map(freq => <option key={freq.value} value={freq.value} className="bg-[#0b3d33]">{freq.label}</option>)}
            </select>
            <input type="range" min="0" max="0.5" step="0.01" value={freqVolume} onChange={(e) => setFreqVolume(Number(e.target.value))} className="w-full h-1 cursor-pointer appearance-none rounded-full bg-black/40 accent-[#d8b4fe] hover:h-1.5 transition-all" />
          </div>

          <div className="pl-3 ml-1 border-l border-white/10 flex items-center">
            <button onClick={handleClose} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95" title="Close Player">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        
        <div className="md:hidden flex items-center justify-end pl-2">
          <button onClick={handleClose} className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95" title="Close Player">
            <X className="w-5 h-5" />
          </button>
        </div>
      </section>
    </>
  );
}