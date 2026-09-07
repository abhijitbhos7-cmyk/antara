"use client";

import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import AuthModal from "../../components/AuthModal";
import useAntaraAccount from "../../hooks/useAntaraAccount";

export default function InfoPage() {
  const params = useParams();
  const slug = params?.slug || "about"; 
  const [showAuth, setShowAuth] = useState(false);
  
  const { user, signOut } = useAntaraAccount();

  
  const PublicNavbar = () => (
    <nav className="flex items-center justify-between bg-[#0b3d33] px-6 py-4 md:px-12 shadow-md">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
           <img src="/antara-logo.svg" alt="Antara Logo" className="h-6 w-6 object-contain" />
        </div>
        <span className="text-xl font-extrabold tracking-widest text-white">ANTARA</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <div className="flex gap-6 text-sm font-bold text-white/90">
          <Link href="/info/premium" className="hover:text-white transition">Premium plans</Link>
          <Link href="/info/support" className="hover:text-white transition">Support</Link>
          <Link href="/info/download" className="hover:text-white transition">Download</Link>
        </div>
        
        <div className="flex items-center gap-4 border-l border-white/20 pl-8">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-white">{user.email?.split('@')[0] || 'User'}</span>
              <Link href="/" className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#0b3d33] transition hover:bg-gray-100">
                Dashboard
              </Link>
              <button onClick={signOut} className="text-white/70 hover:text-red-400 transition" title="Sign Out">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowAuth(true)} className="text-sm font-bold text-white hover:text-gray-200 transition">
                Sign up
              </button>
              <button onClick={() => setShowAuth(true)} className="rounded-full bg-white px-5 py-2 text-sm font-bold text-[#0b3d33] transition hover:bg-gray-100">
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );

  const renderDynamicContent = () => {
    switch (slug) {
      
      case "about":
        return (
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-16 lg:gap-32">
            <div>
               <h1 className="text-5xl lg:text-[4rem] font-extrabold mb-10 tracking-tight text-[#0f172a]">About Us</h1>
               <div className="space-y-6 text-[#334155] text-[17px] leading-relaxed font-medium">
                 <p>With Antara, it’s easy to find the right meditation, soundscape, or breathing exercise for every moment—on your phone, your computer, and more.</p>
                 <p>There are hundreds of sessions on Antara. So whether you’re behind the wheel, working out, partying or relaxing, the right mindfulness practice is always at your fingertips. Choose what you want to listen to, or let Antara surprise you.</p>
                 <p>Soundtrack your life with Antara. Subscribe or listen for free.</p>
               </div>
            </div>
            <div className="space-y-12 md:mt-4">
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-5 tracking-tight text-[#0f172a]">Antara HQ</h2>
                <div className="text-[#334155] space-y-1 text-[15px]">
                  <p className="font-bold text-[#0f172a] mb-2">Antara Wellness AB</p>
                  <p>Regeringsgatan 19</p>
                  <p>SE-111 53 Stockholm</p>
                  <p>Sweden</p>
                  <p className="mt-4 text-[13px] text-gray-400">Reg no: 556703-7485</p>
                  <p className="text-[#0b3d33] hover:underline cursor-pointer mt-1 font-medium">office@antara.com</p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-5 tracking-tight text-[#0f172a]">Antara India</h2>
                <div className="text-[#334155] space-y-1 text-[15px]">
                  <p className="font-bold text-[#0f172a] mb-2">Antara India LLP</p>
                  <p>Jet Airways - Godrej BKC</p>
                  <p>1st Floor, Unit 1 and 2</p>
                  <p>Bandra East, Mumbai</p>
                  <p>Maharashtra, India</p>
                  <p className="mt-4 text-[#0b3d33] hover:underline cursor-pointer font-medium">india@antara.com</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "support":
        return (
          <div>
            <h1 className="text-5xl lg:text-[4rem] font-extrabold mb-10 tracking-tight text-[#0f172a] leading-tight">
              Customer Service <br className="hidden md:block" /> and Support
            </h1>
            <div className="space-y-8 text-[#334155] text-[17px] leading-relaxed font-medium max-w-3xl">
              <p>
                1. Help Site: Check out our help site for answers to your questions and to learn how to get the most out of Antara and your sessions.
              </p>
              <p>
                2. Community: Get fast support from expert Antara users. If there isn't already an answer there to your question, post it and someone will quickly answer.
              </p>
            </div>
          </div>
        );

     
      default:
        return (
          <div>
            <h1 className="text-5xl lg:text-[4rem] font-extrabold mb-10 tracking-tight text-[#0f172a] capitalize">
              {slug === "advertising" ? "Information" : slug?.replace("-", " ")}
            </h1>
            <p className="text-[#334155] text-[17px] leading-relaxed font-medium max-w-2xl">
              We are currently updating this page. Please check back soon for more information about Antara's policies, plans, and community resources.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-paper-texture font-sans text-gray-900 flex flex-col">
      <PublicNavbar />
      
      <div className="p-8 md:p-16 lg:p-24 max-w-6xl mx-auto flex-1 w-full">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#0b3d33] mb-16 text-sm font-bold transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
        </Link>
        
       
        {renderDynamicContent()}
      </div>
      
     
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}