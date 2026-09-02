import { Play, X } from "lucide-react";
import { topics } from "../lib/antara-content";

export default function SessionBuilder({ topic, duration, sound, onTopicChange, onDurationChange, onSoundChange, onClose, onCreate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-overlay">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-modal">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Build session</h2>
          <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        
        <div className="space-y-5">
          <label className="block text-sm font-bold text-gray-700">What do you need today?
            <select value={topic} onChange={(e) => onTopicChange(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33]">
              {topics.slice(1).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          
          <label className="block text-sm font-bold text-gray-700">Session length (minutes)
            <input 
              type="number" min="1" max="180" placeholder="e.g. 15"
              value={duration} onChange={(e) => onDurationChange(e.target.value)} 
              className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33]"
            />
          </label>

          <label className="block text-sm font-bold text-gray-700">Background sound
            <select value={sound} onChange={(e) => onSoundChange(e.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33]">
              <option>Soft rain</option><option>Ocean waves</option><option>Gentle tanpura</option><option>Focus ambience</option>
            </select>
          </label>
        </div>
        <button onClick={onCreate} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#0b3d33] py-3.5 font-bold text-white shadow-md transition hover:scale-[1.02]">
          <Play className="h-4 w-4 fill-current" /> Start my session
        </button>
      </div>
    </div>
  );
}