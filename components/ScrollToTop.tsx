
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { gsap } from 'gsap';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const buttonBgRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const pathLengthRef = useRef<number>(0);

  // Initialize path length
  useLayoutEffect(() => {
    if (progressPathRef.current) {
      pathLengthRef.current = progressPathRef.current.getTotalLength();
      gsap.set(progressPathRef.current, {
        strokeDasharray: pathLengthRef.current,
        strokeDashoffset: pathLengthRef.current
      });
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? scrollY / height : 0;

      // Update visibility with a lower threshold for better UX
      if (scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Update progress circle using GSAP for smoothness
      if (progressPathRef.current && pathLengthRef.current > 0) {
        const offset = pathLengthRef.current - (progress * pathLengthRef.current);
        gsap.to(progressPathRef.current, {
            strokeDashoffset: offset,
            duration: 0.1,
            overwrite: true,
            ease: "none"
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Visibility Animation
  useEffect(() => {
    if (!buttonRef.current) return;
    
    if (isVisible) {
      gsap.to(buttonRef.current, {
        y: 0,
        autoAlpha: 1,
        duration: 0.4,
        ease: "back.out(1.2)",
      });
    } else {
      gsap.to(buttonRef.current, {
        y: 20,
        autoAlpha: 0,
        duration: 0.3,
        ease: "power3.in",
      });
    }
  }, [isVisible]);

  // Hover Effects
  const handleMouseEnter = () => {
    if (!buttonBgRef.current || !iconRef.current) return;
    
    gsap.to(buttonBgRef.current, { 
        backgroundColor: "#ea580c", // brand-orange
        borderColor: "#ea580c",
        scale: 1.1,
        duration: 0.3 
    });
    gsap.to(iconRef.current, { 
        y: -3, 
        color: "#ffffff", 
        duration: 0.2 
    });
    gsap.to(iconRef.current, { 
        y: 0, 
        delay: 0.1, 
        duration: 0.4, 
        ease: "elastic.out(1, 0.5)" 
    });
  };

  const handleMouseLeave = () => {
    if (!buttonBgRef.current || !iconRef.current) return;

    gsap.to(buttonBgRef.current, { 
        backgroundColor: "", // Revert to CSS class
        borderColor: "",
        scale: 1,
        duration: 0.3,
        clearProps: "backgroundColor,borderColor" 
    });
    gsap.to(iconRef.current, { 
        y: 0, 
        color: "",
        duration: 0.3,
        clearProps: "color" 
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      ref={buttonRef}
      onClick={scrollToTop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center cursor-pointer invisible opacity-0 translate-y-4 group"
      aria-label="Scroll to top"
    >
        {/* Progress SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-sm" viewBox="0 0 100 100">
             {/* Track */}
             <circle 
                cx="50" cy="50" r="46" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="4" 
                className="text-gray-300/30 dark:text-zinc-700/50 transition-colors duration-300"
            />
            {/* Indicator */}
            <path
                ref={progressPathRef}
                d="M50,4 A46,46 0 1,1 50,96 A46,46 0 1,1 50,4"
                fill="none"
                stroke="#ea580c"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-100 ease-out"
            />
        </svg>

        {/* Inner Button Circle with Glassmorphism */}
        <div 
            ref={buttonBgRef}
            className="absolute inset-[6px] rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-lg flex items-center justify-center transition-colors duration-300 border border-white/60 dark:border-white/10"
        >
             <div ref={iconRef} className="text-brand-dark dark:text-white transition-colors duration-300">
                <ArrowUp size={20} strokeWidth={2.5} />
             </div>
        </div>
    </button>
  );
};
