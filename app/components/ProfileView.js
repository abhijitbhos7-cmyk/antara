import { Settings, MoreHorizontal, Edit2 } from "lucide-react";

export default function ProfileView({ user, profile, customPlaylists, onOpenSettings }) {
  // 1. Get the raw lowercase name
  const rawUsername = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  
  // 2. Format it to Title Case
  const formattedUsername = rawUsername.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  const initial = formattedUsername.charAt(0);

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500 pb-8">
      
      {/* HEADER */}
      <div className="relative bg-gradient-to-b from-[#1a6e59] to-[#0b3d33] flex flex-col md:flex-row items-end gap-6 md:gap-8 p-6 md:p-10 pt-24 md:pt-36 shadow-md border-b border-[#0b3d33]/20">
        
        {/* AVATAR WITH SPOTIFY HOVER EFFECT */}
        <div className="relative z-10 h-48 w-48 md:h-[232px] md:w-[232px] rounded-full bg-[#0b3d33] flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4)] shrink-0 overflow-hidden border-4 border-white/10 group cursor-pointer">
           <span className="text-7xl md:text-9xl font-black text-white group-hover:opacity-0 transition-opacity duration-300">{initial}</span>
           
           <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Edit2 className="w-10 h-10 text-white mb-2" />
              <span className="text-white font-bold text-base">Choose photo</span>
           </div>
        </div>
        
        {/* Profile Info */}
        <div className="relative z-10 flex flex-col gap-1 md:gap-2 w-full text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/90 drop-shadow-sm">
            Profile
          </p>
          <h1 className="text-5xl font-black md:text-7xl lg:text-[84px] tracking-tighter leading-[1.1] pb-2 truncate max-w-full drop-shadow-md">
            {formattedUsername}
          </h1>
          <p className="text-sm font-medium text-white/80 mt-1">
            {customPlaylists?.length || 0} Public Playlist{(customPlaylists?.length !== 1) ? 's' : ''}
          </p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 px-6 md:px-10 py-6 min-h-[50vh] flex flex-col">
        
        {/* Action Buttons */}
        <div className="flex items-center gap-6 py-4 mb-4">
          <button 
            onClick={onOpenSettings}
            className="flex items-center justify-center h-10 w-10 rounded-full text-gray-400 hover:text-[#0b3d33] hover:bg-gray-100 transition-colors"
          >
            <Settings className="h-7 w-7" />
          </button>
          <button className="text-gray-400 hover:text-gray-800 transition hover:scale-110 active:scale-95">
            <MoreHorizontal className="h-8 w-8" />
          </button>
        </div>

        {/* EMPTY STATE: "No recent activity." */}
        <div className="flex-1 flex items-center justify-center pt-10 pb-20">
           <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
             No recent activity.
           </h2>
        </div>
        
      </div>
    </div>
  );
}