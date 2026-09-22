"use client";

import { createContext, useContext, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const logPlayHistory = async (trackId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase.from('play_history').insert([{
          program_id: trackId,
          user_id: session.user.id
        }]);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Failed to log play:", error.message);
    }
  };

  const playTrack = (track, newQueue = null) => {
    if (!track || !(track.audio_url || track.audioUrl)) {
      console.error("Playback stopped: No audio file found for this track.");
      return;
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else if (queue.length === 0) {
      setQueue([track]);
      setCurrentIndex(0);
    } else {
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
    
    if (track.id && !String(track.id).startsWith('custom-') && track.id !== 'liked-songs') {
      logPlayHistory(track.id);
    }
  };

  const playNext = () => {
    if (queue.length === 0) return;
    
    if (isShuffled) {
      const randomIdx = Math.floor(Math.random() * queue.length);
      playTrack(queue[randomIdx]);
    } else {
      const nextIdx = currentIndex + 1;
      if (nextIdx < queue.length) {
        playTrack(queue[nextIdx]);
      } else if (isRepeat) {
        playTrack(queue[0]); 
      } else {
        setIsPlaying(false); 
      }
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    
    if (isShuffled) {
      const randomIdx = Math.floor(Math.random() * queue.length);
      playTrack(queue[randomIdx]);
    } else {
      const prevIdx = currentIndex - 1;
      if (prevIdx >= 0) {
        playTrack(queue[prevIdx]);
      } else if (isRepeat) {
        playTrack(queue[queue.length - 1]); 
      }
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffled(!isShuffled);
  const toggleRepeat = () => setIsRepeat(!isRepeat);
  
  const closePlayer = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider value={{ 
      currentTrack, isPlaying, playTrack, togglePlay, closePlayer,
      playNext, playPrevious, isShuffled, toggleShuffle, isRepeat, toggleRepeat 
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => useContext(AudioContext);