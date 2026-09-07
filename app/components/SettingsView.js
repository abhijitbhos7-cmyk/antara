import { X, ExternalLink, ChevronDown } from "lucide-react";
import Footer from "./Footer"; 

export default function SettingsView({ onClose }) {
  
  
  const Toggle = ({ active }) => (
    <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-[#0b3d33]' : 'bg-gray-300'}`}>
      <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${active ? 'left-[22px]' : 'left-[2px]'}`} />
    </div>
  );

  return (
    <div className="absolute inset-0 z-[600] bg-white overflow-y-auto text-gray-900 flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      
      
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-[#0b3d33] shadow-md border-b border-[#122d22]/20">
        <h1 className="text-xl font-black tracking-tight text-white">Settings</h1>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors active:scale-90"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 pt-8 pb-6 space-y-12">
        
        
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Account</h2>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-gray-700">Edit login methods</span>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:border-gray-500 transition-colors">
              Edit <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </section>

        
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Language</h2>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-bold text-gray-700">Choose language - Changes will be applied after restarting</span>
            <div className="flex items-center gap-8 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100">
              English (English) <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </section>

        
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Audio quality</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Streaming quality</span>
              <div className="flex items-center gap-8 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100">
                Automatic <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Normalize volume - Set the same volume level for all sessions</span>
              <Toggle active={true} />
            </div>
          </div>
        </section>

        
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Your Library</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Use compact library layout</span>
              <Toggle active={true} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Import sessions from other apps</span>
              <button className="px-4 py-1.5 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:border-gray-500 transition-colors">
                Import library
              </button>
            </div>
          </div>
        </section>

       
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Display</h2>
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-700">Show the now-playing panel on click of play</span>
              <Toggle active={true} />
            </div>
          </div>

          <h2 className="text-lg font-black text-gray-900 mb-2">Videos and Canvas</h2>
          <p className="text-xs font-bold text-gray-500 mb-6 flex items-center gap-1">
            <span className="w-3 h-3 rounded-full border border-gray-500 flex items-center justify-center text-[8px]">i</span>
            It may take some time for your experience to update.
          </p>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-gray-700 block">Canvas</span>
                <span className="text-xs font-medium text-gray-500">Short, looping visuals when a session is playing.</span>
              </div>
              <Toggle active={true} />
            </div>
          </div>
        </section>

        
        <section>
          <h2 className="text-lg font-black text-gray-900 mb-4">Playback</h2>
          <div className="bg-gradient-to-br from-[#0b3d33] to-[#122d22] rounded-xl p-8 text-white relative overflow-hidden shadow-lg mt-8">
            <h3 className="text-2xl font-black mb-2 relative z-10">Fine-tune your sound</h3>
            <p className="text-sm font-medium text-white/80 max-w-sm mb-6 relative z-10">
              Improve streaming quality, adjust the equalizer to best fit your speakers, and enjoy consistent volume across all your tracks.
            </p>
            <button className="bg-[#1db954] text-black font-bold text-sm px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform relative z-10">
              Download the free app
            </button>
            
            
            <div className="absolute top-0 right-0 bottom-0 left-1/2 opacity-20 pointer-events-none flex items-end justify-around pb-8 px-8">
              {[40, 70, 45, 90, 60, 85].map((height, i) => (
                <div key={i} className="w-2 bg-white rounded-t-full" style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </div>
        </section>

        
        <section>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-gray-700 block">Listening activity on desktop and mobile</span>
                <span className="text-xs font-medium text-gray-500">People on Antara can see the sessions you're playing.</span>
              </div>
              <Toggle active={false} />
            </div>
            
            <h3 className="text-sm font-black text-gray-900 pt-4">What others can see on your profile</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-gray-700 block">Followers and following</span>
                <span className="text-xs font-medium text-gray-500">On your profile, people can see who's following you.</span>
              </div>
              <Toggle active={true} />
            </div>
          </div>
        </section>

      </div>
      
      
      <Footer />
    </div>
  );
}