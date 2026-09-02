"use client";
import { Search, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar({
  query,
  onQueryChange,
  user,
  onOpenAuth,
  onSignOut,
}) {
  return (
    <nav className="flex flex-col gap-4 bg-[#FAFAFA] px-6 py-4 md:flex-row md:items-center md:justify-between md:px-8">
      
      <div className="flex items-center justify-between w-full md:w-auto">
        <div className="flex items-center gap-3">
          <img 
            src="/antara-logo.svg" 
            alt="Antara Logo" 
            className="h-12 w-12 object-contain" 
          />
          <span className="text-2xl font-extrabold tracking-tight text-[#0b3d33]"> 
            ANTARA
          </span>
        </div>

       
        <div className="flex items-center gap-3 md:hidden">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm text-gray-600 border border-gray-100">
                <UserIcon className="h-4 w-4" />
              </div>
              <button onClick={onSignOut} className="text-gray-400 hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onOpenAuth} className="text-xs font-bold text-gray-600 px-2 py-1.5">
                Sign in
              </button>
              <button onClick={onOpenAuth} className="rounded-full bg-[#0b3d33] px-4 py-2 text-xs font-bold text-white shadow-sm">
                Create account
              </button>
            </div>
          )}
        </div>
      </div>

      
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search sessions or topics..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full rounded-full bg-white py-3 pl-12 pr-4 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-[#0b3d33]/50"
        />
      </div>

      
      <div className="hidden md:flex items-center gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-gray-700">{user.email?.split('@')[0] || 'User'}</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-gray-600 border border-gray-100">
              <UserIcon className="h-4 w-4" />
            </div>
            <button onClick={onSignOut} className="text-gray-400 hover:text-red-500 transition">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button onClick={onOpenAuth} className="text-sm font-bold text-gray-500 hover:text-gray-900">
              Sign in
            </button>
            <button onClick={onOpenAuth} className="rounded-full bg-[#0b3d33] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105">
              Create account
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}