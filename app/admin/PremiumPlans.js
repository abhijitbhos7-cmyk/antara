"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2, Save, Crown, Sparkles, GraduationCap, List, PencilLine, X, Plus, Trash2, Zap } from "lucide-react";

export default function PremiumPlans() {
  const [plans, setPlans] = useState({ 
    monthly: 99, 
    standard_name: "Standard", 
    standard_desc: "Billed automatically every 30 days",
    standard_features: "",
    yearly: 999, 
    platinum_name: "Platinum", 
    platinum_desc: "Best value for year-round focus",
    platinum_features: "",
    student: 69,
    student_name: "Student",
    student_desc: "Discounted tier for verified students",
    student_features: "",
    custom_plans: [] 
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  const [activeModal, setActiveModal] = useState(null); 

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const formatFeaturesForEditor = (featuresArray) => {
    if (!featuresArray || featuresArray.length === 0) return "";
    return featuresArray.map((f, i) => `${i + 1}. ${f}`).join('\n');
  };

  const parseFeaturesForDB = (featuresText) => {
    return featuresText
      .split('\n')
      .map(f => f.replace(/^\d+[\.\)]\s*/, '').trim())
      .filter(f => f !== '');
  };

  useEffect(() => {
    const fetchPricing = async () => {
      const { data, error } = await supabase.from('pricing').select('*').eq('id', 1).single();
      if (data) {
        setPlans({ 
          monthly: data.monthly ?? 99, 
          standard_name: data.standard_name ?? "Standard",
          standard_desc: data.standard_desc ?? "Billed automatically every 30 days",
          standard_features: formatFeaturesForEditor(data.standard_features),
          
          yearly: data.yearly ?? 999, 
          platinum_name: data.platinum_name ?? "Platinum",
          platinum_desc: data.platinum_desc ?? "Best value for year-round focus",
          platinum_features: formatFeaturesForEditor(data.platinum_features),
          
          student: data.student ?? 69,
          student_name: data.student_name ?? "Student",
          student_desc: data.student_desc ?? "Discounted tier for verified students",
          student_features: formatFeaturesForEditor(data.student_features),

         
          custom_plans: (data.custom_plans || []).map(p => ({ 
            ...p, 
            features: formatFeaturesForEditor(p.features) 
          }))
        });
      }
      setIsLoading(false);
    };
    fetchPricing();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    
    
    const customPlansForDB = plans.custom_plans.map(p => ({
      ...p, 
      features: parseFeaturesForDB(p.features)
    }));

    const { error } = await supabase
      .from('pricing')
      .upsert({ 
        id: 1, 
        monthly: plans.monthly, 
        standard_name: plans.standard_name,
        standard_desc: plans.standard_desc,
        standard_features: parseFeaturesForDB(plans.standard_features),
        
        yearly: plans.yearly, 
        platinum_name: plans.platinum_name,
        platinum_desc: plans.platinum_desc,
        platinum_features: parseFeaturesForDB(plans.platinum_features),
        
        student: plans.student,
        student_name: plans.student_name,
        student_desc: plans.student_desc,
        student_features: parseFeaturesForDB(plans.student_features),

       
        custom_plans: customPlansForDB
      });

    if (error) {
      console.error("Supabase Error:", error);
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage("✅ Premium plans successfully updated and published to live site!");
      setTimeout(() => setMessage(""), 4000);
    }
    
    setIsSaving(false);
  };

 
  const handleFeatureKeyDown = (e, key, isCustom = false, customId = null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;

      const linesBeforeCursor = value.substring(0, start).split('\n');
      const nextNumber = linesBeforeCursor.length + 1;
      const insertText = `\n${nextNumber}. `;

      const newValue = value.substring(0, start) + insertText + value.substring(end);
      
      if (isCustom) {
        updateCustomPlan(customId, 'features', newValue);
      } else {
        setPlans(prev => ({ ...prev, [key]: newValue }));
      }

      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + insertText.length;
      }, 0);
    }
  };

  const handleFeatureFocus = (e, key, isCustom = false, customId = null) => {
    if (isCustom) {
      const plan = plans.custom_plans.find(p => p.id === customId);
      if (!plan.features || plan.features.trim() === '') {
        updateCustomPlan(customId, 'features', '1. ');
      }
    } else {
      if (!plans[key] || plans[key].trim() === '') {
        setPlans(prev => ({ ...prev, [key]: '1. ' }));
      }
    }
  };

  
  const handleAddCustomPlan = () => {
    const newId = Date.now();
    const newPlan = { id: newId, name: "New Plan", desc: "Billing Description", price: 199, interval: "/ mo", features: "1. Premium feature" };
    setPlans(prev => ({ ...prev, custom_plans: [...prev.custom_plans, newPlan] }));
    setActiveModal(`custom-${newId}`);
  };

  const updateCustomPlan = (id, key, value) => {
    setPlans(prev => ({ 
      ...prev, 
      custom_plans: prev.custom_plans.map(p => p.id === id ? { ...p, [key]: value } : p) 
    }));
  };

  if (isLoading) return <div className="p-8 flex justify-center w-full"><Loader2 className="h-8 w-8 animate-spin text-[#0b3d33]" /></div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-20">
      
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Live Pricing Editor</h2>
          <p className="text-sm font-medium text-gray-500 mt-2 max-w-xl">
            Click on any plan card below to open the editor. When you are done customizing, hit Publish to push changes live.
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="shrink-0 bg-[#0b3d33] hover:bg-[#072a23] text-white px-8 py-3.5 rounded-full font-bold shadow-[0_10px_20px_rgba(11,61,51,0.2)] hover:shadow-[0_10px_25px_rgba(11,61,51,0.3)] transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {isSaving ? "Publishing..." : "Publish Changes"}
        </button>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl text-sm font-bold animate-in slide-in-from-top-4 flex items-center gap-2 ${message.includes('✅') ? 'bg-[#8CE0B7]/20 text-[#0b3d33] border border-[#8CE0B7]/50' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
       
        <div onClick={() => setActiveModal('standard')} className="bg-[#0b3d33] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
          <div className="absolute inset-0 bg-[#0b3d33]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm z-30 transition-all duration-300">
            <div className="bg-white text-[#0b3d33] px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <PencilLine className="w-5 h-5" /> Edit Standard Plan
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#8CE0B7]" />
            <span className="text-[#8CE0B7] text-xs font-black uppercase tracking-widest">Standard Tier</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-4">{plans.standard_name || "Standard"}</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-black text-[#8CE0B7]">₹</span>
            <span className="text-5xl font-black text-white">{plans.monthly || "0"}</span>
            <span className="text-white/60 font-bold text-sm">/ mo</span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-8">{plans.standard_desc || "Billing Description"}</p>
          <div className="w-full bg-black/20 rounded-xl p-4 min-h-[160px]">
             <pre className="text-sm font-medium text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">{plans.standard_features}</pre>
          </div>
        </div>

        
        <div onClick={() => setActiveModal('platinum')} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group border border-yellow-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(234,179,8,0.2)] lg:-translate-y-4 cursor-pointer">
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm z-30 transition-all duration-300">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <PencilLine className="w-5 h-5" /> Edit VIP Plan
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-5 h-5 text-yellow-500" />
            <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">VIP Tier</span>
            <span className="ml-auto text-[9px] font-black bg-yellow-500 text-black px-2 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
          </div>
          <h3 className="text-3xl font-black text-yellow-500 mb-4">{plans.platinum_name || "Platinum"}</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-black text-yellow-500/70">₹</span>
            <span className="text-5xl font-black text-white">{plans.yearly || "0"}</span>
            <span className="text-white/60 font-bold text-sm">/ yr</span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-8">{plans.platinum_desc || "Billing Description"}</p>
          <div className="w-full bg-white/5 rounded-xl p-4 min-h-[160px]">
             <pre className="text-sm font-medium text-yellow-100/80 whitespace-pre-wrap font-sans leading-relaxed">{plans.platinum_features}</pre>
          </div>
        </div>

        
        <div onClick={() => setActiveModal('student')} className="bg-[#072a23] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group border border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
          <div className="absolute inset-0 bg-[#072a23]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm z-30 transition-all duration-300">
            <div className="bg-white text-[#072a23] px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
              <PencilLine className="w-5 h-5" /> Edit Student Plan
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-gray-300" />
            <span className="text-gray-300 text-xs font-black uppercase tracking-widest">Discount Tier</span>
          </div>
          <h3 className="text-3xl font-black text-white mb-4">{plans.student_name || "Student"}</h3>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-black text-gray-400">₹</span>
            <span className="text-5xl font-black text-white">{plans.student || "0"}</span>
            <span className="text-white/60 font-bold text-sm">/ mo</span>
          </div>
          <p className="text-sm font-medium text-white/80 mb-8">{plans.student_desc || "Billing Description"}</p>
          <div className="w-full bg-black/20 rounded-xl p-4 min-h-[160px]">
             <pre className="text-sm font-medium text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">{plans.student_features}</pre>
          </div>
        </div>

        
        {plans.custom_plans.map((cp) => (
          <div key={cp.id} onClick={() => setActiveModal(`custom-${cp.id}`)} className="bg-[#122d22] rounded-[2rem] p-8 shadow-xl relative overflow-hidden group border border-[#8CE0B7]/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
            <div className="absolute inset-0 bg-[#122d22]/80 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm z-30 transition-all duration-300">
              <div className="bg-white text-[#122d22] px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform">
                <PencilLine className="w-5 h-5" /> Edit Custom Plan
              </div>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#8CE0B7]/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-6">
              <Zap className="w-5 h-5 text-[#8CE0B7]" />
              <span className="text-[#8CE0B7] text-xs font-black uppercase tracking-widest">Special Tier</span>
            </div>
            <h3 className="text-3xl font-black text-white mb-4">{cp.name}</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-black text-[#8CE0B7]">₹</span>
              <span className="text-5xl font-black text-white">{cp.price}</span>
              <span className="text-white/60 font-bold text-sm">{cp.interval}</span>
            </div>
            <p className="text-sm font-medium text-white/80 mb-8">{cp.desc}</p>
            <div className="w-full bg-black/20 rounded-xl p-4 min-h-[160px]">
              <pre className="text-sm font-medium text-gray-200 whitespace-pre-wrap font-sans leading-relaxed">{cp.features}</pre>
            </div>
          </div>
        ))}

        
        <div onClick={handleAddCustomPlan} className="bg-transparent border-2 border-dashed border-gray-300 rounded-[2rem] p-8 flex flex-col items-center justify-center text-gray-400 hover:text-[#0b3d33] hover:border-[#0b3d33] hover:bg-[#0b3d33]/5 transition-all duration-300 cursor-pointer min-h-[400px] group">
          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-[#0b3d33]/10 flex items-center justify-center mb-4 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black mb-2 text-center">Create New Plan</h3>
          <p className="text-sm font-medium text-center px-4">Add a custom subscription tier to your platform.</p>
        </div>

      </div>

     
      {activeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-200">
          
          <div className="absolute inset-0" onClick={() => setActiveModal(null)}></div>
          
          <div className="relative w-full max-w-lg md:scale-110 z-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            
            <button onClick={() => setActiveModal(null)} className="absolute -top-12 right-0 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2.5 transition-all">
              <X className="w-5 h-5" />
            </button>

            
            {activeModal === 'standard' && (
              <div className="bg-[#0b3d33] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-white/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[#8CE0B7]" />
                  <span className="text-[#8CE0B7] text-xs font-black uppercase tracking-widest">Editing Standard Tier</span>
                </div>
                <input type="text" value={plans.standard_name} onChange={(e) => setPlans({...plans, standard_name: e.target.value})} className="text-3xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none transition-all w-full placeholder-white/30" placeholder="Plan Name" autoFocus />
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-2xl font-black text-[#8CE0B7]">₹</span>
                  <input type="number" value={plans.monthly || ""} onChange={(e) => setPlans({...plans, monthly: parseInt(e.target.value) || 0})} className="text-5xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none w-32 transition-all placeholder-white/30" placeholder="99" />
                  <span className="text-white/60 font-bold text-sm">/ mo</span>
                </div>
                <input type="text" value={plans.standard_desc} onChange={(e) => setPlans({...plans, standard_desc: e.target.value})} className="text-sm font-medium text-white/80 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none w-full transition-all mb-8 placeholder-white/30" placeholder="Billing Description" />
                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5"><List className="w-3.5 h-3.5"/> Features (Press Enter to list)</label>
                  <textarea value={plans.standard_features} onFocus={(e) => handleFeatureFocus(e, 'standard_features')} onKeyDown={(e) => handleFeatureKeyDown(e, 'standard_features')} onChange={(e) => setPlans({...plans, standard_features: e.target.value})} className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 text-sm font-medium text-gray-200 outline-none rounded-xl p-4 resize-none transition-all border border-transparent focus:border-white/10 min-h-[160px] leading-relaxed" />
                </div>
              </div>
            )}

            
            {activeModal === 'platinum' && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-yellow-500/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 text-xs font-black uppercase tracking-widest">Editing VIP Tier</span>
                </div>
                <input type="text" value={plans.platinum_name} onChange={(e) => setPlans({...plans, platinum_name: e.target.value})} className="text-3xl font-black text-yellow-500 bg-transparent border-b border-transparent hover:border-white/20 focus:border-yellow-500 focus:bg-white/5 rounded px-2 py-1 -ml-2 outline-none transition-all w-full placeholder-white/30" placeholder="Plan Name" autoFocus />
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-2xl font-black text-yellow-500/70">₹</span>
                  <input type="number" value={plans.yearly || ""} onChange={(e) => setPlans({...plans, yearly: parseInt(e.target.value) || 0})} className="text-5xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-yellow-500 focus:bg-white/5 rounded px-2 py-1 -ml-2 outline-none w-36 transition-all placeholder-white/30" placeholder="999" />
                  <span className="text-white/60 font-bold text-sm">/ yr</span>
                </div>
                <input type="text" value={plans.platinum_desc} onChange={(e) => setPlans({...plans, platinum_desc: e.target.value})} className="text-sm font-medium text-white/80 bg-transparent border-b border-transparent hover:border-white/20 focus:border-yellow-500 focus:bg-white/5 rounded px-2 py-1 -ml-2 outline-none w-full transition-all mb-8 placeholder-white/30" placeholder="Billing Description" />
                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5"><List className="w-3.5 h-3.5"/> Features (Press Enter to list)</label>
                  <textarea value={plans.platinum_features} onFocus={(e) => handleFeatureFocus(e, 'platinum_features')} onKeyDown={(e) => handleFeatureKeyDown(e, 'platinum_features')} onChange={(e) => setPlans({...plans, platinum_features: e.target.value})} className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-sm font-medium text-yellow-100/80 outline-none rounded-xl p-4 resize-none transition-all border border-transparent focus:border-yellow-500/30 min-h-[160px] leading-relaxed" />
                </div>
              </div>
            )}

            
            {activeModal === 'student' && (
              <div className="bg-[#072a23] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-white/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-300 text-xs font-black uppercase tracking-widest">Editing Discount Tier</span>
                </div>
                <input type="text" value={plans.student_name} onChange={(e) => setPlans({...plans, student_name: e.target.value})} className="text-3xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none transition-all w-full placeholder-white/30" placeholder="Plan Name" autoFocus />
                <div className="flex items-baseline gap-1 mt-4 mb-2">
                  <span className="text-2xl font-black text-gray-400">₹</span>
                  <input type="number" value={plans.student || ""} onChange={(e) => setPlans({...plans, student: parseInt(e.target.value) || 0})} className="text-5xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none w-28 transition-all placeholder-white/30" placeholder="69" />
                  <span className="text-white/60 font-bold text-sm">/ mo</span>
                </div>
                <input type="text" value={plans.student_desc} onChange={(e) => setPlans({...plans, student_desc: e.target.value})} className="text-sm font-medium text-white/80 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none w-full transition-all mb-8 placeholder-white/30" placeholder="Billing Description" />
                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5"><List className="w-3.5 h-3.5"/> Features (Press Enter to list)</label>
                  <textarea value={plans.student_features} onFocus={(e) => handleFeatureFocus(e, 'student_features')} onKeyDown={(e) => handleFeatureKeyDown(e, 'student_features')} onChange={(e) => setPlans({...plans, student_features: e.target.value})} className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 text-sm font-medium text-gray-200 outline-none rounded-xl p-4 resize-none transition-all border border-transparent focus:border-white/10 min-h-[160px] leading-relaxed" />
                </div>
              </div>
            )}

            
            {activeModal?.startsWith('custom-') && (() => {
              const customId = Number(activeModal.replace('custom-', ''));
              const cp = plans.custom_plans.find(p => p.id === customId);
              if (!cp) return null;

              return (
                <div className="bg-[#122d22] rounded-[2rem] p-8 shadow-2xl relative overflow-hidden border border-[#8CE0B7]/50">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap className="w-5 h-5 text-[#8CE0B7]" />
                    <span className="text-[#8CE0B7] text-xs font-black uppercase tracking-widest">Editing Custom Tier</span>
                  </div>
                  <input type="text" value={cp.name} onChange={(e) => updateCustomPlan(customId, 'name', e.target.value)} className="text-3xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none transition-all w-full placeholder-white/30" placeholder="Plan Name" autoFocus />
                  
                  <div className="flex items-baseline gap-1 mt-4 mb-2">
                    <span className="text-2xl font-black text-[#8CE0B7]">₹</span>
                    <input type="number" value={cp.price || ""} onChange={(e) => updateCustomPlan(customId, 'price', parseInt(e.target.value) || 0)} className="text-5xl font-black text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none w-32 transition-all placeholder-white/30" placeholder="199" />
                    
                   
                    <select value={cp.interval} onChange={(e) => updateCustomPlan(customId, 'interval', e.target.value)} className="text-white/60 font-bold text-sm bg-transparent outline-none cursor-pointer hover:text-white">
                      <option className="text-black" value="/ mo">/ mo</option>
                      <option className="text-black" value="/ yr">/ yr</option>
                      <option className="text-black" value="once">once</option>
                    </select>
                  </div>
                  
                  <input type="text" value={cp.desc} onChange={(e) => updateCustomPlan(customId, 'desc', e.target.value)} className="text-sm font-medium text-white/80 bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#8CE0B7] focus:bg-black/20 rounded px-2 py-1 -ml-2 outline-none w-full transition-all mb-8 placeholder-white/30" placeholder="Billing Description" />
                  
                  <div className="flex-1 flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 flex items-center gap-1.5"><List className="w-3.5 h-3.5"/> Features (Press Enter to list)</label>
                    <textarea 
                      value={cp.features} 
                      onFocus={(e) => handleFeatureFocus(e, 'features', true, customId)} 
                      onKeyDown={(e) => handleFeatureKeyDown(e, 'features', true, customId)} 
                      onChange={(e) => updateCustomPlan(customId, 'features', e.target.value)} 
                      className="w-full bg-black/20 hover:bg-black/30 focus:bg-black/40 text-sm font-medium text-gray-200 outline-none rounded-xl p-4 resize-none transition-all border border-transparent focus:border-white/10 min-h-[160px] leading-relaxed" 
                    />
                  </div>

                  <button onClick={() => { setPlans(prev => ({...prev, custom_plans: prev.custom_plans.filter(p => p.id !== customId)})); setActiveModal(null); }} className="mt-6 flex w-full items-center justify-center gap-2 text-red-400 hover:text-red-300 font-bold py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete this plan
                  </button>
                </div>
              );
            })()}

            <button onClick={() => setActiveModal(null)} className="mt-4 w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-2xl">
              Done Editing
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}