"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../lib/supabase/client";

export default function useAntaraAccount() {
  const supabase = useMemo(() => createClient(), []);

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

    if (!profileResult.error) {
      setProfile(profileResult.data);
    }

    if (!savedResult.error) {
      setSavedProgramIds(savedResult.data.map((item) => item.program_id));
    }

    if (!playlistsResult.error && playlistsResult.data) {
      setCustomPlaylists(playlistsResult.data);
    }
  }

  useEffect(() => {
    async function initialiseAccount() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      await loadUserData(currentUser);
      setLoading(false);
    }

    initialiseAccount();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentUser) => {
      setUser(currentUser);
      await loadUserData(currentUser);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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

    const newPlaylist = {
      user_id: user.id,
      name: name,
      tracks: [],
    };

    const { data, error } = await supabase
      .from("custom_playlists")
      .insert(newPlaylist)
      .select()
      .single();

    if (!error && data) {
      setCustomPlaylists((prev) => [...prev, data]);
    }
    return { data, error: error?.message };
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
    addTrackToPlaylist,
    signOut,
  };
}