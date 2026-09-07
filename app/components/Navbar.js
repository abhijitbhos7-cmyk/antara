"use client";
import { Search, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

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
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();

  const SpotifyDropdown = ({ onClose }) => (
    <div className="absolute right-0 top-12 md:top-14 w-60 rounded-md bg-[#282828] p-1 shadow-2xl z-[400] text-[#e5e5e5] animate-in fade-in zoom-in-95 duration-100 font-medium text-sm border border-black/20">
      <button 
        onClick={() => { onClose(); onOpenAccount(); }}
        className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors"
      >
        Account <ExternalLink className="h-4 w-4 text-gray-400" />
      </button>
      <button 
        onClick={() => { onClose(); onOpenProfile(); }}
        className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors"
      >
        Profile
      </button>
      <button className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors">
        Recents
      </button>
      <button className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors">
        Upgrade to Premium <ExternalLink className="h-4 w-4 text-gray-400" />
      </button>
      <button className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors">
        Support <ExternalLink className="h-4 w-4 text-gray-400" />
      </button>
      <button className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors">
        Download <ExternalLink className="h-4 w-4 text-gray-400" />
      </button>
      <button 
        onClick={() => { onClose(); onOpenSettings(); }}
        className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors"
      >
        Settings
      </button>
      <div className="my-1 h-px w-full bg-white/10"></div>
      <button 
        onClick={() => { onClose(); onSignOut(); }}
        className="flex w-full items-center justify-between rounded-sm px-3 py-3 hover:bg-white/10 transition-colors"
      >
        Log out
      </button>
    </div>
  );

  return (
    <nav className="flex flex-col gap-4 bg-transparent px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8">
      
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3">
          <img src="/antara-logo.svg" alt="Antara Logo" className="h-12 w-12 object-contain" />
          <span className="text-2xl font-extrabold tracking-tight text-[#0b3d33]">ANTARA</span>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          {user ? (
            <div className="relative" ref={mobileMenuRef}>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b3d33] text-white font-bold shadow-md transition-all hover:scale-105 active:scale-95 ring-4 ring-transparent hover:ring-[#0b3d33]/10"
              >
                {initial}
              </button>
              {isMobileMenuOpen && <SpotifyDropdown onClose={() => setIsMobileMenuOpen(false)} />}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onOpenAuth} className="text-xs font-bold text-gray-600 px-2 py-1.5">Sign in</button>
              <button onClick={onOpenAuth} className="rounded-full bg-[#0b3d33] px-4 py-2 text-xs font-bold text-white shadow-sm">Create account</button>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full md:max-w-md z-10">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search sessions or topics..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-[#0b3d33]/50 border border-gray-100"
        />
      </div>

      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <div className="relative flex items-center" ref={desktopMenuRef}>
            <button 
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b3d33] text-white text-[15px] font-bold shadow-md transition-all hover:scale-105 active:scale-95 ring-4 ring-transparent hover:ring-[#0b3d33]/10"
            >
              {initial}
            </button>
            {isDesktopMenuOpen && <SpotifyDropdown onClose={() => setIsDesktopMenuOpen(false)} />}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={onOpenAuth} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Sign in</button>
            <button onClick={onOpenAuth} className="rounded-full bg-[#0b3d33] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 active:scale-95">Create account</button>
          </div>
        )}
      </div>
      
    </nav>
  );
}