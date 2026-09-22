"use client";

import { 
  ArrowLeft, Bookmark, Clock, MoreHorizontal, Play, 
  Heart as LucideHeart, Trash2, Music, UserPlus, 
  Search, List, LayoutList, Pencil, Share2, Plus, X,
  Shuffle, ChevronRight, Download, CheckCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import PremiumModal from "./PremiumModal"; 
import { useAudio } from "../context/AudioContext"; 

export default function PlaylistDetail({ playlist, allPrograms = [], onBack, onPlay, isSaved, onToggleSave, savedTracks, onToggleTrackSave, onDeletePlaylist, customPlaylists = [], onAddTrackToPlaylist }) {
  
  const { currentTrack } = useAudio(); 

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const [localName, setLocalName] = useState(playlist.title);
  const [localDesc, setLocalDesc] = useState(playlist.description || "");
  const [localImage, setLocalImage] = useState(playlist.image || playlist.image_url || "");
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempDesc, setTempDesc] = useState("");
  const [tempImage, setTempImage] = useState("");

  const [showSearch, setShowSearch] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [localTracks, setLocalTracks] = useState([]);
  const [dbTracks, setDbTracks] = useState([]);

  const [activeTrackId, setActiveTrackId] = useState(null);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [viewMode, setViewMode] = useState("list"); 

  const [downloadedTracks, setDownloadedTracks] = useState(new Set());
  const [isDownloading, setIsDownloading] = useState(null);
  const [tier, setTier] = useState('free');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    setLocalName(playlist.title);
    setLocalDesc(playlist.description || "");
    setLocalImage(playlist.image || playlist.image_url || "");
    setLocalTracks(playlist.isLikedSongs ? playlist.tracks : (playlist.isCustom ? (playlist.tracks || []) : [playlist]));

    const fetchInitialData = async () => {
      const { data: tracksData } = await supabase.from("programs").select("*");
      if (tracksData) setDbTracks(tracksData);

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase.from('profiles').select('subscription_tier').eq('id', session.user.id).single();
        if (profileData?.subscription_tier) setTier(profileData.subscription_tier);
      }

      if ('caches' in window) {
        const cache = await caches.open('antara-offline-audio');
        const keys = await cache.keys();
        const cachedUrls = keys.map(req => req.url);
        
        const downloadedIds = new Set();
        (tracksData || []).forEach(t => {
          if (t.audio_url && cachedUrls.includes(t.audio_url)) downloadedIds.add(t.id);
        });
        setDownloadedTracks(downloadedIds);
      }
    };
    fetchInitialData();
  }, [playlist]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setIsMenuOpen(false);
      if (!event.target.closest('.track-menu-container')) {
        setActiveTrackId(null);
        setShowSubMenu(false);
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

  const toggleSearch = () => {
    setShowSearch(true);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleAddTrack = async (track) => {
    const updatedTracks = [...localTracks, track];
    setLocalTracks(updatedTracks);
    setSearchQuery(""); 

    if (playlist.isCustom) {
      try {
        await supabase.from('playlists').update({ tracks: updatedTracks }).eq('id', playlist.id);
        await supabase.from('custom_playlists').update({ tracks: updatedTracks }).eq('id', playlist.id);
      } catch (e) { console.error(e); }
    }
  };

  const handleRemoveTrack = async (trackId) => {
    const updatedTracks = localTracks.filter(t => t.id !== trackId);
    setLocalTracks(updatedTracks);

    if (playlist.isCustom) {
      try {
        await supabase.from('playlists').update({ tracks: updatedTracks }).eq('id', playlist.id);
        await supabase.from('custom_playlists').update({ tracks: updatedTracks }).eq('id', playlist.id);
      } catch (e) { console.error(e); }
    }
  };

  const handleShufflePlay = () => {
    if (localTracks.length === 0) return;
    const randomIndex = Math.floor(Math.random() * localTracks.length);
    onPlay(localTracks[randomIndex], localTracks);
  };

  const handleDownloadTrack = async (e, track) => {
    e.stopPropagation();
    
    if (tier === 'free') {
      setShowPremiumModal(true);
      return;
    }

    if (!track.audio_url) {
      alert("No audio file found for this track.");
      return;
    }

    setIsDownloading(track.id);
    try {
      const cache = await caches.open('antara-offline-audio');
      await cache.add(track.audio_url);
      
      setDownloadedTracks(prev => {
        const newSet = new Set(prev);
        newSet.add(track.id);
        return newSet;
      });
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download track.");
    } finally {
      setIsDownloading(null);
    }
  };

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : dbTracks.filter(track => 
        (track.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         track.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         track.topic?.toLowerCase().includes(searchQuery.toLowerCase())) && 
        !localTracks.some(t => t.id === track.id) 
      ).slice(0, 6);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 14px; } }
        .eq-bar { animation: eq 1s ease-in-out infinite; width: 3px; background-color: #0b3d33; border-radius: 2px; }
        .eq-1 { animation-delay: 0.1s; }
        .eq-2 { animation-delay: 0.4s; }
        .eq-3 { animation-delay: 0.2s; }
      `}} />

      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
      
      <div className="animate-in fade-in duration-500 w-full min-h-full bg-[#F8F5F0] relative pb-24 -mt-8 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(11,61,51,0.2)_0%,_rgba(248,245,240,0)_70%)] pointer-events-none z-0"></div>
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#0b3d33]/10 to-transparent pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-end gap-6 md:gap-8 px-6 md:px-8 pt-16 pb-8 border-b border-gray-200/50">
          <button onClick={onBack} className="absolute top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-gray-900 transition-all hover:bg-gray-50 hover:scale-105 active:scale-95 border border-gray-200/50">
            <ArrowLeft className="h-5 w-5" />
          </button>

          {playlist.isLikedSongs ? (
            <div className="h-48 w-48 md:h-[232px] md:w-[232px] rounded-lg flex items-center justify-center bg-gradient-to-br from-[#450af5] to-[#c4efd9] shadow-[0_24px_50px_rgba(0,0,0,0.2)] shrink-0 mt-8 hover:scale-[1.02] transition-transform duration-500">
               <LucideHeart className="h-20 w-20 md:h-24 md:w-24 text-white drop-shadow-md" fill="currentColor" />
            </div>
          ) : (
            <div onClick={playlist.isCustom ? openEditModal : undefined} className={`group relative h-48 w-48 md:h-[232px] md:w-[232px] rounded-lg bg-gray-200 flex items-center justify-center shadow-[0_24px_50px_rgba(0,0,0,0.2)] shrink-0 overflow-hidden mt-8 hover:scale-[1.02] transition-transform duration-500 ${playlist.isCustom ? 'cursor-pointer' : ''}`}>
              {localImage ? <img src={localImage} alt={localName} className="h-full w-full object-cover" /> : <Music className="h-24 w-24 text-gray-400" />}
              {playlist.isCustom && (
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 z-20">
                   <Pencil className="h-10 w-10 text-white mb-2" />
                   <span className="text-white text-sm font-bold tracking-wide">Choose photo</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col w-full text-gray-900 pb-2 overflow-hidden">
            <p className="text-xs font-black uppercase tracking-widest text-gray-700 mb-2">{playlist.isCustom ? 'Public Playlist' : playlist.isLikedSongs ? 'Playlist' : 'Album'}</p>
            <h1 onClick={playlist.isCustom ? openEditModal : undefined} className={`text-5xl md:text-6xl lg:text-7xl xl:text-[80px] font-black tracking-tighter leading-[1.05] pb-3 break-words text-wrap line-clamp-2 drop-shadow-sm ${playlist.isCustom ? 'cursor-pointer hover:text-[#0b3d33]' : ''}`}>
              {localName}
            </h1>
            {localDesc && <p onClick={playlist.isCustom ? openEditModal : undefined} className={`text-sm font-medium text-gray-600 max-w-2xl mb-4 line-clamp-2 ${playlist.isCustom ? 'cursor-pointer hover:text-gray-900' : ''}`}>{localDesc}</p>}
            
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 flex-wrap mt-1">
              <div className="h-6 w-6 rounded-full bg-[#0b3d33] flex items-center justify-center text-white text-[10px] shrink-0">{playlist.isCustom ? 'A' : 'AW'}</div>
              <span className="hover:underline cursor-pointer whitespace-nowrap">{playlist.isCustom ? 'User' : 'Antara Wellness'}</span>
              <span className="text-gray-500 font-medium px-0.5">•</span>
              <span className="text-gray-500 font-medium whitespace-nowrap">{localTracks.length} {localTracks.length === 1 ? 'song' : 'songs'}</span>
            </div>
          </div>
        </div>

        <div className="relative z-20 px-6 md:px-8 py-6 flex items-center justify-between" ref={menuRef}>
          <div className="flex items-center gap-6">
           
            <button onClick={() => localTracks.length > 0 && onPlay(localTracks[0], localTracks)} className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_20px_rgba(11,61,51,0.3)] transition-all hover:scale-105 hover:bg-[#072a23] active:scale-95 shrink-0">
              <Play className="h-6 w-6 fill-current ml-1" />
            </button>

            <button onClick={handleShufflePlay} className="text-gray-400 hover:text-gray-600 transition active:scale-95 hidden sm:block hover:scale-110" title="Shuffle play">
              <Shuffle className="h-8 w-8" />
            </button>
            
            {!playlist.isLikedSongs && !playlist.isCustom && (
              <button onClick={onToggleSave} className={`transition hover:scale-110 active:scale-95 ${isSaved ? "text-[#0b3d33]" : "text-gray-400 hover:text-gray-600"}`}>
                {isSaved ? <LucideHeart className="h-8 w-8 fill-current" /> : <Plus className="h-8 w-8" strokeWidth={2.5} />}
              </button>
            )}

            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`transition hover:scale-110 active:scale-95 ${isMenuOpen ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}`}>
                <MoreHorizontal className="h-8 w-8" />
              </button>
              {isMenuOpen && (
                <div className="absolute top-12 left-0 w-56 rounded-xl bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                  <button onClick={() => setIsMenuOpen(false)} className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                    Add to queue
                  </button>
                  <div className="my-1 h-px w-full bg-gray-100"></div>
                  {playlist.isCustom && (
                    <>
                      <button onClick={openEditModal} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"><Pencil className="h-4 w-4 text-gray-500" /> Edit details</button>
                      {onDeletePlaylist && (
                        <button onClick={() => { if(window.confirm("Delete this playlist?")) { onDeletePlaylist(); setIsMenuOpen(false); } }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /> Delete</button>
                      )}
                      <div className="my-1 h-px w-full bg-gray-100"></div>
                    </>
                  )}
                  <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/playlist/${playlist.id}`); alert("Link copied!"); setIsMenuOpen(false); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"><Share2 className="h-4 w-4 text-gray-500" /> Share</button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <button 
              onClick={() => setViewMode(viewMode === "list" ? "compact" : "list")} 
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors active:scale-95"
            >
              {viewMode === "list" ? "Compact" : "List"} 
              {viewMode === "list" ? <LayoutList className="h-5 w-5" /> : <List className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {playlist.isCustom && showSearch && (
          <div className="relative z-10 border-t border-gray-200/60 pt-6 px-6 md:px-8 mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Let's find something for your playlist</h2>
              <button onClick={() => setShowSearch(false)} className="text-gray-400 hover:text-gray-800 transition-colors"><X className="h-5 w-5" /></button>
            </div>
            
            <div className="relative max-w-[400px] mb-6 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 transition-colors group-hover:text-gray-600" />
              </div>
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs, artists, or topics" 
                className="w-full bg-white border border-gray-200 text-gray-900 rounded-md py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33]/20 transition-all shadow-sm placeholder:text-gray-400 hover:border-gray-300 hover:bg-gray-50/80"
              />
            </div>

            {searchQuery && (
              <div className="flex flex-col gap-1 max-w-[600px] bg-white rounded-xl p-2 shadow-sm border border-gray-100 animate-in fade-in duration-200">
                {searchResults.length > 0 ? (
                  searchResults.map(track => (
                    <div key={track.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <div className="flex items-center gap-4">
                        <img src={track.image_url || track.image} className="h-12 w-12 rounded object-cover shadow-sm" alt={track.title} />
                        <div>
                          <p className="font-bold text-sm text-gray-900">{track.title}</p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{track.artist || track.topic || "Antara Session"}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddTrack(track)} 
                        className="rounded-full border border-gray-300 px-5 py-1.5 text-xs font-bold text-gray-700 hover:border-[#0b3d33] hover:text-[#0b3d33] active:scale-95 transition-all shadow-sm"
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm font-medium text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {localTracks.length > 0 && (
          <div className="relative z-10 grid grid-cols-[32px_1fr_auto] md:grid-cols-[32px_minmax(0,2fr)_minmax(0,1.5fr)_auto] gap-4 items-center px-6 md:px-10 py-2 border-b border-gray-200/60 mb-3 text-xs font-bold text-gray-500 uppercase tracking-widest ml-2 mr-2">
            <div className="text-right">#</div>
            <div>Title</div>
            <div className="hidden md:block">Album</div>
            <div className="flex justify-end pr-8"><Clock className="h-4 w-4" /></div>
          </div>
        )}

        <div className="relative z-10 flex flex-col px-4 md:px-8 mb-8 pb-32">
          {localTracks.map((track, index) => {
            const isTrackSaved = savedTracks && savedTracks.some(t => t.id === track.id);
            const isDownloaded = downloadedTracks.has(track.id);
            const isThisDownloading = isDownloading === track.id;
            const trackImage = track.image_url || track.image || localImage || "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&auto=format&fit=crop&q=60";
            const isPlayingThis = currentTrack?.id === track.id;
            
            return (
              <div 
                key={track.id} 
                
                className={`group grid grid-cols-[32px_1fr_auto] md:grid-cols-[32px_minmax(0,2fr)_minmax(0,1.5fr)_auto] items-center gap-4 rounded-xl px-2 md:px-4 ${viewMode === "compact" ? "py-1.5" : "py-2.5"} hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200/60 transition-all duration-200 cursor-pointer`} 
                onClick={() => onPlay(track, localTracks)}
              >
                <div className="w-full flex justify-end items-center relative text-base text-gray-500 font-medium h-full pr-1">
                  {isPlayingThis ? (
                   
                    <div className="flex items-end gap-[2px] h-3 w-3">
                      <div className="eq-bar eq-1 bg-[#0b3d33]"></div>
                      <div className="eq-bar eq-2 bg-[#0b3d33]"></div>
                      <div className="eq-bar eq-3 bg-[#0b3d33]"></div>
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:hidden">{index + 1}</span>
                      <Play className="h-4 w-4 fill-current text-gray-900 hidden group-hover:block transition-all" />
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  {viewMode === "list" && (
                    <img src={trackImage} alt="" className="h-10 w-10 rounded shadow-sm shrink-0 object-cover" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className={`text-base font-bold truncate transition-colors ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{track.title}</span>
                    <span className="text-sm text-gray-500 truncate mt-0.5 group-hover:text-gray-800 transition-colors">{track.artist || "Antara Wellness"}</span>
                  </div>
                </div>

                <div className="hidden md:block text-sm text-gray-500 truncate pr-4 hover:underline hover:text-gray-900 transition-colors">{track.album || track.topic || "Antara Session"}</div>
                
                <div className="flex items-center gap-4 md:gap-6 pr-2 text-gray-500 track-menu-container relative">
                  
                  <button 
                    onClick={(e) => handleDownloadTrack(e, track)} 
                    className="transition-all hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
                    title={isDownloaded ? "Downloaded" : "Download for offline listening"}
                  >
                    {isThisDownloading ? (
                      <div className="h-5 w-5 border-2 border-gray-400 border-t-[#0b3d33] rounded-full animate-spin"></div>
                    ) : isDownloaded ? (
                      <CheckCircle className="h-5 w-5 text-[#1ed760] fill-[#1ed760]/20" />
                    ) : (
                      <Download className="h-5 w-5 hover:text-gray-900" />
                    )}
                  </button>

                  <button onClick={(e) => { e.stopPropagation(); onToggleTrackSave(track); }} className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:scale-110 active:scale-95">
                    <LucideHeart className={`h-5 w-5 transition-colors ${isTrackSaved ? 'fill-[#0b3d33] text-[#0b3d33] opacity-100' : 'hover:text-gray-900'}`} />
                  </button>
                  <div className="text-sm font-medium w-10 text-right">{track.duration || "10:00"}</div>
                  
                  {playlist.isCustom ? (
                    <button onClick={(e) => { e.stopPropagation(); handleRemoveTrack(track.id); }} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-colors p-1" title="Remove from playlist">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setActiveTrackId(activeTrackId === track.id ? null : track.id); 
                          setShowSubMenu(false); 
                        }} 
                        className="opacity-0 group-hover:opacity-100 hover:text-gray-900 transition-colors focus:opacity-100"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {activeTrackId === track.id && (
                        <div className="absolute right-0 top-8 z-[100] w-56 rounded-xl bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100" onClick={(e) => e.stopPropagation()}>
                          
                          <div 
                            className="relative group/submenu"
                            onMouseEnter={() => setShowSubMenu(true)}
                            onMouseLeave={() => setShowSubMenu(false)}
                          >
                            <button className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                              Add to playlist <ChevronRight className="h-4 w-4" />
                            </button>
                            
                            {showSubMenu && (
                              <div className="absolute right-[95%] top-0 mr-1 w-48 rounded-xl bg-white p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                                {customPlaylists && customPlaylists.length > 0 ? customPlaylists.map(cp => (
                                  <button 
                                    key={cp.id}
                                    onClick={() => {
                                      if (onAddTrackToPlaylist) onAddTrackToPlaylist(cp.id, track);
                                      setActiveTrackId(null);
                                      setShowSubMenu(false);
                                    }} 
                                    className="flex w-full items-center truncate rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    {cp.name}
                                  </button>
                                )) : (
                                  <div className="px-3 py-2 text-xs font-bold text-gray-500">No playlists yet</div>
                                )}
                              </div>
                            )}
                          </div>

                          <button 
                            onClick={() => { onToggleTrackSave(track); setActiveTrackId(null); }} 
                            className="flex w-full items-center rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {isTrackSaved ? "Remove from Liked Songs" : "Save to Liked Songs"}
                          </button>
                          
                          <div className="my-1 h-px w-full bg-gray-100"></div>
                          
                          <button 
                            onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/track/${track.id}`); alert("Track link copied to clipboard!"); setActiveTrackId(null); }} 
                            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Share2 className="h-4 w-4 text-gray-500" /> Share
                          </button>

                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-[520px] rounded-xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Edit details</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"><X className="h-5 w-5" /></button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="group relative h-44 w-44 shrink-0 rounded-lg shadow-md overflow-hidden bg-gray-100 cursor-pointer mx-auto sm:mx-0" onClick={() => document.getElementById('photo-upload').click()}>
                  {tempImage ? <img src={tempImage} className="h-full w-full object-cover" alt="Playlist Cover" /> : <Music className="h-16 w-16 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200">
                    <Pencil className="h-8 w-8 text-white mb-2" />
                    <span className="text-white text-xs font-bold tracking-wide">Choose photo</span>
                  </div>
                  <input type="file" id="photo-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
                
                <div className="flex flex-col gap-3 flex-1">
                  <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none" placeholder="Add a name" />
                  <textarea value={tempDesc} onChange={(e) => setTempDesc(e.target.value)} className="w-full flex-1 min-h-[90px] resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none" placeholder="Add an optional description" />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button onClick={handleSaveDetails} className="rounded-full bg-[#0b3d33] px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-[#072a23] hover:scale-105 active:scale-95 transition-all">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}