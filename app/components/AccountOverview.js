import { X, Search, ChevronRight, Edit2, Clock, MapPin, CreditCard, Shield, LayoutList, Lock, LogIn, MonitorSpeaker, Trash2, LogOut as LogOutIcon, Sliders, HelpCircle, Bookmark } from "lucide-react";

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
      
     
      <div className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-8 py-4 bg-[#0b3d33] shadow-md">
        <div className="flex items-center gap-3">
          <img src="/antara-logo.svg" alt="Antara Logo" className="h-12 w-12 object-contain filter brightness-0 invert" />
          <span className="text-2xl font-extrabold tracking-tight text-white">ANTARA</span>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors active:scale-90"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

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