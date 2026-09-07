import { 
  ArrowLeft, Bookmark, Clock, MoreHorizontal, Play, 
  Heart as LucideHeart, Trash2, Music, UserPlus, 
  Search, List, LayoutList, Pencil, Share2, Plus, X 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PlaylistDetail({ playlist, onBack, onPlay, isSaved, onToggleSave, savedTracks, onToggleTrackSave, onDeletePlaylist }) {
  
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  
  const [localName, setLocalName] = useState(playlist.title);
  const [localDesc, setLocalDesc] = useState(playlist.description || "");
  const [localImage, setLocalImage] = useState(playlist.image || "");
  
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempDesc, setTempDesc] = useState("");
  const [tempImage, setTempImage] = useState("");

  
  useEffect(() => {
    setLocalName(playlist.title);
    setLocalDesc(playlist.description || "");
    setLocalImage(playlist.image || "");
  }, [playlist]);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setIsViewMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  const openEditModal = () => {
    setTempName(localName);
    setTempDesc(localDesc);
    setTempImage(localImage);
    setIsEditModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleSaveDetails = () => {
    setLocalName(tempName);
    setLocalDesc(tempDesc);
    setLocalImage(tempImage);
    setIsEditModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
    }
  };

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const generatedTracks = [
    { id: `${playlist.id}-1`, title: `Introduction to ${playlist.topic}`, artist: "Antara Original", duration: "2:00" },
    { id: `${playlist.id}-2`, title: playlist.title, artist: "Antara Original", duration: `${playlist.duration}:00` },
    { id: `${playlist.id}-3`, title: "Ambient Soundscape", artist: "Antara Nature", duration: "15:00" },
    { id: `${playlist.id}-4`, title: "Gentle Awakening", artist: "Antara Original", duration: "5:30" }
  ];

  const tracksToRender = playlist.isLikedSongs ? playlist.tracks : (playlist.isCustom ? (playlist.tracks || []) : generatedTracks);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full min-h-[80vh] bg-gray-50/50 rounded-t-3xl pb-12 relative">
      
      
      <div className="relative bg-[#1b4332] rounded-3xl mx-3 mt-3 md:mx-4 md:mt-4 flex flex-col md:flex-row items-end gap-6 md:gap-8 p-6 md:p-8 pt-24 md:pt-32 shadow-sm border border-[#122d22]/20">
        
      
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white transition-all hover:bg-black/40 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        
        {playlist.isLikedSongs ? (
          <div className="relative z-10 h-48 w-48 md:h-[232px] md:w-[232px] rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 shadow-[0_8px_40px_rgba(0,0,0,0.4)] shrink-0">
             <LucideHeart className="h-20 w-20 md:h-24 md:w-24 text-white drop-shadow-md" fill="currentColor" />
          </div>
        ) : (
          <div 
            onClick={playlist.isCustom ? openEditModal : undefined}
            className={`group relative z-10 h-48 w-48 md:h-[232px] md:w-[232px] rounded-lg bg-[#2d6a4f] flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4)] shrink-0 overflow-hidden ${playlist.isCustom ? 'cursor-pointer' : ''}`}
          >
            {localImage ? (
               <img src={localImage} alt={localName} className="h-full w-full object-cover" />
            ) : (
               <Music className="h-24 w-24 text-[#1b4332]" />
            )}
            
            
            {playlist.isCustom && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 z-20">
                 <Pencil className="h-10 w-10 text-white mb-2" />
                 <span className="text-white text-sm font-bold tracking-wide">Choose photo</span>
              </div>
            )}
          </div>
        )}
        
        
        <div className="relative z-10 flex flex-col gap-1 md:gap-3 w-full text-white">
          <p className="text-[13px] font-black uppercase tracking-widest text-white/80 drop-shadow-sm">
            {playlist.isCustom ? 'Public Playlist' : `${playlist.topic} Playlist`}
          </p>
          
          <h1 
            onClick={playlist.isCustom ? openEditModal : undefined}
            className={`text-5xl font-black md:text-7xl lg:text-[84px] tracking-tighter leading-[1.1] pb-2 truncate max-w-full drop-shadow-md ${playlist.isCustom ? 'cursor-pointer hover:text-white/90' : ''}`}
          >
            {localName}
          </h1>
          
          {localDesc && (
            <p 
              onClick={playlist.isCustom ? openEditModal : undefined}
              className={`text-sm font-medium text-white/70 max-w-2xl mt-1 line-clamp-2 ${playlist.isCustom ? 'cursor-pointer hover:text-white' : ''}`}
            >
              {localDesc}
            </p>
          )}
          
          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-white/90">
            <div className="flex items-center gap-2 font-bold text-white">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-[#1b4332] text-[10px]">
                {playlist.isCustom ? 'A' : 'AW'}
              </div>
              <span className="hover:underline cursor-pointer">{playlist.isCustom ? 'Abhijit Bhos' : 'Antara Wellness'}</span>
            </div>
            <span className="text-white/50 px-1">•</span>
            <span>{tracksToRender.length} {tracksToRender.length === 1 ? 'song' : 'songs'}</span>
            {playlist.duration && (
              <>
                <span className="text-white/50 px-1">•</span>
                <span className="text-white/70">about {playlist.duration} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative bg-white rounded-3xl mx-3 md:mx-4 mt-2 mb-8 shadow-sm border border-gray-100 overflow-hidden" ref={menuRef}>
        
        
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#1b4332]/15 to-white/0 pointer-events-none z-0"></div>
        
        <div className="relative z-30 flex items-center justify-between px-6 md:px-8 py-5">
          <div className="flex items-center gap-6 md:gap-8">
            <button 
              onClick={onPlay}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1db954] text-black shadow-xl transition-all hover:scale-105 hover:bg-[#1ed760] active:scale-95"
            >
              <Play className="h-6 w-6 fill-current ml-1" />
            </button>
            
            {!playlist.isLikedSongs && !playlist.isCustom && (
              <button 
                onClick={onToggleSave}
                className={`transition hover:scale-110 active:scale-95 ${isSaved ? "text-[#1db954]" : "text-gray-400 hover:text-gray-800"}`}
              >
                <Bookmark className="h-8 w-8" fill={isSaved ? "currentColor" : "none"} />
              </button>
            )}

            {playlist.isCustom && (
              <button className="text-gray-400 hover:text-gray-800 transition hover:scale-110 active:scale-95">
                <UserPlus className="h-8 w-8" />
              </button>
            )}

            
            <div className="relative">
              <button 
                onClick={() => { setIsMenuOpen(!isMenuOpen); setIsViewMenuOpen(false); }}
                className={`transition hover:scale-110 active:scale-95 ${isMenuOpen ? "text-gray-800" : "text-gray-400 hover:text-gray-800"}`}
              >
                <MoreHorizontal className="h-8 w-8" />
              </button>

              {isMenuOpen && (
                <div className="absolute top-12 left-0 w-56 rounded-md bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                  <button className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-black/5 transition-colors">
                    Add to queue
                  </button>
                  <div className="my-1 h-px w-full bg-gray-100"></div>
                  {playlist.isCustom && (
                    <>
                      <button onClick={openEditModal} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-black/5 transition-colors">
                        <Pencil className="h-4 w-4 text-gray-500" /> Edit details
                      </button>
                      {onDeletePlaylist && (
                        <button 
                          onClick={() => {
                            if(window.confirm("Are you sure you want to delete this playlist?")) {
                              onDeletePlaylist();
                              setIsMenuOpen(false);
                            }
                          }}
                          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </button>
                      )}
                      <div className="my-1 h-px w-full bg-gray-100"></div>
                    </>
                  )}
                  <button className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-black/5 transition-colors">
                    <Share2 className="h-4 w-4 text-gray-500" /> Share
                  </button>
                </div>
              )}
            </div>
          </div>

         
          <div className="relative hidden md:block">
            <button 
              onClick={() => { setIsViewMenuOpen(!isViewMenuOpen); setIsMenuOpen(false); }}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors"
            >
              List <List className="h-5 w-5" />
            </button>
            
            {isViewMenuOpen && (
              <div className="absolute top-10 right-0 w-40 rounded-md bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">View as</div>
                <button className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-black/5 transition-colors">
                  <LayoutList className="h-4 w-4 text-gray-500" /> Compact
                </button>
                <button className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-bold text-[#1db954] bg-black/5 transition-colors">
                  <List className="h-4 w-4" /> List
                </button>
              </div>
            )}
          </div>
        </div>

        
        <div className="relative z-10 flex items-center gap-3 px-6 md:px-8 pb-6">
          {playlist.isCustom && (
            <>
              <button onClick={focusSearch} className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-500 hover:scale-105 active:scale-95 transition-all">
                  <Plus className="h-4 w-4" /> Add
              </button>
              <button onClick={openEditModal} className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-500 hover:scale-105 active:scale-95 transition-all">
                  <Pencil className="h-3.5 w-3.5" /> Name & details
              </button>
            </>
          )}
        </div>

        
        <div className="relative z-10 grid grid-cols-[16px_1fr_auto] md:grid-cols-[24px_1fr_auto] gap-4 items-center border-b border-gray-200 pb-2 mb-4 text-sm font-medium text-gray-400 uppercase tracking-widest px-6 md:px-10">
          <div className="text-right text-gray-400">#</div>
          <div>Title</div>
          <div className="flex justify-end pr-8"><Clock className="h-4 w-4" /></div>
        </div>

        <div className="relative z-10 flex flex-col mb-10 px-4 md:px-6">
          {tracksToRender.map((track, index) => {
            const isTrackSaved = savedTracks && savedTracks.some(t => t.id === track.id);
            
            return (
              <div 
                key={track.id} 
                className="group grid grid-cols-[16px_1fr_auto] md:grid-cols-[24px_1fr_auto] items-center gap-4 rounded-md px-2 md:px-4 py-2.5 hover:bg-black/5 transition cursor-pointer"
                onClick={onPlay}
              >
                <div className="w-full text-right text-base text-gray-400 font-medium group-hover:hidden">{index + 1}</div>
                <div className="hidden w-full justify-end text-gray-800 group-hover:flex"><Play className="h-4 w-4 fill-current mr-0.5" /></div>
                
                <div className="flex flex-col min-w-0 pr-4">
                  <span className={`text-base font-bold truncate ${track.id?.endsWith('-2') && !playlist.isLikedSongs ? 'text-[#1db954]' : 'text-gray-900'}`}>{track.title}</span>
                  <span className="text-sm text-gray-500 truncate mt-0.5 group-hover:text-gray-800 transition-colors">{track.artist}</span>
                </div>
                
                <div className="flex items-center gap-4 md:gap-8 pr-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleTrackSave(track); }}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:scale-110 active:scale-95"
                  >
                    <LucideHeart className={`h-5 w-5 transition-colors ${isTrackSaved ? 'fill-[#1db954] text-[#1db954] opacity-100' : 'text-gray-400 hover:text-gray-700'}`} />
                  </button>
                  <div className="text-sm font-medium text-gray-400 w-10 text-right">{track.duration}</div>
                </div>
              </div>
            );
          })}
        </div>

        
        {playlist.isCustom && (
          <div className="relative z-10 mt-6 pt-8 border-t border-gray-100 pb-16 px-6 md:px-8">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Let's find something for your playlist</h2>
                <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"><X className="h-5 w-5" /></button>
             </div>
             <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search for songs or episodes" 
                  className="w-full bg-[#F8F5F0] border border-gray-200 text-gray-900 rounded-md py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#1b4332] focus:ring-1 focus:ring-[#1b4332] transition-all"
                />
             </div>
          </div>
        )}
      </div>

      
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Edit details</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              
              <div 
                className="group relative h-44 w-44 shrink-0 rounded-lg shadow-md overflow-hidden bg-gray-100 cursor-pointer mx-auto sm:mx-0" 
                onClick={() => document.getElementById('photo-upload').click()}
              >
                {tempImage ? (
                  <img src={tempImage} className="h-full w-full object-cover" alt="Playlist Cover" />
                ) : (
                  <Music className="h-16 w-16 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                  <Pencil className="h-8 w-8 text-white mb-2" />
                  <span className="text-white text-xs font-bold tracking-wide">Choose photo</span>
                </div>
                <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
              
              
              <div className="flex flex-col gap-3 flex-1">
                <input 
                  type="text" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)} 
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-[#1b4332] focus:ring-1 focus:ring-[#1b4332] outline-none" 
                  placeholder="Add a name" 
                />
                <textarea 
                  value={tempDesc} 
                  onChange={(e) => setTempDesc(e.target.value)} 
                  className="w-full flex-1 min-h-[90px] resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-[#1b4332] focus:ring-1 focus:ring-[#1b4332] outline-none" 
                  placeholder="Add an optional description" 
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveDetails} 
                className="rounded-full bg-[#1b4332] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#122d22] hover:scale-105 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
            <p className="mt-4 text-[10px] font-bold text-gray-400 text-center">
              By proceeding, you agree to give Antara access to the image you choose to upload.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}