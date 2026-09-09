import { Search, ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SettingsView() {
  const [normalizeVolume, setNormalizeVolume] = useState(true);
  const [compactLayout, setCompactLayout] = useState(false);
  const [language, setLanguage] = useState("English (English)");
  const [audioQuality, setAudioQuality] = useState("Automatic");

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500 pb-12 bg-white">
      
      
      <div className="px-6 md:px-10 pt-10 pb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Settings</h1>
        <div className="relative text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
          <Search className="h-5 w-5" />
        </div>
      </div>

      <div className="px-6 md:px-10 max-w-3xl space-y-12">
        
        
        <section>
          <h2 className="text-base font-black text-gray-900 mb-4 tracking-tight">Account</h2>
          <div className="flex items-center justify-between py-2">
            <span className="text-[15px] font-medium text-gray-600">Edit login methods</span>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 hover:scale-105 active:scale-95 transition-all text-sm font-bold text-gray-700">
              Edit <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </section>

      
        <section>
          <h2 className="text-base font-black text-gray-900 mb-4 tracking-tight">Language</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 gap-4">
            <span className="text-[15px] font-medium text-gray-600">Choose language - Changes will be applied after restarting</span>
            
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-[#F8F5F0] border border-gray-200 text-gray-700 text-sm font-bold rounded-md px-4 py-2 pr-10 hover:bg-gray-100 transition-colors outline-none focus:ring-2 focus:ring-[#0b3d33]/50 cursor-pointer min-w-[200px]"
              >
                <option value="English (English)">English (English)</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900 mb-4 tracking-tight">Audio quality</h2>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-[15px] font-medium text-gray-600">Streaming quality</span>
            <div className="relative">
              <select 
                value={audioQuality}
                onChange={(e) => setAudioQuality(e.target.value)}
                className="appearance-none bg-[#F8F5F0] border border-gray-200 text-gray-700 text-sm font-bold rounded-md px-4 py-2 pr-10 hover:bg-gray-100 transition-colors outline-none focus:ring-2 focus:ring-[#0b3d33]/50 cursor-pointer min-w-[160px]"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Automatic">Automatic</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <span className="text-[15px] font-medium text-gray-600">Normalize volume - Set the same volume level for all sessions</span>
            <button 
              onClick={() => setNormalizeVolume(!normalizeVolume)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/50 focus:ring-offset-2 ${normalizeVolume ? 'bg-[#0b3d33]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${normalizeVolume ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-base font-black text-gray-900 mb-4 tracking-tight">Your Library</h2>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-[15px] font-medium text-gray-600">Use compact library layout</span>
            <button 
              onClick={() => setCompactLayout(!compactLayout)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/50 focus:ring-offset-2 ${compactLayout ? 'bg-[#0b3d33]' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${compactLayout ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between py-4">
            <span className="text-[15px] font-medium text-gray-600">Import sessions from other apps</span>
            <button className="px-4 py-1.5 rounded-full border border-gray-300 hover:border-gray-400 hover:scale-105 active:scale-95 transition-all text-sm font-bold text-gray-700">
              Import library
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}