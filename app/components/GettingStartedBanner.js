"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GettingStartedBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic content array (Easy to update later!)
  const promos = [
    {
      id: 1,
      step: "1. Try the Focus Mixer",
      description: "Combine deep focus sessions with ambient rain or ocean waves without interruptions.",
      primaryAction: "Try it",
      secondaryAction: "Show more tips",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400&auto=format&fit=crop&q=60", // Zen stones
      color: "from-[#0b3d33] to-[#125c4c]" // Antara Deep Green
    },
    {
      id: 2,
      step: "2. Build a Daily Habit",
      description: "Consistency is key. Explore our 'Morning Confidence' tracks to start your day right.",
      primaryAction: "Explore",
      secondaryAction: "Show more tips",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=60", // Morning Stretch/Yoga
      color: "from-[#1a365d] to-[#2a4365]" // Deep Calm Blue
    },
    {
      id: 3,
      step: "3. Create a Custom Playlist",
      description: "Save your favorite meditations and ambient sounds to your own personal library.",
      primaryAction: "Create now",
      secondaryAction: "Show more tips",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&auto=format&fit=crop&q=60", // Calm Landscape
      color: "from-[#5c2a12] to-[#7b3e1f]" // Earthy Warm Tone
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === promos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? promos.length - 1 : prev - 1));
  };

  const currentPromo = promos[currentIndex];

  return (
    <div className="w-full max-w-[480px] xl:max-w-[560px] flex flex-col mb-8">
      
      {/* Header section with arrows */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">Getting started</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevSlide} 
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-900 transition-all active:scale-95"
            aria-label="Previous tip"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide} 
            className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-gray-900 transition-all active:scale-95"
            aria-label="Next tip"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dynamic Animated Card */}
      <div 
        className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${currentPromo.color} text-white shadow-md transition-colors duration-700 ease-in-out h-[220px] flex items-center`}
      >
        <div className="flex justify-between items-center w-full p-6 animate-in fade-in zoom-in-[0.98] duration-500" key={currentPromo.id}>
          
          {/* Left Content Area */}
          <div className="flex flex-col justify-between h-full max-w-[220px] xl:max-w-[260px] z-10">
            <div>
              <h3 className="text-2xl xl:text-[28px] font-black tracking-tighter leading-tight mb-2 drop-shadow-sm">
                {currentPromo.step}
              </h3>
              <p className="text-white/90 text-sm font-medium leading-snug">
                {currentPromo.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4 mt-6">
              <button className="bg-white text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition-transform shadow-sm">
                {currentPromo.primaryAction}
              </button>
              <button onClick={nextSlide} className="text-white/90 text-xs font-bold hover:underline hover:text-white transition-colors">
                {currentPromo.secondaryAction}
              </button>
            </div>
          </div>

          {/* Right Image (Floating Album Cover Style) */}
          <div className="hidden sm:block shrink-0 relative z-10 ml-2">
            <div className="w-32 h-32 xl:w-36 xl:h-36 rounded-md overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.4)] transform hover:scale-105 transition-transform duration-500">
              <img 
                src={currentPromo.image} 
                alt="Promo cover" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Decorative Background Blur (Adds depth to the card) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

        </div>
      </div>
    </div>
  );
}