"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Key, Loader2, AlertTriangle, Users, Crown, Shield } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function UserManagement() {
  const [currentUser, setCurrentUser] = useState(null);
  const [team, setTeam] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [transferEmail, setTransferEmail] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const fetchTeamAndUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    setCurrentUser(myProfile);

    
    const { data: teamData, error: teamError } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_admin', true);
      
    if (teamError) console.error("Supabase Error (Team):", teamError);
    setTeam(teamData || []);

    
    const { data: allUsersData, error: allUsersError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false }); 
      
    if (allUsersError) console.error("Supabase Error (All Users):", allUsersError);
    setAllUsers(allUsersData || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchTeamAndUser();

    
    const channel = supabase
      .channel('user-management-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        
        fetchTeamAndUser();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRevoke = async (targetId) => {
    if (!window.confirm("Are you sure you want to revoke admin access for this user?")) return;
    
    setActionLoading(true);
    setStatus({ type: "", message: "" });

    const { data, error } = await supabase.rpc('safe_revoke_admin', { target_user_id: targetId });

    if (error) {
      setStatus({ type: "error", message: "A network error occurred." });
    } else if (data.success === false) {
      setStatus({ type: "error", message: data.message }); 
    } else {
      setStatus({ type: "success", message: data.message });
      fetchTeamAndUser();
    }
    setActionLoading(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferEmail.trim()) return;
    
    if (!window.confirm(`DANGER: Are you absolutely sure you want to transfer ownership to ${transferEmail}? You will lose ultimate control of Antara.`)) return;

    setActionLoading(true);
    setStatus({ type: "", message: "" });

    const cleanEmail = transferEmail.trim().toLowerCase();

    const { data, error } = await supabase.rpc('transfer_ownership', { new_owner_email: cleanEmail });

    if (error) {
      setStatus({ type: "error", message: "A network error occurred." });
    } else if (data.success === false) {
      setStatus({ type: "error", message: data.message });
    } else {
      setStatus({ type: "success", message: data.message });
      setTransferEmail("");
      fetchTeamAndUser();
    }
    setActionLoading(false);
  };

  if (loading) return <div className="p-8 flex justify-center w-full"><Loader2 className="h-8 w-8 animate-spin text-[#0b3d33]" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto pb-20">
      
     
      {status.message && (
        <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-lg animate-in slide-in-from-top-4 duration-300 ${status.type === 'error' ? 'bg-red-500 text-white shadow-red-500/20' : 'bg-[#0b3d33] text-white shadow-[#0b3d33]/20'}`}>
          {status.type === 'error' ? <AlertTriangle className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-[#8CE0B7] animate-pulse"></div>}
          {status.message}
        </div>
      )}

      
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden mb-12 transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        
        <div className="hidden md:grid grid-cols-[2fr_1fr_auto] gap-4 px-8 py-5 bg-gradient-to-r from-[#F8F5F0]/80 to-white border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <div>User Details</div>
          <div className="text-center">Status</div>
          <div className="text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-gray-50 p-2 md:p-0 md:divide-y-0">
          {team.map((member, index) => {
            const isSelf = member.id === currentUser?.id;
            const isOwner = member.is_owner;
            const disableRevoke = isSelf || isOwner;
            
            let displayName = member.username || member.display_name || member.email || 'Admin User';
            if (displayName === 'Friend' && member.email) {
              displayName = member.email.split('@')[0];
            }

            return (
              <div 
                key={member.id} 
                className="group flex flex-col md:grid md:grid-cols-[2fr_1fr_auto] gap-4 px-4 md:px-6 py-4 items-start md:items-center rounded-2xl hover:bg-[#F8F5F0]/50 transition-all duration-300 md:border-b border-transparent md:border-gray-50 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${isOwner ? 'bg-amber-100 text-amber-600' : 'bg-[#0b3d33]/10 text-[#0b3d33]'}`}>
                    {isOwner ? <Crown className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      {displayName}
                      {isSelf && <span className="text-[9px] bg-[#0b3d33] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">You</span>}
                    </p>
                    <p className="text-[11px] font-medium mt-0.5 text-gray-400 font-mono transition-colors group-hover:text-gray-600">
                      ID: {member.id.substring(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="flex justify-start md:justify-center w-full pl-14 md:pl-0">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 w-fit shadow-sm transition-all duration-300 group-hover:scale-105 ${isOwner ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isOwner ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></div>
                    {isOwner ? 'App Owner' : 'Admin'}
                  </div>
                </div>

                <div className="flex justify-start md:justify-end w-full pl-14 md:pl-0 mt-2 md:mt-0">
                  <button 
                    onClick={() => handleRevoke(member.id)}
                    disabled={disableRevoke || actionLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed text-red-600 bg-red-50 hover:bg-red-600 hover:text-white hover:shadow-[0_4px_15px_rgba(220,38,38,0.2)] active:scale-95"
                  >
                    Revoke Access
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

     
      {currentUser?.is_owner && (
        <div className="relative bg-gradient-to-br from-[#fff5f5] to-white rounded-[2rem] border-2 border-red-500/20 shadow-[0_8px_30px_rgba(239,68,68,0.08)] overflow-hidden mb-12 group transition-all hover:shadow-[0_8px_40px_rgba(239,68,68,0.15)] hover:border-red-500/40">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-[length:200%_100%] animate-pulse"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-red-500/10 rounded-full blur-[80px] group-hover:bg-red-500/20 transition-all duration-700 pointer-events-none"></div>

          <div className="relative p-6 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center animate-pulse shrink-0">
                <ShieldAlert className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-black text-xl md:text-2xl text-red-900 tracking-tight">Danger Zone: Transfer Ownership</h3>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Irreversible Action</p>
              </div>
            </div>
            
            <p className="text-sm font-medium text-red-900/80 mb-8 max-w-3xl leading-relaxed">
              Transferring ownership gives the buyer ultimate control of Antara. They will become the un-removable App Owner, and you will be downgraded to an Admin. <b className="text-red-700">The buyer must create a free Antara account using their email address before you can execute this transfer.</b>
            </p>

            <form onSubmit={handleTransfer} className="flex flex-col sm:flex-row gap-4 max-w-2xl relative z-10">
              <input 
                type="email" 
                required
                value={transferEmail}
                onChange={(e) => setTransferEmail(e.target.value)}
                placeholder="Buyer's registered email address" 
                className="flex-1 bg-white border-2 border-red-100 text-gray-900 rounded-xl py-3.5 px-5 text-sm font-bold outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/20 transition-all placeholder:text-gray-400 shadow-sm"
              />
              <button 
                type="submit"
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] active:scale-95 disabled:opacity-50 disabled:hover:shadow-none whitespace-nowrap"
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                Transfer App
              </button>
            </form>
          </div>
        </div>
      )}

      
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
        <div className="px-6 md:px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#F8F5F0]/80 to-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#0b3d33] flex items-center justify-center shadow-lg shadow-[#0b3d33]/20 shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-900 tracking-tight">Registered Users</h3>
              <p className="text-xs font-medium text-gray-500 mt-0.5">Complete database of all platform accounts</p>
            </div>
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-[#0b3d33] bg-[#0b3d33]/10 px-4 py-2 rounded-full border border-[#0b3d33]/10 w-fit">
            {allUsers.length} Total Users
          </span>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
          {allUsers.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <Users className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-sm font-bold text-gray-400">No users found in database.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50/50">
              {allUsers.map((user, index) => {
                let displayName = user.username || user.display_name || user.email || 'User';
                if (displayName === 'Friend' && user.email) {
                  displayName = user.email.split('@')[0];
                }

                return (
                  <div 
                    key={user.id} 
                    className="flex flex-col md:grid md:grid-cols-[1.5fr_2fr_1fr] gap-2 md:gap-4 px-4 md:px-6 py-4 items-start md:items-center rounded-2xl hover:bg-[#F8F5F0]/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                    style={{ animationDelay: `${(index % 10) * 50}ms` }}
                  >
                    <div className="w-full">
                      <p className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        {displayName}
                        {user.id === currentUser?.id && <span className="text-[9px] bg-[#0b3d33] text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">You</span>}
                      </p>
                      <p className="text-[11px] font-medium mt-1 text-gray-400 font-mono transition-colors hover:text-gray-600">
                        ID: {user.id}
                      </p>
                    </div>
                    
                    <div className="flex flex-col justify-center w-full">
                      <p className="text-sm font-bold text-gray-700 break-all">{user.email || 'No email associated'}</p>
                      {user.created_at && (
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                          Joined: {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-start md:justify-end w-full mt-2 md:mt-0">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-transform hover:scale-105 ${user.is_owner ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-amber-500/20' : user.is_admin ? 'bg-gradient-to-r from-[#0b3d33] to-[#145a4d] text-white shadow-[#0b3d33]/20' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                        {user.is_owner ? 'Owner' : user.is_admin ? 'Admin' : 'User'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}