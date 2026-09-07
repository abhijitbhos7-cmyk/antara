import { X, Settings, MoreHorizontal, Play, Music, Clock, Plus } from "lucide-react";
import Footer from "./Footer";

export default function ProfileView({ user, profile, customPlaylists, onClose, onOpenSettings }) {
  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();

  const topTracks = [
    { id: 1, title: "Badtameez Dil", artist: "Pritam, Benny Dayal, Shefali Alvares", album: "Yeh Jawaani Hai Deewani", time: "4:12" },
    { id: 2, title: "Ilahi", artist: "Pritam, Arijit Singh, Amitabh Bhattacharya", album: "Yeh Jawaani Hai Deewani", time: "3:48" },
    { id: 3, title: "Chammak Challo", artist: "Vishal-Shekhar, Akon, Hamsika Iyer, Vishal Dadlani...", album: "Ra-One", time: "3:47" },
    { id: 4, title: "Love Dose", artist: "Yo Yo Honey Singh", album: "Desi Kalakaar", time: "3:44" },
  ];

  return (
    
    <div className="absolute inset-0 z-[500] bg-[#F8F5F0] overflow-y-auto flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      
      
      <div className="relative bg-[#0b3d33] rounded-3xl mx-3 mt-3 md:mx-4 md:mt-4 flex flex-col md:flex-row items-end gap-6 md:gap-8 p-6 md:p-8 pt-24 md:pt-32 shadow-sm border border-[#122d22]/20">
        <button 
          onClick={onClose} 
          className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white transition-all hover:bg-black/40 hover:scale-105 active:scale-95"
        >
          <X className="h-5 w-5" />
        </button>

       
        <div className="relative z-10 h-48 w-48 md:h-[232px] md:w-[232px] rounded-full bg-[#1a6e59] flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4)] shrink-0 overflow-hidden border-4 border-[#0b3d33]">
           <span className="text-7xl md:text-9xl font-black text-white">{initial}</span>
        </div>
        
        
        <div className="relative z-10 flex flex-col gap-1 md:gap-3 w-full text-white">
          <p className="text-[13px] font-black uppercase tracking-widest text-white/80 drop-shadow-sm">
            Profile
          </p>
          <h1 className="text-5xl font-black md:text-7xl lg:text-[84px] tracking-tighter leading-[1.1] pb-2 truncate max-w-full drop-shadow-md">
            {username}
          </h1>
          <p className="text-sm font-medium text-white/80 mt-1">
            {customPlaylists?.length || 0} Public Playlist{(customPlaylists?.length !== 1) ? 's' : ''}
          </p>
        </div>
      </div>

      
      <div className="relative bg-white rounded-3xl mx-3 md:mx-4 mt-2 mb-8 shadow-sm border border-gray-100 overflow-hidden min-h-[50vh]">
        
       
        <div className="flex items-center gap-6 px-6 md:px-8 py-6">
          <button 
            onClick={onOpenSettings}
            className="flex items-center justify-center h-10 w-10 rounded-full text-gray-400 hover:text-[#0b3d33] hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-7 w-7" />
          </button>
          <button className="text-gray-400 hover:text-gray-800 transition hover:scale-110 active:scale-95">
            <MoreHorizontal className="h-8 w-8" />
          </button>
        </div>

        
        <div className="px-6 md:px-8 mb-12">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Top artists this month</h2>
          <p className="text-sm font-medium text-gray-500 mb-6">Only visible to you</p>
          
          <div className="flex gap-6 overflow-x-auto pb-4">
            <article className="group cursor-pointer w-36 shrink-0 transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square rounded-full overflow-hidden mb-4 shadow-md group-hover:shadow-lg">
                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=60" alt="Pritam" className="h-full w-full object-cover" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#0b3d33] transition-colors">Pritam</h3>
              <p className="text-sm text-gray-500 mt-0.5">Artist</p>
            </article>
          </div>
        </div>

        
        <div className="px-6 md:px-8 mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Top tracks this month</h2>
            <button className="text-xs font-bold text-[#0b3d33] hover:text-[#072a23] uppercase tracking-wider transition-colors">Show all</button>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-6">Only visible to you</p>

          <div className="flex flex-col mb-4">
            {topTracks.map((track, index) => (
              <div key={track.id} className="group grid grid-cols-[30px_1fr_auto] md:grid-cols-[30px_2fr_1.5fr_auto] items-center gap-4 rounded-md px-2 md:px-4 py-2 hover:bg-gray-50 transition cursor-pointer">
                <span className="text-base text-gray-400 font-medium text-right group-hover:hidden">{index + 1}</span>
                <div className="hidden justify-end text-gray-800 group-hover:flex"><Play className="h-4 w-4 fill-current mr-0.5" /></div>
                
                <div className="flex flex-col min-w-0 pr-4">
                  <span className="text-base font-bold text-gray-900 truncate">{track.title}</span>
                  <span className="text-sm text-gray-500 truncate group-hover:text-gray-800">{track.artist}</span>
                </div>
                
                <div className="hidden md:block text-sm text-gray-500 truncate pr-4">
                  {track.album}
                </div>
                
               
                <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                  <button className="opacity-0 group-hover:opacity-100 hover:text-gray-800 hover:scale-110 transition-all">
                    <Plus className="h-5 w-5" />
                  </button>
                  <span className="w-10 text-right">{track.time}</span>
                  <button className="opacity-0 group-hover:opacity-100 hover:text-gray-800 hover:scale-110 transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="px-6 md:px-8 mb-12">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Public Playlists</h2>
          <div className="flex gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {(customPlaylists?.length > 0) ? customPlaylists.map(cp => (
              <article key={cp.id} className="group cursor-pointer w-44 sm:w-48 shrink-0 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md border border-gray-200">
                   <Music className="h-12 w-12 text-gray-300 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-bold text-gray-900 truncate group-hover:text-[#0b3d33]">{cp.name}</h3>
                <p className="text-sm text-gray-500 mt-0.5 truncate">By {username}</p>
              </article>
            )) : (
              <p className="text-sm text-gray-500 font-medium">No public playlists yet.</p>
            )}
          </div>
        </div>
      </div>
      
     
      <Footer />
    </div>
  );
}