"use client";

import { Crown, Sparkles, X, Headphones, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PremiumModal({ onClose }) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">

        
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 opacity-20 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#0b3d33] to-[#1ed760] opacity-10 blur-3xl"></div>

        <div className="relative p-8">
          <div className="mb-6 flex justify-between items-start">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-sm border border-yellow-300/50">
              <Crown className="h-7 w-7 text-yellow-600" />
            </div>
            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <h2 className="mb-3 text-3xl font-black tracking-tight text-gray-900 leading-none">
            Unlock your <br /> full focus.
          </h2>

          <p className="mb-6 text-[15px] font-medium leading-relaxed text-gray-600">
            You've reached the end of your free preview. Upgrade to Premium to unlock uninterrupted listening, brainwave frequencies, and offline downloads.
          </p>

          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
              <Sparkles className="h-5 w-5 text-[#0b3d33]" /> Unlimited ad-free sessions
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
              <Headphones className="h-5 w-5 text-[#0b3d33]" /> High-fidelity spatial audio
            </div>
            <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
              <Lock className="h-5 w-5 text-[#0b3d33]" /> 40Hz & 432Hz Brainwave states
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                onClose();
                router.push('/premium/explore');
              }}
              className="w-full rounded-full bg-[#0b3d33] py-4 text-[15px] font-black text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#072a23] hover:shadow-xl active:scale-95"
            >
              View Premium Plans
            </button>
            <button
              onClick={onClose}
              className="w-full rounded-full bg-transparent py-3 text-[14px] font-bold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900 active:scale-95"
            >
              Not right now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}