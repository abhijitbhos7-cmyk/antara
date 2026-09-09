import { 
  ArrowLeft, Bookmark, Clock, MoreHorizontal, Play, 
  Heart as LucideHeart, Trash2, Music, UserPlus, 
  Search, List, LayoutList, Pencil, Share2, Plus, X,
  Shuffle, ArrowDownCircle // Added Spotify album icons
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

  // Dynamically generate a full "Album" of 8 tracks based on the session topic
  const generatedTracks = [
    { id: `${playlist.id}-1`, title: `Introduction to ${playlist.topic}`, artist: "Antara Wellness", duration: "2:15", album: playlist.title },
    { id: `${playlist.id}-2`, title: playlist.title, artist: "Antara Wellness", duration: `${playlist.duration}:00`, album: playlist.title },
    { id: `${playlist.id}-3`, title: "Deep Breathing Protocol", artist: "Antara Original", duration: "4:30", album: playlist.title },
    { id: `${playlist.id}-4`, title: "Ambient Soundscape (Continuous)", artist: "Antara Nature", duration: "12:00", album: playlist.title },
    { id: `${playlist.id}-5`, title: "Binaural Integration", artist: "Antara Frequencies", duration: "8:45", album: playlist.title },
    { id: `${playlist.id}-6`, title: "Mindful Reflection", artist: "Antara Wellness", duration: "5:20", album: playlist.title },
    { id: `${playlist.id}-7`, title: "Grounding Exercise", artist: "Antara Original", duration: "3:40", album: playlist.title },
    { id: `${playlist.id}-8`, title: "Gentle Awakening & Closing", artist: "Antara Wellness", duration: "2:55", album: playlist.title }
  ];

  const tracksToRender = playlist.isLikedSongs ? playlist.tracks : (playlist.isCustom ? (playlist.tracks || []) : generatedTracks);

  return (
    // Added scrollbar hiding classes to forcefully kill unwanted bars
    <div className="animate-in fade-in duration-500 w-full min-h-full bg-[#F8F5F0] relative pb-24 -mt-8 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* SEAMLESS BACKGROUND GRADIENT (Antara Green Theme) */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#0b3d33]/15 to-[#F8F5F0] pointer-events-none z-0"></div>
      
      {/* HEADER SECTION (Spotify Typography & Layout) */}
      <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 md:gap-8 px-6 md:px-8 pt-16 pb-6">
        
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="absolute top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-gray-900 transition-all hover:bg-black/10 hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Cover Art */}
        {playlist.isLikedSongs ? (
          <div className="h-48 w-48 md:h-[232px] md:w-[232px] rounded-lg flex items-center justify-center bg-gradient-to-br from-[#450af5] to-[#c4efd9] shadow-[0_12px_40px_rgba(0,0,0,0.15)] shrink-0 mt-8">
             <LucideHeart className="h-20 w-20 md:h-24 md:w-24 text-white drop-shadow-md" fill="currentColor" />
          </div>
        ) : (
          <div 
            onClick={playlist.isCustom ? openEditModal : undefined}
            className={`group relative h-48 w-48 md:h-[232px] md:w-[232px] rounded-lg bg-gray-200 flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.1)] shrink-0 overflow-hidden mt-8 ${playlist.isCustom ? 'cursor-pointer' : ''}`}
          >
            {localImage ? (
               <img src={localImage} alt={localName} className="h-full w-full object-cover" />
            ) : (
               <Music className="h-24 w-24 text-gray-400" />
            )}
            
            {playlist.isCustom && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 z-20">
                 <Pencil className="h-10 w-10 text-white mb-2" />
                 <span className="text-white text-sm font-bold tracking-wide">Choose photo</span>
              </div>
            )}
          </div>
        )}
        
        {/* Playlist Metadata */}
        <div className="flex flex-col w-full text-gray-900 pb-2 overflow-hidden">
          <p className="text-sm font-bold text-gray-800 mb-1">
            {playlist.isCustom ? 'Public Playlist' : playlist.isLikedSongs ? 'Playlist' : 'Album'}
          </p>
          
          {/* FIXED: Removed truncate, added break-words and line-clamp so long titles wrap instead of breaking the box */}
          <h1 
            onClick={playlist.isCustom ? openEditModal : undefined}
            className={`text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-black tracking-tighter leading-[1.05] pb-3 break-words text-wrap line-clamp-2 drop-shadow-sm ${playlist.isCustom ? 'cursor-pointer hover:text-[#0b3d33]' : ''}`}
          >
            {localName}
          </h1>
          
          {localDesc && (
            <p 
              onClick={playlist.isCustom ? openEditModal : undefined}
              className={`text-sm font-medium text-gray-600 max-w-2xl mb-3 line-clamp-2 ${playlist.isCustom ? 'cursor-pointer hover:text-gray-900' : ''}`}
            >
              {localDesc}
            </p>
          )}
          
          <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800 flex-wrap">
            <div className="h-6 w-6 rounded-full bg-[#0b3d33] flex items-center justify-center text-white text-[10px] shrink-0">
              {playlist.isCustom ? 'A' : 'AW'}
            </div>
            <span className="hover:underline cursor-pointer whitespace-nowrap">{playlist.isCustom ? 'Abhijit Bhos' : 'Antara Wellness'}</span>
            <span className="text-gray-500 font-medium px-0.5">•</span>
            <span className="text-gray-500 font-medium whitespace-nowrap">{tracksToRender.length} {tracksToRender.length === 1 ? 'song' : 'songs'}</span>
            {playlist.duration && (
              <>
                <span className="text-gray-500 font-medium px-0.5">•</span>
                <span className="text-gray-500 font-medium whitespace-nowrap">about {playlist.duration + 25} min</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ACTION BAR (Spotify Album Layout: Play, Shuffle, Plus, Download, More) */}
      <div className="relative z-20 px-6 md:px-8 py-4 flex items-center justify-between" ref={menuRef}>
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={onPlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-xl transition-all hover:scale-105 hover:bg-[#072a23] active:scale-95 shrink-0"
          >
            <Play className="h-6 w-6 fill-current ml-1" />
          </button>

          <button className="text-gray-400 hover:text-gray-600 transition active:scale-95 hidden sm:block">
            <Shuffle className="h-8 w-8" />
          </button>
          
          {!playlist.isLikedSongs && !playlist.isCustom && (
            <button 
              onClick={onToggleSave}
              className={`transition hover:scale-110 active:scale-95 ${isSaved ? "text-[#0b3d33]" : "text-gray-400 hover:text-gray-600"}`}
            >
              {isSaved ? <LucideHeart className="h-8 w-8 fill-current" /> : <Plus className="h-8 w-8" strokeWidth={2.5} />}
            </button>
          )}

          {!playlist.isLikedSongs && !playlist.isCustom && (
            <button className="text-gray-400 hover:text-gray-600 transition active:scale-95 hidden sm:block">
              <ArrowDownCircle className="h-8 w-8" strokeWidth={1.5} />
            </button>
          )}

          {playlist.isCustom && (
            <button className="text-gray-400 hover:text-gray-600 transition hover:scale-110 active:scale-95">
              <UserPlus className="h-8 w-8" />
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsViewMenuOpen(false); }}
              className={`transition hover:scale-110 active:scale-95 ${isMenuOpen ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
            >
              <MoreHorizontal className="h-8 w-8" />
            </button>

            {isMenuOpen && (
              <div className="absolute top-12 left-0 w-56 rounded-md bg-white p-1 shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                <button className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  Add to queue
                </button>
                <div className="my-1 h-px w-full bg-gray-100"></div>
                {playlist.isCustom && (
                  <>
                    <button onClick={openEditModal} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
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
                <button className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  <Share2 className="h-4 w-4 text-gray-500" /> Share
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Toggle (List) */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
            List <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* EDIT PILLS (Add, Name & Details - Matches Spotify Custom Playlist exactly) */}
      {playlist.isCustom && (
        <div className="px-6 md:px-8 pb-8 flex items-center gap-3 relative z-20">
          <button onClick={focusSearch} className="flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-all">
            <Plus className="h-4 w-4" /> Add
          </button>
          <button onClick={openEditModal} className="flex items-center gap-2 rounded-full border border-gray-300 bg-transparent px-4 py-1.5 text-sm font-bold text-gray-700 hover:border-gray-500 hover:text-gray-900 transition-all">
            <Pencil className="h-3.5 w-3.5" /> Name & details
          </button>
        </div>
      )}

      {/* SEARCH SECTION (Let's find something...) */}
      {playlist.isCustom && (
        <div className="relative z-10 border-t border-gray-200/60 pt-6 px-6 md:px-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Let's find something for your playlist</h2>
            <button className="text-gray-400 hover:text-gray-800 transition-colors"><X className="h-5 w-5" /></button>
          </div>
          <div className="relative max-w-[400px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-500" /></div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search for songs or episodes" 
              className="w-full bg-[#F0EDE6] text-gray-900 rounded-md py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-500"
            />
          </div>
        </div>
      )}

      {/* TRACKLIST TABLE HEADER */}
      <div className="relative z-10 grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_minmax(0,2fr)_minmax(0,1.5fr)_auto] gap-4 items-center px-6 md:px-12 py-2 border-b border-gray-200/60 mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
        <div className="text-right">#</div>
        <div>Title</div>
        <div className="hidden md:block">Album</div>
        <div className="flex justify-end pr-8"><Clock className="h-4 w-4" /></div>
      </div>

      {/* TRACKLIST ROWS */}
      <div className="relative z-10 flex flex-col px-4 md:px-8">
        {tracksToRender.map((track, index) => {
          const isTrackSaved = savedTracks && savedTracks.some(t => t.id === track.id);
          const trackImage = track.image || localImage || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&auto=format&fit=crop&q=60";
          
          return (
            <div 
              key={track.id} 
              className="group grid grid-cols-[16px_1fr_auto] md:grid-cols-[16px_minmax(0,2fr)_minmax(0,1.5fr)_auto] items-center gap-4 rounded-md px-2 md:px-4 py-2 hover:bg-black/5 transition cursor-pointer"
              onClick={onPlay}
            >
              <div className="w-full text-right text-base text-gray-500 font-medium group-hover:hidden">{index + 1}</div>
              <div className="hidden w-full justify-end text-gray-900 group-hover:flex"><Play className="h-4 w-4 fill-current mr-0.5" /></div>
              
              <div className="flex items-center gap-3 min-w-0 pr-4">
                {/* Omit thumbnails for standard generated tracks if we want a pure album look, but keeping it as it provides a premium feel */}
                {!playlist.isLikedSongs && playlist.isCustom ? (
                  <img src={trackImage} alt="" className="h-10 w-10 rounded shadow-sm shrink-0 object-cover" />
                ) : null}
                
                <div className="flex flex-col min-w-0">
                  <span className={`text-base font-bold truncate ${track.id?.endsWith('-2') && !playlist.isLikedSongs ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{track.title}</span>
                  <span className="text-sm text-gray-500 truncate mt-0.5 group-hover:text-gray-800 transition-colors">{track.artist}</span>
                </div>
              </div>

              <div className="hidden md:block text-sm text-gray-500 truncate pr-4 hover:underline hover:text-gray-900 transition-colors">
                {track.album || playlist.topic || "Antara Session"}
              </div>
              
              <div className="flex items-center gap-4 md:gap-6 pr-2 text-gray-500">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleTrackSave(track); }}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:scale-110 active:scale-95"
                >
                  <LucideHeart className={`h-5 w-5 transition-colors ${isTrackSaved ? 'fill-[#0b3d33] text-[#0b3d33] opacity-100' : 'hover:text-gray-900'}`} />
                </button>
                <div className="text-sm font-medium w-10 text-right">{track.duration}</div>
                <button className="opacity-0 group-hover:opacity-100 hover:text-gray-900 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
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
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none" 
                  placeholder="Add a name" 
                />
                <textarea 
                  value={tempDesc} 
                  onChange={(e) => setTempDesc(e.target.value)} 
                  className="w-full flex-1 min-h-[90px] resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none" 
                  placeholder="Add an optional description" 
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveDetails} 
                className="rounded-full bg-[#0b3d33] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#072a23] hover:scale-105 active:scale-95 transition-all"
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