
import React, { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crown } from 'lucide-react';
import { trackSectionView } from '../services/analyticsService';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
    startAnimation?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ startAnimation = true }) => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track when this section is mounted
    trackSectionView('Hero');
  }, []);

  useLayoutEffect(() => {
    // Only set up initial states here, actual animation triggers via prop
    const ctx = gsap.context(() => {
      gsap.set(textRef.current, { yPercent: 100 });
      gsap.set(ballRef.current, { scale: 0.8, opacity: 0, x: 50 });
      gsap.set(contentRef.current, { opacity: 0, y: 30 });
      
      // Parallax Effect for Text Wrapper - Always active for scroll
      gsap.to(textWrapperRef.current, {
        yPercent: 60,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!startAnimation) return;

    const ctx = gsap.context(() => {
      // Entrance Timeline
      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out" }
      });

      tl.to(textRef.current, {
        yPercent: 0,
        duration: 1.5,
        ease: "power4.out",
      })
      .to(ballRef.current, {
        scale: 1,
        opacity: 1,
        x: 0,
        duration: 1.4,
        ease: "elastic.out(1, 0.75)"
      }, "-=1.3")
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
      }, "-=1.0");

    }, container);

    return () => ctx.revert();
  }, [startAnimation]);

  return (
    <div ref={container} className="relative w-full h-[100dvh] min-h-[700px] bg-[#0284c7] overflow-hidden flex flex-col justify-start" aria-label="Hero Section">
      
      {/* Background Texture - Blue Court Floor */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Base Gradient for the 'Court' blue - Darkened for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0284c7] to-[#0369a1]"></div>
        
        {/* Texture Overlay */}
        <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop" 
            alt="" 
            role="presentation"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay grayscale contrast-125"
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.4))]"></div>
      </div>

      {/* Main Content Layer (Z-20) */}
      <div className="relative z-20 w-full h-full max-w-[1800px] mx-auto px-6 md:px-10 lg:px-12 pt-32 md:pt-40 lg:pt-48 grid grid-cols-1 md:grid-cols-12 pointer-events-none">
          
          {/* Left Column: Headline */}
          <div ref={contentRef} className="md:col-span-8 lg:col-span-7 flex flex-col items-start justify-center pb-32 md:pb-0 pointer-events-auto">
               <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem] font-medium leading-[1.05] tracking-tight text-white drop-shadow-xl mb-6 md:mb-8">
                  A new species <br/> of sportainment.
               </h1>

               <div 
                 className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105 cursor-default"
                 role="status"
                 aria-label="Health tip"
               >
                  <div className="bg-brand-orange p-1 rounded-full flex items-center justify-center shadow-md">
                      <Crown size={12} className="text-white" fill="currentColor" aria-hidden="true" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-white drop-shadow-md">Improve your health — performance well</span>
               </div>
          </div>

          {/* Right Column: Ball Placeholder (Visuals handled absolutely below) */}
          <div className="hidden md:flex md:col-span-4 lg:col-span-5 items-center justify-center relative">
          </div>
      </div>

      {/* Layer 1: Granger Brand Text (Behind Ball, Front of BG) */}
      <div 
        ref={textWrapperRef}
        className="absolute bottom-0 left-0 w-full overflow-hidden z-10 flex justify-center items-end leading-none pointer-events-none"
        aria-hidden="true"
      >
          <span 
            ref={textRef} 
            className="text-[29vw] xl:text-[26rem] font-black tracking-tighter text-white leading-[0.75] select-none mix-blend-overlay opacity-30 block"
          >
              Granger
          </span>
      </div>

      {/* Layer 2: Basketball (Front of Text) */}
      <div className="absolute bottom-[12%] sm:bottom-[8%] md:bottom-[2%] right-[-10%] sm:right-[-5%] md:right-[-2%] w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[45%] h-[50%] md:h-[90%] z-20 flex items-end justify-end pointer-events-none">
          <img 
            ref={ballRef}
            src="https://images.unsplash.com/photo-1519861531473-92002639313cc?q=80&w=1200&auto=format&fit=crop" 
            alt="Basketball Visual"
            className="w-full h-full object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          />
      </div>

    </div>
  );
};
