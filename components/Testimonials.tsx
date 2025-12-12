
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { Star, ArrowUpRight, ArrowRight, Quote, ArrowLeft, Users } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TestimonialItem, SessionItem } from '../types';
import { trackSectionView, trackEvent, trackButtonClick } from '../services/analyticsService';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialsProps {
    testimonials: TestimonialItem[];
    sessions: SessionItem[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, sessions }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  
  // Animation refs
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackSectionView('Testimonials');
  }, []);

  // Safety checks
  const safeTestimonials = testimonials.length > 0 ? testimonials : [{ id: 0, text: 'No testimonials', author: '', role: '', rating: 5, avatar: '' }];
  const safeSessions = sessions.length > 0 ? sessions : [{ id: 0, title: 'No sessions', subtitle: '', price: '', image: '' }];

  const activeTestimonial = safeTestimonials[activeIndex % safeTestimonials.length];
  const activeSession = safeSessions[activeIndex % safeSessions.length];

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % safeTestimonials.length);
    trackEvent('Testimonial Nav', { action: 'Next' });
  }, [safeTestimonials.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + safeTestimonials.length) % safeTestimonials.length);
    trackEvent('Testimonial Nav', { action: 'Prev' });
  }, [safeTestimonials.length]);

  // Auto-play
  useEffect(() => {
    if (isHoverPaused) return;
    const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % safeTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoverPaused, safeTestimonials.length]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // Initial Scroll Entrance
        gsap.from(".testimonial-entrance", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%"
            }
        });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Content Transition Animation
  useEffect(() => {
     const ctx = gsap.context(() => {
         // Animate Quote
         if (quoteRef.current) {
             gsap.fromTo(quoteRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
             );
         }
         // Animate Author Details
         if (authorRef.current) {
             gsap.fromTo(authorRef.current,
                { opacity: 0, x: -10 },
                { opacity: 1, x: 0, duration: 0.6, delay: 0.1, ease: "power3.out" }
             );
         }
         // Animate Right Card
         if (cardRef.current) {
             gsap.fromTo(cardRef.current,
                { opacity: 0, scale: 0.98 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }
             );
         }
     }, containerRef);
     return () => ctx.revert();
  }, [activeIndex]);

  return (
    <section 
        ref={containerRef} 
        className="py-16 md:py-24 px-6 md:px-10 max-w-[1800px] mx-auto overflow-hidden"
        onMouseEnter={() => setIsHoverPaused(true)}
        onMouseLeave={() => setIsHoverPaused(false)}
    >
       {/* Section Header - Full Width */}
       <div className="flex flex-col lg:flex-row justify-between items-end mb-16 md:mb-20 gap-8 testimonial-entrance">
          <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] leading-[1.05] font-medium tracking-tight text-brand-dark dark:text-white max-w-4xl">
            What 
            <span className="inline-block mx-2 md:mx-4 relative top-1 md:top-3">
              <img 
                src="https://images.unsplash.com/photo-1628779238951-be2c9f256548?q=80&w=150&auto=format&fit=crop" 
                className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-[3px] border-white dark:border-zinc-800 shadow-lg" 
                alt="Tennis Ball"
              />
            </span>
            people are <br /> honestly saying right now
          </h2>

          <div className="flex flex-col items-end gap-3 mb-2 min-w-max">
              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
                  <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Testimonial</span>
              </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-full shadow-sm hover:scale-105 transition-transform cursor-default">
                  <Users size={12} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Customer Says</span>
              </div>
          </div>
       </div>

       {/* Main Grid Content */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch testimonial-entrance">
          
          {/* Left: Testimonials Slider */}
          <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="mb-8 md:mb-12 flex-1">
                 <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                        <Quote size={20} className="text-brand-orange fill-brand-orange" />
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Success Stories</span>
                 </div>
                 
                 <div className="min-h-[220px] md:min-h-[280px] flex flex-col justify-center">
                     <h3 ref={quoteRef} className="text-2xl md:text-3xl lg:text-5xl font-medium leading-[1.2] text-brand-dark dark:text-white mb-8 tracking-tight">
                        "{activeTestimonial.text}"
                     </h3>
                     
                     <div ref={authorRef} className="flex items-center gap-4">
                        <img 
                            src={activeTestimonial.avatar} 
                            alt={activeTestimonial.author}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-brand-orange shadow-md"
                        />
                        <div>
                            <div className="text-lg font-bold text-brand-dark dark:text-white leading-tight">{activeTestimonial.author}</div>
                            <div className="text-xs text-gray-500 font-medium">{activeTestimonial.role}</div>
                        </div>
                        <div className="ml-auto flex items-center gap-1 bg-brand-orange/10 px-3 py-1.5 rounded-full border border-brand-orange/20">
                            <Star size={14} className="text-brand-orange fill-brand-orange" />
                            <span className="text-xs font-bold text-brand-orange">{activeTestimonial.rating}</span>
                        </div>
                     </div>
                 </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4 border-t border-gray-100 dark:border-zinc-800 pt-8 mt-auto">
                  <button 
                    onClick={handlePrev}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group active:scale-95"
                    aria-label="Previous Testimonial"
                  >
                      <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group active:scale-95"
                    aria-label="Next Testimonial"
                  >
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                  </button>
                  
                  {/* Progress Bar */}
                  <div className="flex-1 h-[2px] bg-gray-100 dark:bg-zinc-800 relative ml-4 hidden md:block rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-brand-orange transition-all duration-700 ease-in-out"
                        style={{ width: `${((activeIndex + 1) / safeTestimonials.length) * 100}%` }}
                      ></div>
                  </div>
                  <div className="md:hidden text-xs font-bold text-gray-400">
                      {activeIndex + 1} / {safeTestimonials.length}
                  </div>
              </div>
          </div>

          {/* Right: Featured Session Card */}
          <div className="lg:col-span-5 h-[400px] md:h-[500px] lg:h-auto min-h-[400px]">
             <div ref={cardRef} className="w-full h-full relative rounded-[2rem] md:rounded-4xl overflow-hidden group shadow-2xl cursor-pointer">
                 <img 
                    src={activeSession.image}
                    alt={activeSession.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity"></div>

                 <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between text-white z-10">
                     <div className="flex justify-between items-start">
                         <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                             Featured Session
                         </div>
                         <div 
                            onClick={() => trackButtonClick('Arrow Link', 'Session Card')}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black hover:bg-brand-orange hover:text-white transition-colors duration-300 shadow-xl"
                         >
                             <ArrowUpRight size={20} />
                         </div>
                     </div>

                     <div className="transform transition-transform duration-300 group-hover:translate-y-[-5px]">
                         <div className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-2">Apr — May 2025</div>
                         <div className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{activeSession.title}</div>
                         <p className="text-sm font-medium text-gray-300 mb-6 tracking-wide">{activeSession.subtitle}</p>
                         
                         <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                             <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                 {activeSession.price} <span className="text-[10px] font-normal opacity-70">/ session</span>
                             </div>
                             <button 
                                onClick={() => trackButtonClick('Full Game', 'Session Card')}
                                className="flex-1 border border-white/30 hover:bg-brand-orange hover:border-brand-orange text-white py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg flex justify-center items-center gap-2 group/btn"
                             >
                                 Full Game <ArrowUpRight size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform"/>
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
