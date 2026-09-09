"use client";
import { useState } from "react";
import { X, Smartphone, ArrowLeft } from "lucide-react";
import useAntaraAccount from "../hooks/useAntaraAccount";

export default function AuthModal({ onClose }) {
  const [authMode, setAuthMode] = useState("email"); // "email", "phone", or "otp"
  const [isSignUp, setIsSignUp] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // Step 1: Email, Step 2: Profile Details
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // New Profile States for Step 2
  const [name, setName] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [gender, setGender] = useState("");
  
  // Status States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { signIn, signUp, signInWithGoogle, sendPhoneOtp, verifyPhoneOtp, saveProfile } = useAntaraAccount();

  // --- HANDLERS ---
  
  async function handleEmailSubmit(e) {
    e.preventDefault();
    setLoading(true); 
    setError(""); 
    setMessage("");

    const result = isSignUp ? await signUp(email, password) : await signIn(email, password);
    
    if (result?.error) {
      setError(result.error);
    } else if (isSignUp) {
      // If sign up is successful, save the extra profile data
      await saveProfile({ 
        username: name,
        gender: gender,
        dob: `${dobYear}-${dobMonth}-${dobDay}`
      });
      setMessage("Account created! Check your email to confirm.");
    } else {
      onClose();
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true); setError("");
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
    setLoading(false);
  }

  async function handlePhoneSubmit(e) {
    e.preventDefault();
    setLoading(true); setError(""); setMessage("");
    const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
    
    const { error } = await sendPhoneOtp(formattedPhone);
    if (error) {
      setError(error.message);
    } else {
      setPhone(formattedPhone);
      setAuthMode("otp");
      setMessage(`Code sent to ${formattedPhone}`);
    }
    setLoading(false);
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    const { error } = await verifyPhoneOtp(phone, otp);
    if (error) setError(error.message);
    else onClose();
    setLoading(false);
  }

  // --- RENDER HELPERS ---

  const renderEmailForm = () => {
    // 2-Step Sign Up Flow (Spotify Detailed Profile Style)
    if (isSignUp) {
      if (signupStep === 1) {
        return (
          <form onSubmit={(e) => { e.preventDefault(); if(email) setSignupStep(2); }} className="w-full max-w-[400px] mx-auto animate-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-sm font-bold text-gray-900">Email address</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-3.5 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-400" 
                placeholder="name@domain.com" required
              />
            </div>
            <button type="submit" className="w-full rounded-full bg-[#0b3d33] py-4 text-base font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 hover:bg-[#072a23]">
              Next
            </button>
          </form>
        );
      } else {
        return (
          <form onSubmit={handleEmailSubmit} className="w-full max-w-[400px] mx-auto animate-in slide-in-from-right-4 duration-300 pb-8">
            
            {/* Progress Bar & Header */}
            <div className="w-full bg-gray-200 h-1 mb-6 rounded-full overflow-hidden">
               <div className="bg-[#0b3d33] h-full w-1/2 rounded-full"></div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-bold">Step 1 of 2</p>
              <h2 className="text-xl font-bold text-gray-900">Finish creating your account</h2>
            </div>

            {/* Email (Read Only from Step 1) */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-sm font-bold text-gray-900">Email address</label>
              <input 
                type="email" value={email} disabled
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-3 text-base text-gray-500 cursor-not-allowed outline-none" 
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="text-sm font-bold text-gray-900">Create a password</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-400" 
                placeholder="Password" required autoFocus
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1 mb-5">
              <label className="text-sm font-bold text-gray-900">Name</label>
              <p className="text-xs text-gray-500 mb-1 font-medium">This name will appear on your profile</p>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-400" 
                placeholder="Your name" required
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1 mb-5">
              <label className="text-sm font-bold text-gray-900">Date of birth</label>
              <p className="text-xs text-gray-500 mb-1 font-medium">Why do we need your date of birth? <span className="underline cursor-pointer hover:text-gray-800">Learn more.</span></p>
              <div className="flex gap-3">
                <input 
                  type="text" placeholder="yyyy" maxLength={4} value={dobYear} onChange={(e) => setDobYear(e.target.value)} required
                  className="w-24 rounded-md border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all text-center" 
                />
                <select 
                  value={dobMonth} onChange={(e) => setDobMonth(e.target.value)} required
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all cursor-pointer"
                >
                  <option value="" disabled>Month</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <input 
                  type="text" placeholder="dd" maxLength={2} value={dobDay} onChange={(e) => setDobDay(e.target.value)} required
                  className="w-16 rounded-md border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all text-center" 
                />
              </div>
            </div>

            {/* Gender Radios */}
            <div className="flex flex-col gap-1 mb-8">
              <label className="text-sm font-bold text-gray-900">Gender</label>
              <p className="text-xs text-gray-500 mb-3 font-medium">We use your gender to help personalise our content recommendations.</p>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {["Man", "Woman", "Non-binary", "Something else", "Prefer not to say"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-800 hover:text-black">
                    <input 
                      type="radio" name="gender" value={g} checked={gender === g} onChange={(e) => setGender(e.target.value)} required
                      className="w-4 h-4 accent-[#0b3d33] cursor-pointer"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-full bg-[#0b3d33] py-4 text-base font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 hover:bg-[#072a23] disabled:opacity-70 disabled:hover:scale-100">
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        );
      }
    }

    // Standard Log In Flow
    return (
      <form onSubmit={handleEmailSubmit} className="w-full max-w-[324px] mx-auto animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-bold text-gray-900">Email or username</label>
          <input 
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3.5 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-400" 
            placeholder="Email or username" required
          />
        </div>
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-sm font-bold text-gray-900">Password</label>
          <input 
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-3.5 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-400" 
            placeholder="Password" required
          />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-[#0b3d33] py-4 text-base font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100">
          {loading ? "Please wait..." : "Log In"}
        </button>
        <div className="text-center mt-6">
          <button type="button" className="text-gray-600 font-bold hover:text-[#0b3d33] hover:underline text-sm tracking-wide">Forgot your password?</button>
        </div>
      </form>
    );
  };

  const renderPhoneForm = () => (
    <form onSubmit={handlePhoneSubmit} className="w-full max-w-[324px] mx-auto animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-sm font-bold text-gray-900">Phone Number</label>
        <input 
          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-3.5 text-base text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all placeholder:text-gray-400" 
          placeholder="+91 98765 43210" required
        />
        <p className="text-xs text-gray-500 mt-1">Include your country code (e.g., +91)</p>
      </div>
      <button type="submit" disabled={loading} className="w-full rounded-full bg-[#0b3d33] py-4 text-base font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70">
        {loading ? "Sending Code..." : "Send Verification Code"}
      </button>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleOtpSubmit} className="w-full max-w-[324px] mx-auto animate-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-1.5 mb-6">
        <label className="text-sm font-bold text-gray-900">Verification Code</label>
        <input 
          type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-3.5 text-center tracking-widest text-xl font-bold text-gray-900 outline-none focus:border-[#0b3d33] focus:ring-1 focus:ring-[#0b3d33] transition-all" 
          placeholder="000000" required autoFocus
        />
        <p className="text-xs text-gray-500 mt-1 text-center">Enter the 6-digit code sent to {phone}</p>
      </div>
      <button type="submit" disabled={loading || otp.length !== 6} className="w-full rounded-full bg-[#0b3d33] py-4 text-base font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-70">
        {loading ? "Verifying..." : "Verify & Log In"}
      </button>
    </form>
  );

  const showBackButton = authMode !== "email" || (isSignUp && signupStep === 2);
  const handleBack = () => {
    if (authMode !== "email") {
      setAuthMode(authMode === "otp" ? "phone" : "email");
    } else if (isSignUp && signupStep === 2) {
      setSignupStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-[#F8F5F0] overflow-y-auto flex flex-col items-center animate-in fade-in duration-300">
      
      {/* Top Right Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 p-3 text-gray-500 hover:text-gray-900 hover:bg-black/5 rounded-full transition-all active:scale-95 z-50">
        <X className="h-7 w-7" />
      </button>

      {/* Top Left Back Button */}
      {showBackButton && (
        <button onClick={handleBack} className="absolute top-6 left-6 p-3 text-gray-500 hover:text-gray-900 hover:bg-black/5 rounded-full transition-all active:scale-95 z-50">
          <ArrowLeft className="h-7 w-7" />
        </button>
      )}

      <div className="w-full max-w-[734px] px-6 py-16 sm:py-24 flex flex-col items-center">
        
        {/* Only show logo and big title if NOT on detailed signup step */}
        {(!isSignUp || signupStep === 1) && (
          <>
            <div className="flex justify-center mb-8">
               <img src="/antara-logo.svg" alt="Antara Logo" className="h-24 w-24 sm:h-28 sm:w-28 object-contain" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-center mb-12 leading-tight text-gray-900">
              {authMode === "otp" ? "Enter Code" : authMode === "phone" ? "Enter phone number" : isSignUp ? "Sign up to start listening" : "Welcome back"}
            </h1>
          </>
        )}

        <div className="w-full max-w-[400px] mx-auto">
          {error && <div className="mb-4 text-sm font-bold text-red-600 bg-red-50 p-3 rounded-md border border-red-100">{error}</div>}
          {message && <div className="mb-4 text-sm font-bold text-green-700 bg-green-50 p-3 rounded-md border border-green-100">{message}</div>}
        </div>

        {authMode === "email" && renderEmailForm()}
        {authMode === "phone" && renderPhoneForm()}
        {authMode === "otp" && renderOtpForm()}

        {/* Hide Social Buttons and Footer if they are on Step 2 of Email Signup */}
        {authMode === "email" && (!isSignUp || (isSignUp && signupStep === 1)) && (
          <div className="w-full max-w-[324px] mx-auto animate-in fade-in duration-500">
            <div className="flex items-center my-8">
              <hr className="flex-1 border-gray-300"/>
              <span className="px-4 text-gray-500 font-bold text-sm">or</span>
              <hr className="flex-1 border-gray-300"/>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => { setAuthMode("phone"); setError(""); setMessage(""); }} type="button" className="relative flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]">
                <Smartphone className="absolute left-5 h-5 w-5 text-gray-600" />
                {isSignUp ? "Sign up with phone number" : "Continue with phone number"}
              </button>
              
              <button onClick={handleGoogleLogin} disabled={loading} type="button" className="relative flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]">
                <svg className="absolute left-5 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isSignUp ? "Sign up with Google" : "Continue with Google"}
              </button>

              <button type="button" className="relative flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]">
                <svg className="absolute left-5 h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                {isSignUp ? "Sign up with Facebook" : "Continue with Facebook"}
              </button>

              <button type="button" className="relative flex w-full items-center justify-center rounded-full border border-gray-300 bg-white py-3.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:bg-gray-50 active:scale-[0.98]">
                <svg className="absolute left-5 h-5 w-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.365 14.858c-.021 2.378 2.057 3.176 2.08 3.185-.018.06-3.23 11.084-10.597 11.111-2.222.007-2.912-1.353-5.467-1.353-2.537 0-3.328 1.328-5.433 1.353-7.61.089-11.233-11.758-10.569-16.143.235-1.545.962-2.955 2.019-3.957 1.353-1.282 3.123-2.036 4.965-2.015 2.148.025 4.148 1.488 5.463 1.488 1.306 0 3.731-1.745 6.326-1.488 1.086.05 4.168.435 6.136 3.32-.158.098-3.663 2.137-3.682 6.002zM12.094 4.542c1.077-1.298 1.796-3.1 1.597-4.88-1.536.061-3.418.96-4.526 2.253-.984 1.144-1.848 2.973-1.616 4.733 1.716.132 3.469-.806 4.545-2.106z" transform="translate(0, -5) scale(0.85)"/>
                </svg>
                {isSignUp ? "Sign up with Apple" : "Continue with Apple"}
              </button>
            </div>

            <hr className="w-full border-gray-300 my-8"/>
            <div className="text-center pb-8">
              <p className="text-gray-600 font-medium mb-1">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button 
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setSignupStep(1);
                  setError("");
                  setMessage("");
                }} 
                className="text-[#0b3d33] hover:underline font-bold transition-all"
              >
                {isSignUp ? "Log in here." : "Sign up for Antara."}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}