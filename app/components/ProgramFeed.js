"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useAudio } from "../context/AudioContext";
import { Play } from "lucide-react"; 

export default function ProgramFeed() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  
  const { playTrack } = useAudio();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchPrograms = async () => {
      
      const { data } = await supabase
        .from("programs")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setPrograms(data);
      setIsLoading(false);
    };
    fetchPrograms();
  }, [supabase]);

  if (isLoading) return <div className="animate-pulse text-gray-400 mt-8 font-bold">Loading live sessions...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Popular Right Now</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {programs.map((program) => (
          <article 
            key={program.id} 
            className="group cursor-pointer transition-all duration-300 active:scale-95 bg-[#F8F5F0] rounded-2xl p-3 md:p-4 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-transparent hover:border-gray-100" 
            onClick={() => playTrack(program)}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-sm mb-3">
              
              <img src={program.image_url} alt={program.title} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              
              <div className="absolute bottom-2 right-2 opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 z-20">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    playTrack(program); 
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0b3d33] text-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-[#072a23] active:scale-95 transition-all"
                >
                  <Play className="h-5 w-5 fill-current ml-1" />
                </button>
              </div>
            </div>
            
            <div className="px-1">
              <h3 className="truncate text-base font-bold text-gray-900 group-hover:text-[#0b3d33] transition-colors">{program.title}</h3>
              <p className="text-sm font-medium text-gray-500 mt-0.5 line-clamp-2 leading-snug">{program.topic}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}