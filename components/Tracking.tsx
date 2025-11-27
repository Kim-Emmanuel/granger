
import React, { useState, useLayoutEffect, useRef } from 'react';
import { ActivityStat } from '../types';
import { getFitnessAdvice } from '../services/geminiService';
import { Activity, Flame, Heart, Zap, Sparkles, ArrowRight, Dumbbell } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats: ActivityStat[] = [
  { label: 'Walking', value: 127, unit: 'Cal', color: 'bg-brand-blue' },
  { label: 'Running', value: 386, unit: 'Cal', color: 'bg-brand-orange' },
  { label: 'Workout', value: 249, unit: 'Cal', color: 'bg-brand-mint' },
];

export const Tracking: React.FC = () => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Content Entrance
      gsap.from(contentRef.current, {
        x: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%"
        }
      });

      // Image Parallax (Disable on mobile for better performance/layout)
      if (imageRef.current && window.innerWidth > 768) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -15, scale: 1.2 },
          {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Chart Animation
      if (chartPathRef.current) {
        const length = chartPathRef.current.getTotalLength();
        gsap.set(chartPathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        gsap.set([".chart-fill", ".chart-dot", ".chart-tooltip"], { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".chart-wrapper",
            start: "top 80%",
          }
        });

        tl.to(chartPathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power3.out"
        })
        .to(".chart-fill", { opacity: 1, duration: 1 }, "-=1.5")
        .to([".chart-dot", ".chart-tooltip"], { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.5");
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getFitnessAdvice(stats);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-6 md:px-10 bg-white dark:bg-brand-dark transition-colors duration-300 overflow-hidden">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        
        {/* Left: Image & Card Overlay */}
        <div className="relative group mx-auto w-full max-w-2xl lg:max-w-none">
           <div className="h-[400px] md:h-[600px] lg:h-[700px] rounded-[2rem] md:rounded-4xl overflow-hidden relative shadow-2xl shadow-blue-900/10 dark:shadow-none">
              <img 
                ref={imageRef}
                src="https://images.unsplash.com/photo-1546519638-68e109498ee2?q=80&w=1000&auto=format&fit=crop" 
                alt="Basketball Hoop" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-500/10 mix-blend-multiply pointer-events-none"></div>
           </div>

           {/* Floating Analytics Card */}
           <div className="relative md:absolute md:top-[55%] lg:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 mt-[-60px] md:mt-0 mx-4 md:mx-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.12)] w-auto md:w-[90%] lg:w-[75%] transition-colors duration-300 border border-white/40 dark:border-zinc-700/50">
              <div className="flex justify-between items-start mb-6 md:mb-8">
                 <div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-[10px] font-bold mb-2 md:mb-3 uppercase tracking-widest">
                       <div className="w-5 h-5 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange"><Activity size={10} /></div>
                       Activity
                    </div>
                    <div className="text-3xl md:text-5xl font-bold dark:text-white tracking-tighter text-slate-800">2.780 <span className="text-sm font-medium text-gray-400 ml-1">Cal</span></div>
                    <div className="text-[10px] md:text-[11px] font-medium text-gray-400 mt-2">You improved overall well-being</div>
                 </div>
                 <div className="px-3 py-1.5 bg-[#ffefe5] text-[#ea580c] text-[10px] font-bold rounded-full border border-orange-100">+87%</div>
              </div>

              {/* Chart SVG */}
              <div className="chart-wrapper relative h-24 md:h-32 mb-6 md:mb-8 w-full grid-pattern rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden bg-gray-50/50 dark:bg-black/20">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#ea580c" stopOpacity="0"/>
                        </linearGradient>
                         <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ea580c" />
                            <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" className="text-black dark:text-white" />
                      <path 
                        d="M0,70 C60,70 80,30 130,30 S220,60 300,10 V100 H0 Z" 
                        fill="url(#chartGradient)" 
                        className="chart-fill opacity-0"
                      />
                      <path 
                        ref={chartPathRef}
                        d="M0,70 C60,70 80,30 130,30 S220,60 300,10" 
                        fill="none" 
                        stroke="url(#lineGradient)" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="300" cy="10" r="6" fill="#f59e0b" className="chart-dot opacity-0" stroke="white" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-0 right-0 -mt-6 bg-brand-orange text-white text-[10px] font-bold px-3 py-1.5 rounded-lg chart-tooltip opacity-0 transform translate-y-2 shadow-lg z-10">
                      +87%
                  </div>
              </div>

              <div className="flex justify-between gap-2 md:gap-4 pt-6 border-t border-gray-100 dark:border-zinc-800/50">
                 {stats.map((stat) => (
                    <div key={stat.label} className="text-center flex-1 group/stat cursor-default">
                       <div className={`w-2 h-2 ${stat.color} rounded-full mx-auto mb-3 shadow-[0_0_8px_currentColor] group-hover/stat:scale-150 transition-transform`}></div>
                       <div className="text-[8px] md:text-[9px] text-gray-400 uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                       <div className="text-xs md:text-sm font-bold dark:text-white text-slate-800">{stat.value} <span className="text-[9px] font-normal text-gray-400">{stat.unit}</span></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Content */}
        <div ref={contentRef} className="flex flex-col justify-center lg:pl-10 opacity-0">
           <div className="text-[10px] font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span> Featured Features
           </div>
           <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8 md:mb-12 dark:text-white tracking-tight">
              Stay motivated with activity <span className="inline-block relative top-1 md:top-3 mx-1"><img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=100&auto=format&fit=crop" className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-2 md:border-4 border-white dark:border-zinc-900 shadow-xl" alt="Activity" /></span> tracking.
           </h2>

           <div className="flex flex-wrap gap-4 mb-10 md:mb-16">
              {[
                { icon: Heart, label: 'Heart Rate' },
                { icon: Activity, label: 'Steps' },
                { icon: Flame, label: 'Calories' },
                { icon: Dumbbell, label: 'Workout' }
              ].map((item, i) => (
                 <div key={i} className="group relative">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white hover:border-black dark:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 cursor-pointer shadow-sm">
                      <item.icon size={20} />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-white px-2 py-1 rounded">
                        {item.label}
                    </div>
                 </div>
              ))}
           </div>

           <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md text-base md:text-lg leading-relaxed font-medium">
              Record activities to boost your performance.
           </p>

            <div className="mb-8 md:mb-12">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange bg-brand-orange/10 px-3 py-1.5 rounded-md">With Gemini AI</span>
            </div>

           <div className="flex items-center gap-6">
               <button className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-xl shadow-brand-orange/30 hover:scale-110 transition-transform duration-300 group">
                   <ArrowRight size={24} className="-rotate-45 group-hover:rotate-0 transition-transform"/>
               </button>
               <div className="text-xs font-bold uppercase tracking-widest text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition-colors">
                   Explore More
               </div>
           </div>

            {/* AI Integration Box */}
           <div className="mt-12 md:mt-16 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl md:rounded-4xl border border-white/60 dark:border-zinc-700/50 relative overflow-hidden max-w-md shadow-lg group hover:shadow-brand-blue/10 transition-shadow">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-brand-blue animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">AI Coach</span>
               </div>
               
               <p className="text-sm font-medium text-brand-dark dark:text-gray-300 mb-6 italic min-h-[3rem] leading-relaxed">
                 {loading ? "Analyzing your stats..." : (advice ? `"${advice}"` : "Get personalized motivation based on your current stats.")}
               </p>

               <button 
                  onClick={handleGetAdvice}
                  disabled={loading}
                  className="w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-3 rounded-xl text-xs font-bold hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
               >
                   {loading ? <span className="animate-spin rounded-full h-3 w-3 border-2 border-white/20 border-t-white"></span> : <Zap size={14} fill="currentColor"/>}
                  {loading ? 'Thinking...' : 'Generate Insight'}
               </button>
             </div>
           </div>
           
        </div>

      </div>
    </section>
  );
};
