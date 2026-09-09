"use client";
import { Search, ExternalLink, ArrowDownCircle, Bell, Users } from "lucide-react";
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
  const desktopMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setIsDesktopMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const initial = username.charAt(0).toUpperCase();

  const SpotifyDropdown = ({ onClose }) => (
    <div className="absolute right-0 top-12 w-56 rounded-md bg-white p-1 shadow-2xl z-[400] text-gray-800 animate-in fade-in zoom-in-95 duration-100 font-medium text-sm border border-gray-100">
      <button onClick={() => { onClose(); onOpenAccount(); }} className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Account <ExternalLink className="h-4 w-4 text-gray-400"/>
      </button>
      <button onClick={() => { onClose(); onOpenProfile(); }} className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Profile
      </button>
      <button onClick={() => { onClose(); onOpenSettings(); }} className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Settings
      </button>
      <div className="my-1 h-px w-full bg-gray-100"></div>
      <button onClick={() => { onClose(); onSignOut(); }} className="flex w-full items-center justify-between rounded-sm px-3 py-2.5 hover:bg-gray-100 transition-colors">
        Log out
      </button>
    </div>
  );

  return (
    <nav className="flex items-center justify-between bg-transparent px-6 py-3 md:px-8 gap-4 w-full">
      
      {/* MOBILE ONLY: Logo */}
      <div className="flex items-center gap-2 md:hidden shrink-0">
        <img src="/antara-logo.svg" alt="Antara Logo" className="h-8 w-8 object-contain" />
      </div>

      {/* LEFT SIDE: Search Bar Only */}
      <div className="flex items-center gap-3 w-full max-w-[420px] flex-1 md:flex-none md:ml-0">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full rounded-full bg-[#F8F5F0] hover:bg-white hover:border-[#0b3d33]/30 py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-[#0b3d33]/50 border border-gray-200"
          />
        </div>
      </div>

      {/* RIGHT SIDE: Spotify Buttons & Profile */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        
        {/* New Spotify-Style Action Buttons (Desktop Only) */}
        <div className="hidden lg:flex items-center gap-2 mr-2">
          
          <button 
            onClick={onOpenAccount}
            className="flex items-center justify-center rounded-full bg-white hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all text-[13px] font-bold text-gray-900 px-4 py-1.5 shadow-sm border border-gray-200"
          >
            Explore Premium
          </button>
          
          <button 
            onClick={onOpenAccount}
            className="flex items-center gap-1.5 rounded-full hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all text-[13px] font-bold text-gray-600 px-3 py-1.5"
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

        {/* User Profile Bubble */}
        {user ? (
          <div className="relative flex items-center" ref={desktopMenuRef}>
            <button 
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b3d33] text-white text-[14px] font-bold shadow-md transition-all hover:scale-105 active:scale-95 ring-4 ring-transparent hover:ring-[#0b3d33]/10"
            >
              {initial}
            </button>
            {isDesktopMenuOpen && <SpotifyDropdown onClose={() => setIsDesktopMenuOpen(false)} />}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={onOpenAuth} className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Sign up</button>
            <button onClick={onOpenAuth} className="rounded-full bg-[#0b3d33] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105 active:scale-95">Log in</button>
          </div>
        )}
      </div>
      
    </nav>
  );
}