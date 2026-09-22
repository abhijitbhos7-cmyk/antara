"use client";

import { Check, ArrowLeft, Home, Library, Bookmark, Plus, Mic, Timer, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function PremiumPage() {
  const router = useRouter();
  const [prices, setPrices] = useState({ 
    monthly: 139, yearly: 299, student: 69,
    standard_name: "Standard", standard_desc: "₹139 / month", standard_features: ['1 Standard account', 'Download to listen offline', 'Highest audio quality (~320kbps)', 'Cancel anytime'],
    platinum_name: "Platinum", platinum_desc: "₹299 / year", platinum_features: ['Up to 3 Platinum accounts', 'Lossless audio quality (24-bit)', 'Your personal AI DJ', 'AI playlist creation', 'Cancel anytime'],
    student_name: "Student", student_desc: "₹69 / month", student_features: ['1 verified Standard account', 'Download to listen offline', 'Cancel anytime'],
    custom_plans: []
  });
  
  useEffect(() => {
    const fetchPrices = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data } = await supabase.from('pricing').select('*').eq('id', 1).single();
      if (data) {
        setPrices({ 
          monthly: data.monthly, yearly: data.yearly, student: data.student,
          standard_name: data.standard_name || "Standard", standard_desc: data.standard_desc || `₹${data.monthly} / month`, standard_features: data.standard_features || ['1 Standard account', 'Download to listen offline', 'Cancel anytime'],
          platinum_name: data.platinum_name || "Platinum", platinum_desc: data.platinum_desc || `₹${data.yearly} / year`, platinum_features: data.platinum_features || ['Up to 3 Platinum accounts', 'Lossless audio quality (24-bit)', 'Cancel anytime'],
          student_name: data.student_name || "Student", student_desc: data.student_desc || `₹${data.student} / month`, student_features: data.student_features || ['1 verified Standard account', 'Cancel anytime'],
          custom_plans: data.custom_plans || []
        });
      }
    };
    fetchPrices();
  }, []);

  const handleCheckout = (planName, price, interval) => {
    router.push(`/premium/checkout?plan=${encodeURIComponent(planName)}&price=${price}&interval=${encodeURIComponent(interval)}`);
  };

  return (
    <div className="flex h-screen w-full bg-[#F0EDE6] overflow-hidden font-sans text-gray-900 selection:bg-[#8CE0B7] selection:text-[#041c17] p-0 gap-0">
        
      <div className="w-[280px] shrink-0 flex-col gap-0 hidden md:flex h-full">
        <div className="bg-[#0b3d33] rounded-none p-6 flex flex-col gap-6 shadow-md relative overflow-hidden shrink-0 border border-black/5 border-b-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 blur-[50px] rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-3 relative z-10">
            <img src="/antara-logo.svg" alt="Antara Logo" className="h-8 w-8 object-contain filter brightness-0 invert" />
            <span className="text-xl font-black tracking-widest text-white">ANTARA</span>
          </div>
          <Link href="/" className="flex items-center gap-4 text-sm font-bold text-white/70 hover:text-white transition-all duration-300 relative z-10">
            <Home className="h-6 w-6" /> Home
          </Link>
        </div>

        <div className="bg-[#0b3d33] rounded-none flex-1 flex flex-col overflow-hidden shadow-md relative border border-black/5 border-t-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="px-6 py-5 flex items-center justify-between shadow-sm bg-black/10 relative z-10">
            <div className="flex items-center gap-3 text-sm font-bold text-white/70">
              <Library className="h-6 w-6" /> Your Library
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Link href="/" className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-[0.97]">
              <Bookmark className="h-5 w-5" /> Saved
            </Link>
            <p className="mb-3 mt-8 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Rituals</p>
            <Link href="/" className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white">
              <Plus className="h-5 w-5" /> Build Session
            </Link>
            <Link href="/" className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white">
              <Mic className="h-5 w-5" /> Record Voice
            </Link>
            <Link href="/" className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-bold text-white/70 transition-all duration-300 active:scale-[0.97] hover:bg-white/10 hover:text-white">
              <Timer className="h-5 w-5" /> Deep Work
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-auto bg-[#041c17] text-[#F8F5F0] rounded-none shadow-xl border border-black/10 relative flex flex-col [&::-webkit-scrollbar]:hidden">
        
        <nav className="flex items-center justify-between p-6 md:px-12 z-50 sticky top-0 bg-[#041c17]/80 backdrop-blur-md border-b border-white/5">
          <Link href="/premium/explore" className="text-sm font-bold text-[#8CE0B7] hover:text-[#041c17] flex items-center gap-2 transition-all px-5 py-2.5 rounded-full border border-[#8CE0B7] hover:bg-[#8CE0B7] shadow-[0_0_15px_rgba(140,224,183,0.2)]">
            <Sparkles className="w-4 h-4" /> Explore Features
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-300 hover:text-white flex items-center gap-2 transition-colors bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
        </nav>

        <div className="relative pt-12 pb-24 px-6 text-center max-w-4xl mx-auto w-full shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b3d33]/50 to-transparent -z-10 rounded-[4rem] blur-3xl opacity-50"></div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight">Experience Antara Premium</h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">Enjoy ad-free, high-fidelity focused sessions with Antara Premium.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button onClick={() => handleCheckout(prices.standard_name, prices.monthly, "month")} className="bg-[#F8F5F0] text-[#041c17] px-8 py-3.5 rounded-full font-black text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all w-full sm:w-auto shadow-lg shadow-white/10">
              Get {prices.standard_name}
            </button>
            <button 
              onClick={() => document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-transparent border-2 border-gray-500 text-white px-8 py-3.5 rounded-full font-bold text-sm hover:border-white hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              View all plans
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mt-6 font-medium">Limited time offer. Limited Eligibility. Terms Apply.</p>
        </div>

        <div id="plans" className="bg-white py-20 px-6 w-full shrink-0">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900">Choose the Premium plan that's right for you.</h2>
              <p className="text-gray-600 font-medium mb-6">Listen to immersive soundscapes and ad-free music when you want.<br />Pay in various ways. Cancel anytime.</p>
              
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-50 border border-gray-200 rounded flex items-center justify-center h-8 w-12 shadow-sm"><span className="text-[10px] font-black text-gray-800 italic">UPI</span></div>
                  <div className="bg-gray-50 border border-gray-200 rounded flex items-center justify-center h-8 w-12 shadow-sm"><span className="text-[12px] font-black text-[#5f259f]">पे</span></div>
                  <div className="bg-gray-50 border border-gray-200 rounded flex items-center justify-center h-8 w-12 shadow-sm"><span className="text-[14px] font-bold text-gray-600">G</span></div>
                  <div className="bg-gray-50 border border-gray-200 rounded flex items-center justify-center h-8 w-12 shadow-sm"><span className="text-[10px] font-black text-[#00baf2] tracking-tighter">Paytm</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
              
              <div className="bg-[#0b3d33] rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-colors relative flex flex-col">
                <span className="bg-[#F8F5F0] text-[#041c17] text-xs font-black px-3 py-1 rounded-md mb-6 w-fit">₹{prices.monthly} / month</span>
                <h3 className="text-3xl font-black text-white mb-2">{prices.standard_name}</h3>
                <p className="text-sm text-gray-300 font-medium mb-8 border-b border-white/10 pb-6">{prices.standard_desc}</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {prices.standard_features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium"><Check className="w-5 h-5 shrink-0 text-[#F8F5F0]" /> {feature}</li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(prices.standard_name, prices.monthly, "month")} className="w-full bg-[#F8F5F0] text-[#041c17] py-3.5 rounded-full font-black text-sm hover:scale-[1.02] active:scale-95 transition-all">
                  Get {prices.standard_name} for ₹{prices.monthly}
                </button>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-8 border border-yellow-500/30 shadow-2xl relative flex flex-col transform md:-translate-y-4">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Most Popular</div>
                <h3 className="text-3xl font-black text-yellow-500 mb-2 mt-4">{prices.platinum_name}</h3>
                <p className="text-sm text-gray-300 font-medium mb-8 border-b border-white/10 pb-6">{prices.platinum_desc}</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {prices.platinum_features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium"><Check className="w-5 h-5 shrink-0 text-yellow-500" /> {feature}</li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(prices.platinum_name, prices.yearly, "year")} className="w-full bg-yellow-500 text-black py-3.5 rounded-full font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  Get {prices.platinum_name} for ₹{prices.yearly}
                </button>
              </div>

              <div className="bg-[#0b3d33] rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-colors relative flex flex-col">
                <span className="bg-[#8CE0B7] text-[#041c17] text-xs font-black px-3 py-1 rounded-md mb-6 w-fit">Savings available</span>
                <h3 className="text-3xl font-black text-white mb-2">{prices.student_name}</h3>
                <p className="text-sm text-gray-300 font-medium mb-8 border-b border-white/10 pb-6">{prices.student_desc}</p>
                <ul className="space-y-4 mb-8 flex-1">
                  {prices.student_features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium"><Check className="w-5 h-5 shrink-0 text-[#F8F5F0]" /> {feature}</li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout(prices.student_name, prices.student, "month")} className="w-full bg-transparent border-2 border-[#F8F5F0] text-[#F8F5F0] py-3.5 rounded-full font-black text-sm hover:bg-[#F8F5F0] hover:text-[#041c17] hover:scale-[1.02] active:scale-95 transition-all">
                  Try {prices.student_name} for ₹{prices.student}
                </button>
              </div>

              {prices.custom_plans.map((plan) => (
                <div key={plan.id} className="bg-[#122d22] rounded-3xl p-8 border border-[#8CE0B7]/20 shadow-xl relative flex flex-col transition-transform hover:-translate-y-2">
                  <span className="bg-[#8CE0B7] text-[#041c17] text-xs font-black px-3 py-1 rounded-md mb-6 w-fit">Special Tier</span>
                  <h3 className="text-3xl font-black text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-300 font-medium mb-8 border-b border-white/10 pb-6">{plan.desc}</p>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-200 font-medium"><Check className="w-5 h-5 shrink-0 text-[#8CE0B7]" /> {feature}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleCheckout(plan.name, plan.price, plan.interval)} className="w-full bg-transparent border-2 border-[#8CE0B7] text-[#8CE0B7] py-3.5 rounded-full font-black text-sm hover:bg-[#8CE0B7] hover:text-[#041c17] hover:scale-[1.02] active:scale-95 transition-all">
                    Get {plan.name} for ₹{plan.price}
                  </button>
                </div>
              ))}  
            </div>
          </div>
        </div>

        <footer className="bg-[#041c17] pt-20 pb-12 px-6 md:px-12 border-t border-white/10 shrink-0 w-full mt-auto">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full md:w-3/4">
                
                <div>
                  <h4 className="text-white font-bold mb-6 text-sm">Company</h4>
                  <ul className="space-y-4">
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">About</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Jobs</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">For the Record</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-6 text-sm">Communities</h4>
                  <ul className="space-y-4">
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">For Artists</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">For Creators</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Developers</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Investors</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Vendors</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-6 text-sm">Useful links</h4>
                  <ul className="space-y-4">
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Support</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Free Mobile App</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Import your music</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-bold mb-6 text-sm">Antara Plans</h4>
                  <ul className="space-y-4">
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Premium Standard</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Premium Platinum</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Premium Student</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Antara Free</Link></li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 md:justify-end">
                <button className="h-10 w-10 rounded-full bg-[#292929] hover:bg-white text-white hover:text-black flex items-center justify-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </button>
                <button className="h-10 w-10 rounded-full bg-[#292929] hover:bg-white text-white hover:text-black flex items-center justify-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </button>
                <button className="h-10 w-10 rounded-full bg-[#292929] hover:bg-white text-white hover:text-black flex items-center justify-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Legal</Link>
                <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Safety & Privacy Center</Link>
                <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Cookies</Link>
                <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">About Ads</Link>
                <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Accessibility</Link>
              </div>
              <p className="text-xs text-gray-400">© 2026 Antara AB</p>
            </div>
            
          </div>
        </footer>
      </div>
    </div>
  );
}