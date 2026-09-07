"use client";
import { useState } from "react";
import { X } from "lucide-react";
import useAntaraAccount from "../hooks/useAntaraAccount";

export default function AuthModal({ onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signIn, signUp } = useAntaraAccount();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (result?.error) {
      setError(result.error);
    } else if (isSignUp) {
      setMessage("Check your email to confirm your account!");
    } else {
      onClose();
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-overlay">
      
      {/* Bento Modal Container with Paper Texture */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#F8F5F0] bg-paper-texture p-8 md:p-10 shadow-[0_20px_50px_-10px_rgba(11,61,51,0.3)] border border-[#0b3d33]/15 animate-modal">
        
        <div className="relative z-10 mb-8 flex items-start justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#0b3d33]/70">
              Antara Account
            </p>
            <h2 className="text-3xl font-serif font-black tracking-tight text-[#0f172a]">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/60 p-2.5 text-gray-500 hover:bg-white hover:text-gray-900 hover:scale-105 active:scale-95 transition shadow-sm border border-[#0b3d33]/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-[#0b3d33]/15 bg-white/60 px-4 py-3.5 font-medium text-[#0f172a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password — at least 8 characters"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#0b3d33]/15 bg-white/60 px-4 py-3.5 font-medium text-[#0f172a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
            />
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}
          {message && <p className="text-sm font-bold text-[#0b3d33]">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-full border border-[#041c17] bg-gradient-to-b from-[#0b3d33] to-[#072a23] text-base font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),_0_6px_12px_rgba(11,61,51,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_8px_16px_rgba(11,61,51,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setMessage("");
          }}
          className="relative z-10 mt-6 w-full text-center text-sm font-bold text-gray-500 hover:text-[#0b3d33] transition"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New to Antara? Create an account"}
        </button>
      </div>
    </div>
  );
}