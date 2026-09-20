"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Lock, Check, ShieldCheck, Sparkles } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const defaultFeatures = {
  standard: [
    "1 Standard account",
    "Ad-free uninterrupted soundscapes",
    "Download sessions to listen offline",
    "High audio quality (~320kbps)",
    "Cancel anytime without penalty",
  ],
  platinum: [
    "Up to 3 Platinum accounts",
    "Studio lossless 24-bit audio quality",
    "Your personal AI DJ & smart flow playlists",
    "Full offline downloads & multi-device sync",
    "Unlimited access to all ambient rituals",
    "Cancel anytime without penalty",
  ],
  student: [
    "1 verified Student account",
    "Full ad-free ambient catalog",
    "Download to listen offline",
    "Discounted student pricing tier",
    "Cancel anytime",
  ],
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "Annual Plan (Platinum)";
  const price = searchParams.get("price") || "1011";
  const interval = searchParams.get("interval") || "year";

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [planFeatures, setPlanFeatures] = useState([]);

  
  useEffect(() => {
    const fetchPlanDetails = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const lower = planName.toLowerCase();
      let fallback = defaultFeatures.standard;
      if (lower.includes("platinum") || lower.includes("annual")) {
        fallback = defaultFeatures.platinum;
      } else if (lower.includes("student")) {
        fallback = defaultFeatures.student;
      }

      if (!url || !key) {
        setPlanFeatures(fallback);
        return;
      }

      try {
        const supabase = createBrowserClient(url, key);
        const { data } = await supabase.from("pricing").select("*").eq("id", 1).single();

        if (data) {
          if (lower.includes("platinum") || lower.includes("annual")) {
            setPlanFeatures(data.platinum_features || fallback);
          } else if (lower.includes("student")) {
            setPlanFeatures(data.student_features || fallback);
          } else {
            setPlanFeatures(data.standard_features || fallback);
          }
        } else {
          setPlanFeatures(fallback);
        }
      } catch {
        setPlanFeatures(fallback);
      }
    };

    fetchPlanDetails();
  }, [planName]);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planName,
          price: Number(price),
          interval,
        }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || "Failed to generate Stripe checkout session");
      }

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("No checkout redirect URL received from server.");
      }
    } catch (error) {
      console.error("Checkout redirection error:", error);
      alert(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-center gap-2">
          <img src="/antara-logo.svg" alt="Antara Logo" className="h-8 w-8" />
          <span className="text-xl font-black tracking-widest text-gray-900">
            ANTARA
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-[#041c17] text-[#8CE0B7] font-bold flex items-center justify-center text-sm shadow-sm">
          A
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout</h1>
        <Link
          href="/premium/explore"
          className="text-sm font-bold text-gray-600 hover:text-black underline transition-colors"
        >
          Change plan
        </Link>
      </div>

      
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#041c17] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <img
                src="/antara-logo.svg"
                alt="Icon"
                className="h-6 w-6 filter brightness-0 invert"
              />
            </div>
            <div>
              <h3 className="font-black text-lg text-gray-900">
                Antara {planName}
              </h3>
              <p className="text-sm font-medium text-gray-500">
                1 Premium subscription
              </p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-black text-2xl text-gray-900">₹{price}.00</h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Per {interval.replace("/", "").trim()}
            </p>
          </div>
        </div>
        <ul className="text-sm font-medium text-gray-600 space-y-1 list-disc list-inside ml-1">
          <li>One-time payment, does not auto-renew</li>
          <li>
            Offer{" "}
            <span className="underline cursor-pointer hover:text-black">
              Terms apply
            </span>
          </li>
        </ul>
      </div>

      
      <div className="mb-10">
        <h2 className="text-2xl font-black text-gray-900 mb-1">Address</h2>
        <p className="text-sm font-medium text-gray-500 mb-6">
          Tax is calculated based on your jurisdiction.
        </p>

        <label className="block text-sm font-bold text-gray-700 mb-2">
          State / County
        </label>
        <div className="relative mb-6">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-300 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-black focus:ring-1 focus:ring-black cursor-pointer shadow-sm"
          >
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Telangana">Telangana</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
        </div>

        <button
          type="button"
          className="w-full bg-[#1ed760] hover:bg-[#1fdf64] hover:scale-[1.01] active:scale-[0.99] text-black font-black py-4 rounded-full transition-all shadow-sm"
        >
          Save Address
        </button>
      </div>

      
      <div className="mb-12 border border-gray-200 rounded-2xl p-6 sm:p-8 bg-gray-50/70 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#041c17]" />
              Plan Summary & Benefits
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Everything included with your Antara {planName}
            </p>
          </div>
          <span className="bg-[#041c17] text-[#8CE0B7] text-xs font-black px-3 py-1.5 rounded-full">
            Active
          </span>
        </div>

        
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
          {planFeatures.map((feature, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm font-semibold text-gray-800"
            >
              <div className="w-5 h-5 rounded-full bg-[#8CE0B7]/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-[#041c17] stroke-[3]" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

       
        <div className="bg-white rounded-xl p-5 border border-gray-200/80 space-y-3">
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>Base Subscription</span>
            <span>₹{price}.00</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>Applicable Taxes & GST</span>
            <span className="text-green-700 font-bold">Included</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
            <span>Total Payable Now</span>
            <span className="text-lg text-[#041c17]">₹{price}.00</span>
          </div>
        </div>

        
        <div className="mt-6 flex items-center gap-3 bg-white p-3.5 rounded-xl border border-gray-200/70 text-xs font-medium text-gray-600">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            Payment details are securely captured via <strong>Stripe</strong>’s 256-bit encrypted gateway on the next screen[cite: 19].
          </span>
        </div>
      </div>

      
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 flex justify-center">
        <div className="w-full max-w-3xl flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-500">
            <Lock className="w-4 h-4" /> SECURE STRIPE CHECKOUT
          </div>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 sm:flex-none w-full sm:w-auto bg-[#635BFF] hover:bg-[#4B45D6] text-white font-black py-3.5 px-12 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Redirecting to Stripe..." : `Pay ₹${price} with Stripe`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white pb-24">
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center font-bold text-gray-400">
            Loading Checkout...
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
    </div>
  );
}