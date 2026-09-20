"use client";

import { useState } from "react";
import { ShieldAlert, RefreshCw, AlertTriangle, XCircle, ExternalLink, SearchCheck } from "lucide-react";

export default function LinkMonitor() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState("Never");
  const [issues, setIssues] = useState(null);

  
  const runHealthScan = () => {
    setIsScanning(true);
    setIssues(null);

    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime("Just now");
      
      setIssues([
        { id: "TRK-892", title: "Lofi Study Beats 2024", type: "YouTube URL", error: "Video marked as Private", severity: "high" },
        { id: "TRK-104", title: "Deep Sleep Rain Sounds", type: "YouTube URL", error: "Copyright Takedown", severity: "high" },
        { id: "TRK-551", title: "Morning Acoustic", type: "Direct MP3", error: "File not found in Storage Bucket", severity: "medium" },
      ]);
    }, 3000); 
  };

  const resolveIssue = (id) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  return (
    <div className="space-y-6">
      
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#0b3d33]" /> Automated Link Monitor
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Detect dead YouTube links and broken audio files before users complain.
          </p>
        </div>
        
        <button 
          onClick={runHealthScan}
          disabled={isScanning}
          className={`shrink-0 px-6 py-3 text-white text-sm font-black rounded-xl shadow-md transition-all flex items-center gap-2 ${
            isScanning ? 'bg-[#0b3d33]/70 cursor-not-allowed' : 'bg-[#0b3d33] hover:bg-[#072a23] hover:scale-[1.02]'
          }`}
        >
          {isScanning ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Crawling Database...</>
          ) : (
            "Run Full Catalog Scan"
          )}
        </button>
      </div>

      
      {!isScanning && lastScanTime !== "Never" && issues && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 font-bold text-sm ${issues.length > 0 ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}>
          {issues.length > 0 ? <AlertTriangle className="w-5 h-5" /> : <SearchCheck className="w-5 h-5" />}
          {issues.length > 0 
            ? `Scan complete: Found ${issues.length} critical issues that need your attention.` 
            : `Scan complete: 100% of your audio catalog is healthy and online!`}
        </div>
      )}

      
      {issues && issues.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-[#F8F5F0] border-b border-gray-100 text-[#0b3d33] uppercase text-[11px] font-black tracking-wider">
                <tr>
                  <th className="px-6 py-4">Track Info</th>
                  <th className="px-6 py-4">Source Type</th>
                  <th className="px-6 py-4">Detected Error</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{issue.title}</p>
                      <p className="text-xs text-gray-400 font-mono mt-1">ID: {issue.id}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-500">
                      {issue.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-md text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" /> {issue.error}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors inline-flex items-center justify-center">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => resolveIssue(issue.id)}
                        className="px-4 py-2 bg-[#0b3d33] text-white hover:bg-[#072a23] rounded-lg text-xs font-bold transition-colors"
                      >
                        Update Link
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {!issues && !isScanning && (
        <div className="bg-[#F8F5F0] border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <SearchCheck className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-black text-gray-900 mb-1">Catalog Ready for Inspection</h3>
          <p className="text-sm font-medium text-gray-500 max-w-md">
            Click the "Run Full Catalog Scan" button above to check all your database links against YouTube and your Storage Buckets.
          </p>
        </div>
      )}

    </div>
  );
}