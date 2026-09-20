"use client";

import { useState } from "react";
import { FileArchive, FileSpreadsheet, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

export default function BulkUpload() {
  const [zipFile, setZipFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

 
  const mockCsvPreview = [
    { file: "track1_focus.mp3", title: "Deep Study Alpha", artist: "Antara Sounds", category: "Focus" },
    { file: "track2_sleep.mp3", title: "Midnight Rain", artist: "Antara Sounds", category: "Sleep" },
    { file: "track3_relax.mp3", title: "Morning Zen", artist: "Antara Sounds", category: "Relax" },
  ];

  const handleStartUpload = () => {
    setIsProcessing(true);
    setProgress(0);
    setUploadComplete(false);

    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  const resetForm = () => {
    setZipFile(null);
    setCsvFile(null);
    setUploadComplete(false);
    setProgress(0);
  };

  return (
    <div className="space-y-6">
      
     
      <div>
        <h2 className="text-2xl font-black text-gray-900">Bulk Content Ingestion</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Upload multiple tracks simultaneously using a ZIP file and CSV metadata mapping.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        
        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${zipFile ? 'border-[#0b3d33] bg-[#F8F5F0]' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
          <FileArchive className={`w-10 h-10 mb-4 ${zipFile ? 'text-[#0b3d33]' : 'text-gray-400'}`} />
          <h3 className="text-sm font-black text-gray-900 mb-1">{zipFile ? zipFile.name : 'Upload Audio Assets (.zip)'}</h3>
          <p className="text-xs font-medium text-gray-500 mb-4">Contains your MP3 files</p>
          <label className="cursor-pointer bg-[#0b3d33] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#072a23] transition-colors">
            {zipFile ? 'Change File' : 'Select ZIP File'}
            <input 
              type="file" 
              accept=".zip,.rar" 
              className="hidden" 
              onChange={(e) => setZipFile(e.target.files[0])} 
            />
          </label>
        </div>

        
        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${csvFile ? 'border-[#0b3d33] bg-[#F8F5F0]' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
          <FileSpreadsheet className={`w-10 h-10 mb-4 ${csvFile ? 'text-[#0b3d33]' : 'text-gray-400'}`} />
          <h3 className="text-sm font-black text-gray-900 mb-1">{csvFile ? csvFile.name : 'Upload Metadata (.csv)'}</h3>
          <p className="text-xs font-medium text-gray-500 mb-4">Maps filenames to Titles & Categories</p>
          <label className="cursor-pointer bg-[#0b3d33] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#072a23] transition-colors">
            {csvFile ? 'Change File' : 'Select CSV File'}
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={(e) => setCsvFile(e.target.files[0])} 
            />
          </label>
        </div>
      </div>

      
      {csvFile && !uploadComplete && !isProcessing && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="px-6 py-4 border-b border-gray-100 bg-[#F8F5F0]">
            <h3 className="text-sm font-black text-gray-900">Metadata Mapping Preview</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Please verify the columns match correctly before ingesting.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-white border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="px-6 py-3">Filename Mapping</th>
                  <th className="px-6 py-3">Track Title</th>
                  <th className="px-6 py-3">Artist</th>
                  <th className="px-6 py-3">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockCsvPreview.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-mono text-xs text-[#0b3d33]">{row.file}</td>
                    <td className="px-6 py-3 font-bold text-gray-900">{row.title}</td>
                    <td className="px-6 py-3 font-medium">{row.artist}</td>
                    <td className="px-6 py-3">
                      <span className="bg-[#8CE0B7]/20 text-[#0b3d33] px-2 py-1 rounded text-xs font-bold">{row.category}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-white">
            <button 
              onClick={handleStartUpload}
              disabled={!zipFile || !csvFile}
              className="w-full py-3 bg-[#0b3d33] text-white text-sm font-black rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UploadCloud className="w-5 h-5" /> Start Bulk Ingestion
            </button>
          </div>
        </div>
      )}

      
      {(isProcessing || uploadComplete) && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in-up">
          {uploadComplete ? (
            <div className="space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#8CE0B7] mx-auto" />
              <h3 className="text-xl font-black text-gray-900">Ingestion Complete</h3>
              <p className="text-sm font-medium text-gray-500">Successfully processed 3 tracks and mapped metadata.</p>
              <button 
                onClick={resetForm}
                className="mt-4 px-6 py-2 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Upload Another Batch
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md mx-auto">
              <h3 className="text-lg font-black text-[#0b3d33]">Processing Batch...</h3>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden relative">
                <div 
                  className="bg-[#0b3d33] h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs font-bold text-gray-500 flex justify-between">
                <span>Extracting MP3s</span>
                <span>{progress}%</span>
              </p>
            </div>
          )}
        </div>
      )}

      
      {zipFile && !csvFile && (
        <div className="flex items-center gap-3 bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          Please upload the corresponding .csv metadata file to continue.
        </div>
      )}

    </div>
  );
}