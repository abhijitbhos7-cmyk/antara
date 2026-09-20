"use client";
import { Search, ExternalLink, ArrowDownCircle, Bell, Users, Crown, Sparkles, GraduationCap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({
  query,
  onQueryChange,
  user,
  profile,
  onOpenAuth,
  onSignOut,
  onOpenAccount,
  onOpenProfile,
  onOpenSettings,
}) {
  const router = useRouter();
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);

  
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch(err => console.error('Service Worker Failed', err));
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); 
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    function handleClickOutside(event) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("App is already installed or your browser doesn't support PWA installation.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();
  const tier = profile?.subscription_tier || 'free';

  const SpotifyDropdown = ({ onClose }) => (
    <div className="absolute right-0 top-12 w-64 rounded-xl bg-white p-2 shadow-2xl z-[400] text-gray-800 animate-in fade-in zoom-in-95 duration-100 font-medium text-sm border border-gray-100">
      
      <div className="px-3 py-3 mb-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-lg">
        <span className="font-bold text-gray-900 truncate pr-2">{username}</span>
        {tier === 'platinum' && <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md"><Crown className="w-3 h-3"/> VIP</span>}
        {tier === 'standard' && <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-[#0b3d33]/10 text-[#0b3d33] px-2 py-1 rounded-md"><Sparkles className="w-3 h-3"/> Premium</span>}
        {tier === 'student' && <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-2 py-1 rounded-md"><GraduationCap className="w-3 h-3"/> Student</span>}
        {tier === 'free' && <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-1 rounded-md">Free</span>}
      </div>

      <button onClick={() => { onClose(); onOpenAccount(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Account <ExternalLink className="h-4 w-4 text-gray-400"/>
      </button>
      <button onClick={() => { onClose(); onOpenProfile(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Profile
      </button>
      <button onClick={() => { onClose(); onOpenSettings(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Settings
      </button>
      <div className="my-1 h-px w-full bg-gray-100"></div>
      <button onClick={() => { onClose(); onSignOut(); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 hover:red-50 hover:text-red-600 transition-colors">
        Log out
      </button>
    </div>
  );

  return (
    <nav className="flex items-center justify-between bg-transparent px-4 py-3 md:px-8 gap-3 md:gap-4 w-full">
      <div className="flex items-center gap-2 md:hidden shrink-0">
        <img src="/antara-logo.svg" alt="Antara Logo" className="h-8 w-8 object-contain" />
      </div>

      <div className="flex items-center gap-3 w-full max-w-[420px] flex-1 min-w-0 md:flex-none md:ml-0">
        <div className="relative w-full">
          <Search className="absolute left-3 md:left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-full bg-[#F8F5F0] hover:bg-white hover:border-[#0b3d33]/30 py-2 md:py-2.5 pl-9 md:pl-10 pr-4 text-xs md:text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-[#0b3d33]/50 border border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <div className="hidden lg:flex items-center gap-2 mr-2">
          
          {tier === 'free' && (
            <button 
             onClick={() => router.push('/premium')}
              className="flex items-center justify-center rounded-full bg-white hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-[13px] font-bold text-gray-900 px-4 py-1.5 shadow-sm border border-gray-200"
            >
              Explore Premium
            </button>
          )}

          
          <button 
            onClick={handleInstallClick}
            className={`flex items-center gap-1.5 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all text-[13px] font-bold px-3 py-1.5 ${isInstallable ? 'text-[#0b3d33] bg-[#0b3d33]/10' : 'text-gray-600'}`}
          >
            <ArrowDownCircle className="h-4 w-4" /> Install App
          </button>
          
          <button className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-500 transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          
          <button className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100 hover:text-gray-900 text-gray-500 transition-colors">
            <Users className="h-4 w-4" />
          </button>
        </div>

        {user ? (
          <div className="relative flex items-center" ref={desktopMenuRef}>
            <button 
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#0b3d33] text-white text-[14px] font-bold shadow-md transition-all hover:scale-105 active:scale-95 ring-2 ${tier === 'platinum' ? 'ring-yellow-500 ring-offset-2' : 'ring-transparent hover:ring-[#0b3d33]/10'}`}
            >
              {initial}
            </button>
            {isDesktopMenuOpen && <SpotifyDropdown onClose={() => setIsDesktopMenuOpen(false)} />}
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={onOpenAuth} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Sign up</button>
            <button onClick={onOpenAuth} className="rounded-full bg-[#0b3d33] px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-bold text-white shadow-md transition hover:scale-105 active:scale-95">Log in</button>
          </div>
        )}
      </div>
    </nav>
  );
}