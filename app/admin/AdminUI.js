"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import DashboardOverview from "./DashboardOverview";
import AdminWorkspace from "./AdminWorkspace";
import { 
  Search, Bell, LayoutDashboard, LogOut, Settings, Camera, ChevronDown, 
  Upload, Users, CreditCard, Activity, Files, Link2, History, FileText, 
  Clock, MapPin, Command, Menu, X, DollarSign, UserPlus, Info, ShieldPlus, CheckCheck, Loader2, Waves 
} from "lucide-react"; 
import { createBrowserClient } from "@supabase/ssr";


export default function AdminUI({ profile, user }) {
  const [activeTab, setActiveTab] = useState("discover"); 
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("https://api.dicebear.com/9.x/avataaars/svg?seed=Admin");
  
  const [isMounted, setIsMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);
  
 
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [lifetimeRevenue, setLifetimeRevenue] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  
  const fetchFinancials = async () => {
    const { data: payments } = await supabase
      .from("payments")
      .select("amount, created_at")
      .eq("status", "completed");

    if (payments && payments.length > 0) {
      const lifetime = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      setLifetimeRevenue(lifetime);

      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const today = payments
        .filter((p) => new Date(p.created_at) >= startOfToday)
        .reduce((sum, p) => sum + Number(p.amount), 0);
      setTodayRevenue(today);
    }
  };

  useEffect(() => {
    const fetchRealNotifications = async () => {
      setIsLoadingNotifs(true);
      const notifs = [];

     
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentUsers) {
        recentUsers.forEach(u => {
          notifs.push({
            id: `usr-${u.id}`,
            type: 'user',
            title: 'New User Registered',
            message: `${u.username || u.display_name || u.email?.split('@')[0] || 'A listener'} connected to Antara.`,
            time: new Date(u.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            timestamp: new Date(u.created_at || Date.now()).getTime()
          });
        });
      }

     
      const { data: recentTracks } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentTracks) {
        recentTracks.forEach(t => {
          notifs.push({
            id: `trk-${t.id}`,
            type: 'alert', 
            title: 'New Content Published',
            message: `"${t.title}" added successfully.`,
            time: new Date(t.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
            timestamp: new Date(t.created_at || Date.now()).getTime()
          });
        });
      }

     
      const { data: dbNotifs } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (dbNotifs) {
        dbNotifs.forEach(n => {
          notifs.push({
            id: n.id,
            type: n.amount ? 'payment' : 'alert',
            title: n.title,
            message: n.message,
            time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: n.is_read,
            timestamp: new Date(n.created_at).getTime()
          });
        });
      }

     
      notifs.push({
        id: 'sug-1',
        type: 'alert',
        title: 'Plan Update Suggestion',
        message: "It's time to review and update your custom pricing tiers.",
        time: 'System',
        read: false,
        timestamp: Date.now() - 3600000
      });

      notifs.push({
        id: 'sug-2',
        type: 'admin',
        title: 'Team Management Suggestion',
        message: "Platform usage is growing! Consider adding a new team Admin.",
        time: 'System',
        read: false,
        timestamp: Date.now() - 7200000
      });

      notifs.sort((a, b) => b.timestamp - a.timestamp);
      setNotifications(notifs);
      setIsLoadingNotifs(false);
    };

    fetchRealNotifications();
    fetchFinancials();

   
    const channel = supabase
      .channel('admin-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'admin_notifications' }, (payload) => {
        const newNotif = {
          id: payload.new.id,
          type: payload.new.amount ? 'payment' : 'alert',
          title: payload.new.title,
          message: payload.new.message,
          time: new Date(payload.new.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          timestamp: new Date(payload.new.created_at).getTime()
        };
        
        setActiveToast(newNotif);
        setTimeout(() => setActiveToast(null), 6000);
        
        setNotifications(prev => [newNotif, ...prev].sort((a, b) => b.timestamp - a.timestamp));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'payments' }, () => {
        fetchFinancials(); 
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    
    await supabase.from('admin_notifications').update({ is_read: true }).eq('is_read', false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let displayName = profile?.username || profile?.display_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "Admin";
  if (displayName === 'Friend' && user?.email) {
    displayName = user.email.split('@')[0];
  }
  const isOwner = profile?.is_owner === true;

  useEffect(() => {
    setIsMounted(true); 
    const savedPic = localStorage.getItem("adminProfilePic");
    if (savedPic) setProfilePic(savedPic);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    if (!isMounted) return "Welcome";
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String); 
        localStorage.setItem("adminProfilePic", base64String); 
      };
      reader.readAsDataURL(file);
    }
  };

  const getHeaderTitle = () => {
    switch(activeTab) {
      case 'discover': return 'Platform Analytics';
      case 'content': return 'Content Upload';
      case 'bulk': return 'Bulk Ingestion';
      case 'ambience': return 'Ambience Studio';
      case 'team': return 'Manage Team';
      case 'plans': return 'Premium Plans';
      case 'health': return 'System Health';
      case 'monitor': return 'Link Monitor';
      case 'audit': return 'Audit Ledger';
      case 'finance': return 'Financial Export';
      default: return 'Workspace & Settings';
    }
  };

  const getNotifIcon = (type) => {
    switch(type) {
      case 'payment': return <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full"><DollarSign className="w-4 h-4" /></div>;
      case 'user': return <div className="bg-blue-100 text-blue-600 p-2 rounded-full"><UserPlus className="w-4 h-4" /></div>;
      case 'alert': return <div className="bg-amber-100 text-amber-600 p-2 rounded-full"><Info className="w-4 h-4" /></div>;
      case 'admin': return <div className="bg-purple-100 text-purple-600 p-2 rounded-full"><ShieldPlus className="w-4 h-4" /></div>;
      default: return <div className="bg-gray-100 text-gray-600 p-2 rounded-full"><Bell className="w-4 h-4" /></div>;
    }
  };

  const isWorkspaceTabActive = !['discover', 'ambience'].includes(activeTab);

  return (
    <div className="flex h-screen w-full bg-[#F0EDE6] overflow-hidden p-0 md:p-3 md:gap-3 font-sans text-gray-900 relative">
      
      
      {activeToast && (
        <div className="fixed top-6 right-8 z-[100] bg-[#041c17] text-white border border-[#8CE0B7]/50 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-[fade-in-up_0.3s_ease-out]">
          <div className="w-10 h-10 rounded-xl bg-[#8CE0B7]/20 flex items-center justify-center text-[#8CE0B7]">
            {activeToast.type === 'payment' ? <DollarSign className="w-5 h-5" /> : <Info className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#8CE0B7]">New Alert</span>
            </div>
            <p className="text-sm font-bold text-gray-100">{activeToast.title}</p>
          </div>
          <button onClick={() => setActiveToast(null)} className="text-gray-400 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      
      <div className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#F0EDE6] md:bg-transparent p-3 md:p-0 flex flex-col gap-3 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto hide-scrollbar`}>
        <div className="bg-[#0b3d33] rounded-3xl p-6 flex items-center justify-between shadow-md border border-black/5 shrink-0 h-[88px] transition-transform duration-300 hover:shadow-lg group relative overflow-hidden">
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out]"></div>
          <div className="flex items-center gap-3 relative z-10">
            <img src="/antara-logo.svg" alt="Antara Logo" className="h-8 w-8 filter brightness-0 invert transition-transform duration-500 group-hover:rotate-180" />
            <span className="text-xl font-black tracking-widest text-white uppercase">ANTARA</span>
          </div>
          <button className="md:hidden relative z-10 text-white/50 hover:text-white transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-[#0b3d33] rounded-3xl flex-1 flex flex-col shadow-md border border-black/5 py-6">
          <div className="px-6 flex items-center gap-4 mb-8">
            <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95" onClick={() => document.getElementById("profile-upload").click()}>
              <img src={profilePic} className="w-12 h-12 rounded-full border-2 border-[#8CE0B7]/50 bg-white object-cover shadow-sm transition-colors group-hover:border-[#8CE0B7]" alt="Admin" />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{displayName}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${isOwner ? 'bg-amber-400 shadow-[0_0_5px_#facc15]' : 'bg-[#8CE0B7] shadow-[0_0_5px_#8CE0B7] animate-pulse'}`}></span>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isOwner ? 'text-amber-400' : 'text-[#8CE0B7]'}`}>
                  {isOwner ? '👑 App Owner' : 'Online'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 overflow-y-auto hide-scrollbar">
            <p className="text-[10px] font-black text-white/40 mb-4 px-3 uppercase tracking-widest">Dashboard</p>
            
           
            <button 
              onClick={() => { setActiveTab("discover"); setIsWorkspaceOpen(false); setIsMobileMenuOpen(false); }} 
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-[0.98] group ${activeTab === 'discover' ? 'bg-white/10 text-white shadow-sm' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard className={`w-5 h-5 transition-all duration-300 ${activeTab === 'discover' ? 'text-[#8CE0B7]' : 'group-hover:text-[#8CE0B7] group-hover:scale-110'}`} /> 
              <span className="transition-transform duration-300 group-hover:translate-x-1">Analytics Overview</span>
            </button>

           
            <div className="pt-2">
              <button 
                onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)} 
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-[0.98] group ${isWorkspaceTabActive && !isWorkspaceOpen ? 'bg-white/5 text-white border border-white/10 shadow-inner' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <div className="flex items-center gap-4">
                  <Settings className={`w-5 h-5 transition-transform duration-300 group-hover:rotate-90 ${isWorkspaceTabActive ? 'text-[#8CE0B7]' : ''}`} /> 
                  <span className="transition-transform duration-300 group-hover:translate-x-1">Admin Workspace</span>
                </div>
                <div className={`transition-transform duration-300 ${isWorkspaceOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <ChevronDown className={`w-4 h-4 ${isWorkspaceOpen ? 'text-[#8CE0B7]' : ''}`} />
                </div>
              </button>

              <div 
                className="grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ gridTemplateRows: isWorkspaceOpen ? '1fr' : '0fr', opacity: isWorkspaceOpen ? 1 : 0 }}
              >
                <div className="overflow-hidden">
                  <div className="ml-6 pl-4 border-l-2 border-white/10 space-y-1 py-2 relative mt-2">
                    
                    
                    <div className="absolute left-[-2px] w-[2px] h-[36px] bg-[#8CE0B7] rounded-r-full transition-all duration-500 ease-out shadow-[0_0_8px_#8CE0B7]" 
                         style={{ top: activeTab === 'content' ? '8px' : activeTab === 'bulk' ? '48px' : activeTab === 'team' ? '88px' : activeTab === 'plans' ? '128px' : activeTab === 'health' ? '168px' : activeTab === 'monitor' ? '208px' : activeTab === 'audit' ? '248px' : activeTab === 'finance' ? '288px' : '-100px', opacity: isWorkspaceTabActive ? 1 : 0 }}>
                    </div>
                    
                    {[
                      { id: 'content', icon: Upload, label: 'Content Upload' },
                      { id: 'bulk', icon: Files, label: 'Bulk Ingestion' },
                      { id: 'team', icon: Users, label: 'Manage Team' },
                      { id: 'plans', icon: CreditCard, label: 'Premium Plans' },
                      { id: 'health', icon: Activity, label: 'System Health' },
                      { id: 'monitor', icon: Link2, label: 'Link Monitor' },
                      { id: 'audit', icon: History, label: 'Audit Ledger' },
                      { id: 'finance', icon: FileText, label: 'Financial Export' },
                    ].map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} 
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group ${activeTab === item.id ? 'text-[#0b3d33] bg-[#8CE0B7] shadow-md scale-[1.02]' : 'text-white/50 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}
                      >
                        <item.icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} /> 
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

           
            <div className="pt-2">
              <button 
                onClick={() => { setActiveTab("ambience"); setIsWorkspaceOpen(false); setIsMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-[0.98] group ${activeTab === 'ambience' ? 'bg-white/10 text-white shadow-sm' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
              >
                <Waves className={`w-5 h-5 transition-all duration-300 ${activeTab === 'ambience' ? 'text-[#8CE0B7]' : 'group-hover:text-[#8CE0B7] group-hover:scale-110'}`} /> 
                <span className="transition-transform duration-300 group-hover:translate-x-1">Ambience Studio</span>
              </button>
            </div>

          </nav>

          <div className="px-4 pt-4 border-t border-white/10 mt-auto">
            <Link href="/" className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 active:scale-95 group border border-transparent hover:border-red-500/20">
              <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Exit Vault
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col relative overflow-hidden bg-white md:rounded-[2rem] shadow-xl z-10 transition-all duration-500 border border-gray-100">
        <header className="h-[76px] md:h-[96px] w-full flex items-center justify-between px-4 md:px-8 lg:px-10 border-b border-gray-50 shrink-0 bg-white/95 backdrop-blur-md z-20 sticky top-0 transition-colors">
          <div className="flex items-center gap-3 md:gap-0 animate-[fade-in-up_0.4s_ease-out]">
            <button 
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-[#0b3d33] bg-[#F8F5F0] rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">
                {getGreeting()}, {displayName}
              </p>
              <h1 className="text-lg md:text-3xl font-black text-[#0b3d33] tracking-tight truncate max-w-[180px] sm:max-w-xs md:max-w-none">
                {getHeaderTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-gray-500 bg-[#F8F5F0] px-4 py-2.5 rounded-full border border-gray-100 shadow-inner hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#0b3d33]" /> Pune, IND</div>
              <div className="w-[1px] h-3 bg-gray-300"></div>
              <div className="flex items-center gap-1.5 w-[70px] justify-center">
                <Clock className="w-3.5 h-3.5 text-[#0b3d33]" />
                <span className="font-mono mt-0.5">{isMounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "..."}</span>
              </div>
            </div>

            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0b3d33] transition-colors z-10" />
              <input type="text" placeholder="Search..." className="w-48 focus:w-72 bg-[#F8F5F0] focus:bg-white text-gray-900 placeholder-gray-400 rounded-full py-2.5 pl-11 pr-12 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#0b3d33]/20 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) border border-transparent focus:border-gray-200 shadow-inner focus:shadow-lg" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center opacity-100 group-focus-within:opacity-0 transition-opacity duration-300 pointer-events-none">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400 shadow-sm"><Command className="w-3 h-3" /></kbd>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>
            
            
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2.5 md:p-3 transition-all duration-300 border shadow-sm rounded-xl md:rounded-2xl active:scale-95 group ${isNotifOpen ? 'bg-white border-gray-200 text-[#0b3d33] shadow-md' : 'bg-[#F8F5F0] border-transparent text-gray-400 hover:text-[#0b3d33] hover:bg-white hover:border-gray-200 hover:shadow-md hover:-translate-y-1'}`}
              >
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-red-500 border-2 border-white"></span>
                  </span>
                )}
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'group-hover:animate-[wiggle_1s_ease-in-out_infinite]' : ''}`} />
              </button>

              
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-[fade-in-up_0.2s_ease-out]">
                  
                  
                  <div className="bg-[#F8F5F0] px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-gray-900">Notifications & Real-Time Alerts</h3>
                      <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-wider">{unreadCount} Unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs font-bold text-[#0b3d33] hover:text-[#8CE0B7] transition-colors flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                        <CheckCheck className="w-3.5 h-3.5" /> Mark read
                      </button>
                    )}
                  </div>

                 
                  <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-50 hide-scrollbar">
                    {isLoadingNotifs ? (
                      <div className="p-8 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#0b3d33] mx-auto mb-2" />
                        <p className="text-xs font-bold text-gray-400">Loading real activity...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-5 flex gap-4 transition-colors hover:bg-gray-50 cursor-pointer ${notif.read ? 'opacity-60' : 'bg-white'}`}>
                          <div className="shrink-0 mt-0.5">
                            {getNotifIcon(notif.type)}
                          </div>
                          <div>
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <h4 className={`text-sm font-bold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h4>
                              {!notif.read && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"></span>}
                            </div>
                            <p className="text-xs font-medium text-gray-500 leading-relaxed mb-2">{notif.message}</p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-400">You're all caught up!</p>
                      </div>
                    )}
                  </div>

                  
                  <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                    <button onClick={() => { setActiveTab('audit'); setIsNotifOpen(false); }} className="text-xs font-black text-gray-500 hover:text-[#0b3d33] transition-colors uppercase tracking-widest">
                      View Audit Ledger
                    </button>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </header>

        <div key={activeTab} className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth animate-[fade-in-up_0.5s_cubic-bezier(0.16,1,0.3,1)]">
          
           {activeTab === 'discover' ? (
             <DashboardOverview 
               todayRevenue={todayRevenue} 
               lifetimeRevenue={lifetimeRevenue} 
             />
           ) : (
             <AdminWorkspace currentView={activeTab} />
           )}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(15px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes shine { 100% { left: 200%; } }
        @keyframes wiggle { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
      `}} />
    </div>
  );
}