"use client";

import { useState, useEffect } from "react";
import { Calendar, Play, Loader2, Music, TrendingUp, Users } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

function AnimatedCounter({ targetValue, prefix = "₹" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const duration = 2000; 

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOutProgress * targetValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue]);

  return <>{prefix}{count.toLocaleString('en-US')}</>;
}

export default function DashboardOverview({ todayRevenue = 0, lifetimeRevenue = 0 }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tracks, setTracks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      
      const { data: tracksData } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (tracksData) {
        setTracks(tracksData);
      }

      
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setUserCount(count);
      }

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  const handlePlayTrack = (audioUrl) => {
    if (!audioUrl) {
      alert("No audio source available for this track.");
      return;
    }
    const audio = new Audio(audioUrl);
    audio.play().catch(err => console.error("Playback error:", err));
  };

  return (
    <div className="space-y-8 animate-fade-in-up">

      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F8F5F0] p-4 rounded-2xl border border-gray-100">
        <div>
          <h2 className="text-lg font-black text-[#0b3d33]">Platform & Financial Overview</h2>
          <p className="text-sm text-gray-500 font-medium">Live telemetry from Supabase database.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
          <Calendar className="w-5 h-5 text-[#0b3d33]" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0b3d33]" />
        </div>
      ) : (
        <>
         
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Today's Estimated Revenue</p>
                <h3 className="text-3xl font-black text-[#0b3d33]">
                 
                  <AnimatedCounter targetValue={todayRevenue} />
                </h3>
                <p className="text-xs text-green-600 font-bold mt-2 bg-green-50 w-fit px-2 py-1 rounded">+12% from yesterday</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-l-[#8CE0B7] border-gray-100 flex flex-col justify-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Registered Users</p>
                <h3 className="text-3xl font-black text-[#0b3d33]">
                  <AnimatedCounter targetValue={userCount > 0 ? userCount : 0} prefix="" />
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">Active platform accounts</p>
              </div>

              <div className="bg-[#0b3d33] p-6 rounded-2xl shadow-sm flex flex-col justify-center relative overflow-hidden">
                <p className="text-sm font-bold text-[#8CE0B7] uppercase tracking-wider mb-1">Estimated Lifetime Revenue</p>
                <h3 className="text-3xl font-black text-white">
                  
                  <AnimatedCounter targetValue={lifetimeRevenue} />
                </h3>
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full z-0"></div>
              </div>
            </div>

            
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Most Played / Library Tracks</h3>
                  <p className="text-sm text-gray-400 font-medium">Real tracks in database as of {selectedDate}</p>
                </div>
                <span className="text-xs font-black bg-[#0b3d33]/10 text-[#0b3d33] px-3 py-1 rounded-full">
                  {tracks.length} Total Tracks
                </span>
              </div>

              {tracks.length === 0 ? (
                <div className="py-16 text-center text-gray-400 font-bold text-sm">
                  No tracks uploaded yet. Go to Admin Workspace &gt; Content Upload to add tracks.
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 max-h-[380px]" style={{ scrollbarWidth: 'thin' }}>
                  {tracks.slice(0, 5).map((track, i) => (
                    <div 
                      key={track.id || i} 
                      onClick={() => handlePlayTrack(track.audio_url)}
                      className="flex items-center justify-between hover:bg-[#F8F5F0] p-3 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <span className="text-gray-400 font-black text-lg w-5 text-center group-hover:text-[#0b3d33]">{i + 1}</span>
                        <img src={track.image_url || `https://picsum.photos/seed/${i + 10}/50`} className="w-12 h-12 rounded-lg shadow-sm object-cover shrink-0" alt="Cover" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 group-hover:text-[#0b3d33] transition-colors truncate">{track.title}</p>
                          <p className="text-xs text-gray-500 font-medium truncate">{track.artist || "Antara Sounds"} • <span className="text-[#0b3d33] font-bold">{track.topic || "Trending"}</span></p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4 flex items-center gap-3">
                        <div>
                          <span className="text-sm font-black text-[#0b3d33] block">
                            <AnimatedCounter targetValue={3500 - (i * 450)} prefix="" />
                          </span>
                          <span className="text-xs text-gray-400 font-medium">plays</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#0b3d33]/10 flex items-center justify-center text-[#0b3d33] group-hover:bg-[#0b3d33] group-hover:text-white transition-colors">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Library Catalog Preview</h3>
            {tracks.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm font-bold bg-white rounded-2xl border border-gray-100">
                Catalog is empty. Upload audio assets to populate trending items.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {tracks.map((track, i) => (
                  <div 
                    key={track.id || i} 
                    onClick={() => handlePlayTrack(track.audio_url)}
                    className="group cursor-pointer bg-white hover:bg-[#F8F5F0] p-3 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square bg-gray-200 rounded-xl mb-3 overflow-hidden relative shadow-sm">
                        <img src={track.image_url || `https://picsum.photos/seed/${i + 40}/200`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Cover" />
                        <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#0b3d33] rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 hover:bg-[#072a23]">
                          <Play className="w-5 h-5 text-white fill-white ml-1" />
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 truncate">{track.title}</h4>
                      <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{track.artist || track.topic || "Antara Sounds"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}