"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { CloudUpload, Music, Trash2, Loader2, CheckCircle, AlertTriangle, FileAudio, Sparkles, Play } from "lucide-react";

export default function AmbienceUpload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [tracks, setTracks] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  const fileInputRef = useRef(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const fetchTracks = async () => {
    setIsLoadingTracks(true);
    const { data, error } = await supabase
      .from("ambience_tracks")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setTracks(data);
    setIsLoadingTracks(false);
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("audio/")) {
      setFile(selectedFile);
     
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    } else {
      setStatus({ type: "error", message: "Please select a valid audio file (.mp3, .wav)." });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setStatus({ type: "error", message: "Please provide both a title and an audio file." });
      return;
    }

    setIsUploading(true);
    setStatus({ type: "", message: "" });

    try {
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `ambience/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('antara-audio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      
      const { data: { publicUrl } } = supabase.storage
        .from('antara-audio')
        .getPublicUrl(filePath);

      
      const { error: dbError } = await supabase
        .from('ambience_tracks')
        .insert([{ title: title.trim(), url: publicUrl }]);

      if (dbError) throw dbError;

      setStatus({ type: "success", message: "Ambience track uploaded successfully!" });
      setTitle("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      
      fetchTracks();
      
      setTimeout(() => setStatus({ type: "", message: "" }), 4000);

    } catch (error) {
      console.error("Upload error:", error);
      setStatus({ type: "error", message: error.message || "Failed to upload track." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id, url) => {
    if (!window.confirm("Are you sure you want to delete this track? It will be removed from user options.")) return;

    try {
      
      await supabase.from('ambience_tracks').delete().eq('id', id);

     
      const urlParts = url.split('/antara-audio/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from('antara-audio').remove([filePath]);
      }

      fetchTracks();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete track completely.");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20 space-y-10">
      
      
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Ambience Studio</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">Upload and manage the background soundscapes available in the Session Builder.</p>
      </div>

      {status.message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-lg animate-in slide-in-from-top-4 duration-300 ${status.type === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#0b3d33] text-white shadow-[#0b3d33]/20'}`}>
          {status.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
        
       
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 h-fit">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-[#0b3d33]" />
            <h3 className="text-xl font-black text-gray-900">New Track</h3>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Deep Forest Rain" 
                className="w-full bg-[#F8F5F0] border border-transparent text-gray-900 rounded-xl py-3.5 px-4 text-sm font-bold outline-none focus:border-[#0b3d33]/30 focus:ring-4 focus:ring-[#0b3d33]/10 transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Audio File</label>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group ${file ? 'border-[#0b3d33] bg-[#0b3d33]/5' : 'border-gray-200 bg-gray-50 hover:bg-[#F8F5F0] hover:border-gray-300'}`}
              >
                {file ? (
                  <>
                    <div className="w-12 h-12 bg-[#0b3d33] rounded-full flex items-center justify-center mb-3 shadow-lg transform group-hover:scale-110 transition-transform">
                      <FileAudio className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-black text-[#0b3d33] truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-gray-400 group-hover:text-[#0b3d33] transition-colors">
                      <CloudUpload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-700">Click to browse audio files</p>
                    <p className="text-xs font-medium text-gray-400 mt-1">MP3 or WAV up to 50MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/mp3,audio/wav,audio/mpeg" 
                  className="hidden" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isUploading || !file || !title}
              className="w-full flex items-center justify-center gap-2 bg-[#0b3d33] hover:bg-[#072a23] text-white px-8 py-4 rounded-xl text-sm font-bold transition-all hover:shadow-[0_10px_20px_rgba(11,61,51,0.2)] active:scale-95 disabled:opacity-50 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CloudUpload className="h-5 w-5" />}
              {isUploading ? "Uploading to Cloud..." : "Upload Ambience"}
            </button>
          </form>
        </div>

        
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#F8F5F0]/80 to-white">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#0b3d33]/10 flex items-center justify-center">
                <Music className="h-5 w-5 text-[#0b3d33]" />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 tracking-tight">Cloud Library</h3>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Live tracks available to users</p>
              </div>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[#0b3d33] bg-[#0b3d33]/10 px-3 py-1.5 rounded-full">
              {tracks.length} Tracks
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px] p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {isLoadingTracks ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="w-8 h-8 animate-spin text-[#0b3d33]" />
              </div>
            ) : tracks.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <Music className="w-12 h-12 text-gray-200 mb-4" />
                <p className="text-sm font-bold text-gray-400">No custom ambience tracks uploaded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {tracks.map((track) => (
                  <div key={track.id} className="group flex items-center justify-between p-4 hover:bg-[#F8F5F0]/50 rounded-2xl transition-all duration-300 hover:shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                      <button 
                        onClick={() => new Audio(track.url).play()}
                        className="w-10 h-10 rounded-full bg-[#0b3d33] text-white flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                      >
                        <Play className="w-4 h-4 ml-0.5 fill-current" />
                      </button>
                      <div className="min-w-0 pr-4">
                        <p className="font-bold text-gray-900 text-sm truncate">{track.title}</p>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-0.5">
                          Added {new Date(track.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(track.id, track.url)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all active:scale-95 shrink-0"
                      title="Delete track"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}