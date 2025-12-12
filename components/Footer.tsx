
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { trackSectionView, trackEvent } from '../services/analyticsService';

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const container = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    trackSectionView('Footer');
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // General Footer Entrance (Fade In)
        gsap.from(container.current, {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: container.current,
                start: "top 80%"
            }
        });

        // Parallax Brand Text Effect
        // Text rises up as user scrolls down through the footer
        gsap.fromTo(textRef.current, 
            { yPercent: 50 }, 
            {
                yPercent: -10, // Moves up slightly past its natural position
                ease: "none",
                scrollTrigger: {
                    trigger: container.current,
                    start: "top bottom", // Starts when footer top enters viewport
                    end: "bottom bottom", // Ends when footer bottom hits viewport bottom
                    scrub: 1 // Smooth scrubbing
                }
            }
        );
    }, container);
    return () => ctx.revert();
  }, []);

  const handleLinkClick = (label: string) => {
    trackEvent('Footer Click', { label });
  }

  return (
    <footer id="about" ref={container} className="bg-[#f3f4f6] dark:bg-zinc-950 pt-24 pb-8 px-6 md:px-10 transition-colors duration-300">
       <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-5">
             <div onClick={() => handleLinkClick('Explore Card')} className="relative rounded-4xl overflow-hidden aspect-square md:aspect-[4/3] bg-gray-900 group cursor-pointer shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop" 
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition duration-700 group-hover:scale-105"
                  alt="Explore"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10">
                   <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 flex items-center justify-center text-white mb-6 md:mb-8 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:scale-110">
                      <ArrowUpRight size={28} strokeWidth={1.5} />
                   </div>
                   <h3 className="text-5xl md:text-6xl font-bold text-white leading-[0.9] tracking-tighter">Explore <br/> More</h3>
                </div>
             </div>
          </div>

          <div className="md:col-span-7 flex flex-col justify-between lg:pl-16 pt-0 md:pt-8">
             <div>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-brand-dark dark:text-white mb-8 md:mb-12 leading-[1.05] tracking-tight">We're doing everything for future healthiness.</h2>
                <div className="flex flex-wrap gap-2 md:gap-3">
                   {['Trainer & Coach Access', 'Priority Event', 'Badges'].map(tag => (
                      <span key={tag} className="px-4 py-2 md:px-6 md:py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide hover:bg-brand-dark hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300 cursor-default shadow-sm">{tag}</span>
                   ))}
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mt-16 md:mt-20 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex flex-col gap-4">
                   <span className="font-bold text-black dark:text-white mb-2 md:mb-4 uppercase tracking-wider text-[10px]">Program</span>
                   <a href="#" onClick={() => handleLinkClick('Product')} className="hover:text-brand-orange transition-colors">Product</a>
                   <a href="#" onClick={() => handleLinkClick('Event')} className="hover:text-brand-orange transition-colors">Event</a>
                   <a href="#" onClick={() => handleLinkClick('About')} className="hover:text-brand-orange transition-colors">About</a>
                </div>
                <div className="flex flex-col gap-4">
                   <span className="font-bold text-black dark:text-white mb-2 md:mb-4 uppercase tracking-wider text-[10px]">Social</span>
                   <a href="#" onClick={() => handleLinkClick('Twitter')} className="hover:text-brand-orange transition-colors flex items-center gap-2">X (Twitter) <ArrowUpRight size={10}/></a>
                   <a href="#" onClick={() => handleLinkClick('Instagram')} className="hover:text-brand-orange transition-colors flex items-center gap-2">Instagram <ArrowUpRight size={10}/></a>
                   <a href="#" onClick={() => handleLinkClick('LinkedIn')} className="hover:text-brand-orange transition-colors flex items-center gap-2">LinkedIn <ArrowUpRight size={10}/></a>
                </div>
                <div className="flex items-end justify-start md:justify-end">
                   <button onClick={() => handleLinkClick('Contact Button')} className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-orange flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-2xl shadow-brand-orange/40">
                      <ArrowUpRight size={32} />
                   </button>
                </div>
             </div>
          </div>
       </div>

       <div className="border-t border-gray-200 dark:border-zinc-800 pt-10 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-10 gap-6">
          <div>San Diego - California</div>
          <div>EST — 2018</div>
          <div className="hover:text-brand-orange cursor-pointer transition-colors" onClick={() => handleLinkClick('Email')}>hello@granger.com</div>
       </div>

       <div className="relative w-full overflow-hidden">
        <h1 ref={textRef} className="text-[26vw] leading-[0.7] font-black text-center tracking-tighter text-brand-dark dark:text-white opacity-100 dark:opacity-10 select-none transition-colors duration-300 pb-0">
            Granger
        </h1>
       </div>
       
       <div className="flex flex-col md:flex-row justify-between text-[10px] text-gray-400 font-bold mt-2 uppercase tracking-widest pb-6 gap-4 md:gap-0">
          <div className="flex gap-6">
            <div onClick={() => handleLinkClick('Attachment')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Website Attachment</div>
            <div onClick={() => handleLinkClick('Resources')} className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Resources</div>
          </div>
          <div>©2025 All Right Reserved</div>
       </div>
    </footer>
  );
};
