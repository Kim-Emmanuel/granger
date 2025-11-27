
import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus, Shirt, Utensils, Sparkles, Brain, Zap, ArrowRight } from 'lucide-react';
import { getDailyChallenge } from '../services/geminiService';

gsap.registerPlugin(ScrollTrigger);

export const Features: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const [challenge, setChallenge] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Coaching...");
  const rotateTween = useRef<gsap.core.Tween | null>(null);

  const handleGetChallenge = async () => {
    if (loading) return;
    setLoading(true);
    // Reset challenge briefly to show generation is happening if re-clicking
    if (challenge) setChallenge(""); 
    
    try {
        const result = await getDailyChallenge();
        setChallenge(result);
    } catch (e) {
        setChallenge("Sprint 100m x 10 reps.");
    } finally {
        setLoading(false);
    }
  };
  
  // Cycle loading messages
  useEffect(() => {
    if (!loading) return;
    const messages = ["Contacting Coach...", "Analyzing...", "Formulating...", "Drafting..."];
    let i = 0;
    setLoadingText(messages[0]);
    
    const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingText(messages[i]);
    }, 800);
    
    return () => clearInterval(interval);
  }, [loading]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance for all feature columns
      gsap.from(".feature-col", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        }
      });
      
      // Inline Badge Rotation
      rotateTween.current = gsap.to(".rotate-badge", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "linear"
      });

    }, container);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={container} className="w-full py-16 md:py-24 bg-[#f3f4f6] dark:bg-zinc-950 text-brand-dark dark:text-white transition-colors duration-300 relative z-20 overflow-hidden">
      
      {/* Unified Grid Layout: Mobile Stack -> Tablet 2-Col -> Desktop 12-Col */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 xl:gap-8 px-6 lg:px-10 max-w-[1800px] mx-auto">
        
        {/* --- COL 1: Title & Utility Cards --- */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 flex flex-col gap-8 feature-col">
          
          {/* Title Area */}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-6">
                 <div className="w-2.5 h-2.5 rounded-full bg-brand-orange shadow-[0_0_10px_rgba(234,88,12,0.6)] animate-pulse"></div>
                 <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">The Benefit</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] font-medium leading-[1.05] mb-10 tracking-tight text-brand-dark dark:text-white">
              Explore 
              <span className="inline-flex align-middle mx-3 w-12 h-12 md:w-16 md:h-16 relative rotate-badge -mt-2">
                 <img src="https://images.unsplash.com/photo-1558554904-df38d011197c?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover rounded-full border-2 border-white dark:border-zinc-800" alt="Tennis Ball"/>
              </span>
              our <br/> flexible of activity.
            </h2>
            
            {/* Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
               <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-full text-[11px] font-bold uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm group">
                 <Utensils size={14} className="group-hover:text-brand-orange transition-colors"/> Eating After the Game
               </button>
               <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-transparent dark:border-zinc-800 rounded-full text-[11px] font-bold uppercase tracking-wide hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm group">
                 <Shirt size={14} className="group-hover:text-brand-orange transition-colors"/> Game Jersey
               </button>
            </div>
          </div>

          {/* Cards: Stacked on Mobile, Grid on Tablet, Stacked on Desktop */}
          <div className="flex flex-col gap-4 mt-auto md:grid md:grid-cols-2 lg:flex lg:flex-col">
             {/* Connections Card */}
             <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-transparent dark:border-zinc-800 transition-transform duration-300 hover:-translate-y-1 h-full">
                 <div className="flex justify-between items-start mb-4">
                     <h4 className="font-bold text-lg text-brand-dark dark:text-white">Connections</h4>
                     <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                        <Minus size={16} className="text-gray-400"/>
                     </button>
                 </div>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-[90%]">
                    Built to connect — with people, purpose, and the momentum that moves you forward.
                 </p>
             </div>
             
             {/* Sport Package Strip */}
             <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 px-8 flex justify-between items-center shadow-sm border border-transparent dark:border-zinc-800 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-zinc-800 group cursor-pointer h-full">
                 <h4 className="font-bold text-lg text-brand-dark dark:text-white">Sport Package</h4>
                 <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-black flex items-center justify-center text-brand-dark dark:text-white group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                    <Plus size={20} />
                 </div>
             </div>

             {/* AI Challenge Card (New) */}
             <div className="bg-brand-blue dark:bg-blue-600 rounded-[2rem] p-8 shadow-lg shadow-brand-blue/20 dark:shadow-none relative overflow-hidden group md:col-span-2 lg:col-span-1 min-h-[220px]">
                <div className="absolute -right-6 -top-6 text-white/10 transform rotate-12 group-hover:rotate-45 transition-transform duration-700">
                    <Sparkles size={140} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-white/80 mb-4">
                            <Brain size={14} className={loading ? "animate-pulse" : ""} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Daily AI Challenge</span>
                        </div>

                        <div className="min-h-[4rem] mb-6">
                            <h4 className={`font-bold text-2xl text-white leading-tight transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                                {loading 
                                    ? <span className="animate-pulse">Thinking...</span> 
                                    : (challenge ? `"${challenge}"` : "Unlock your daily elite fitness challenge.")
                                }
                            </h4>
                        </div>
                    </div>

                    <button 
                        onClick={handleGetChallenge}
                        className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all duration-300 shadow-md flex items-center w-fit gap-2 ${
                            loading 
                            ? "bg-white/20 text-white cursor-wait backdrop-blur-sm" 
                            : "bg-white text-brand-blue hover:bg-brand-dark hover:text-white"
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                                </span>
                                {loadingText}
                            </>
                        ) : (
                            <>
                                Generate <Zap size={14} fill="currentColor" />
                            </>
                        )}
                    </button>
                </div>
            </div>

          </div>
        </div>

        {/* --- COL 2: Visionary Card --- */}
        <div className="col-span-1 md:col-span-1 lg:col-span-3 feature-col">
           <div className="h-full bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden border border-transparent dark:border-zinc-800 transition-transform duration-500 hover:-translate-y-2 group shadow-sm min-h-[420px]">
              {/* Subtle BG Pattern */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
              
              <div>
                 <div className="flex items-center gap-3 mb-10">
                     <div className="w-4 h-4 rounded-full border border-brand-orange/30 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div>
                     </div>
                     <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">EST — 1997</span>
                 </div>
                 <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-7 relative z-10">
                    Smart features designed to move with you — fast, flexible, and built for everyday action.
                 </p>
              </div>
              <div className="mt-12 relative z-10">
                  <h3 className="text-3xl md:text-4xl font-medium leading-[1.05] mb-10 text-brand-dark dark:text-white tracking-tight">
                     Visionary <br/> Precision Play
                  </h3>
                  <button className="w-full py-4 px-6 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-full flex items-center justify-between group/btn transition-all duration-300 hover:opacity-90 shadow-lg">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Join Now!</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                  </button>
              </div>
           </div>
        </div>

        {/* --- COL 3: Image Card --- */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 feature-col">
           <div className="h-full min-h-[500px] md:min-h-[600px] lg:min-h-0 relative rounded-[2.5rem] overflow-hidden group shadow-xl bg-brand-orange">
               <div className="absolute inset-0 transition-transform duration-700 hover:scale-105">
                 <img 
                   src="https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1000&auto=format&fit=crop" 
                   className="w-full h-full object-cover saturate-[1.2]"
                   alt="Tennis Court"
                 />
               </div>
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
               
               <div className="absolute top-8 right-8 z-20">
                   <div className="bg-white/95 backdrop-blur px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-brand-dark flex items-center gap-2 shadow-sm transform transition-transform group-hover:rotate-3">
                       <div className="bg-brand-orange p-1 rounded-full text-white"><Shirt size={10} strokeWidth={3}/></div> February Sale
                   </div>
               </div>

               <div className="absolute bottom-6 left-6 right-6 lg:bottom-8 lg:left-8 lg:right-8 z-20">
                   <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                       <div className="flex justify-between items-center mb-3">
                           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tennis Outdoor</span>
                           <div className="flex gap-1.5">
                               <div className="w-2.5 h-2.5 rounded-full bg-brand-mint border border-white/20"></div>
                               <div className="w-2.5 h-2.5 rounded-full bg-brand-orange border border-white/20"></div>
                           </div>
                       </div>
                       
                       <div className="flex justify-between items-end">
                           <div className="flex items-baseline gap-2">
                               <span className="text-4xl font-bold text-brand-dark tracking-tighter">86%</span>
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Member</span>
                           </div>
                           
                           <button className="bg-brand-blue text-white px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-brand-blue/30 hover:bg-brand-dark transition-colors">
                               <Plus size={12} strokeWidth={3} /> Boost
                           </button>
                       </div>
                   </div>
               </div>
           </div>
        </div>

      </div>
    </section>
  );
};
