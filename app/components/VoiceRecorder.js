"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Play, Trash2, Sparkles, Brain, Loader2 } from "lucide-react";
import { createClient } from "../lib/supabase/client";

function generateReverbBuffer(audioContext) {
  const length = audioContext.sampleRate * 3.0; 
  const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
  for (let i = 0; i < 2; i++) {
    const channel = impulse.getChannelData(i);
    for (let j = 0; j < length; j++) {
      channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 3);
    }
  }
  return impulse;
}

export default function VoiceRecorder({ user, onRequireAuth, onPlayRecommended }) {
  const supabase = createClient();
  const recorderRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [status, setStatus] = useState("");

  const audioContextRef = useRef(null);
  const voiceSourceRef = useRef(null);
  const ambienceAudioRef = useRef(null);
  const [loopRecordingId, setLoopRecordingId] = useState(null);
  const [loopStatus, setLoopStatus] = useState("");
  const [loopAmbience, setLoopAmbience] = useState("/audio/ambience/waves.mp3");

  const [analyzingId, setAnalyzingId] = useState(null);
  const [aiInsights, setAiInsights] = useState({});

  useEffect(() => {
    return () => stopVocalLoop();
  }, []);

  async function loadRecordings() {
    if (!user || !user.id) {
      setRecordings([]);
      return;
    }
    const { data, error } = await supabase
      .from("recordings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return;

    const recordingsWithUrls = await Promise.all(
      data.map(async (recording) => {
        const { data: signedUrl } = await supabase.storage
          .from("voice-recordings")
          .createSignedUrl(recording.storage_path, 3600);
        return {
          ...recording,
          url: signedUrl?.signedUrl,
        };
      })
    );
    setRecordings(recordingsWithUrls);
  }

  useEffect(() => {
    loadRecordings();
  }, [user]);

  async function toggleRecording() {
    try {
      if (!user || !user.id) {
        if (onRequireAuth) onRequireAuth();
        else alert("Please sign in to record an affirmation.");
        return;
      }

      if (isRecording) {
        recorderRef.current?.stop();
        return;
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("Error: Your browser blocks microphone access here.");
        alert("Microphone access is blocked. If testing on mobile, ensure you use HTTPS.");
        return;
      }

      setStatus("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => chunks.push(event.data);

      recorder.onstop = async () => {
        setIsRecording(false);
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(chunks, { type: "audio/webm" });

        if (audioBlob.size > 15 * 1024 * 1024) {
          setStatus("Recording is too large. Please keep it under 15 MB.");
          return;
        }

        setStatus("Saving your private recording...");
        const filePath = `${user.id}/${crypto.randomUUID()}.webm`;

        const { error: uploadError } = await supabase.storage
          .from("voice-recordings")
          .upload(filePath, audioBlob, {
            contentType: "audio/webm",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setStatus("Upload failed: " + uploadError.message);
          return;
        }

        const { error: recordError } = await supabase.from("recordings").insert({
          user_id: user.id,
          title: "My affirmation",
          storage_path: filePath,
        });

        if (recordError) {
          await supabase.storage.from("voice-recordings").remove([filePath]);
          setStatus("Database error: " + recordError.message);
          return;
        }

        setStatus("Recording saved privately.");
        await loadRecordings();
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setStatus("Recording...");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
      alert("Microphone failed: " + err.message);
    }
  }

  async function deleteRecording(recording) {
    if (loopRecordingId === recording.id) stopVocalLoop(); 
    await supabase.storage.from("voice-recordings").remove([recording.storage_path]);
    await supabase.from("recordings").delete().eq("id", recording.id);
    await loadRecordings();
  }

  async function toggleVocalLoop(recording) {
    if (loopRecordingId === recording.id) {
      stopVocalLoop();
      return;
    }

    stopVocalLoop(); 
    setLoopRecordingId(recording.id);
    setLoopStatus("Creating cinematic loop...");

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const ctx = audioContextRef.current;

      const response = await fetch(recording.url);
      const arrayBuffer = await response.arrayBuffer();
      const decodedData = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = decodedData;
      source.loop = true; 
      voiceSourceRef.current = source;

      const convolver = ctx.createConvolver();
      convolver.buffer = generateReverbBuffer(ctx);

      const dryGain = ctx.createGain();
      dryGain.gain.value = 0.9; 

      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.5; 

      source.connect(dryGain);
      dryGain.connect(ctx.destination);

      source.connect(convolver);
      convolver.connect(wetGain);
      wetGain.connect(ctx.destination);

      source.start(0);

      if (ambienceAudioRef.current) {
        ambienceAudioRef.current.src = loopAmbience;
        ambienceAudioRef.current.volume = 0.3; 
        ambienceAudioRef.current.play().catch(e => console.log("Ambience error:", e));
      }

      setLoopStatus("Looping with cinematic echo...");
    } catch (err) {
      console.error("Vocal loop error:", err);
      setLoopStatus("Error creating loop.");
      setLoopRecordingId(null);
    }
  }

  function stopVocalLoop() {
    if (voiceSourceRef.current) {
      voiceSourceRef.current.stop();
      voiceSourceRef.current.disconnect();
      voiceSourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (ambienceAudioRef.current) {
      ambienceAudioRef.current.pause();
    }
    setLoopRecordingId(null);
    setLoopStatus("");
  }

  async function analyzeMood(recording) {
    setAnalyzingId(recording.id);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: recording.url })
      });
      const data = await response.json();
      setAiInsights(prev => ({ ...prev, [recording.id]: data }));
    } catch (error) {
      console.error("AI Analysis failed:", error);
    }
    setAnalyzingId(null);
  }

  return (
    <div className="rounded-[2.5rem] bg-[#F8F5F0] border border-[#0b3d33]/15 p-6 md:p-10 shadow-sm relative overflow-hidden">
      <audio ref={ambienceAudioRef} loop preload="auto" />

      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-[#0b3d33]/10 p-3.5 text-[#0b3d33] shadow-sm">
          <Mic className="h-6 w-6" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold text-[#0f172a] tracking-tight">Record your own voice</p>
          <p className="text-sm font-medium text-gray-500 mt-0.5">Your affirmations are strictly private to your account.</p>
        </div>
      </div>

      <button
        onClick={toggleRecording}
        className={`flex w-full items-center justify-center gap-2 rounded-full border px-4 py-4 font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_6px_12px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-0.5 active:scale-[0.98] ${
          isRecording
            ? "border-red-900 bg-gradient-to-b from-red-500 to-red-700 animate-pulse"
            : "border-[#041c17] bg-gradient-to-b from-[#0b3d33] to-[#072a23]"
        }`}
      >
        <Mic className="h-5 w-5 drop-shadow-md" />
        {isRecording ? "Stop recording" : "Record an affirmation"}
      </button>

      {status && <p className="mt-4 text-center text-sm font-bold text-[#0b3d33] animate-pulse">{status}</p>}

      {recordings.length > 0 && (
        <div className="mt-8 rounded-3xl bg-white/60 border border-[#0b3d33]/15 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#0b3d33]" />
            <h3 className="text-lg font-serif font-bold text-[#0f172a]">Vocal Loop Engine</h3>
          </div>
          <p className="text-sm font-medium text-gray-500 mb-5">Select an ambience. Click "Deep Loop" on any track to add a cinematic echo and loop it infinitely.</p>
          <select
            value={loopAmbience}
            onChange={(e) => setLoopAmbience(e.target.value)}
            className="w-full cursor-pointer rounded-2xl border border-[#0b3d33]/15 bg-white/80 px-4 py-3 font-medium text-[#0f172a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
          >
            <option value="/audio/ambience/waves.mp3">Ocean Waves</option>
            <option value="/audio/ambience/rain.mp3">Soft Rain</option>
            <option value="/audio/ambience/tanpura.mp3">Gentle Tanpura</option>
            <option value="/audio/ambience/focus.mp3">Focus Ambience</option>
          </select>
          {loopStatus && <p className="mt-4 text-sm font-bold text-[#0b3d33] animate-pulse">{loopStatus}</p>}
        </div>
      )}

      {recordings.length > 0 && (
        <div className="mt-6 space-y-4">
          {recordings.map((recording) => (
            <div
              key={recording.id}
              className={`flex flex-col gap-4 rounded-3xl border p-5 transition-all ${
                loopRecordingId === recording.id ? "bg-[#E9E2D5] border-[#0b3d33]/20 shadow-inner" : "bg-white/60 border-[#0b3d33]/10 hover:border-[#0b3d33]/20 hover:bg-white/90 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg font-bold text-[#0f172a]">{recording.title}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0b3d33]/60 mt-0.5">{new Date(recording.created_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => deleteRecording(recording)} aria-label="Delete recording" className="rounded-full p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center flex-wrap">
                {recording.url && (
                  <audio controls src={recording.url} className="h-10 w-full sm:flex-1 min-w-[200px]" />
                )}
                
                <button
                  onClick={() => analyzeMood(recording)}
                  disabled={analyzingId === recording.id}
                  className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-purple-200/50 bg-gradient-to-b from-purple-50 to-purple-100 px-5 py-2.5 text-xs font-bold text-purple-700 shadow-sm transition hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {analyzingId === recording.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                  Analyze Mood
                </button>

                <button
                  onClick={() => toggleVocalLoop(recording)}
                  className={`flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95 border ${
                    loopRecordingId === recording.id
                      ? "border-[#041c17] bg-gradient-to-b from-[#0b3d33] to-[#072a23] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_0_15px_rgba(11,61,51,0.5)] animate-pulse"
                      : "border-[#0b3d33]/15 bg-white/80 text-[#0b3d33] shadow-sm hover:scale-105 hover:bg-white"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  {loopRecordingId === recording.id ? "Stop Loop" : "Deep Loop"}
                </button>
              </div>

              {aiInsights[recording.id] && (
                <div className="mt-3 rounded-2xl bg-[#E9E2D5]/70 p-5 border border-[#0b3d33]/10 shadow-inner">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-white p-2.5 text-[#0b3d33] shrink-0 shadow-sm">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 leading-relaxed">{aiInsights[recording.id].message}</p>
                      <button 
                        onClick={() => onPlayRecommended && onPlayRecommended(aiInsights[recording.id].suggestedTopic)}
                        className="mt-4 flex items-center gap-2 rounded-full border border-[#041c17] bg-gradient-to-b from-[#0b3d33] to-[#072a23] px-5 py-2 text-xs font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_4px_8px_rgba(11,61,51,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all"
                      >
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5 drop-shadow-md" /> Play recommended {aiInsights[recording.id].suggestedTopic} session
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}