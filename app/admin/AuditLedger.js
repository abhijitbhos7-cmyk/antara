"use client";

import { useState, useEffect } from "react";
import { History, Search, Filter, ShieldCheck, Download, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function AuditLedger() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
 
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const formattedLogs = data.map(log => ({
          id: `LOG-${String(log.id).substring(0, 5).toUpperCase()}`, 
          time: new Date(log.created_at).toLocaleString('en-IN', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }),
          user: log.actor_name,
          email: log.actor_email,
          action: log.action_performed,
          target: log.target_details,
          status: log.status,
          category: log.category
        }));
        setLogs(formattedLogs);
      } else {
       
        setLogs([]);
      }
      setIsLoading(false);
    };
    
    fetchLogs();

    
    const channel = supabase
      .channel('audit_logs_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, () => {
        fetchLogs(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      (log.action && log.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.target && log.target.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === "all" || log.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  
  const handleExportCSV = () => {
    const headers = ["Timestamp", "User", "Email", "Action Performed", "Target Details", "Status"];
    
    const csvRows = filteredLogs.map(log => 
      `"${log.time}","${log.user}","${log.email}","${log.action}","${log.target}","${log.status}"`
    );

    const csvString = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `antara_audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
     
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0b3d33]" /> Security Audit Ledger
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Immutable log of all system changes, content modifications, and team actions.
          </p>
        </div>
        
        <button 
          onClick={handleExportCSV}
          disabled={isLoading || logs.length === 0}
          className="shrink-0 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search logs by action, user, or target..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F8F5F0] text-gray-900 placeholder-gray-400 rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 transition-all border border-transparent focus:border-[#0b3d33]/30" 
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[#F8F5F0] px-3 py-2 rounded-xl border border-gray-100 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-sm font-bold text-gray-700 focus:outline-none cursor-pointer w-full"
            >
              <option value="all">All Actions</option>
              <option value="content">Content Updates</option>
              <option value="team">Team Management</option>
              <option value="security">Security Events</option>
            </select>
          </div>
        </div>

      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#F8F5F0] border-b border-gray-100 text-[#0b3d33] uppercase text-[11px] font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User / Actor</th>
                <th className="px-6 py-4">Action Performed</th>
                <th className="px-6 py-4">Target Details</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0b3d33] mx-auto mb-2" />
                    <p className="text-gray-500 font-medium">Loading ledger...</p>
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">{log.time}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{log.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{log.user}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{log.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#0b3d33] bg-[#0b3d33]/5 px-2.5 py-1 rounded-md text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.status === "Success" ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-600 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">
                    No logs found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}