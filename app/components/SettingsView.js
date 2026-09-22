"use client";

import { useState } from "react";
import { Crown, ExternalLink, ShieldCheck, Camera, Save, Loader2, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import useAntaraAccount from "../hooks/useAntaraAccount"; 
import { useLanguage } from "../context/LanguageContext"; 

export default function SettingsView({ profile }) {
  const router = useRouter();
  
  // 1. We grab the "t" function from our context here!
  const languageContext = useLanguage();
  const language = languageContext?.language || "en-UK";
  const changeLanguage = languageContext?.changeLanguage || (() => {});
  const t = languageContext?.t || ((word) => word); 

  const { user, saveProfile } = useAntaraAccount();
  const [username, setUsername] = useState(profile?.username || "");
  const [focusGoal, setFocusGoal] = useState(profile?.focus_goal || "Focus");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const tier = profile?.subscription_tier || 'free';
  const isPlatinum = tier === 'platinum';

  const [settings, setSettings] = useState({
    normalizeVolume: true,
    autoPlayAmbience: false,
    losslessFrequencies: isPlatinum, 
    breathingVisuals: true,
    privateActivity: false,
    compactLibrary: false,
  });

  const toggleSetting = (key) => {
    if (key === 'losslessFrequencies' && !isPlatinum) {
      router.push('/premium/explore');
      return;
    }
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = async (e) => {
    try {
      setIsUploading(true);
      const file = e.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);
      setMessage({ type: 'success', text: 'Profile picture uploaded!' });
      
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Upload failed. Make sure the "avatars" bucket exists and is public.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfileData = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const { error } = await saveProfile({
      username,
      focus_goal: focusGoal,
      avatar_url: avatarUrl
    });

    setIsSaving(false);
    if (error) {
      setMessage({ type: 'error', text: error });
    } else {
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
    }
  };

  const ToggleRow = ({ label, description, stateKey, isLocked }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 group">
      <div className="pr-4">
        <p className={`text-sm font-medium ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button 
        onClick={() => toggleSetting(stateKey)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings[stateKey] ? 'bg-[#0b3d33]' : 'bg-gray-200'} ${isLocked ? 'opacity-50' : ''}`}
      >
        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings[stateKey] ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-500 max-w-4xl mx-auto pb-32">
      
      <div className="mb-10">
        {/* 2. Look here! Instead of typing "Settings", we use t("settingsTitle") */}
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">{t("settingsTitle")}</h2>
      </div>

      <div className="space-y-12">

        <section>
          {/* We use t("publicProfile") here */}
          <h3 className="font-bold text-lg text-gray-900 mb-6 border-b border-gray-100 pb-2">{t("publicProfile")}</h3>
          
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="relative group cursor-pointer shrink-0" onClick={() => document.getElementById('avatar-upload').click()}>
              <div className="h-28 w-28 rounded-full bg-[#0b3d33] flex items-center justify-center overflow-hidden shadow-md">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-white">{username ? username.charAt(0).toUpperCase() : 'U'}</span>
                )}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </div>
              </div>
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
            </div>

            <form onSubmit={handleSaveProfileData} className="flex-1 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-gray-200 text-gray-900 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:border-[#0b3d33] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Primary Focus Goal</label>
                <select 
                  value={focusGoal} 
                  onChange={(e) => setFocusGoal(e.target.value)}
                  className="w-full bg-[#F8F5F0] border border-gray-200 text-gray-900 rounded-lg py-2.5 px-4 text-sm font-medium outline-none focus:border-[#0b3d33] transition-all cursor-pointer"
                >
                  <option value="Focus">Deep Focus & Productivity</option>
                  <option value="Sleep">Better Sleep & Rest</option>
                  <option value="Relax">Relaxation & Anxiety Relief</option>
                  <option value="Guided">Guided Meditation</option>
                </select>
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm font-bold ${message.type === 'success' ? 'bg-[#1ed760]/10 text-[#0b3d33]' : 'bg-red-50 text-red-600'}`}>
                  {message.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center justify-center gap-2 rounded-full bg-[#0b3d33] px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 w-full sm:w-auto"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </form>
          </div>
        </section>
        
        <section>
          {/* We use t("account") here */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 border-b border-gray-100 pb-2">{t("account")}</h3>
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Current Plan</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                  tier === 'platinum' ? 'bg-yellow-100 text-yellow-700' : 
                  tier === 'standard' ? 'bg-[#0b3d33]/10 text-[#0b3d33]' : 
                  tier === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tier}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  {tier === 'free' ? 'Ad-supported listening' : 'Premium ad-free listening'}
                </span>
              </div>
            </div>
            <button onClick={() => router.push('/premium/explore')} className="px-4 py-1.5 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:border-gray-500 hover:bg-gray-50 transition-colors flex items-center gap-2">
              Edit <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section>
          {/* We use t("language") here */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 border-b border-gray-100 pb-2">{t("language")}</h3>
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            <div className="pr-4">
              <p className="text-sm font-medium text-gray-900">{t("chooseLanguage")}</p>
              <p className="text-xs text-gray-500 mt-0.5">Changes will be applied instantly</p>
            </div>
            <select 
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-[#F8F5F0] hover:bg-white text-gray-900 rounded-md px-4 py-2.5 text-sm font-bold outline-none border border-gray-200 cursor-pointer transition-colors min-w-[240px]"
            >
              <option value="en-UK">English (United Kingdom)</option>
              <option value="en-US">English (United States)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </section>

        {/* ... Rest of the settings page remains exactly the same ... */}
        <section>
          <h3 className="font-bold text-lg text-gray-900 mb-2 border-b border-gray-100 pb-2">Audio quality</h3>
          
          <div className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Streaming quality</p>
            </div>
            <select className="bg-[#F8F5F0] hover:bg-white border border-gray-200 text-gray-900 rounded-md px-3 py-2 text-sm font-medium outline-none cursor-pointer transition-colors">
              <option>Automatic</option>
              <option>Low (Data Saver)</option>
              <option>Normal</option>
              <option>High</option>
              {isPlatinum && <option>Lossless (24-bit)</option>}
            </select>
          </div>

          <ToggleRow 
            label="Normalise volume" 
            description="Set the same volume level for all guided voices and ambient sounds" 
            stateKey="normalizeVolume" 
          />
          
          <div className="flex items-center justify-between py-4 border-b border-gray-50 group">
            <div className="pr-4">
              <p className={`text-sm font-medium ${isPlatinum ? 'text-gray-900' : 'text-gray-400'}`}>Enable Lossless Brainwave Frequencies</p>
              <p className="text-xs text-gray-500 mt-0.5">Stream uncompressed Binaural and Solfeggio frequencies for optimal brainwave entrainment.</p>
              {!isPlatinum && (
                <div className="flex items-center gap-1 mt-2 text-yellow-600">
                  <Crown className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Platinum Exclusive</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => toggleSetting('losslessFrequencies')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${settings.losslessFrequencies ? 'bg-yellow-500' : 'bg-gray-200'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.losslessFrequencies ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-900 mb-2 border-b border-gray-100 pb-2">Playback & Zen Mode</h3>
          
          <ToggleRow 
            label="Auto-play ambience" 
            description="Seamlessly continue playing ambient sounds (like rain or waves) after a guided session ends." 
            stateKey="autoPlayAmbience" 
          />
          
          <div className="flex items-center justify-between py-4 border-b border-gray-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Offline Zen Mode (Downloads)</p>
              <p className="text-xs text-gray-500 mt-0.5">Download sessions to listen completely offline without interruptions.</p>
            </div>
            {tier === 'free' ? (
              <button onClick={() => router.push('/premium')} className="text-xs font-bold text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-md hover:bg-yellow-100 transition-colors">
                Upgrade
              </button>
            ) : (
              <button className="text-xs font-bold text-[#0b3d33] bg-[#0b3d33]/10 px-3 py-1.5 rounded-md hover:bg-[#0b3d33]/20 transition-colors">
                Manage Downloads
              </button>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-900 mb-2 border-b border-gray-100 pb-2">Display & Visuals</h3>
          
          <ToggleRow 
            label="Breathing Visuals (Canvas)" 
            description="Show short, looping breathing animations when a meditation is playing." 
            stateKey="breathingVisuals" 
          />
          
          <ToggleRow 
            label="Compact library layout" 
            description="Show more playlists and saved sessions on screen at once." 
            stateKey="compactLibrary" 
          />
        </section>

        <section>
          <h3 className="font-bold text-lg text-gray-900 mb-2 border-b border-gray-100 pb-2">Privacy</h3>
          
          <div className="flex items-start gap-3 py-4 bg-gray-50 rounded-xl px-4 mb-4 border border-gray-100">
            <ShieldCheck className="w-5 h-5 text-[#0b3d33] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Your wellness data is protected</p>
              <p className="text-xs text-gray-500 mt-0.5">Antara never sells your listening history, sleep habits, or custom session data.</p>
            </div>
          </div>

          <ToggleRow 
            label="Private listening activity" 
            description="Hide the sessions you listen to from your public profile and friends." 
            stateKey="privateActivity" 
          />
        </section>

      </div>
    </div>
  );
}