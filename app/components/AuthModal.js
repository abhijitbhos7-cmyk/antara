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
    
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-overlay">
      
      
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-modal">
        
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0b3d33]">
              Antara Account
            </p>
            <h2 className="mt-1 text-3xl font-extrabold text-gray-900">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
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
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition focus:border-[#0b3d33] focus:bg-white focus:ring-1 focus:ring-[#0b3d33]"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          {message && <p className="text-sm font-medium text-green-600">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[#0b3d33] py-3.5 font-bold text-white shadow-md shadow-[#0b3d33]/20 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
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
          className="mt-6 w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-900"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New to Antara? Create an account"}
        </button>
      </div>
    </div>
  );
}