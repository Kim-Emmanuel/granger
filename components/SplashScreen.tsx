
import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Animate out (Slide Up)
                gsap.to(container.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: "power3.inOut",
                    onComplete: onComplete
                });
            }
        });

        // Initial Set
        gsap.set(textRef.current, { y: 100, opacity: 0 });
        gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left" });

        // Counter Animation
        const counterObj = { value: 0 };
        tl.to(counterObj, {
            value: 100,
            duration: 2,
            ease: "expo.out",
            onUpdate: () => setCount(Math.round(counterObj.value))
        });

        // Line Progress (Syncs roughly with counter)
        tl.to(lineRef.current, {
            scaleX: 1,
            duration: 2,
            ease: "expo.out"
        }, 0);

        // Text Reveal
        tl.to(textRef.current, {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out"
        }, "-=1.5");

        // Slight Pause before exit
        tl.to({}, { duration: 0.5 });

    }, container);
    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
        ref={container} 
        className="fixed inset-0 z-[100] bg-[#0f0f11] text-white flex flex-col justify-between p-6 md:p-12 overflow-hidden"
    >
        {/* Top Info */}
        <div className="flex justify-between items-start opacity-50 text-[10px] md:text-xs font-bold uppercase tracking-widest font-sans">
            <div className="flex flex-col gap-1">
                <span>San Diego, CA</span>
                <span>Est. 2018</span>
            </div>
            <div className="text-right">
                <span>Premium Wellness</span>
                <br />
                <span>Experience</span>
            </div>
        </div>

        {/* Center Hero */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="overflow-hidden relative">
                <h1 
                    ref={textRef} 
                    className="text-[18vw] leading-none font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-400 to-gray-800 select-none"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)' }}
                >
                    Granger
                </h1>
            </div>
        </div>

        {/* Bottom Loading */}
        <div className="w-full relative z-10">
            <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Loading Assets</span>
                <div ref={counterRef} className="text-4xl md:text-6xl font-black tracking-tighter tabular-nums leading-none">
                    {count}%
                </div>
            </div>
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div ref={lineRef} className="w-full h-full bg-brand-orange"></div>
            </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};
