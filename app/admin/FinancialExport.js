"use client";

import { useState } from "react";
import { FileText, Download, Calendar, IndianRupee, Users, TrendingUp, CheckCircle2 } from "lucide-react";

export default function FinancialExport() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);

  
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-31");

  const handleGenerate = () => {
    setIsGenerating(true);
    setReportReady(false);
    
    
    setTimeout(() => {
      setIsGenerating(false);
      setReportReady(true);
    }, 2000);
  };

  const handleDownload = () => {
    alert(`Downloading Financial_Statement_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="space-y-6">
      
      
      <div>
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#0b3d33]" /> Accounting & Financial Export
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-1">
          Generate professional revenue statements for taxes, investors, or accounting.
        </p>
      </div>

      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 justify-between items-end">
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Start Date</label>
            <div className="flex items-center gap-2 bg-[#F8F5F0] px-4 py-2.5 rounded-xl border border-gray-200">
              <Calendar className="w-4 h-4 text-[#0b3d33]" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">End Date</label>
            <div className="flex items-center gap-2 bg-[#F8F5F0] px-4 py-2.5 rounded-xl border border-gray-200">
              <Calendar className="w-4 h-4 text-[#0b3d33]" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm font-bold text-gray-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full md:w-auto px-8 py-3 text-white text-sm font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
            isGenerating ? 'bg-[#0b3d33]/70 cursor-not-allowed' : 'bg-[#0b3d33] hover:bg-[#072a23] hover:scale-[1.02]'
          }`}
        >
          {isGenerating ? "Compiling Data..." : "Generate Statement"}
        </button>

      </div>

      
      {reportReady && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
          
          <div className="p-6 border-b border-gray-100 bg-[#F8F5F0] flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-[#0b3d33]">Statement Preview</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Period: {startDate} to {endDate}</p>
            </div>
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" /> Calculated Successfully
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            
            <div className="border border-gray-100 p-4 rounded-xl">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                <IndianRupee className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
              <h4 className="text-2xl font-black text-gray-900">₹ 1,45,200</h4>
              <p className="text-xs text-gray-500 font-medium mt-2">After payment gateway fees</p>
            </div>

           
            <div className="border border-gray-100 p-4 rounded-xl">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">New Premium Subs</p>
              <h4 className="text-2xl font-black text-gray-900">145 Users</h4>
              <p className="text-xs text-gray-500 font-medium mt-2">92 Monthly, 53 Annual</p>
            </div>

            
            <div className="border border-gray-100 p-4 rounded-xl">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Streams</p>
              <h4 className="text-2xl font-black text-gray-900">824,050</h4>
              <p className="text-xs text-gray-500 font-medium mt-2">Top genre: Focus & Study</p>
            </div>

          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
            <button 
              onClick={handleDownload}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Download as CSV
            </button>
            <button 
              onClick={handleDownload}
              className="px-6 py-2.5 bg-[#0b3d33] text-white text-sm font-black rounded-xl shadow-sm hover:bg-[#072a23] transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Official PDF
            </button>
          </div>
        </div>
      )}

    </div>
  );
}