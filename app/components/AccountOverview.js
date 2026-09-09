import { X, Search, ChevronRight, Edit2, Clock, MapPin, CreditCard, Shield, LayoutList, Lock, LogIn, MonitorSpeaker, Trash2, LogOut as LogOutIcon, Sliders, HelpCircle, Bookmark, User, ChevronDown } from "lucide-react";

export default function AccountOverview({ user, profile, onClose }) {
  const email = user?.email || "No email provided";
  const username = profile?.username || user?.user_metadata?.username || user?.user_metadata?.name || email.split('@')[0];

  const sections = [
    {
      title: "Account",
      items: [
        { icon: <Edit2 className="h-5 w-5 text-gray-400" />, text: "Edit personal info", onClick: () => {} },
        { icon: <Clock className="h-5 w-5 text-gray-400" />, text: "Recover playlists", onClick: () => {} },
        { icon: <MapPin className="h-5 w-5 text-gray-400" />, text: "Address", onClick: () => {} },
      ]
    },
    {
      title: "Payment",
      items: [
        { icon: <CreditCard className="h-5 w-5 text-gray-400" />, text: "Payment history", onClick: () => {} },
        { icon: <Shield className="h-5 w-5 text-gray-400" />, text: "Saved payment cards", onClick: () => {} },
        { icon: <Bookmark className="h-5 w-5 text-gray-400" />, text: "Redeem", onClick: () => {} },
      ]
    },
    {
      title: "Security and privacy",
      items: [
        { icon: <LayoutList className="h-5 w-5 text-gray-400" />, text: "Manage apps", onClick: () => {} },
        { icon: <Lock className="h-5 w-5 text-gray-400" />, text: "Account privacy", onClick: () => {} },
        { icon: <LogIn className="h-5 w-5 text-gray-400" />, text: "Login methods", onClick: () => {} },
        { icon: <MonitorSpeaker className="h-5 w-5 text-gray-400" />, text: "Set device password", onClick: () => {} },
        { icon: <Trash2 className="h-5 w-5 text-gray-400" />, text: "Delete account", onClick: () => {} },
        { icon: <LogOutIcon className="h-5 w-5 text-gray-400" />, text: "Sign out everywhere", onClick: () => {} },
      ]
    },
    {
      title: "Advertising",
      items: [
        { icon: <Sliders className="h-5 w-5 text-gray-400" />, text: "Ad preferences", onClick: () => {} },
      ]
    },
    {
      title: "Help",
      items: [
        { icon: <HelpCircle className="h-5 w-5 text-gray-400" />, text: "Antara support", onClick: () => {} },
      ]
    }
  ];

  return (
    <div className="absolute inset-0 z-[500] bg-white overflow-y-auto text-gray-900 flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      
      
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-3 bg-[#0b3d33] text-white shadow-md">
        
        
        <div className="flex items-center gap-3 cursor-pointer" onClick={onClose}>
          <img src="/antara-logo.svg" alt="Antara Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain filter brightness-0 invert" />
          <span className="text-xl md:text-2xl font-extrabold tracking-tight hidden sm:block text-white">ANTARA</span>
        </div>

       
        <div className="flex items-center gap-4 sm:gap-6">
          
          
          <div className="hidden lg:flex items-center gap-8 mr-2 h-full">
            
            
            <div className="relative group py-4">
              <a href="#" className="text-[15px] font-bold transition-colors text-white hover:text-green-200">Premium plans</a>
              
              
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-[340px] bg-[#282828] rounded-md shadow-2xl p-2 border border-[#3e3e3e]">
                  
                  <div className="p-4 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                    <h4 className="text-white font-bold mb-1 text-base">Premium Standard</h4>
                    <p className="text-gray-400 text-sm">Your music. Your way. Everywhere - 1 account.</p>
                  </div>
                  
                  <div className="p-4 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                    <h4 className="text-white font-bold mb-1 text-base">Premium Platinum</h4>
                    <p className="text-gray-400 text-sm">Listen on a whole new level - Up to 3 accounts.</p>
                  </div>
                  
                  <div className="p-4 hover:bg-white/10 rounded-md cursor-pointer transition-colors">
                    <h4 className="text-white font-bold mb-1 text-base">Premium Student</h4>
                    <p className="text-gray-400 text-sm">1 account - Discount for eligible students.</p>
                  </div>

                </div>
              </div>
            </div>

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
              <ChevronDown className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:rotate-180" />
            </button>

            
            <div className="absolute right-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="w-44 bg-white rounded-md shadow-[0_16px_40px_rgba(0,0,0,0.3)] relative mt-2">
                
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white rotate-45 rounded-tl-sm shadow-[-4px_-4px_8px_rgba(0,0,0,0.05)] z-0"></div>
                
                <div className="relative z-10 flex flex-col py-1 bg-white rounded-md overflow-hidden">
                  <button className="text-left px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-100 hover:text-[#0b3d33] transition-colors">Account</button>
                  <button className="text-left px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-100 hover:text-[#0b3d33] transition-colors">Log out</button>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 ml-2 sm:ml-0"
          >
            <X className="h-7 w-7" />
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 md:py-12 space-y-10">
        
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0b3d33] to-[#1a6e59] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#0b3d33]/30 hover:-translate-y-1 cursor-default">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight text-white drop-shadow-md">
              Get 12 months of Antara Premium at ₹799
            </h2>
            <p className="text-sm md:text-base font-medium text-white/80 mb-4 max-w-xl">
              Equivalent to ₹66.59/month. Limited time offer.<br />
              Enjoy ad-free focused sessions with Antara Premium.
            </p>
            <p className="text-xs text-white/60">Limited time offer. Limited Eligibility. <span className="underline cursor-pointer hover:text-white transition-colors">Terms Apply.</span></p>
          </div>
          <button className="relative z-10 shrink-0 bg-white text-[#0b3d33] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
            Get Premium
          </button>
        </div>

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
        <p className="text-xs font-medium text-gray-500 mt-2">Your search is powered by AI.</p>

        <div className="grid md:grid-cols-2 gap-4">
          
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:bg-white hover:border-gray-200 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-[0_12px_25px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Your plan</h3>
            <p className="text-2xl font-black text-gray-900 group-hover:text-[#0b3d33] transition-colors">Antara Free</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#0b3d33] to-[#1C5E40] text-white rounded-xl p-6 flex flex-col items-center justify-center text-center hover:opacity-95 transition-all duration-300 cursor-pointer shadow-lg shadow-[#0b3d33]/20 hover:shadow-2xl hover:shadow-[#0b3d33]/40 hover:-translate-y-0.5 active:scale-[0.98]">
             <LayoutList className="h-8 w-8 mb-2 opacity-80" />
             <p className="font-bold text-lg">Join Premium</p>
          </div>
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
    </div>
  );
}