"use client";
import VoiceRecorder from "./components/VoiceRecorder";
import PlaylistDetail from "./components/PlaylistDetail";
import SessionBuilder from "./components/SessionBuilder";
import useAntaraAccount from "./hooks/useAntaraAccount";
import AuthModal from "./components/AuthModal";
import AudioPlayer from "./components/AudioPlayer";
import AccountOverview from "./components/AccountOverview";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import { programs, topics } from "./lib/antara-content";
import {
  Activity, Bookmark, Brain, Home, Library,
  Mic, Moon, Play, Plus, Sparkles, Target, Waves, X,
  ArrowLeft, Clock, MoreHorizontal, Heart as LucideHeart,
  ListPlus, Music, Search, ChevronDown
} from "lucide-react";
import Footer from "./components/Footer";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [playerProgram, setPlayerProgram] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [builderTopic, setBuilderTopic] = useState("Focus");
  const [builderDuration, setBuilderDuration] = useState(10);
  const [builderSound, setBuilderSound] = useState("Soft rain");

  const [viewingPlaylist, setViewingPlaylist] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [showAllCards, setShowAllCards] = useState(false); 
  const [savedTracks, setSavedTracks] = useState([]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  
  const [activeFilter, setActiveFilter] = useState("All");
  const filterCategories = ["All", "Focus", "Sleep", "Relax", "Guided", "Frequencies"];

  const [showAccountView, setShowAccountView] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);

  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);

  const { user, profile, recordCompletedSession, signOut, customPlaylists, createPlaylist, deletePlaylist } = useAntaraAccount();
  const [showAuth, setShowAuth] = useState(false);

  function toggleSave(id) { setSavedIds((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]); }
  function toggleTrackSave(track) { setSavedTracks((prev) => prev.some((t) => t.id === track.id) ? prev.filter((t) => t.id !== track.id) : [...prev, track]); }

  async function handleCreatePlaylist(e) {
    e.preventDefault();
    if (!user) return setShowAuth(true);
    if (!newPlaylistName.trim()) return;
    await createPlaylist(newPlaylistName);
    setShowCreatePlaylist(false);
    setNewPlaylistName("");
    setActiveTab("Library"); 
    setIsLibraryExpanded(true);
  }

  
  const visiblePrograms = useMemo(() => {
    let filtered = programs.filter((program) => `${program.title} ${program.topic}`.toLowerCase().includes(query.toLowerCase()));
    
    if (activeTab === "Saved") {
      filtered = filtered.filter((p) => savedIds.includes(p.id));
    }
    
    if (activeTab === "Home" && activeFilter !== "All") {
      filtered = filtered.filter((p) => {
        const filterLower = activeFilter.toLowerCase();
        const topicLower = p.topic ? p.topic.toLowerCase() : "";
        const titleLower = p.title ? p.title.toLowerCase() : "";
        
        if (filterLower === "frequencies") {
           return topicLower.includes("hz") || titleLower.includes("hz") || topicLower.includes("frequency");
        }
        return topicLower.includes(filterLower) || titleLower.includes(filterLower);
      });
    }
    
    return filtered;
  }, [query, activeTab, savedIds, activeFilter]);

  const dailySession = programs.find((program) => program.topic === profile?.focus_goal) || programs[0];
  const trendingSessions = programs.slice(1, 4);

  function createCustomSession() {
    const matchingProgram = programs.find((p) => p.topic === builderTopic) || programs[0];
    let selectedAmbienceUrl = "/audio/ambience/focus.mp3"; 
    if (builderSound === "Soft rain") selectedAmbienceUrl = "/audio/ambience/rain.mp3";
    else if (builderSound === "Ocean waves") selectedAmbienceUrl = "/audio/ambience/waves.mp3";
    else if (builderSound === "Gentle tanpura") selectedAmbienceUrl = "/audio/ambience/tanpura.mp3";

    setPlayerProgram({
      ...matchingProgram, id: `custom-${Date.now()}`, title: `My ${builderTopic} Session`,
      duration: Number(builderDuration), description: `${builderDuration}-minute session.`, ambienceUrl: selectedAmbienceUrl, 
    });
    setShowBuilder(false);
  }

  function handlePlayRecommendedSession(topic) {
    setPlayerProgram(programs.find((p) => p.topic.toLowerCase() === topic.toLowerCase()) || programs[0]);
  }

 
  function resetViews() {
    setShowAccountView(false);
    setShowProfileView(false);
    setShowSettingsView(false);
    setViewingPlaylist(null);
    setShowAllCards(false);
    setActiveFilter("All");
  }

  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const forceGrid = showAllCards || (activeTab === "Home" && activeFilter !== "All");

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F0EDE6] md:p-2 md:gap-2 font-sans text-gray-900 selection:bg-[#0b3d33] selection:text-white relative">
      
      {showAccountView && <AccountOverview user={user} profile={profile} onClose={() => setShowAccountView(false)} />}
      {showProfileView && <ProfileView user={user} profile={profile} customPlaylists={customPlaylists} onClose={() => setShowProfileView(false)} onOpenSettings={() => setShowSettingsView(true)} />}
      {showSettingsView && <SettingsView onClose={() => setShowSettingsView(false)} />}

      <aside className="w-[260px] shrink-0 flex-col bg-[#0b3d33] hidden md:flex rounded-3xl shadow-[0_20px_40px_-15px_rgba(11,61,51,0.5)] z-20 relative overflow-hidden py-8 transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="mb-12 px-8 flex items-center gap-4 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
            <img src="/antara-logo.svg" alt="Antara Logo" className="h-7 w-7 object-contain" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white">ANTARA</span>
        </div>
        
        <div className="px-5 relative z-10 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <p className="mb-4 px-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Menu</p>
          <nav className="space-y-1.5 flex flex-col">
            <button onClick={() => {setActiveTab("Home"); resetViews(); setIsLibraryExpanded(false);}} className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${activeTab === "Home" && !showAccountView && !showProfileView && !showSettingsView && !viewingPlaylist ? "bg-white text-[#0b3d33] shadow-lg scale-100" : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"}`}><Home className="h-5 w-5" /> Home</button>
            
            <button 
              onClick={() => {
                const isCurrentlyLibrary = (activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView;
                if (isCurrentlyLibrary) {
                 
                  setIsLibraryExpanded(!isLibraryExpanded);
                } else {
                 
                  setActiveTab("Library"); 
                  setIsLibraryExpanded(true);
                  resetViews();
                }
              }} 
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${(activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView ? "bg-white text-[#0b3d33] shadow-lg scale-100" : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"}`}
            >
              <div className="flex items-center gap-4">
                <Library className="h-5 w-5" /> Library
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isLibraryExpanded && ((activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView) ? "rotate-180" : ""}`} />
            </button>

            {(activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView && isLibraryExpanded && (
              <div className="ml-5 pl-4 border-l-2 border-white/20 flex flex-col gap-2 mt-2 mb-3 animate-in slide-in-from-top-2 duration-300">
                
                <div 
                  onClick={() => { resetViews(); setActiveTab("Library"); setViewingPlaylist({id: "liked-songs", title: "Liked Songs", topic: "Favorites", description: "All your favorite tracks in one place.", isLikedSongs: true, tracks: savedTracks}); }} 
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${viewingPlaylist?.id === 'liked-songs' ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`}
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shrink-0 shadow-sm">
                     <LucideHeart className="h-5 w-5 text-white" fill="currentColor" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                     <span className={`font-bold text-sm truncate ${viewingPlaylist?.id === 'liked-songs' ? 'text-white' : 'text-white/80'}`}>Liked Songs</span>
                     <span className="text-white/50 font-medium text-[11px] truncate">Playlist • {savedTracks.length} songs</span>
                  </div>
                </div>

                {customPlaylists.map(cp => (
                  <div 
                    key={cp.id} 
                    onClick={() => { resetViews(); setActiveTab("Library"); setViewingPlaylist({...cp, title: cp.name, description: "Your custom playlist", isCustom: true}); }} 
                    className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${viewingPlaylist?.id === cp.id ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`}
                  >
                     <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        {cp.image ? (
                          <img src={cp.image} className="w-full h-full object-cover" alt={cp.name} />
                        ) : (
                          <Music className="h-5 w-5 text-white/70" />
                        )}
                     </div>
                     <div className="flex flex-col overflow-hidden">
                        <span className={`font-bold text-sm truncate ${viewingPlaylist?.id === cp.id ? 'text-white' : 'text-white/80'}`}>{cp.name}</span>
                        <span className="text-white/50 font-medium text-[11px] truncate">Playlist • {username}</span>
                     </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => {setActiveTab("Saved"); resetViews(); setIsLibraryExpanded(false);}} className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${activeTab === "Saved" && !showAccountView && !showProfileView && !showSettingsView ? "bg-white text-[#0b3d33] shadow-lg scale-100" : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"}`}><Bookmark className="h-5 w-5" /> Saved</button>
            <button onClick={() => { user ? setShowCreatePlaylist(true) : setShowAuth(true) }} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white hover:translate-x-1"><ListPlus className="h-5 w-5" /> Create Playlist</button>
          </nav>

          <p className="mb-4 mt-10 px-3 text-[11px] font-black uppercase tracking-[0.2em] text-white/40">Rituals</p>
          <nav className="space-y-1.5">
            <button onClick={() => setShowBuilder(true)} className="flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white hover:translate-x-1"><Plus className="h-5 w-5" /> Build Session</button>
            <button onClick={() => { setActiveTab("Record"); resetViews(); setIsLibraryExpanded(false);}} className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${activeTab === "Record" && !showAccountView && !showProfileView && !showSettingsView ? "bg-white text-[#0b3d33] shadow-lg scale-100" : "text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1"}`}><Mic className="h-5 w-5" /> Record Voice</button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-white md:rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] z-10 transition-all duration-500">
        
        <Navbar 
          query={query} 
          onQueryChange={setQuery} 
          user={user} 
          profile={profile} 
          onOpenAuth={() => setShowAuth(true)} 
          onSignOut={signOut} 
          onOpenAccount={() => setShowAccountView(true)}
          onOpenProfile={() => setShowProfileView(true)}
          onOpenSettings={() => setShowSettingsView(true)}
        />
        
        <div className="flex-1 overflow-y-auto pb-32 md:pb-12 scroll-smooth">
          {viewingPlaylist ? (
            <div className="px-6 md:px-12 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
              <PlaylistDetail 
                playlist={viewingPlaylist} 
                onBack={() => setViewingPlaylist(null)} 
                onPlay={() => setPlayerProgram(viewingPlaylist)} 
                isSaved={savedIds.includes(viewingPlaylist.id)} 
                onToggleSave={() => toggleSave(viewingPlaylist.id)} 
                savedTracks={savedTracks} 
                onToggleTrackSave={toggleTrackSave} 
                onDeletePlaylist={async () => {
                  await deletePlaylist(viewingPlaylist.id);
                  setViewingPlaylist(null);
                }}
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-700 ease-out">
              
              {activeTab === "Home" && (
                <div className="px-6 md:px-12 pt-4 pb-2 flex items-center gap-3 overflow-x-auto border-b border-gray-50/50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {filterCategories.map(category => (
                    <button 
                      key={category}
                      onClick={() => setActiveFilter(category)}
                      className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                        activeFilter === category 
                          ? "bg-[#0b3d33] text-white shadow-md scale-105" 
                          : "bg-[#F8F5F0] text-gray-600 hover:bg-gray-200 border border-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "Home" && !showAllCards && activeFilter === "All" && (
                <>
                  <div className="relative w-full pt-8 pb-20 px-6 md:px-12 flex flex-col md:flex-row md:items-center gap-10 lg:gap-14 bg-gradient-to-br from-[#0b3d33]/5 via-white to-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.03%22/%3E%3C/svg%3E')] opacity-50 mix-blend-overlay pointer-events-none"></div>
                    <div className="relative shrink-0 group cursor-pointer" onClick={() => setPlayerProgram(dailySession)}>
                      <div className="absolute inset-0 bg-[#0b3d33]/20 blur-2xl transform translate-y-6 scale-90 transition-all duration-700 group-hover:scale-105 group-hover:bg-[#0b3d33]/30"></div>
                      <img src={dailySession.image} alt="" className="w-56 h-56 lg:w-64 lg:h-64 rounded-3xl object-cover relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03] shadow-lg border border-black/5" />
                      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="h-16 w-16 bg-[#0b3d33]/90 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"><Play className="h-6 w-6 ml-1 fill-current" /></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b3d33]/10 w-fit text-xs font-black uppercase tracking-widest text-[#0b3d33]">
                        <Sparkles className="w-3.5 h-3.5" /> Featured Session
                      </div>
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1]">{dailySession.title}</h1>
                      <p className="text-lg lg:text-xl font-medium text-gray-600 mt-2">{dailySession.description}</p>
                      <div className="flex items-center gap-4 mt-6">
                        <button onClick={() => setPlayerProgram(dailySession)} className="flex items-center gap-3 rounded-full bg-[#0b3d33] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(11,61,51,0.3)] transition-all duration-300 active:scale-95 hover:bg-[#072a23] hover:shadow-[0_15px_35px_rgba(11,61,51,0.4)] hover:-translate-y-1">
                          <Play className="h-5 w-5 fill-current" /> Play Session
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-12 xl:grid-cols-[1.5fr_1fr] px-6 md:px-12">
                    <div>
                      <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-black text-gray-900 tracking-tight">Popular Right Now</h2></div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {programs.slice(2, 6).map((program) => (
                           <article key={program.id} className="group cursor-pointer transition-all duration-500 active:scale-95" onClick={() => setViewingPlaylist(program)}>
                             <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F8F5F0] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-black/[0.03]">
                               <img src={program.image} alt="" className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" />
                               <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0b3d33] shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500"><Play className="h-6 w-6 fill-current ml-1" /></div></div>
                             </div>
                             <div className="mt-5 px-1"><h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-[#0b3d33]">{program.title}</h3><p className="truncate text-sm font-medium text-gray-500 mt-1">{program.topic}</p></div>
                           </article>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-8"><h2 className="text-2xl font-black text-gray-900 tracking-tight">Up Next</h2></div>
                      <div className="flex flex-col gap-2">
                        {trendingSessions.map((session, index) => (
                          <div key={session.id} className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:bg-gray-50 rounded-2xl p-3 -mx-3 active:scale-[0.98]" onClick={() => setPlayerProgram(session)}>
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-black text-gray-300 w-5 text-center group-hover:hidden">{index + 1}</span>
                              <div className="hidden h-5 w-5 items-center justify-center text-[#0b3d33] group-hover:flex animate-in zoom-in duration-200"><Play className="h-4 w-4 fill-current" /></div>
                              <img src={session.image} className="h-14 w-14 rounded-xl object-cover shadow-sm transition-transform duration-500 group-hover:scale-105" alt="" />
                              <div><p className="text-base font-bold text-gray-900 transition-colors group-hover:text-[#0b3d33]">{session.title}</p><p className="text-xs font-medium text-gray-500 mt-1">{session.topic}</p></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 mr-2">{session.duration}:00</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab !== "Record" && (
                <div className={`px-6 md:px-12 ${activeTab === "Home" && !showAllCards && activeFilter === "All" ? "mt-16" : "mt-8"}`}>
                  
                  {activeTab === "Library" && customPlaylists.length > 0 && (
                    <div className="mb-12">
                      <h2 className="mb-8 text-2xl font-black text-gray-900 tracking-tight">Your Playlists</h2>
                      <div className="flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {customPlaylists.map(cp => (
                          <article key={cp.id} className="group cursor-pointer shrink-0 snap-start w-44 sm:w-52 transition-all duration-500 active:scale-95" onClick={() => setViewingPlaylist({...cp, title: cp.name, description: "Your custom playlist", isCustom: true})}>
                            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex items-center justify-center border border-black/[0.03]">
                              <Music className="h-12 w-12 text-gray-300 transition-transform duration-700 ease-out group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500"><Play className="h-6 w-6 fill-current ml-1" /></div></div>
                            </div>
                            <div className="mt-5 px-1"><h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-[#0b3d33]">{cp.name}</h3><p className="truncate text-sm font-medium text-gray-500 mt-1">{(cp.tracks || []).length} {((cp.tracks || []).length) === 1 ? 'track' : 'tracks'}</p></div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {activeTab === "Saved" ? "Saved Sessions" 
                        : activeTab === "Library" ? "All Sessions" 
                        : activeFilter !== "All" ? `${activeFilter} Sessions` 
                        : "Explore Space"}
                    </h2>
                    {visiblePrograms.length > 0 && activeFilter === "All" && (
                      <button onClick={() => setShowAllCards(!showAllCards)} className="text-xs font-bold text-[#0b3d33] hover:text-[#072a23] transition-all uppercase tracking-[0.1em] hover:translate-x-1">
                        {showAllCards ? "Show less" : "See all"}
                      </button>
                    )}
                  </div>

                  {(activeTab === "Saved" && visiblePrograms.length === 0 && savedTracks.length === 0) || (activeTab === "Home" && activeFilter !== "All" && visiblePrograms.length === 0) ? (
                    <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50/50 py-32 text-center">
                      {activeTab === "Saved" ? (
                        <>
                          <Bookmark className="mx-auto mb-5 h-12 w-12 text-gray-300" />
                          <p className="text-gray-900 font-bold text-xl">No saved sessions yet.</p>
                          <p className="text-base text-gray-500 mt-2">Click the bookmark or heart icon on any playlist or song.</p>
                        </>
                      ) : (
                        <>
                          <Search className="mx-auto mb-5 h-12 w-12 text-gray-300" />
                          <p className="text-gray-900 font-bold text-xl">No {activeFilter} sessions found.</p>
                          <p className="text-base text-gray-500 mt-2">Try selecting a different category or search term.</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={forceGrid ? "grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "flex overflow-x-auto gap-6 pb-8 pt-2 snap-x snap-mandatory"} style={{ scrollbarWidth: forceGrid ? 'auto' : 'none', msOverflowStyle: 'none' }}>
                      {activeTab === "Saved" && savedTracks.length > 0 && (
                        <article className={`group cursor-pointer transition-all duration-500 active:scale-95 ${!forceGrid ? "shrink-0 snap-start w-44 sm:w-52" : ""}`} onClick={() => setViewingPlaylist({id: "liked-songs", title: "Liked Songs", topic: "Favorites", description: "All your favorite tracks in one place.", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=60", isLikedSongs: true, tracks: savedTracks})}>
                          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b3d33] to-[#2B7A55] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(11,61,51,0.3)] flex items-center justify-center">
                            <LucideHeart className="h-16 w-16 text-white drop-shadow-lg transition-transform duration-700 ease-out group-hover:scale-110" fill="currentColor" />
                            <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0b3d33] shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500"><Play className="h-6 w-6 fill-current ml-1" /></div></div>
                          </div>
                          <div className="mt-5 px-1"><h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-[#0b3d33]">Liked Songs</h3><p className="truncate text-sm font-medium text-gray-500 mt-1">{savedTracks.length} {savedTracks.length === 1 ? 'song' : 'songs'}</p></div>
                        </article>
                      )}
                      {visiblePrograms.map((program) => (
                        <article key={program.id} className={`group cursor-pointer transition-all duration-500 active:scale-95 ${!forceGrid ? "shrink-0 snap-start w-44 sm:w-52" : ""}`} onClick={() => setViewingPlaylist(program)}>
                          <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F8F5F0] shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] border border-black/[0.03]"><img src={program.image} alt="" className="h-full w-full object-cover transition-all duration-1000 ease-out group-hover:scale-110" /><div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div><div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0b3d33] shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500"><Play className="h-6 w-6 fill-current ml-1" /></div></div></div>
                          <div className="mt-5 px-1"><h3 className="truncate text-base font-bold text-gray-900 transition-colors group-hover:text-[#0b3d33]">{program.title}</h3><p className="truncate text-sm font-medium text-gray-500 mt-1">{program.topic}</p></div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Record" && (
                <div className="mt-12 px-6 md:px-12 max-w-4xl animate-in fade-in duration-700">
                  <h2 className="mb-8 text-3xl font-black text-gray-900 tracking-tight">Voice Studio</h2>
                  <VoiceRecorder user={user} profile={profile} onRequireAuth={() => setShowAuth(true)} onPlayRecommended={handlePlayRecommendedSession} />
                </div>
              )}

            </div>
          )}
          <Footer />
        </div>
        
        <nav className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-around bg-white/90 px-2 pb-8 pt-4 backdrop-blur-2xl md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-gray-100">
          <button onClick={() => { setActiveTab("Home"); resetViews(); }} className="flex flex-col items-center gap-1.5 p-2 transition-all active:scale-90 text-[#0b3d33]"><Home className="h-6 w-6" /><span className="text-[10px] font-bold uppercase tracking-wider">Home</span></button>
        </nav>

        {playerProgram && (<AudioPlayer program={playerProgram} onClose={() => setPlayerProgram(null)} onComplete={() => recordCompletedSession(playerProgram)} />)}
      
      </main>

      {showCreatePlaylist && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">New Playlist</h3>
              <button 
                onClick={() => setShowCreatePlaylist(false)} 
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreatePlaylist}>
              <input 
                type="text" 
                placeholder="Name your playlist..." 
                autoFocus 
                value={newPlaylistName} 
                onChange={(e) => setNewPlaylistName(e.target.value)} 
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]" 
              />
              <button 
                type="submit" 
                disabled={!newPlaylistName.trim()} 
                className="mt-4 w-full rounded-full bg-[#0b3d33] py-3.5 font-bold text-white transition-all active:scale-95 hover:bg-[#072a23] disabled:opacity-50"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showBuilder && (<SessionBuilder topic={builderTopic} duration={builderDuration} sound={builderSound} onTopicChange={setBuilderTopic} onDurationChange={setBuilderDuration} onSoundChange={setBuilderSound} onClose={() => setShowBuilder(false)} onCreate={createCustomSession} />)}
    </div>
  );
}