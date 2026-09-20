"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!sessionId) return;

    fetch("/api/stripe/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, planName: plan }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId, plan]);

  return (
    <div className="min-h-screen bg-[#041c17] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#072c24] border border-[#0d4a3b] rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-[#8CE0B7]/20 text-[#8CE0B7] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black mb-2">Welcome to Premium!</h1>
        <p className="text-gray-300 text-sm mb-8">
          {status === "verifying"
            ? "Syncing your subscription..."
            : `Your account has been upgraded to Antara ${plan || "Premium"}.`}
        </p>

        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#8CE0B7] hover:bg-[#a6ebd0] text-[#041c17] font-black py-4 px-6 rounded-2xl transition-all"
        >
          Start Listening <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#041c17]" />}>
      <SuccessContent />
    </Suspense>
  );
}