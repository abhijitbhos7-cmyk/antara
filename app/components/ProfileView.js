"use client";

import { Settings, MoreHorizontal, Edit2, Crown, Sparkles, GraduationCap, Clock, Activity, Flame, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function ProfileView({ user, profile, customPlaylists, onOpenSettings }) {
  const [stats, setStats] = useState({ totalMinutes: 0, totalSessions: 0, streak: 0 });
  
  const rawUsername = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const formattedUsername = rawUsername.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  const initial = formattedUsername.charAt(0);
  const tier = profile?.subscription_tier || 'free';

  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );

      const { data } = await supabase
        .from('listening_sessions')
        .select('duration_seconds, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        const totalSecs = data.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0);
        
       
        const hasRecentSession = new Date() - new Date(data[0].created_at) < 86400000 * 2;
        
        setStats({
          totalMinutes: Math.floor(totalSecs / 60),
          totalSessions: data.length,
          streak: hasRecentSession ? 1 : 0
        });
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500 pb-8">
      
      <div className="relative bg-gradient-to-b from-[#1a6e59] to-[#0b3d33] flex flex-col md:flex-row items-end gap-6 md:gap-8 p-6 md:p-10 pt-24 md:pt-36 shadow-md border-b border-[#0b3d33]/20">
        <div className={`relative z-10 h-48 w-48 md:h-[232px] md:w-[232px] rounded-full bg-[#0b3d33] flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4)] shrink-0 overflow-hidden border-4 group cursor-pointer ${tier === 'platinum' ? 'border-yellow-500' : 'border-white/10'}`}>
           <span className="text-7xl md:text-9xl font-black text-white group-hover:opacity-0 transition-opacity duration-300">{initial}</span>
           
           <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Edit2 className="w-10 h-10 text-white mb-2" />
              <span className="text-white font-bold text-base">Choose photo</span>
           </div>
        </div>
        
        <div className="relative z-10 flex flex-col gap-1 md:gap-2 w-full text-white">
          <p className="text-sm font-bold uppercase tracking-widest text-white/90 drop-shadow-sm flex items-center gap-2">
            Profile 
            {tier === 'platinum' && <span className="bg-yellow-500 text-black px-2 py-0.5 rounded text-[10px]">Platinum</span>}
            {tier === 'standard' && <span className="bg-[#8CE0B7] text-black px-2 py-0.5 rounded text-[10px]">Standard</span>}
            {tier === 'student' && <span className="bg-blue-300 text-black px-2 py-0.5 rounded text-[10px]">Student</span>}
          </p>
          
          <h1 className="text-5xl font-black md:text-7xl lg:text-[84px] tracking-tighter leading-[1.1] pb-2 truncate max-w-full drop-shadow-md flex items-center gap-3 md:gap-5">
            {formattedUsername}
            {tier === 'platinum' && <Crown className="w-10 h-10 md:w-16 md:h-16 text-yellow-500 drop-shadow-lg" />}
            {tier === 'standard' && <Sparkles className="w-10 h-10 md:w-14 md:h-14 text-[#8CE0B7] drop-shadow-lg" />}
            {tier === 'student' && <GraduationCap className="w-10 h-10 md:w-16 md:h-16 text-blue-300 drop-shadow-lg" />}
          </h1>
          
          <p className="text-sm font-medium text-white/80 mt-1">
            {customPlaylists?.length || 0} Public Playlist{(customPlaylists?.length !== 1) ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="flex-1 px-6 md:px-10 py-6 flex flex-col">
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

        
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">Your Focus Analytics</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Time</span>
              <div className="h-10 w-10 rounded-full bg-[#0b3d33]/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#0b3d33]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalMinutes}</h3>
              <span className="text-sm font-bold text-gray-500">mins</span>
            </div>
          </div>

          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Sessions</span>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats.totalSessions}</h3>
              <span className="text-sm font-bold text-gray-500">completed</span>
            </div>
          </div>

          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Day Streak</span>
              <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stats.streak}</h3>
              <span className="text-sm font-bold text-gray-500">days</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}