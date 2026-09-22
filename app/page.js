"use client";

import GettingStartedBanner from "./components/GettingStartedBanner";
import VoiceRecorder from "./components/VoiceRecorder";
import PlaylistDetail from "./components/PlaylistDetail";
import SessionBuilder from "./components/SessionBuilder";
import useAntaraAccount from "./hooks/useAntaraAccount";
import AuthModal from "./components/AuthModal";
import AudioPlayer from "./components/AudioPlayer";
import AccountOverview from "./components/AccountOverview";
import ProfileView from "./components/ProfileView";
import SettingsView from "./components/SettingsView";
import DeepWorkTimer from "./components/DeepWorkTimer";
import { useMemo, useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Navbar from "./components/Navbar";
import {
  Activity, Bookmark, Brain, Home, Library,
  Mic, Moon, Play, Plus, Sparkles, Target, Waves, X,
  ArrowLeft, Clock, MoreHorizontal, Heart as LucideHeart,
  ListPlus, Music, Search, ChevronDown, Timer, Flame, TrendingUp
} from "lucide-react";
import Footer from "./components/Footer";
import ProgramFeed from "./components/ProgramFeed";
import { useAudio } from "./context/AudioContext";
import { useLanguage } from "./context/LanguageContext"; // Added Translation Hook

export default function Dashboard() {
  const { currentTrack, playTrack, closePlayer } = useAudio();
  
  // Safely initialize the translator
  const languageContext = useLanguage();
  const t = languageContext?.t || ((word) => word);

  const [query, setQuery] = useState("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [showDeepWork, setShowDeepWork] = useState(false);
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
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, profile, recordCompletedSession, signOut, customPlaylists, createPlaylist, deletePlaylist, addTrackToPlaylist } = useAntaraAccount();
  const [showAuth, setShowAuth] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      try {
        const cachedSessions = localStorage.getItem("antara_sessions");
        if (cachedSessions && isMounted) {
          setPrograms(JSON.parse(cachedSessions));
        }

        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        if (data && isMounted) {
          setPrograms(data); 
          localStorage.setItem("antara_sessions", JSON.stringify(data)); 
        }
        
      } catch (error) {
        console.error("Database fetch failed:", error.message);
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

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
  }, [programs, query, activeTab, savedIds, activeFilter]);

  const defaultFallback = {
    title: "Welcome to Antara",
    topic: "Setup",
    description: "Upload your first session in the Admin panel.",
    image_url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=60"
  };
  const dailySession = programs.length > 0 ? (programs.find((program) => program.topic === profile?.focus_goal) || programs[0]) : defaultFallback;
  const trendingSessions = programs.slice(1, 4);

  const popularNowTracks = useMemo(() => {
    return [...programs]
      .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
      .slice(0, 6);
  }, [programs]);
  
  const newReleasesTracks = useMemo(() => {
    return [...programs]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 6);
  }, [programs]);
  
  const mostFamousTracks = useMemo(() => {
    return [...programs]
      .sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
      .slice(0, 6);
  }, [programs]);

  function createCustomSession() {
    const matchingProgram = programs.find((p) => p.topic === builderTopic) || programs[0] || defaultFallback;
    let selectedAmbienceUrl = "/audio/ambience/focus.mp3";
    if (builderSound === "Soft rain") selectedAmbienceUrl = "/audio/ambience/rain.mp3";
    else if (builderSound === "Ocean waves") selectedAmbienceUrl = "/audio/ambience/waves.mp3";
    else if (builderSound === "Gentle tanpura") selectedAmbienceUrl = "/audio/ambience/tanpura.mp3";

    playTrack({
      ...matchingProgram, id: `custom-${Date.now()}`, title: `My ${builderTopic} Session`,
      duration: Number(builderDuration), description: `${builderDuration}-minute session.`, ambienceUrl: selectedAmbienceUrl,
    }, programs);
    setShowBuilder(false);
  }

  function handlePlayRecommendedSession(topic) {
    playTrack(programs.find((p) => p.topic.toLowerCase() === topic.toLowerCase()) || programs[0], programs);
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
    <div className="flex h-screen w-full bg-black overflow-hidden relative font-sans text-gray-900 selection:bg-[#0b3d33] selection:text-white">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes eq { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        .eq-bar { animation: eq 1s ease-in-out infinite; width: 3px; background-color: #8CE0B7; border-radius: 2px; }
        .eq-1 { animation-delay: 0.1s; }
        .eq-2 { animation-delay: 0.4s; }
        .eq-3 { animation-delay: 0.2s; }
      `}} />

      {showAccountView && <AccountOverview user={user} profile={profile} onClose={() => setShowAccountView(false)} />}

      {/* FIX: Set outer padding to p-0 to completely eliminate the background border space */}
      <div className="flex flex-1 w-full h-full p-0 gap-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden">

        <div className="w-[280px] shrink-0 flex-col gap-0 hidden md:flex z-20 h-full">
          
          {/* FIX: Removed rounded-t-2xl entirely for sharp corners */}
          <div className="bg-[#0b3d33] rounded-none p-6 flex flex-col gap-6 relative overflow-hidden shrink-0 border border-white/5 border-b-0 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-3 relative z-10">
              <img src="/antara-logo.svg" alt="Antara Logo" className="h-8 w-8 object-contain filter brightness-0 invert" />
              <span className="text-xl font-black tracking-widest text-white">ANTARA</span>
            </div>

            <button onClick={() => { setActiveTab("Home"); resetViews(); setIsLibraryExpanded(false); }} className={`flex items-center gap-4 text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === "Home" && !showAccountView && !showProfileView && !showSettingsView && !viewingPlaylist ? "text-white" : "text-white/70 hover:text-white"}`}>
              <Home className="h-6 w-6" /> {t('home')}
            </button>
          </div>

          {/* FIX: Removed rounded-b-2xl entirely for sharp corners */}
          <div className="bg-[#0b3d33] rounded-none flex-1 flex flex-col overflow-hidden relative border border-white/5 border-t-0 shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="px-6 py-5 flex items-center justify-between shadow-sm bg-black/10 relative z-10">
              <button
                onClick={() => {
                  const isCurrentlyLibrary = (activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView;
                  if (isCurrentlyLibrary) setIsLibraryExpanded(!isLibraryExpanded);
                  else { setActiveTab("Library"); setIsLibraryExpanded(true); resetViews(); }
                }}
                className={`flex items-center gap-3 text-sm font-bold transition-all duration-300 ${(activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView ? "text-white" : "text-white/70 hover:text-white"}`}
              >
                <Library className="h-6 w-6" /> {t('library')}
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 ${isLibraryExpanded && ((activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView) ? "rotate-180" : ""}`} />
              </button>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); user ? setShowCreatePlaylist(true) : setShowAuth(true); }} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition active:scale-90">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {(activeTab === "Library" || viewingPlaylist) && !showAccountView && !showProfileView && !showSettingsView && isLibraryExpanded && (
                <div className="pl-1 flex flex-col gap-2 mb-4 animate-in slide-in-from-top-2 duration-300">
                  {customPlaylists.length === 0 && (
                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-1 mt-2 mb-4 hover:bg-white/10 transition-colors">
                      <span className="text-white font-bold text-sm">{t('createPlaylist')}</span>
                      <span className="text-white/60 text-xs font-medium mb-2">{t('createPlaylistSub')}</span>
                      <button onClick={(e) => { e.stopPropagation(); user ? setShowCreatePlaylist(true) : setShowAuth(true); }} className="bg-white text-black px-4 py-1.5 rounded-full text-xs font-bold w-fit hover:scale-105 active:scale-95 transition-all">
                        {t('createBtn')}
                      </button>
                    </div>
                  )}

                  <div onClick={() => { resetViews(); setActiveTab("Library"); setViewingPlaylist({ id: "liked-songs", title: "Liked Songs", topic: "Favorites", description: "All your favorite tracks in one place.", isLikedSongs: true, tracks: savedTracks }); }} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${viewingPlaylist?.id === 'liked-songs' ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`}>
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#450af5] to-[#c4efd9] flex items-center justify-center shrink-0 shadow-sm">
                      <LucideHeart className="h-5 w-5 text-white" fill="currentColor" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className={`font-bold text-sm truncate ${viewingPlaylist?.id === 'liked-songs' ? 'text-white' : 'text-white/80'}`}>{t('likedSongs')}</span>
                      <span className="text-white/50 font-medium text-[11px] truncate">Playlist • {savedTracks.length} songs</span>
                    </div>
                  </div>

                  {customPlaylists.map(cp => (
                    <div key={cp.id} onClick={() => { resetViews(); setActiveTab("Library"); setViewingPlaylist({ ...cp, title: cp.name, description: "Your custom playlist", isCustom: true }); }} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 ${viewingPlaylist?.id === cp.id ? 'bg-white/20 shadow-sm' : 'hover:bg-white/10'}`}>
                      <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        {cp.image || cp.image_url ? <img src={cp.image || cp.image_url} className="w-full h-full object-cover" alt={cp.name} /> : <Music className="h-5 w-5 text-white/70" />}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className={`font-bold text-sm truncate ${viewingPlaylist?.id === cp.id ? 'text-white' : 'text-white/80'}`}>{cp.name}</span>
                        <span className="text-white/50 font-medium text-[11px] truncate">Playlist • {username}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={() => { setActiveTab("Saved"); resetViews(); setIsLibraryExpanded(false); }} className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${activeTab === "Saved" && !showAccountView && !showProfileView && !showSettingsView ? "bg-white/10 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Bookmark className="h-5 w-5" /> {t('saved')}</button>

              <div className="w-full h-px bg-white/10 my-4"></div>
              
              <button onClick={() => setShowBuilder(true)} className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white"><Plus className="h-5 w-5" /> {t('buildSession')}</button>
              <button onClick={() => { setActiveTab("Record"); resetViews(); setIsLibraryExpanded(false); }} className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${activeTab === "Record" && !showAccountView && !showProfileView && !showSettingsView ? "bg-white/10 text-white shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"}`}><Mic className="h-5 w-5" /> {t('recordVoice')}</button>
              <button onClick={() => setShowDeepWork(true)} className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white"><Timer className="h-5 w-5" /> {t('deepWork')}</button>

            </div>
          </div>
        </div>

        {/* FIX: Removed rounded-2xl entirely for sharp corners */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F8F5F0] rounded-none shadow-sm z-10 transition-all duration-500 border border-gray-100">

          <div className={`sticky top-0 z-20 transition-all duration-300 ${isScrolled ? 'bg-[#F8F5F0]/95 backdrop-blur-xl border-b border-gray-200/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]' : 'bg-transparent border-transparent'}`}>
            <Navbar
              query={query}
              onQueryChange={setQuery}
              user={user}
              profile={profile}
              onOpenAuth={() => setShowAuth(true)}
              onSignOut={signOut}
              onOpenAccount={() => setShowAccountView(true)}
              onOpenProfile={() => { resetViews(); setShowProfileView(true); }}
              onOpenSettings={() => { resetViews(); setShowSettingsView(true); }}
            />

            {activeTab === "Home" && !showProfileView && !showSettingsView && (
              <div className="px-6 md:px-12 pt-2 pb-3 flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {filterCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${activeFilter === category
                        ? "bg-[#0b3d33] text-white shadow-md scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div 
            className={`flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${currentTrack ? 'pb-[160px] md:pb-[120px]' : 'pb-[100px] md:pb-12'}`}
            onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 50)}
          >

            {showSettingsView ? (
              <SettingsView profile={profile} />
            ) : showProfileView ? (
              <ProfileView
                user={user}
                profile={profile}
                customPlaylists={customPlaylists}
                onOpenSettings={() => setShowSettingsView(true)}
              />
            ) : viewingPlaylist ? (
              <div className="px-6 md:px-12 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                <PlaylistDetail
                  playlist={viewingPlaylist}
                  allPrograms={programs}
                  onBack={() => setViewingPlaylist(null)}
                  onPlay={(track, queue) => playTrack(track, queue || viewingPlaylist?.tracks || programs)}
                  isSaved={savedIds.includes(viewingPlaylist.id)}
                  onToggleSave={() => toggleSave(viewingPlaylist.id)}
                  savedTracks={savedTracks}
                  onToggleTrackSave={toggleTrackSave}
                  onDeletePlaylist={async () => {
                    await deletePlaylist(viewingPlaylist.id);
                    setViewingPlaylist(null);
                  }}
                  customPlaylists={customPlaylists}
                  onAddTrackToPlaylist={addTrackToPlaylist}
                />
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 ease-out">

                {activeTab === "Home" && !showAllCards && activeFilter === "All" && (
                  <>
                    <div className="relative w-full pt-8 pb-20 px-6 md:px-12 flex flex-col xl:flex-row xl:justify-between items-start gap-10 overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-[150%] bg-[radial-gradient(ellipse_at_top_left,_rgba(11,61,51,0.15)_0%,_rgba(248,245,240,0)_60%)] pointer-events-none z-0"></div>

                      <div className="flex flex-col md:flex-row md:items-center gap-10 lg:gap-14 relative z-10 w-full xl:w-auto">
                        <div className="relative shrink-0 group cursor-pointer" onClick={() => setViewingPlaylist(dailySession)}>
                          <div className="absolute inset-0 bg-[#0b3d33]/20 blur-2xl transform translate-y-6 scale-90 transition-all duration-700 group-hover:scale-105 group-hover:bg-[#0b3d33]/30"></div>
                          <img src={dailySession.image_url} alt="" className="w-56 h-56 lg:w-64 lg:h-64 rounded-3xl object-cover relative z-10 transition-transform duration-700 ease-out group-hover:scale-[1.03] shadow-lg border border-black/5" />
                        </div>

                        <div className="flex flex-col gap-3 relative z-10 max-w-2xl">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-gray-200/60 w-fit text-xs font-black uppercase tracking-widest text-[#0b3d33]">
                            <Sparkles className="w-3.5 h-3.5" /> {t('featured')}
                          </div>

                          <h1
                            onClick={() => setViewingPlaylist(dailySession)}
                            className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[1.1] hover:text-[#0b3d33] transition-colors cursor-pointer"
                          >
                            {dailySession.title}
                          </h1>

                          <p className="text-lg lg:text-xl font-medium text-gray-600 mt-2">{dailySession.description}</p>
                          <div className="flex items-center gap-4 mt-6">
                            <button onClick={() => playTrack(dailySession, programs)} className="flex items-center gap-3 rounded-full bg-[#0b3d33] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_30px_rgba(11,61,51,0.3)] transition-all duration-300 active:scale-95 hover:bg-[#072a23] hover:shadow-[0_15px_35px_rgba(11,61,51,0.4)] hover:-translate-y-1">
                              <Play className="h-5 w-5 fill-current" /> {t('playSession')}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="w-full xl:w-[460px] shrink-0 relative z-10 mt-8 xl:mt-0 flex justify-center xl:justify-end">
                        <GettingStartedBanner />
                      </div>
                    </div>

                    <div className="mt-12 md:mt-16 grid grid-cols-1 gap-12 xl:grid-cols-[1.5fr_1fr] px-6 md:px-12 w-full max-w-7xl mx-auto relative z-10">
                      <div className="w-full min-w-0">
                        <ProgramFeed />
                      </div>
                      <div className="w-full min-w-0 flex flex-col">
                        {!isLoadingData && trendingSessions.length > 0 && (
                          <>
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('upNext')}</h2>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                              {trendingSessions.map((session, index) => {
                                const isPlayingThis = currentTrack?.id === session.id;
                                return (
                                <div key={session.id} className="flex items-center justify-between group cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200/60 rounded-2xl p-3 -mx-3 active:scale-[0.98]" onClick={() => playTrack(session, programs)}>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm font-black text-gray-400 w-5 text-center group-hover:hidden">{index + 1}</span>
                                    <div className="hidden h-5 w-5 items-center justify-center text-[#0b3d33] group-hover:flex animate-in zoom-in duration-200">
                                      {isPlayingThis ? (
                                        <div className="flex items-end gap-[2px] h-3 w-3">
                                          <div className="eq-bar eq-1 bg-[#0b3d33]"></div>
                                          <div className="eq-bar eq-2 bg-[#0b3d33]"></div>
                                          <div className="eq-bar eq-3 bg-[#0b3d33]"></div>
                                        </div>
                                      ) : <Play className="h-4 w-4 fill-current" />}
                                    </div>
                                    <img src={session.image_url} className="h-14 w-14 rounded-xl object-cover shadow-sm transition-transform duration-500 group-hover:scale-105" alt="" />
                                    <div><p className={`text-base font-bold transition-colors group-hover:text-[#0b3d33] ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{session.title}</p><p className="text-xs font-medium text-gray-500 mt-1">{session.topic}</p></div>
                                  </div>
                                  <span className="text-xs font-bold text-gray-400 mr-2">{session.duration || "10"}:00</span>
                                </div>
                              )})}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeTab !== "Record" && (
                  <div className={`px-6 md:px-12 relative z-10 ${activeTab === "Home" && !showAllCards && activeFilter === "All" ? "mt-16" : "mt-8"}`}>

                    {activeTab === "Library" && customPlaylists.length > 0 && (
                      <div className="mb-12">
                        <h2 className="mb-8 text-2xl font-black text-gray-900 tracking-tight">{t('yourPlaylists')}</h2>
                        <div className="flex overflow-x-auto gap-4 pb-8 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                          {customPlaylists.map(cp => {
                            const isPlayingThis = currentTrack?.id === cp.id;
                            return (
                            <article key={cp.id} className="group cursor-pointer shrink-0 snap-start w-44 sm:w-52 transition-all duration-300 active:scale-95 bg-white/50 rounded-2xl p-3 md:p-4 hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-transparent hover:border-gray-200/60" onClick={() => setViewingPlaylist({ ...cp, title: cp.name, description: "Your custom playlist", isCustom: true })}>
                              <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3 flex items-center justify-center bg-gray-100">
                                <Music className="h-12 w-12 text-gray-300 transition-transform duration-700 ease-out group-hover:scale-110" />
                                <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                  {isPlayingThis ? (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] shadow-[0_8px_15px_rgba(0,0,0,0.3)]">
                                      <div className="flex items-end gap-[2px] h-4 w-4">
                                        <div className="eq-bar eq-1"></div>
                                        <div className="eq-bar eq-2"></div>
                                        <div className="eq-bar eq-3"></div>
                                      </div>
                                    </div>
                                  ) : (
                                    <button onClick={(e) => { e.stopPropagation(); playTrack({ ...cp, title: cp.name, description: "Your custom playlist", isCustom: true }, cp.tracks); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#072a23] active:scale-95 transition-all">
                                      <Play className="h-5 w-5 fill-current ml-1" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="px-1"><h3 className={`truncate text-base font-bold transition-colors group-hover:text-[#0b3d33] ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{cp.name}</h3><p className="text-sm font-medium text-gray-500 mt-0.5">{(cp.tracks || []).length} {((cp.tracks || []).length) === 1 ? 'track' : 'tracks'}</p></div>
                            </article>
                          )})}
                        </div>
                      </div>
                    )}

                    {activeTab === "Home" && activeFilter === "All" && !query && !showAllCards ? (
                      isLoadingData ? (
                        <div className="space-y-12">
                          {[1, 2, 3].map((section) => (
                            <div key={section}>
                              <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
                              <div className="flex overflow-x-hidden gap-4 pb-4 pt-2">
                                {[...Array(5)].map((_, i) => (
                                  <div key={i} className="shrink-0 w-44 sm:w-52 bg-white/40 rounded-2xl p-3 md:p-4 border border-gray-100">
                                    <div className="w-full aspect-square bg-gray-200 rounded-xl mb-3 animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-12">
                          
                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <Flame className="h-6 w-6 text-amber-500 fill-amber-500" />
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('popularNow')}</h2>
                              </div>
                            </div>
                            <div className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                              {popularNowTracks.map((program) => {
                                const isPlayingThis = currentTrack?.id === program.id;
                                return (
                                <article key={`pop-${program.id}`} className="group cursor-pointer shrink-0 snap-start w-44 sm:w-52 transition-all duration-300 active:scale-95 bg-white/50 rounded-2xl p-3 md:p-4 hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-transparent hover:border-gray-200/60" onClick={() => setViewingPlaylist(program)}>
                                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3">
                                    <img src={program.image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                    <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                      {isPlayingThis ? (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] shadow-[0_8px_15px_rgba(0,0,0,0.3)]">
                                          <div className="flex items-end gap-[2px] h-4 w-4">
                                            <div className="eq-bar eq-1"></div>
                                            <div className="eq-bar eq-2"></div>
                                            <div className="eq-bar eq-3"></div>
                                          </div>
                                        </div>
                                      ) : (
                                        <button onClick={(e) => { e.stopPropagation(); playTrack(program, popularNowTracks); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#072a23] active:scale-95 transition-all">
                                          <Play className="h-5 w-5 fill-current ml-1" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="px-1"><h3 className={`truncate text-base font-bold transition-colors group-hover:text-[#0b3d33] ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{program.title}</h3><p className="text-sm font-medium text-gray-500 mt-0.5 line-clamp-2 leading-snug">{program.topic}</p></div>
                                </article>
                              )})}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-[#0b3d33]" />
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('newReleases')}</h2>
                              </div>
                            </div>
                            <div className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                              {newReleasesTracks.map((program) => {
                                const isPlayingThis = currentTrack?.id === program.id;
                                return (
                                <article key={`new-${program.id}`} className="group cursor-pointer shrink-0 snap-start w-44 sm:w-52 transition-all duration-300 active:scale-95 bg-white/50 rounded-2xl p-3 md:p-4 hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-transparent hover:border-gray-200/60" onClick={() => setViewingPlaylist(program)}>
                                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3">
                                    <img src={program.image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                    <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                      {isPlayingThis ? (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] shadow-[0_8px_15px_rgba(0,0,0,0.3)]">
                                          <div className="flex items-end gap-[2px] h-4 w-4">
                                            <div className="eq-bar eq-1"></div>
                                            <div className="eq-bar eq-2"></div>
                                            <div className="eq-bar eq-3"></div>
                                          </div>
                                        </div>
                                      ) : (
                                        <button onClick={(e) => { e.stopPropagation(); playTrack(program, newReleasesTracks); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#072a23] active:scale-95 transition-all">
                                          <Play className="h-5 w-5 fill-current ml-1" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="px-1"><h3 className={`truncate text-base font-bold transition-colors group-hover:text-[#0b3d33] ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{program.title}</h3><p className="text-sm font-medium text-gray-500 mt-0.5 line-clamp-2 leading-snug">{program.topic}</p></div>
                                </article>
                              )})}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-6 w-6 text-emerald-600" />
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('mostViewed')}</h2>
                              </div>
                            </div>
                            <div className="flex overflow-x-auto gap-4 pb-4 pt-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                              {mostFamousTracks.map((program) => {
                                const isPlayingThis = currentTrack?.id === program.id;
                                return (
                                <article key={`fam-${program.id}`} className="group cursor-pointer shrink-0 snap-start w-44 sm:w-52 transition-all duration-300 active:scale-95 bg-white/50 rounded-2xl p-3 md:p-4 hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-transparent hover:border-gray-200/60" onClick={() => setViewingPlaylist(program)}>
                                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3">
                                    <img src={program.image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                    <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                      {isPlayingThis ? (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] shadow-[0_8px_15px_rgba(0,0,0,0.3)]">
                                          <div className="flex items-end gap-[2px] h-4 w-4">
                                            <div className="eq-bar eq-1"></div>
                                            <div className="eq-bar eq-2"></div>
                                            <div className="eq-bar eq-3"></div>
                                          </div>
                                        </div>
                                      ) : (
                                        <button onClick={(e) => { e.stopPropagation(); playTrack(program, mostFamousTracks); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#072a23] active:scale-95 transition-all">
                                          <Play className="h-5 w-5 fill-current ml-1" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="px-1"><h3 className={`truncate text-base font-bold transition-colors group-hover:text-[#0b3d33] ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{program.title}</h3><p className="text-sm font-medium text-gray-500 mt-0.5 line-clamp-2 leading-snug">{program.topic}</p></div>
                                </article>
                              )})}
                            </div>
                          </div>

                        </div>
                      )
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {activeTab === "Saved" ? t('savedSessions')
                              : activeTab === "Library" ? t('allSessions')
                                : activeFilter !== "All" ? `${activeFilter} Sessions`
                                  : t('exploreSpace')}
                          </h2>
                          {visiblePrograms.length > 0 && activeFilter === "All" && (
                            <button onClick={() => setShowAllCards(!showAllCards)} className="text-xs font-bold text-[#0b3d33] hover:text-[#072a23] transition-all uppercase tracking-[0.1em] hover:translate-x-1">
                              {showAllCards ? "Show less" : "See all"}
                            </button>
                          )}
                        </div>

                        {(activeTab === "Saved" && visiblePrograms.length === 0 && savedTracks.length === 0) || (activeTab === "Home" && activeFilter !== "All" && visiblePrograms.length === 0) ? (
                          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-white/50 py-32 text-center">
                            {activeTab === "Saved" ? (
                              <>
                                <Bookmark className="mx-auto mb-5 h-12 w-12 text-gray-300" />
                                <p className="text-gray-900 font-bold text-xl">{t('noSaved')}</p>
                                <p className="text-base text-gray-500 mt-2">{t('noSavedSub')}</p>
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
                          <div className={forceGrid ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "flex overflow-x-auto gap-4 pb-8 pt-2 snap-x snap-mandatory"} style={{ scrollbarWidth: forceGrid ? 'auto' : 'none', msOverflowStyle: 'none' }}>
                            {activeTab === "Saved" && savedTracks.length > 0 && (
                              <article className={`group cursor-pointer transition-all duration-300 active:scale-95 bg-white/50 rounded-2xl p-3 md:p-4 hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-gray-200/60 ${!forceGrid ? "shrink-0 snap-start w-44 sm:w-52" : ""}`} onClick={() => setViewingPlaylist({ id: "liked-songs", title: "Liked Songs", topic: "Favorites", description: "All your favorite tracks in one place.", image_url: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=60", isLikedSongs: true, tracks: savedTracks })}>
                                <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3 flex items-center justify-center bg-gradient-to-br from-[#0b3d33] to-[#2B7A55]">
                                  <LucideHeart className="h-16 w-16 text-white drop-shadow-lg transition-transform duration-700 ease-out group-hover:scale-110" fill="currentColor" />
                                  <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                    <button onClick={(e) => { e.stopPropagation(); playTrack({ id: "liked-songs", title: "Liked Songs", isLikedSongs: true, tracks: savedTracks }, savedTracks); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0b3d33] shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all">
                                      <Play className="h-5 w-5 fill-current ml-1" />
                                    </button>
                                  </div>
                                </div>
                                <div className="px-1"><h3 className="truncate text-base font-bold text-gray-900 group-hover:text-[#0b3d33] transition-colors">{t('likedSongs')}</h3><p className="text-sm font-medium text-gray-500 mt-0.5">{savedTracks.length} {savedTracks.length === 1 ? 'song' : 'songs'}</p></div>
                              </article>
                            )}
                            {visiblePrograms.map((program) => {
                              const isPlayingThis = currentTrack?.id === program.id;
                              return (
                              <article key={program.id} className={`group cursor-pointer transition-all duration-300 active:scale-95 bg-white/50 rounded-2xl p-3 md:p-4 hover:bg-white hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] border border-transparent hover:border-gray-200/60 ${!forceGrid ? "shrink-0 snap-start w-44 sm:w-52" : ""}`} onClick={() => setViewingPlaylist(program)}>
                                <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3">
                                  <img src={program.image_url} alt="" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                                  <div className="absolute bottom-3 right-3 translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-20">
                                    {isPlayingThis ? (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] shadow-[0_8px_15px_rgba(0,0,0,0.3)]">
                                          <div className="flex items-end gap-[2px] h-4 w-4">
                                            <div className="eq-bar eq-1"></div>
                                            <div className="eq-bar eq-2"></div>
                                            <div className="eq-bar eq-3"></div>
                                          </div>
                                        </div>
                                      ) : (
                                        <button onClick={(e) => { e.stopPropagation(); playTrack(program, visiblePrograms); }} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#072a23] active:scale-95 transition-all">
                                          <Play className="h-5 w-5 fill-current ml-1" />
                                        </button>
                                      )}
                                  </div>
                                </div>
                                <div className="px-1"><h3 className={`truncate text-base font-bold transition-colors group-hover:text-[#0b3d33] ${isPlayingThis ? 'text-[#0b3d33]' : 'text-gray-900'}`}>{program.title}</h3><p className="text-sm font-medium text-gray-500 mt-0.5 line-clamp-2 leading-snug">{program.topic}</p></div>
                              </article>
                            )})}
                          </div>
                        )}
                      </>
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

          <nav 
            className="absolute left-0 right-0 bottom-0 z-40 flex items-center justify-between bg-white/95 px-4 pb-4 pt-2 h-[80px] backdrop-blur-2xl md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-gray-100 transition-all duration-500 ease-out overflow-x-auto gap-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <button onClick={() => { setActiveTab("Home"); resetViews(); }} className={`flex flex-col shrink-0 items-center gap-1 p-2 transition-all active:scale-90 w-16 ${activeTab === "Home" ? "text-[#0b3d33]" : "text-gray-500"}`}>
              <Home className="h-6 w-6" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t('home')}</span>
            </button>
            
            <button onClick={() => { setActiveTab("Library"); resetViews(); setIsLibraryExpanded(true); }} className={`flex flex-col shrink-0 items-center gap-1 p-2 transition-all active:scale-90 w-16 ${activeTab === "Library" ? "text-[#0b3d33]" : "text-gray-500"}`}>
              <Library className="h-6 w-6" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t('library')}</span>
            </button>

            <button onClick={() => setShowBuilder(true)} className="flex flex-col shrink-0 items-center gap-1 p-2 transition-all active:scale-90 w-16 text-gray-500 hover:text-[#0b3d33]">
              <Plus className="h-6 w-6" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t('buildSession')}</span>
            </button>

            <button onClick={() => { setActiveTab("Record"); resetViews(); setIsLibraryExpanded(false); }} className={`flex flex-col shrink-0 items-center gap-1 p-2 transition-all active:scale-90 w-16 ${activeTab === "Record" ? "text-[#0b3d33]" : "text-gray-500"}`}>
              <Mic className="h-6 w-6" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t('recordVoice')}</span>
            </button>

            <button onClick={() => setShowDeepWork(true)} className="flex flex-col shrink-0 items-center gap-1 p-2 transition-all active:scale-90 w-16 text-gray-500 hover:text-[#0b3d33]">
              <Timer className="h-6 w-6" />
              <span className="text-[9px] font-bold uppercase tracking-wider">{t('deepWork')}</span>
            </button>
          </nav>
        </main>
      </div>
        
      {currentTrack && (<AudioPlayer program={currentTrack} onClose={closePlayer} onComplete={() => recordCompletedSession(currentTrack)} />)}

      {showCreatePlaylist && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">New Playlist</h3>
              <button onClick={() => setShowCreatePlaylist(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-90"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreatePlaylist}>
              <input type="text" placeholder="Name your playlist..." autoFocus value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]" />
              <button type="submit" disabled={!newPlaylistName.trim()} className="mt-4 w-full rounded-full bg-[#0b3d33] py-3.5 font-bold text-white transition-all active:scale-95 hover:bg-[#072a23] disabled:opacity-50">Create</button>
            </form>
          </div>
        </div>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showBuilder && (<SessionBuilder topic={builderTopic} duration={builderDuration} sound={builderSound} onTopicChange={setBuilderTopic} onDurationChange={setBuilderDuration} onSoundChange={setBuilderSound} onClose={() => setShowBuilder(false)} onCreate={createCustomSession} />)}

      {showDeepWork && <DeepWorkTimer onClose={() => setShowDeepWork(false)} />}
    </div>
  );
}