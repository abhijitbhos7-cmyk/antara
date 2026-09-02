"use client";
import VoiceRecorder from "./components/VoiceRecorder";
import PlaylistDetail from "./components/PlaylistDetail";
import SessionBuilder from "./components/SessionBuilder";
import useAntaraAccount from "./hooks/useAntaraAccount";
import AuthModal from "./components/AuthModal";
import AudioPlayer from "./components/AudioPlayer";
import { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import { programs, topics } from "./lib/antara-content";
import {
  Activity, Bookmark, Brain, Home, Library,
  Mic, Moon, Play, Plus, Sparkles, Target, Waves, X,
  ArrowLeft, Clock, MoreHorizontal, Heart as LucideHeart,
  ListPlus, Music
} from "lucide-react";
import Footer from "./components/Footer";

const iconByTopic = {
  All: Sparkles, Focus: Target, Confidence: Activity,
  Sleep: Moon, "Self-love": Heart, Calm: Waves,
};

function Heart(props) {
  return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
}

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

  const { user, profile, savedProgramIds, loading, recordCompletedSession, signOut, customPlaylists, createPlaylist } = useAntaraAccount();
  const [showAuth, setShowAuth] = useState(false);

  function toggleSave(id) {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]);
  }

  function toggleTrackSave(track) {
    setSavedTracks((prev) => prev.some((t) => t.id === track.id) ? prev.filter((t) => t.id !== track.id) : [...prev, track]);
  }

  async function handleCreatePlaylist(e) {
    e.preventDefault();
    if (!user) return setShowAuth(true);
    if (!newPlaylistName.trim()) return;
    
    await createPlaylist(newPlaylistName);
    setShowCreatePlaylist(false);
    setNewPlaylistName("");
    setActiveTab("Library"); 
  }

  const visiblePrograms = useMemo(() => {
    let filtered = programs.filter((program) => {
      const searchableText = `${program.title} ${program.topic} ${program.description}`.toLowerCase();
      return searchableText.includes(query.toLowerCase());
    });
    if (activeTab === "Saved") filtered = filtered.filter((p) => savedIds.includes(p.id));
    return filtered;
  }, [query, activeTab, savedIds]);

  const dailySession = programs.find((program) => program.topic === profile?.focus_goal) || programs[0];
  const trendingSessions = programs.slice(1, 4);

  function createCustomSession() {
    const matchingProgram = programs.find((program) => program.topic === builderTopic) || programs[0];
    let selectedAmbienceUrl = "/audio/ambience/focus.mp3"; 
    if (builderSound === "Soft rain") selectedAmbienceUrl = "/audio/ambience/rain.mp3";
    else if (builderSound === "Ocean waves") selectedAmbienceUrl = "/audio/ambience/waves.mp3";
    else if (builderSound === "Gentle tanpura") selectedAmbienceUrl = "/audio/ambience/tanpura.mp3";

    setPlayerProgram({
      ...matchingProgram,
      id: `custom-${Date.now()}`,
      title: `My ${builderTopic} Session`,
      duration: Number(builderDuration),
      description: `${builderDuration}-minute session with ${builderSound.toLowerCase()}.`,
      ambienceUrl: selectedAmbienceUrl, 
    });
    setShowBuilder(false);
  }

  function handlePlayRecommendedSession(topic) {
    const session = programs.find((p) => p.topic.toLowerCase() === topic.toLowerCase()) || programs[0];
    setPlayerProgram(session);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white text-gray-900">
      <aside className="w-64 shrink-0 flex-col border-r border-[#0b3d33] bg-[#0b3d33] py-6 hidden md:flex">
        <div className="mb-10 mt-4 flex w-full justify-center">
          <div className="flex items-center justify-center rounded-full bg-white p-4 shadow-lg">
            <img src="/antara-logo.svg" alt="Antara Logo" className="h-16 w-16 object-contain" />
          </div>
        </div>
        <div className="px-4">
          <p className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-white/60">Menu</p>
          <nav className="space-y-1">
            <button onClick={() => {setActiveTab("Home"); setViewingPlaylist(null); setShowAllCards(false);}} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === "Home" ? "bg-white/20 text-white shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"}`}><Home className="h-5 w-5" /> Home</button>
            <button onClick={() => {setActiveTab("Library"); setViewingPlaylist(null); setShowAllCards(false);}} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === "Library" ? "bg-white/20 text-white shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"}`}><Library className="h-5 w-5" /> Library</button>
            <button onClick={() => {setActiveTab("Saved"); setViewingPlaylist(null); setShowAllCards(false);}} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === "Saved" ? "bg-white/20 text-white shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"}`}><Bookmark className="h-5 w-5" /> Saved</button>
            <button onClick={() => { user ? setShowCreatePlaylist(true) : setShowAuth(true) }} className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"><ListPlus className="h-5 w-5" /> Create Playlist</button>
          </nav>
        </div>
        <div className="mt-10 px-4">
          <p className="mb-4 px-4 text-xs font-bold uppercase tracking-widest text-white/60">Rituals</p>
          <nav className="space-y-1">
            <button onClick={() => setShowBuilder(true)} className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"><Plus className="h-5 w-5" /> Build Session</button>
            <button onClick={() => { setActiveTab("Record"); setViewingPlaylist(null); setShowAllCards(false); }} className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === "Record" ? "bg-white/20 text-white shadow-md" : "text-white/80 hover:bg-white/10 hover:text-white"}`}><Mic className="h-5 w-5" /> Record Voice</button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#FAFAFA] relative overflow-hidden">
        <Navbar query={query} onQueryChange={setQuery} user={user} onOpenAuth={() => setShowAuth(true)} onSignOut={signOut} />
        <div className="flex-1 overflow-y-auto px-8 pb-12 pt-2">
          {viewingPlaylist ? (
            <PlaylistDetail 
              playlist={viewingPlaylist} 
              onBack={() => setViewingPlaylist(null)} 
              onPlay={() => setPlayerProgram(viewingPlaylist)}
              isSaved={savedIds.includes(viewingPlaylist.id)}
              onToggleSave={() => toggleSave(viewingPlaylist.id)}
              savedTracks={savedTracks}           
              onToggleTrackSave={toggleTrackSave} 
            />
          ) : (
            <>
              {activeTab === "Home" && !showAllCards && (
                <div className="grid gap-10 xl:grid-cols-[1fr_350px]">
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Featured Session</h2>
                    <div className="relative flex items-center justify-between overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
                      <div className="relative z-10 max-w-sm">
                        <h3 className="text-3xl font-extrabold text-gray-900">{dailySession.title}</h3>
                        <p className="mt-3 text-sm font-medium text-gray-500">{dailySession.description}</p>
                        <div className="mt-6 h-1 w-12 rounded-full bg-[#0b3d33]"></div>
                        <button onClick={() => setPlayerProgram(dailySession)} className="mt-8 flex items-center gap-2 rounded-full bg-[#0b3d33] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-[#0b3d33]/30 transition hover:scale-105"><Play className="h-4 w-4 fill-current" /> Play Session</button>
                      </div>
                      <div className="absolute right-0 top-0 h-full w-1/2">
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
                        <img src={dailySession.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Up Next</h2>
                    <div className="space-y-4 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
                      {trendingSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between group cursor-pointer" onClick={() => setPlayerProgram(session)}>
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b3d33]/10 text-[#0b3d33]"><Play className="h-4 w-4 fill-current ml-0.5" /></div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 transition group-hover:text-[#0b3d33]">{session.title}</p>
                              <p className="text-xs font-medium text-gray-400">{session.topic}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-gray-400">{session.duration}:00</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== "Record" && (
                <div className={activeTab === "Home" && !showAllCards ? "mt-12" : "mt-2"}>
                  
                  {activeTab === "Library" && customPlaylists.length > 0 && (
                    <div className="mb-10">
                      <h2 className="mb-6 text-xl font-bold text-gray-900">Your Playlists</h2>
                      <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {customPlaylists.map(cp => (
                          <article key={cp.id} className="group cursor-pointer shrink-0 snap-start w-40 sm:w-48 md:w-56" onClick={() => setViewingPlaylist({...cp, title: cp.name, description: "Your custom playlist", isCustom: true})}>
                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm transition group-hover:shadow-md flex items-center justify-center">
                              <Music className="h-16 w-16 text-gray-400" />
                              <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100"></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"><Play className="h-5 w-5 fill-current ml-1" /></div></div>
                            </div>
                            <div className="mt-4 px-1"><h3 className="truncate text-sm font-bold text-gray-900">{cp.name}</h3><p className="truncate text-xs font-medium text-gray-400">{(cp.tracks || []).length} {((cp.tracks || []).length) === 1 ? 'track' : 'tracks'}</p></div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{activeTab === "Saved" ? "Saved Sessions" : activeTab === "Library" ? "All Sessions" : "Explore Space"}</h2>
                    {visiblePrograms.length > 0 && <button onClick={() => setShowAllCards(!showAllCards)} className="text-sm font-bold text-gray-500 hover:text-gray-900 hover:underline transition">{showAllCards ? "Show less" : "Show all"}</button>}
                  </div>

                  {activeTab === "Saved" && visiblePrograms.length === 0 && savedTracks.length === 0 ? (
                    <div className="rounded-3xl border border-gray-100 bg-white py-16 text-center shadow-sm">
                      <Bookmark className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No saved sessions yet.</p>
                      <p className="text-sm text-gray-400">Click the bookmark or heart icon on any playlist or song to save it here.</p>
                    </div>
                  ) : (
                    <div className={showAllCards ? "grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory"} style={{ scrollbarWidth: showAllCards ? 'auto' : 'none', msOverflowStyle: 'none' }}>
                      {activeTab === "Saved" && savedTracks.length > 0 && (
                        <article className={`group cursor-pointer ${!showAllCards ? "shrink-0 snap-start w-40 sm:w-48 md:w-56" : ""}`} onClick={() => setViewingPlaylist({id: "liked-songs", title: "Liked Songs", topic: "Favorites", description: "All your favorite tracks in one place.", image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=60", isLikedSongs: true, tracks: savedTracks})}>
                          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3d33] to-[#2B7A55] shadow-sm transition group-hover:shadow-md flex items-center justify-center">
                            <LucideHeart className="h-16 w-16 text-white drop-shadow-md" fill="currentColor" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0b3d33] shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"><Play className="h-5 w-5 fill-current ml-1" /></div></div>
                          </div>
                          <div className="mt-4 px-1"><h3 className="truncate text-sm font-bold text-gray-900">Liked Songs</h3><p className="truncate text-xs font-medium text-gray-400">{savedTracks.length} {savedTracks.length === 1 ? 'song' : 'songs'}</p></div>
                        </article>
                      )}
                      {visiblePrograms.map((program) => (
                        <article key={program.id} className={`group cursor-pointer ${!showAllCards ? "shrink-0 snap-start w-40 sm:w-48 md:w-56" : ""}`} onClick={() => setViewingPlaylist(program)}>
                          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition group-hover:shadow-md">
                            <img src={program.image} alt={program.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100"></div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"><Play className="h-5 w-5 fill-current ml-1" /></div></div>
                          </div>
                          <div className="mt-4 px-1"><h3 className="truncate text-sm font-bold text-gray-900">{program.title}</h3><p className="truncate text-xs font-medium text-gray-400">{program.topic} • {program.duration} min</p></div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "Record" && (
                <div className="mt-4 max-w-2xl">
                  <h2 className="mb-6 text-xl font-bold text-gray-900">Voice Studio</h2>
                  <VoiceRecorder 
                    user={user} 
                    onRequireAuth={() => setShowAuth(true)} 
                    onPlayRecommended={handlePlayRecommendedSession} 
                  />
                </div>
              )}
            </>
          )}
          <Footer />
        </div>
      </main>

      {showCreatePlaylist && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">New Playlist</h3>
              <button onClick={() => setShowCreatePlaylist(false)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900">
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
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]" 
              />
              <button 
                type="submit" 
                disabled={!newPlaylistName.trim()} 
                className="mt-4 w-full rounded-full bg-[#0b3d33] py-3 font-bold text-white transition disabled:opacity-50"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {showBuilder && (<SessionBuilder topic={builderTopic} duration={builderDuration} sound={builderSound} onTopicChange={setBuilderTopic} onDurationChange={setBuilderDuration} onSoundChange={setBuilderSound} onClose={() => setShowBuilder(false)} onCreate={createCustomSession} />)}
      {playerProgram && (<AudioPlayer program={playerProgram} onClose={() => setPlayerProgram(null)} onComplete={() => recordCompletedSession(playerProgram)} />)}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {loading && (<div className="fixed inset-0 z-[60] grid place-items-center bg-white text-gray-900">Loading Antara...</div>)}
    </div>
  );
}