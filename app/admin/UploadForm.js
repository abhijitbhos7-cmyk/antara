"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Sparkles, MonitorPlay, Cloud, Link as LinkIcon, Music, Trash2 } from "lucide-react";

export default function UploadForm() {
  const [uploadMode, setUploadMode] = useState("file"); 
  const [urlSource, setUrlSource] = useState("youtube"); 
  
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("Trending Songs");
  const [description, setDescription] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [externalUrl, setExternalUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [message, setMessage] = useState("");
  const [aiData, setAiData] = useState(null); 

  
  const [existingPrograms, setExistingPrograms] = useState([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

 
  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setExistingPrograms(data);
    setIsLoadingPrograms(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const runAiAnalysis = async () => {
    const targetName = uploadMode === "file" && audioFiles.length > 0 
      ? audioFiles[0].name 
      : (title || externalUrl);

    if (!targetName) {
      setMessage("⚠️ Provide a file, URL, or Title first for the AI to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setMessage("🤖 AI is analyzing audio waveform & metadata...");

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: targetName, type: uploadMode })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setCategory(data.category);
        setAiData(data);
        setMessage(`✨ AI Analysis Complete! Detected: ${data.category} (${data.bpm} BPM)`);
      } else {
        throw new Error("Analysis failed");
      }
    } catch (error) {
      setMessage("❌ AI Analysis failed. Please set category manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (uploadMode === "file" && audioFiles.length === 0) {
      setMessage("⚠️ Please select at least one audio file."); return;
    }
    if (uploadMode === "url" && !externalUrl) {
      setMessage("⚠️ Please enter a valid URL."); return;
    }
    if (!imageFile) {
      setMessage("⚠️ Please upload a cover art image."); return;
    }

    setIsUploading(true);
    setMessage("⏳ Processing cover art...");

    try {
      
      const imageName = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error: imageError } = await supabase.storage.from("cover_art").upload(imageName, imageFile);
      if (imageError) throw imageError;
      const { data: imageUrlData } = supabase.storage.from("cover_art").getPublicUrl(imageName);
      const finalImageUrl = imageUrlData.publicUrl;

      
      if (uploadMode === "file") {
        setMessage("⏳ Uploading MP3 files to Supabase...");
        const dbRecords = [];

        for (let i = 0; i < audioFiles.length; i++) {
          const file = audioFiles[i];
          const audioName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

          const { error: audioError } = await supabase.storage.from("audio-files").upload(audioName, file);
          if (audioError) throw audioError;
          const { data: audioUrlData } = supabase.storage.from("audio-files").getPublicUrl(audioName);

          const trackTitle = audioFiles.length === 1 && title !== "" ? title : file.name.replace(/\.[^/.]+$/, "");

          dbRecords.push({
            title: trackTitle, 
            artist: artist, 
            topic: category, 
            description: description,
            audio_url: audioUrlData.publicUrl, 
            image_url: finalImageUrl,
            bpm: aiData?.bpm || null 
          });
        }

        const { error: dbError } = await supabase.from("programs").insert(dbRecords);
        if (dbError) throw dbError;

      } else {
        setMessage(`⏳ Extracting audio from ${urlSource.toUpperCase()}... This may take a minute.`);
        
        const response = await fetch('/api/extract-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            sourceUrl: externalUrl, 
            sourceType: urlSource, 
            trackTitle: title || "Imported Session" 
          }),
        });

        const extractedData = await response.json();
        if (!response.ok || !extractedData.success) throw new Error(extractedData.error || "Failed to extract audio from URL");

        const { error: dbError } = await supabase.from("programs").insert([{
          title: title || "Imported Session", 
          artist: artist, 
          topic: category, 
          description: description,
          audio_url: extractedData.audioUrl, 
          image_url: finalImageUrl, 
          bpm: aiData?.bpm || null
        }]);
        if (dbError) throw dbError;
      }

      setMessage(`✅ Success! Session published successfully.`);
     
      setTitle(""); setArtist(""); setDescription(""); setExternalUrl("");
      setAudioFiles([]); setImageFile(null); setAiData(null);
      document.getElementById("imageInput").value = "";
      if (document.getElementById("audioInput")) document.getElementById("audioInput").value = "";
      
      
      fetchPrograms();
    } catch (error) {
      console.error("FULL ERROR:", error);
      setMessage(`❌ Error: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

 
  const handleDeleteProgram = async (programId) => {
    if (!window.confirm("Are you sure you want to permanently delete this track from Antara?")) return;

    const { error } = await supabase
      .from("programs")
      .delete()
      .eq("id", programId);

    if (error) {
      alert("Error deleting track: " + error.message);
    } else {
      setExistingPrograms((prev) => prev.filter((p) => p.id !== programId));
      setMessage("🗑️ Track deleted successfully.");
    }
  };

  const getUrlPlaceholder = () => {
    switch(urlSource) {
      case 'youtube': return "https://www.youtube.com/watch?v=...";
      case 'soundcloud': return "https://soundcloud.com/artist/track...";
      case 'gdrive': return "https://drive.google.com/file/d/...";
      case 'direct': return "https://example.com/audio.mp3";
      default: return "Paste URL here...";
    }
  };

  return (
    <div className="space-y-10">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 relative">
        
        
        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-bold ${message.includes('✅') || message.includes('✨') || message.includes('🗑️') ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' : 'bg-[#0b3d33]/5 text-[#0b3d33] border border-[#0b3d33]/20 shadow-sm'}`}>
            {message}
          </div>
        )}

       
        <div className="flex gap-2 mb-8 bg-[#F8F5F0] p-1.5 rounded-2xl w-full md:w-fit border border-gray-100 shadow-inner">
          <button type="button" onClick={() => setUploadMode("file")}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${uploadMode === "file" ? "bg-white text-[#0b3d33] shadow-md scale-[1.02]" : "text-gray-500 hover:text-[#0b3d33]"}`}>
            Upload Local File(s)
          </button>
          <button type="button" onClick={() => setUploadMode("url")}
            className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${uploadMode === "url" ? "bg-white text-[#0b3d33] shadow-md scale-[1.02]" : "text-gray-500 hover:text-[#0b3d33]"}`}>
            Cloud / URL Import
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-6">
          
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {uploadMode === "file" && audioFiles.length > 1 ? "Album / Collection Title" : "Track Title"}
              </label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder={uploadMode === "file" && audioFiles.length > 1 ? "Auto-fills with file names if blank" : "e.g., Deep Focus Mixer"}
                className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 focus:border-[#0b3d33] font-bold transition-all shadow-inner focus:shadow-md" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Artist / Creator</label>
              <input value={artist} onChange={(e) => setArtist(e.target.value)} type="text" placeholder="e.g., Antara Sounds"
                className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 focus:border-[#0b3d33] font-bold transition-all shadow-inner focus:shadow-md" />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Sector / Category</label>
                <button 
                  type="button" 
                  onClick={runAiAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#0b3d33] bg-[#8CE0B7] px-2.5 py-1 rounded-md hover:bg-[#a3f0cb] transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  {isAnalyzing ? "Scanning..." : "Auto-Tag via AI"}
                </button>
              </div>
              
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-2xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 focus:border-[#0b3d33] font-bold cursor-pointer transition-all shadow-inner focus:shadow-md">
                <option value="Trending Songs">🔥 Trending Songs</option>
                <option value="Most Famous">⭐ Most Famous</option>
                <option value="Most Viewed">👁️ Most Viewed</option>
                <option value="New Releases">🚀 New Releases</option>
                <option value="Focus">🧠 Focus</option>
                <option value="Sleep">🌙 Sleep</option>
                <option value="Relax">🍃 Relax</option>
              </select>

              {aiData && (
                <div className="flex gap-2 mt-3">
                  {aiData.tags.map(tag => (
                    <span key={tag} className="text-[11px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200 font-bold shadow-sm">#{tag}</span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder="Briefly describe the session..."
                className="w-full px-4 py-3 bg-[#F8F5F0] border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 focus:border-[#0b3d33] font-bold transition-all shadow-inner focus:shadow-md" />
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {uploadMode === "file" ? (
              <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-[#F8F5F0] hover:bg-gray-50 transition-colors">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 cursor-pointer">
                  🎵 Upload Audio File(s)
                  <input id="audioInput" onChange={(e) => setAudioFiles(Array.from(e.target.files))} type="file" accept="audio/*" multiple
                    className="mt-3 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-[#0b3d33] hover:file:bg-gray-100 cursor-pointer shadow-sm border border-gray-200" />
                </label>
                {audioFiles.length > 0 && <p className="text-xs text-[#0b3d33] mt-3 font-black bg-white w-fit px-3 py-1 rounded-lg border border-gray-200 shadow-sm">{audioFiles.length} file(s) selected</p>}
              </div>
            ) : (
              <div className="p-5 border border-gray-200 rounded-2xl bg-[#F8F5F0] shadow-inner">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">🔗 Resource Platform</label>
                
                <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
                  {[
                    { id: 'youtube', icon: MonitorPlay, label: 'YouTube' },
                    { id: 'soundcloud', icon: Music, label: 'SoundCloud' },
                    { id: 'gdrive', icon: Cloud, label: 'G-Drive' },
                    { id: 'direct', icon: LinkIcon, label: 'Direct MP3' }
                  ].map(platform => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => setUrlSource(platform.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${urlSource === platform.id ? 'bg-[#0b3d33] text-white shadow-md' : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-200 shadow-sm'}`}
                    >
                      <platform.icon className="w-3.5 h-3.5" /> {platform.label}
                    </button>
                  ))}
                </div>

                <input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} type="url" placeholder={getUrlPlaceholder()}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 focus:border-[#0b3d33] font-bold transition-all shadow-sm" />
              </div>
            )}

            <div className="p-5 border-2 border-dashed border-gray-200 rounded-2xl bg-[#F8F5F0] hover:bg-gray-50 transition-colors">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 cursor-pointer">
                🖼️ Upload Cover Art (.jpg/png)
                <input id="imageInput" onChange={(e) => setImageFile(e.target.files[0])} type="file" accept="image/*"
                  className="mt-3 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-white file:text-[#0b3d33] hover:file:bg-gray-100 cursor-pointer shadow-sm border border-gray-200" />
              </label>
            </div>
          </div>

          <button type="submit" disabled={isUploading || isAnalyzing}
            className={`w-full py-4 text-white text-sm font-black rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${(isUploading || isAnalyzing) ? 'bg-[#0b3d33]/70 cursor-not-allowed' : 'bg-[#0b3d33] hover:bg-[#072a23] hover:shadow-xl'}`}>
            {isUploading ? "Processing & Uploading..." : "Publish to Antara"}
          </button>
        </form>
      </div>

      
      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Manage Uploaded Tracks</h3>
            <p className="text-xs text-gray-500 mt-0.5">Remove unwanted or outdated songs from your platform library.</p>
          </div>
          <span className="bg-[#0b3d33]/10 text-[#0b3d33] px-3 py-1 rounded-full text-xs font-black">
            {existingPrograms.length} Tracks Live
          </span>
        </div>

        {isLoadingPrograms ? (
          <div className="py-8 text-center text-xs font-bold text-gray-400 animate-pulse">Loading tracks library...</div>
        ) : existingPrograms.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-sm font-bold">
            No tracks uploaded yet. Use the form above to add your first session!
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {existingPrograms.map((program) => (
              <div key={program.id} className="flex items-center justify-between p-4 bg-[#F8F5F0] rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
                <div className="flex items-center gap-4 overflow-hidden">
                  <img src={program.image_url} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0 shadow-sm" />
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{program.title}</h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{program.artist || "Antara Sounds"} • <span className="text-[#0b3d33] font-bold">{program.topic}</span></p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProgram(program.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ml-4"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}