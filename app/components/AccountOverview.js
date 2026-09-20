"use client";

import { 
  X, Search, ChevronRight, Edit2, Clock, MapPin, CreditCard, Shield, 
  LayoutList, Lock, LogIn, MonitorSpeaker, Trash2, LogOut as LogOutIcon, 
  Sliders, HelpCircle, Bookmark, User, ChevronDown, ArrowLeft, 
  CheckCircle2, Activity, HeartPulse 
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountOverview({ user, profile, onClose }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState("main");
  const [saveStatus, setSaveStatus] = useState("");

  const email = user?.email || "No email provided";
  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || email.split('@')[0];
  const tier = profile?.subscription_tier || 'free';

  const sections = [
    {
      title: "Account",
      items: [
        { icon: <Edit2 className="h-5 w-5 text-gray-400" />, text: "Edit personal info", onClick: () => setActiveView("personal-info") },
        { icon: <Clock className="h-5 w-5 text-gray-400" />, text: "Recover playlists", onClick: () => setActiveView("recover-playlists") },
      ]
    },
    {
      title: "Subscription & Payment",
      items: [
        { icon: <CreditCard className="h-5 w-5 text-gray-400" />, text: "Manage subscription", onClick: () => setActiveView("subscription") },
        { icon: <Shield className="h-5 w-5 text-gray-400" />, text: "Payment history", onClick: () => setActiveView("payment-history") },
        { icon: <Bookmark className="h-5 w-5 text-gray-400" />, text: "Redeem gift code", onClick: () => setActiveView("redeem") },
      ]
    },
    {
      title: "Security and privacy",
      items: [
        { icon: <LayoutList className="h-5 w-5 text-gray-400" />, text: "Connected health apps", onClick: () => setActiveView("connected-apps") },
        { icon: <Lock className="h-5 w-5 text-gray-400" />, text: "Account privacy", onClick: () => setActiveView("privacy") },
        { icon: <LogOutIcon className="h-5 w-5 text-gray-400" />, text: "Sign out everywhere", onClick: () => setActiveView("sign-out") },
      ]
    },
    {
      title: "Help",
      items: [
        { icon: <HelpCircle className="h-5 w-5 text-gray-400" />, text: "Antara support", onClick: () => setActiveView("support") },
      ]
    }
  ];

  const handleSimulateSave = (e) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    setTimeout(() => setSaveStatus("Profile updated successfully!"), 1000);
    setTimeout(() => setSaveStatus(""), 4000);
  };

  
  const SubPageLayout = ({ title, children }) => (
    <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-8 md:py-12 animate-in slide-in-from-right-8 duration-300">
      <button 
        onClick={() => setActiveView("main")} 
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0b3d33] transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Account overview
      </button>
      <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-8">{title}</h1>
      {children}
    </div>
  );

  return (
    <div className="absolute inset-0 z-[500] bg-white overflow-y-auto text-gray-900 flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      
     
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-3 bg-[#0b3d33] text-white shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onClose}>
          <img src="/antara-logo.svg" alt="Antara Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain filter brightness-0 invert" />
          <span className="text-xl md:text-2xl font-extrabold tracking-tight hidden sm:block text-white">ANTARA</span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden lg:flex items-center gap-8 mr-2 h-full">
            <a href="/premium" className="text-[15px] font-bold transition-colors text-white hover:text-green-200">Premium plans</a>
            <a href="#" className="text-[15px] font-bold hover:scale-105 transition-transform text-white">Support</a>
            <a href="#" className="text-[15px] font-bold hover:scale-105 transition-transform border-r border-white/30 pr-8 text-white">Download</a>
          </div>

          <div className="hidden md:block relative group py-2">
            <button className="flex items-center gap-2 hover:bg-white/10 py-1.5 px-2 pr-3 rounded-full transition-colors cursor-pointer text-white">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-white/30 transition-colors">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="font-bold text-[15px]">Profile</span>
            </button>
          </div>

          <button onClick={onClose} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 ml-2 sm:ml-0">
            <X className="h-7 w-7" />
          </button>
        </div>
      </header>

      
      {activeView === "main" && (
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 md:py-12 space-y-10 animate-in fade-in duration-300">
          
          {tier === 'free' && (
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0b3d33] to-[#1a6e59] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#0b3d33]/30 hover:-translate-y-1 cursor-default">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight text-white drop-shadow-md">
                  Get 12 months of Antara Premium at ₹799
                </h2>
                <p className="text-sm md:text-base font-medium text-white/80 mb-4 max-w-xl">
                  Enjoy ad-free focused sessions and lossless brainwave frequencies.
                </p>
              </div>
              <button onClick={() => { onClose(); router.push('/premium'); }} className="relative z-10 shrink-0 bg-white text-[#0b3d33] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
                Get Premium
              </button>
            </div>
          )}

          <div className="relative transition-all duration-300 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] rounded-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="What can I help with?"
              className="w-full bg-[#F8F5F0] border border-gray-200 focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33] text-gray-900 rounded-full py-4 pl-12 pr-16 font-medium outline-none transition-all shadow-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0b3d33] hover:bg-[#072a23] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors active:scale-95">
              Ask
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Your plan</h3>
              <p className="text-2xl font-black text-[#0b3d33] capitalize">Antara {tier}</p>
            </div>
            
            {tier === 'free' ? (
              <div onClick={() => { onClose(); router.push('/premium'); }} className="bg-gradient-to-br from-[#0b3d33] to-[#1C5E40] text-white rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:scale-[0.98] transition-all">
                 <LayoutList className="h-8 w-8 mb-2 opacity-80" />
                 <p className="font-bold text-lg">Join Premium</p>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
                 <CheckCircle2 className="h-8 w-8 mb-2 opacity-80" />
                 <p className="font-bold text-lg">Premium Active</p>
              </div>
            )}
          </div>

          <div className="space-y-8 pb-12">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold mb-4 tracking-tight text-gray-900">{section.title}</h2>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-gray-300">
                  {section.items.map((item, itemIndex) => (
                    <button 
                      key={itemIndex}
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <span className="font-bold text-sm text-gray-700">{item.text}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      

      {activeView === "personal-info" && (
        <SubPageLayout title="Edit personal info">
          {saveStatus && (
            <div className={`mb-6 p-4 rounded-lg font-bold text-sm ${saveStatus.includes('success') ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
              {saveStatus}
            </div>
          )}
          <form onSubmit={handleSimulateSave} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email address</label>
              <input type="email" defaultValue={email} className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none" disabled />
              <p className="text-xs text-gray-500 mt-1">To change your email, please contact support.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Username</label>
              <input type="text" defaultValue={username} className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Primary Wellness Goal</label>
              <select defaultValue={profile?.focus_goal || 'Focus'} className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] outline-none">
                <option>Focus</option>
                <option>Sleep</option>
                <option>Calm</option>
                <option>Spirituality</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setActiveView("main")} className="px-6 py-3 rounded-full font-bold text-gray-700 hover:bg-gray-100 transition-colors">Cancel</button>
              <button type="submit" className="px-8 py-3 rounded-full font-bold bg-[#0b3d33] text-white hover:bg-[#072a23] transition-colors shadow-md">Save profile</button>
            </div>
          </form>
        </SubPageLayout>
      )}

      {activeView === "recover-playlists" && (
        <SubPageLayout title="Recover playlists">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No deleted playlists</h3>
            <p className="text-gray-500 text-sm">Playlists you delete will appear here for 90 days. You haven't deleted any playlists recently.</p>
          </div>
        </SubPageLayout>
      )}

      {activeView === "subscription" && (
        <SubPageLayout title="Manage subscription">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-6">
            <div className="bg-[#0b3d33] p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Antara {tier}</h3>
              <p className="text-white/80 text-sm">Your current plan.</p>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6">
                {tier === 'free' ? "You are currently on the free, ad-supported tier. Upgrade to remove ads and unlock lossless brainwave frequencies." : "Thank you for being a premium member. Your peace is uninterrupted."}
              </p>
              <button onClick={() => { onClose(); router.push('/premium'); }} className="w-full sm:w-auto px-8 py-3 rounded-full font-bold border-2 border-[#0b3d33] text-[#0b3d33] hover:bg-[#0b3d33] hover:text-white transition-colors">
                {tier === 'free' ? "View Premium Plans" : "Change Plan"}
              </button>
            </div>
          </div>
        </SubPageLayout>
      )}

      {activeView === "connected-apps" && (
        <SubPageLayout title="Connected health apps">
          <p className="text-gray-600 mb-6">Connect Antara to your device's health apps to track mindful minutes and sync sleep data automatically.</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500"><HeartPulse className="w-6 h-6" /></div>
                <div><p className="font-bold text-gray-900">Apple Health</p><p className="text-xs text-gray-500">Sync Mindful Minutes</p></div>
              </div>
              <button className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50">Connect</button>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Activity className="w-6 h-6" /></div>
                <div><p className="font-bold text-gray-900">Google Fit</p><p className="text-xs text-gray-500">Sync Meditation Data</p></div>
              </div>
              <button className="px-4 py-2 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50">Connect</button>
            </div>
          </div>
        </SubPageLayout>
      )}

      {activeView === "privacy" && (
        <SubPageLayout title="Account privacy">
          <div className="space-y-6">
            <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl">
              <div className="pr-6">
                <p className="font-bold text-gray-900">Public listening activity</p>
                <p className="text-xs text-gray-500 mt-1">Allow friends to see what meditation sessions you are listening to.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-gray-200 border-2 border-transparent">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-0" />
              </div>
            </div>
            <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl">
              <div className="pr-6">
                <p className="font-bold text-gray-900">Share anonymous wellness data</p>
                <p className="text-xs text-gray-500 mt-1">Help us improve brainwave frequency recommendations by sharing anonymous usage stats.</p>
              </div>
              <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full bg-[#0b3d33] border-2 border-transparent">
                <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow translate-x-5" />
              </div>
            </div>
          </div>
        </SubPageLayout>
      )}

      
      {["payment-history", "redeem", "sign-out", "support"].includes(activeView) && (
        <SubPageLayout title={activeView.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-500 text-sm">This feature is currently being built for the Antara platform.</p>
          </div>
        </SubPageLayout>
      )}

    </div>
  );
}