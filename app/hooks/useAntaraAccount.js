"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

const supabase = createClient();

export default function useAntaraAccount() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [savedProgramIds, setSavedProgramIds] = useState([]);
  const [customPlaylists, setCustomPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUserData(currentUser) {
    if (!currentUser) {
      setProfile(null);
      setSavedProgramIds([]);
      setCustomPlaylists([]);
      return;
    }

    const [profileResult, savedResult, playlistsResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle(),
      supabase
        .from("saved_programs")
        .select("program_id")
        .eq("user_id", currentUser.id),
      supabase
        .from("custom_playlists")
        .select("*")
        .eq("user_id", currentUser.id),
    ]);

    let finalProfileData = profileResult.data;

    if (!finalProfileData && !profileResult.error) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const retry = await supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle();
      finalProfileData = retry.data;
    }

    if (!finalProfileData) {
      finalProfileData = {
        id: currentUser.id,
        username: currentUser.user_metadata?.username || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || "User",
      };
    }

    setProfile(finalProfileData);

    if (!savedResult.error && savedResult.data) {
      setSavedProgramIds(savedResult.data.map((item) => item.program_id));
    }

    if (!playlistsResult.error && playlistsResult.data) {
      setCustomPlaylists(playlistsResult.data);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initialiseAccount() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (mounted) {
        setUser(currentUser);
        await loadUserData(currentUser);
        setLoading(false);
      }
    }

    initialiseAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (mounted) {
        const currentUser = session?.user || null;
        setUser(currentUser);
        await loadUserData(currentUser);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function saveProfile(updates) {
    if (!user) return { error: "Please sign in first." };

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error) setProfile(data);

    return { data, error: error?.message };
  }

  async function toggleSavedProgram(programId) {
    if (!user) return { requiresAuth: true };

    const isSaved = savedProgramIds.includes(programId);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_programs")
        .delete()
        .eq("user_id", user.id)
        .eq("program_id", programId);

      if (error) return { error: error.message };

      setSavedProgramIds((current) =>
        current.filter((id) => id !== programId),
      );

      return { saved: false };
    }

    const { error } = await supabase.from("saved_programs").insert({
      user_id: user.id,
      program_id: programId,
    });

    if (error) return { error: error.message };

    setSavedProgramIds((current) => [...current, programId]);

    return { saved: true };
  }

  async function recordCompletedSession(program) {
    if (!user) return;

    await supabase.from("listening_sessions").insert({
      user_id: user.id,
      program_id: program.id,
      duration_seconds: program.duration * 60,
    });
  }

  async function createPlaylist(name) {
    if (!user) return { error: "Please sign in first." };

    const newId = crypto.randomUUID();
    
    const playlistData = {
      id: newId, 
      user_id: user.id,
      name: name,
      tracks: [],
    };

    setCustomPlaylists((prev) => [...prev, playlistData]);

    const { data, error } = await supabase
      .from("custom_playlists")
      .insert(playlistData)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error.message);
      setCustomPlaylists((current) => current.filter(p => p.id !== newId));
      alert("Could not create playlist. Please try again.");
    }
    
    return { data, error: error?.message };
  }

  async function deletePlaylist(playlistId) {
    if (!user) return { error: "Please sign in first." };

    const playlistBackup = customPlaylists.find(p => p.id === playlistId);
    setCustomPlaylists((prev) => prev.filter((p) => p.id !== playlistId));

    const { error } = await supabase
      .from("custom_playlists")
      .delete()
      .eq("id", playlistId);

    if (error) {
      console.error("Database error:", error.message);
      if (playlistBackup) {
        setCustomPlaylists((prev) => [...prev, playlistBackup]);
      }
      alert("Could not delete playlist. Please try again.");
      return { error: error.message };
    }
    
    return { success: true };
  }

  async function addTrackToPlaylist(playlistId, track) {
    if (!user) return { error: "Please sign in first." };

    const playlist = customPlaylists.find((p) => p.id === playlistId);
    if (!playlist) return { error: "Playlist not found." };

    const updatedTracks = [...(playlist.tracks || []), track];

    const { error } = await supabase
      .from("custom_playlists")
      .update({ tracks: updatedTracks })
      .eq("id", playlistId);

    if (!error) {
      setCustomPlaylists((current) =>
        current.map((p) =>
          p.id === playlistId ? { ...p, tracks: updatedTracks } : p
        )
      );
    }
    return { error: error?.message };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    return { data, error: error?.message };
  }

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    return { data, error: error?.message };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });
    return { data, error };
  }

  const sendPhoneOtp = async (phone) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });
    return { data, error };
  }

  const verifyPhoneOtp = async (phone, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    return { data, error };
  }

  return {
    user,
    profile,
    savedProgramIds,
    customPlaylists,
    loading,
    signIn,   
    signUp,
    saveProfile,
    toggleSavedProgram,
    recordCompletedSession,
    createPlaylist,
    deletePlaylist, 
    addTrackToPlaylist,
    signOut,
    signInWithGoogle, sendPhoneOtp, verifyPhoneOtp,
  };
}