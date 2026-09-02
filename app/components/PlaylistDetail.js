import { ArrowLeft, Bookmark, Clock, MoreHorizontal, Play, Heart as LucideHeart } from "lucide-react";

export default function PlaylistDetail({ playlist, onBack, onPlay, isSaved, onToggleSave, savedTracks, onToggleTrackSave }) {
  
  const generatedTracks = [
    { id: `${playlist.id}-1`, title: `Introduction to ${playlist.topic}`, artist: "Antara Original", duration: "2:00" },
    { id: `${playlist.id}-2`, title: playlist.title, artist: "Antara Original", duration: `${playlist.duration}:00` },
    { id: `${playlist.id}-3`, title: "Ambient Soundscape", artist: "Antara Nature", duration: "15:00" },
    { id: `${playlist.id}-4`, title: "Gentle Awakening", artist: "Antara Original", duration: "5:30" }
  ];

  
  const tracksToRender = playlist.isLikedSongs ? playlist.tracks : generatedTracks;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <button onClick={onBack} className="mb-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 border border-gray-100">
        <ArrowLeft className="h-4 w-4" /> Back to Explore
      </button>

      <div className="flex flex-col gap-6 md:flex-row md:items-end rounded-3xl bg-gradient-to-b from-[#0b3d33]/20 to-transparent p-8 shadow-sm">
        {playlist.isLikedSongs ? (
          <div className="h-48 w-48 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0b3d33] to-[#2B7A55] shadow-2xl md:h-56 md:w-56 shrink-0">
             <LucideHeart className="h-20 w-20 text-white drop-shadow-md" fill="currentColor" />
          </div>
        ) : (
          <img 
            src={playlist.image} 
            alt={playlist.title} 
            className="h-48 w-48 rounded-2xl object-cover shadow-2xl md:h-56 md:w-56 shrink-0" 
          />
        )}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0b3d33]">{playlist.topic} Playlist</p>
          <h1 className="text-4xl font-black text-gray-900 md:text-6xl lg:text-7xl">{playlist.title}</h1>
          <p className="mt-2 text-sm font-medium text-gray-600">{playlist.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-800">
            <span className="text-[#0b3d33]">Antara Wellness</span>
            <span className="text-gray-400">•</span>
            <span>{tracksToRender.length} {tracksToRender.length === 1 ? 'song' : 'songs'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6 px-4">
        <button 
          onClick={onPlay}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-lg transition hover:scale-105 hover:bg-[#1C5E40]"
        >
          <Play className="h-6 w-6 fill-current ml-1" />
        </button>
        
        {!playlist.isLikedSongs && (
          <button 
            onClick={onToggleSave}
            className={`transition ${isSaved ? "text-[#0b3d33] hover:text-[#1C5E40]" : "text-gray-400 hover:text-gray-900"}`}
          >
            <Bookmark className="h-8 w-8" fill={isSaved ? "currentColor" : "none"} />
          </button>
        )}

        <button className="text-gray-400 hover:text-gray-900 transition">
          <MoreHorizontal className="h-8 w-8" />
        </button>
      </div>

      <div className="mt-8 px-4">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 border-b border-gray-200 pb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div className="flex justify-end pr-4"><Clock className="h-4 w-4" /></div>
        </div>

        <div className="mt-4 space-y-1">
          {tracksToRender.map((track, index) => {
            
            const isTrackSaved = savedTracks && savedTracks.some(t => t.id === track.id);
            
            return (
              <div 
                key={track.id} 
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg px-2 py-3 hover:bg-gray-100 transition cursor-pointer"
                onClick={onPlay}
              >
                <div className="w-8 text-center text-sm font-medium text-gray-400 group-hover:hidden">
                  {index + 1}
                </div>
                <div className="hidden w-8 justify-center text-[#0b3d33] group-hover:flex">
                  <Play className="h-4 w-4 fill-current" />
                </div>
                
                <div className="flex flex-col">
                  <span className={`text-base font-bold ${track.id.endsWith('-2') && !playlist.isLikedSongs ? 'text-[#0b3d33]' : 'text-gray-900'}`}>
                    {track.title}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{track.artist}</span>
                </div>
                
                <div className="flex items-center gap-4 pr-4">
                 
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      onToggleTrackSave(track);
                    }}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <LucideHeart className={`h-5 w-5 transition-colors ${isTrackSaved ? 'fill-[#0b3d33] text-[#0b3d33] opacity-100' : 'text-gray-400 hover:text-gray-700'}`} />
                  </button>
                  <div className="text-sm font-medium text-gray-500 w-10 text-right">
                    {track.duration}
                  </div>
                </div>
              </div>
            );
          })}
          {tracksToRender.length === 0 && (
            <div className="py-12 text-center text-sm font-medium text-gray-500">
              No liked songs yet. Find a playlist and click the heart icon to add tracks!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}