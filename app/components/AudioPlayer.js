"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, X, Activity, Waves } from "lucide-react";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

const brainwaveFrequencies = [
  { label: "Off - No Frequency", value: 0 },
  { label: "4 Hz - Delta (Deep Sleep)", value: 4 },
  { label: "40 Hz - Gamma (Deep Focus)", value: 40 },
  { label: "396 Hz - Solfeggio (Liberation)", value: 396 },
  { label: "432 Hz - Solfeggio (Healing)", value: 432 },
  { label: "528 Hz - Solfeggio (DNA Repair)", value: 528 },
  { label: "639 Hz - Solfeggio (Connection)", value: 639 }
];

export default function AudioPlayer({ program, onClose, onComplete }) {
  const programAudioRef = useRef(null);
  const ambienceAudioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  
  const [voiceVolume, setVoiceVolume] = useState(0.9);
  const [ambienceVolume, setAmbienceVolume] = useState(0.25);
  const [freqVolume, setFreqVolume] = useState(0.1);
  const [selectedFreq, setSelectedFreq] = useState(0);

  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const freqGainRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(program.duration ? program.duration * 60 : 0);
    setError("");

    const startAudio = async () => {
      if (programAudioRef.current && program.audioUrl) {
        programAudioRef.current.volume = voiceVolume;
        programAudioRef.current.play().catch(() => console.log("Voice audio missing, running in silent mode."));
      }
      
      if (ambienceAudioRef.current && program.ambienceUrl) {
        ambienceAudioRef.current.volume = ambienceVolume;
        ambienceAudioRef.current.play().catch(() => console.log("Ambience audio missing, running in silent mode."));
      }
      
      setIsPlaying(true);
    };

    startAudio();
  }, [program.id, program.duration]);

  
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const customLimit = program.duration ? program.duration * 60 : duration;
          const nextTime = prevTime + 1;
          
          if (customLimit > 0 && nextTime >= customLimit) {
            clearInterval(interval);
            setIsPlaying(false);
            
            if (programAudioRef.current) programAudioRef.current.pause();
            if (ambienceAudioRef.current) ambienceAudioRef.current.pause();
            
            onComplete?.();
            
            setTimeout(() => {
              alert(`✨ Session Complete!\n\nYour ${program.duration}-minute session has ended successfully.`);
            }, 100);
            
            return customLimit;
          }
          
          return nextTime;
        });
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, program.duration, duration, onComplete]);

  
  useEffect(() => {
    if (programAudioRef.current) programAudioRef.current.volume = voiceVolume;
  }, [voiceVolume]);

  useEffect(() => {
    if (ambienceAudioRef.current) ambienceAudioRef.current.volume = ambienceVolume;
  }, [ambienceVolume]);


  
  useEffect(() => {
    if (selectedFreq === 0) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;

    if (!oscRef.current) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine'; 
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      oscRef.current = osc;
      freqGainRef.current = gain;
    }

   
    oscRef.current.frequency.setValueAtTime(selectedFreq, ctx.currentTime);
    
    if (freqGainRef.current) {
      freqGainRef.current.gain.setTargetAtTime(freqVolume, ctx.currentTime, 0.015);
    }
  }, [selectedFreq]);

  
  useEffect(() => {
    if (freqGainRef.current && audioCtxRef.current) {
      freqGainRef.current.gain.setTargetAtTime(freqVolume, audioCtxRef.current.currentTime, 0.015);
    }
  }, [freqVolume]);

  
  useEffect(() => {
    if (audioCtxRef.current) {
      if (isPlaying && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      } else if (!isPlaying && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    }
  }, [isPlaying]);

  
  useEffect(() => {
    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch(e){}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    }
  }, []);
 

  async function togglePlayback() {
    const programAudio = programAudioRef.current;
    const ambienceAudio = ambienceAudioRef.current;

    if (!programAudio) return;

    if (isPlaying) {
      programAudio.pause();
      ambienceAudio?.pause();
      setIsPlaying(false);
      return;
    }

    if (currentTime >= duration) {
      setCurrentTime(0);
      if (programAudio) programAudio.currentTime = 0;
      if (ambienceAudio) ambienceAudio.currentTime = 0;
    }

    if (programAudio && program.audioUrl) {
      programAudio.play().catch(() => console.log("Voice audio missing."));
    }
    
    if (ambienceAudio && program.ambienceUrl) {
      ambienceAudio.play().catch(() => console.log("Ambience audio missing."));
    }
    
    setIsPlaying(true);
    setError(""); 
  }

  function handleEnded() {
    const customLimit = program.duration ? program.duration * 60 : 0;
    if (customLimit > 0 && currentTime < customLimit) {
      return; 
    }

    setIsPlaying(false);
    ambienceAudioRef.current?.pause();
    onComplete?.();
  }

  function handleClose() {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  }

  return (
    <section 
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/40 bg-white/75 px-4 py-4 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out md:px-6 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b3d33]/10 via-transparent to-[#0b3d33]/10 opacity-60 animate-[pulse_4s_ease-in-out_infinite] pointer-events-none"></div>

      <audio
        ref={programAudioRef}
        src={program.audioUrl}
        preload="metadata"
        onLoadedMetadata={(event) => {
          if (!program.duration) {
            setDuration(event.currentTarget.duration);
          }
        }}
        onEnded={handleEnded}
      />

      {program.ambienceUrl && (
        <audio ref={ambienceAudioRef} src={program.ambienceUrl} loop preload="auto" />
      )}

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
        
        
        <div className="flex items-center justify-between gap-4 md:w-1/4">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={program.image}
              alt=""
              className={`h-12 w-12 shrink-0 rounded-full object-cover shadow-md transition-all duration-700 md:h-14 md:w-14 ${
                isPlaying ? "animate-[spin_6s_linear_infinite]" : ""
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-gray-900 md:text-base">{program.title}</p>
              <p className="truncate text-xs font-medium text-gray-500">
                {program.topic} Session
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close player"
            className="rounded-full p-2 text-gray-500 transition hover:bg-white/50 hover:text-gray-900 md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause session" : "Play session"}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#0b3d33] text-white transition-all hover:scale-105 md:h-10 md:w-10 ${
                isPlaying ? "shadow-[0_0_15px_rgba(20,69,47,0.5)] animate-[pulse_2s_ease-in-out_infinite]" : "shadow-md shadow-[#0b3d33]/30"
              }`}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current md:h-5 md:w-5" />
              ) : (
                <Play className="h-4 w-4 fill-current ml-0.5 md:h-5 md:w-5" />
              )}
            </button>
          </div>

          <div className="flex w-full max-w-md items-center gap-2 text-[11px] font-medium text-gray-500">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="1"
              value={currentTime}
              onChange={(event) => {
                const value = Number(event.target.value);
                setCurrentTime(value);
                if (programAudioRef.current && value <= (programAudioRef.current.duration || 0)) {
                  programAudioRef.current.currentTime = value;
                }
              }}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-black/10 accent-[#0b3d33]"
            />
            <span className="w-8">{formatTime(duration)}</span>
          </div>
        </div>

       
        <div className="hidden lg:flex w-[40%] items-center justify-end gap-5">
          
          <div className="flex flex-col gap-2 border-r border-gray-300 pr-5">
            
            <div className="flex items-center gap-2" title="Guide Volume">
              <Volume2 className="h-3.5 w-3.5 text-[#0b3d33]" />
              <input
                type="range" min="0" max="1" step="0.05" value={voiceVolume}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-black/10 accent-[#0b3d33]"
              />
            </div>
           
            <div className="flex items-center gap-2" title="Ambience Volume">
              <Waves className="h-3.5 w-3.5 text-blue-600" />
              <input
                type="range" min="0" max="1" step="0.05" value={ambienceVolume}
                onChange={(e) => setAmbienceVolume(Number(e.target.value))}
                className="h-1.5 w-20 cursor-pointer appearance-none rounded-full bg-black/10 accent-blue-600"
              />
            </div>
          </div>

          
          <div className="flex flex-col gap-2 pr-2">
            <select 
              value={selectedFreq} 
              onChange={(e) => setSelectedFreq(Number(e.target.value))}
              className="text-[10px] font-bold text-gray-700 bg-gray-100/80 rounded-md px-1.5 py-1 outline-none border border-gray-200 cursor-pointer w-[150px]"
            >
              {brainwaveFrequencies.map(freq => (
                <option key={freq.value} value={freq.value}>{freq.label}</option>
              ))}
            </select>
            
            <div className={`flex items-center gap-2 transition-opacity ${selectedFreq === 0 ? "opacity-30 pointer-events-none" : "opacity-100"}`} title="Frequency Volume">
              <Activity className="h-3.5 w-3.5 text-purple-600" />
              <input
                type="range" min="0" max="0.5" step="0.01" value={freqVolume}
                onChange={(e) => setFreqVolume(Number(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-black/10 accent-purple-600"
              />
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close player"
            className="rounded-full p-2 text-gray-500 transition hover:bg-white/50 hover:text-gray-900 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {error && <p className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 rounded-lg bg-red-50/90 backdrop-blur-sm px-4 py-2 text-sm text-red-600 shadow-lg">{error}</p>}
    </section>
  );
}




