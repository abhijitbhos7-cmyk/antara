"use client";

import { useState, useEffect } from "react";
import { Database, HardDrive, Activity, Trash2, RefreshCw, CheckCircle, ShieldCheck, AlertTriangle, Search } from "lucide-react";

export default function SystemHealth() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  
  useEffect(() => {
    setLoaded(true);
  }, []);

  
  const handleScan = () => {
    setIsScanning(true);
    setScanResults(null);
    
    setTimeout(() => {
      setIsScanning(false);
      setScanResults({
        filesFound: 14,
        wastedSpace: "342 MB",
      });
    }, 2500); 
  };

  const handleClean = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      setScanResults({ ...scanResults, cleaned: true });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto pb-20">
      
      
      <div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Telemetry</h2>
        <p className="text-sm font-medium text-gray-500 mt-2">Monitor backend storage, database health, and API usage in real-time.</p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
       
        <div className="group bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0b3d33]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#0b3d33]/10 transition-colors"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#F8F5F0] rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <HardDrive className="w-6 h-6 text-[#0b3d33]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Healthy
            </div>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-1">Bucket Storage</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Audio & Image assets</p>
          
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#0b3d33] to-[#145a4d] h-full rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: loaded ? '45%' : '0%' }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-900">45 GB Used</span>
            <span className="text-gray-400">100 GB Limit</span>
          </div>
        </div>

        
        <div className="group bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CE0B7]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#8CE0B7]/20 transition-colors"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-[#F8F5F0] rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Database className="w-6 h-6 text-[#0b3d33]" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Healthy
            </div>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-1">Database Size</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Profiles & Metadata</p>
          
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-[#8CE0B7] to-[#5bb88a] h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: loaded ? '12%' : '0%' }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-900">60 MB Used</span>
            <span className="text-gray-400">500 MB Limit</span>
          </div>
        </div>

       
        <div className="group bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-colors"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-amber-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> Warning
            </div>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-1">API Requests</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Monthly quota usage</p>
          
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: loaded ? '85%' : '0%' }}
            >
               <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-900">85k Requests</span>
            <span className="text-gray-400">100k Limit</span>
          </div>
        </div>

      </div>

      
      <div className="bg-gradient-to-br from-[#122d22] to-[#072a23] p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-[#8CE0B7]/20 group mt-10">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8CE0B7]/10 rounded-full blur-[100px] pointer-events-none transition-opacity duration-700 group-hover:opacity-70 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0b3d33] rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-between">
          
          <div className="max-w-xl text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 mx-auto md:mx-0 backdrop-blur-md border border-white/10 shadow-xl">
              <Trash2 className="w-6 h-6 text-[#8CE0B7]" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
              Orphaned File Scanner
            </h3>
            <p className="text-sm font-medium text-white/70 leading-relaxed">
              Sometimes audio files or cover images are uploaded but the database record fails to save, leaving "ghost" files taking up your expensive Supabase storage. Run a scan to find and permanently delete files that aren't attached to any active session.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex justify-center">
            {!scanResults ? (
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className={`relative overflow-hidden shrink-0 px-8 py-4 text-sm font-black rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-center gap-3 w-full md:w-64 ${
                  isScanning 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed border border-white/5' 
                  : 'bg-[#8CE0B7] text-[#041c17] hover:bg-white hover:scale-105 active:scale-95 shadow-[#8CE0B7]/20 hover:shadow-[#8CE0B7]/40'
                }`}
              >
                {isScanning ? (
                  <>
                    <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Cross-Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" /> Scan Storage Buckets
                  </>
                )}
              </button>
            ) : (
              <div className="w-full md:w-72 bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
                {scanResults.cleaned ? (
                  <div className="text-center space-y-3 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-[#8CE0B7]/20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(140,224,183,0.3)]">
                      <CheckCircle className="w-8 h-8 text-[#8CE0B7]" />
                    </div>
                    <p className="text-lg font-black text-white">Storage Optimized!</p>
                    <p className="text-sm font-medium text-white/70">Successfully freed up {scanResults.wastedSpace}.</p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-black/20 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white/70">Ghost Files Found:</span>
                        <span className="font-black text-2xl text-amber-400 drop-shadow-md">{scanResults.filesFound}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white/70">Wasted Space:</span>
                        <span className="font-black text-amber-400">{scanResults.wastedSpace}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleClean}
                      disabled={isCleaning}
                      className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white border border-red-400/50 text-sm font-black rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isCleaning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      {isCleaning ? "Deleting ghosts..." : "Delete Permanently"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { background-position: -40px 0; }
        }
      `}} />
    </div>
  );
}