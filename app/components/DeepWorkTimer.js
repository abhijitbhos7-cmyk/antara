"use client";

import { useState, useEffect } from "react";
import { Play, Pause, X, Brain, Coffee, RotateCcw, Target } from "lucide-react";

export default function DeepWorkTimer({ onClose }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("focus"); // 'focus' or 'rest'
  const [task, setTask] = useState("");

  const placeholderTasks = [
    "Spot the error grammar practice...",
    "Calculus integration drills...",
    "ZBrush 1/7 scale sculpting...",
    "UPSC mock test review...",
    "NDA syllabus mapping..."
  ];
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Cycle through placeholders for inspiration
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderTasks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      // Auto-switch modes when timer hits 0
      const nextMode = mode === "focus" ? "rest" : "focus";
      setMode(nextMode);
      setTimeLeft(nextMode === "focus" ? 25 * 60 : 5 * 60);
      setIsActive(false); // Pause so the user can physically start the next phase
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isFocus = mode === "focus";

  return (
    <div className={`fixed inset-0 z-[2000] flex flex-col items-center justify-center transition-colors duration-1000 ease-in-out ${isFocus ? 'bg-[#0b3d33]' : 'bg-[#F0EDE6]'}`}>
      
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-8 flex justify-between items-center z-10">
        <div className={`flex items-center gap-3 font-black tracking-widest text-xl ${isFocus ? 'text-white' : 'text-[#0b3d33]'}`}>
          <Target className="h-6 w-6" />
          DEEP WORK STUDIO
        </div>
        <button 
          onClick={onClose}
          className={`p-3 rounded-full transition-all active:scale-95 ${isFocus ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-[#0b3d33] hover:bg-black/10'}`}
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl px-6 flex flex-col items-center animate-in zoom-in-95 duration-500">
        
        {/* Mode Switcher */}
        <div className={`flex items-center gap-2 p-1.5 rounded-full mb-12 ${isFocus ? 'bg-white/10' : 'bg-black/5'}`}>
          <button 
            onClick={() => switchMode('focus')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${isFocus ? 'bg-white text-[#0b3d33] shadow-lg' : 'text-black/50 hover:text-black/70'}`}
          >
            <Brain className="h-4 w-4" /> Focus
          </button>
          <button 
            onClick={() => switchMode('rest')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isFocus ? 'bg-[#0b3d33] text-white shadow-lg' : 'text-white/50 hover:text-white/80'}`}
          >
            <Coffee className="h-4 w-4" /> Rest
          </button>
        </div>

        {/* Massive Timer */}
        <div className={`text-[120px] md:text-[180px] font-black tracking-tighter leading-none mb-8 drop-shadow-sm ${isFocus ? 'text-white' : 'text-[#0b3d33]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {formatTime(timeLeft)}
        </div>

        {/* Task Input */}
        <input 
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder={placeholderTasks[placeholderIndex]}
          className={`w-full max-w-md text-center text-xl font-medium outline-none bg-transparent border-b-2 pb-2 transition-colors duration-300 placeholder:transition-opacity ${isFocus ? 'border-white/20 text-white placeholder:text-white/30 focus:border-white' : 'border-[#0b3d33]/20 text-[#0b3d33] placeholder:text-[#0b3d33]/30 focus:border-[#0b3d33]'}`}
        />

        {/* Controls */}
        <div className="flex items-center gap-6 mt-16">
          <button 
            onClick={resetTimer}
            className={`p-4 rounded-full transition-all active:scale-95 ${isFocus ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-[#0b3d33]/50 hover:text-[#0b3d33] hover:bg-black/5'}`}
          >
            <RotateCcw className="h-8 w-8" />
          </button>
          
          <button 
            onClick={toggleTimer}
            className={`flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 ${isFocus ? 'bg-white text-[#0b3d33]' : 'bg-[#0b3d33] text-white'}`}
          >
            {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-2" />}
          </button>

          <div className="w-16"></div> {/* Spacer for symmetry */}
        </div>

      </div>
    </div>
  );
}