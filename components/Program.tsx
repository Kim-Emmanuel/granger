
import React, { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowLeft, Trophy, Zap, Sparkles, PlayCircle, Users, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Training', 'Wellness', 'Community'];

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

const allPrograms = [
  {
    id: 1,
    category: 'Community',
    style: 'dark',
    subtitle: 'Sportcenter',
    title: 'The coach experts and simple software Command for better sportainment.',
    live: true,
    avatars: [11, 12, 33],
    buttonText: 'granger.com'
  },
  {
    id: 2,
    category: 'Training',
    style: 'image',
    title: 'Chemistry Sports Partner',
    image: 'https://images.unsplash.com/photo-1599474924187-334a405be2ce?q=80&w=1000&auto=format&fit=crop',
    stats: { main: '2.88k', sub: 'Membership', badge: '+1.2k' },
    location: 'New York, US'
  },
  {
    id: 3,
    category: 'Training',
    style: 'image',
    title: 'Marathon Pro Training',
    image: 'https://images.unsplash.com/photo-1552674605-46d531d0654c?q=80&w=1000&auto=format&fit=crop',
    stats: { main: '42km', sub: 'Distance', badge: 'Elite' },
    location: 'London, UK'
  },
  {
    id: 4,
    category: 'Training',
    style: 'dark',
    subtitle: 'Masterclass',
    title: 'Learn from the legends. Exclusive access to pro-athlete routines.',
    icon: <Trophy size={20} className="text-yellow-400" />,
    buttonText: 'Join Class'
  },
  {
    id: 5,
    category: 'Wellness',
    style: 'dark',
    subtitle: 'Mental Wellness',
    title: 'Mind & Body Sync. Meditation for high performance athletes.',
    icon: <Zap size={20} className="text-purple-400" />,
    buttonText: 'Start Now'
  },
  {
    id: 6,
    category: 'Wellness',
    style: 'image',
    title: 'Nutrition Workshops',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop',
    stats: { main: '100+', sub: 'Recipes', badge: 'New' },
    location: 'Online'
  },
  {
    id: 7,
    category: 'Community',
    style: 'image',
    title: 'Global Run Club',
    image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?q=80&w=1000&auto=format&fit=crop',
    stats: { main: '15k', sub: 'Runners', badge: 'Hot' },
    location: 'Worldwide'
  },
];

export const Program: React.FC = () => {
  const container = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredPrograms, setFilteredPrograms] = useState(allPrograms);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(400);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Filter Logic
  useEffect(() => {
    // Animate out
    gsap.to(sliderRef.current, {
        opacity: 0, 
        duration: 0.3, 
        onComplete: () => {
            const newPrograms = activeCategory === 'All' 
                ? allPrograms 
                : allPrograms.filter(p => p.category === activeCategory);
            
            setFilteredPrograms(newPrograms);
            setActiveIndex(0);
            
            // Animate in
            gsap.to(sliderRef.current, { opacity: 1, duration: 0.4, delay: 0.1 });
        }
    });
  }, [activeCategory]);

  const updateWidth = useCallback(() => {
    if (sliderRef.current && sliderRef.current.children.length > 0) {
      const card = sliderRef.current.children[0] as HTMLElement;
      if (card) {
        // Gap check: Mobile usually 24px (gap-6), Desktop 32px (gap-8)
        const isDesktop = window.innerWidth >= 1024;
        const gap = isDesktop ? 32 : 24;
        setCardWidth(card.offsetWidth + gap);
      }
    }
  }, [filteredPrograms]);

  useEffect(() => {
    const timer = setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, [updateWidth]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation for Header
      gsap.from(".program-header-anim", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        }
      });

      // Cards Staggered Entrance
      gsap.from(".program-card", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
            trigger: sliderRef.current,
            start: "top 85%",
        }
      });

    }, container);
    return () => ctx.revert();
  }, []);

  // Counter Animation on Change
  useEffect(() => {
    if (counterRef.current) {
        gsap.fromTo(counterRef.current, 
            { y: 10, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
    }
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    if (filteredPrograms.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredPrograms.length);
  }, [filteredPrograms.length]);

  const handlePrev = useCallback(() => {
    if (filteredPrograms.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredPrograms.length) % filteredPrograms.length);
  }, [filteredPrograms.length]);

  // Auto-play
  useEffect(() => {
    if (isHoverPaused) return; 
    
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [isHoverPaused, handleNext]);

  // Slider Movement Animation
  useEffect(() => {
    if (sliderRef.current) {
        gsap.to(sliderRef.current, {
            x: -activeIndex * cardWidth,
            duration: 0.8,
            ease: "power3.inOut"
        });
    }
  }, [activeIndex, cardWidth]);

  // Touch logic
  const onTouchStart = (e: React.TouchEvent) => {
      setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    if (distance < -50) handlePrev();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <section ref={container} className="py-16 md:py-24 px-4 md:px-10 bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden relative">
      <div className="max-w-[1800px] mx-auto">
      
      {/* HEADER SECTION */}
      <div className="mb-12 md:mb-24">
         {/* Top Row: Filters & Label */}
         <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            
            {/* Categories - Sticky on Mobile */}
            <div className="sticky top-[70px] md:static z-40 bg-white/90 dark:bg-zinc-950/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none w-screen -mx-4 px-4 md:w-auto md:mx-0 md:px-0 py-4 md:py-0 transition-all border-b md:border-b-0 border-gray-100 dark:border-zinc-800 md:border-transparent">
                <div className="flex flex-wrap gap-2 program-header-anim">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 ${
                                activeCategory === cat 
                                ? 'bg-brand-dark dark:bg-white text-white dark:text-brand-dark border-transparent shadow-md transform scale-105' 
                                : 'bg-transparent text-gray-500 border-gray-200 dark:border-zinc-800 hover:border-brand-orange hover:text-brand-orange'
                            }`}
                        >
                            {cat === 'All' && <Sparkles size={12} className={activeCategory === cat ? 'fill-current' : ''} />}
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Label */}
            <div className="flex items-center gap-2 program-header-anim">
               <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
               <span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">The Program</span>
            </div>
         </div>

         {/* Title Row */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 program-header-anim">
                 <h2 ref={titleRef} className="text-4xl sm:text-5xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-medium leading-[0.95] dark:text-white tracking-tighter">
                   Elevate your <br className="hidden md:block" />
                   <span className="relative inline-flex items-center mx-2 align-baseline">
                     <img src="https://images.unsplash.com/photo-1628779238951-be2c9f256548?q=80&w=200&auto=format&fit=crop" className="w-10 h-10 md:w-20 md:h-20 rounded-full object-cover border-[3px] border-white dark:border-zinc-800 shadow-xl rotate-12" alt="Ball" />
                   </span>
                   experience <br className="hidden md:block"/>
                   with handpicked featured.
                </h2>
            </div>
            <div className="lg:col-span-4 program-header-anim text-left lg:text-right pb-4">
               <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-xs ml-auto leading-relaxed">
                  Your sports journey starts right here with us and the crew.
               </p>
            </div>
         </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
         
         {/* Left Column: Counter & Controls (Desktop Sticky, Mobile Flex Row) */}
         <div className="lg:col-span-3 pt-4 program-header-anim relative z-10 mb-8 lg:mb-0 order-2 lg:order-1">
            <div className="lg:sticky lg:top-32 flex flex-row lg:flex-col justify-between items-end lg:items-start w-full gap-4">
                <div>
                    <div className="flex items-baseline mb-2">
                        <span ref={counterRef} className="text-6xl md:text-8xl font-medium tracking-tighter text-brand-dark dark:text-white leading-none">
                            {String(activeIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="text-xl md:text-2xl text-gray-300 dark:text-zinc-700 font-medium ml-2">
                            /{filteredPrograms.length}
                        </span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-brand-orange mb-0 lg:mb-8 flex items-center gap-2">
                    <PlayCircle size={12}/>
                    Upcoming Event
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                    <button 
                        onClick={handlePrev}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group shadow-sm active:scale-95"
                        aria-label="Previous Slide"
                    >
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform stroke-[1.5]"/>
                    </button>
                    <button 
                        onClick={handleNext}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300 shadow-xl shadow-brand-orange/20 group active:scale-95"
                        aria-label="Next Slide"
                    >
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform stroke-[1.5]"/>
                    </button>
                </div>
            </div>
         </div>

         {/* Right Column: Content Window */}
         <div 
            className="lg:col-span-9 -mx-4 px-4 lg:mx-0 lg:px-0 program-header-anim order-1 lg:order-2"
            onMouseEnter={() => setIsHoverPaused(true)}
            onMouseLeave={() => setIsHoverPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
         >
            {/* Slider container: flex-row always */}
            <div ref={sliderRef} className="flex flex-row gap-6 lg:gap-8 w-max py-4 lg:pl-1 lg:min-h-[600px]">
                {filteredPrograms.map((item) => (
                    <div 
                        key={item.id} 
                        className="program-card w-[85vw] md:w-[480px] h-[500px] md:h-[580px] flex-shrink-0 relative group perspective-1000"
                    >
                        {item.style === 'dark' && (
                            <div className="bg-[#1a1a1c] text-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 h-full flex flex-col justify-between relative overflow-hidden border border-white/5 transition-transform duration-500 hover:-translate-y-2 shadow-2xl">
                                {/* Gradient Mesh Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 via-[#1a1a1c] to-black z-0"></div>
                                {/* Noise Texture */}
                                <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: `url("${NOISE_SVG}")` }}></div>
                                
                                {/* Decorative Glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2 z-0"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2 z-0"></div>
                                
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-8 md:mb-12">
                                        <div className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
                                            <span className="w-1.5 h-1.5 bg-brand-orange rounded-full shadow-[0_0_8px_#ea580c]"></span> {item.subtitle}
                                        </div>
                                        {item.icon || <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm"><Zap size={16} className="text-white"/></div>}
                                    </div>
                                    
                                    <h3 className="text-3xl md:text-[3rem] leading-[1.05] font-medium tracking-tight mb-6">
                                        {item.title}
                                    </h3>
                                    
                                    <div className="mt-auto">
                                         {item.avatars && (
                                            <div className="flex items-center gap-3 mb-8">
                                                <span className="flex -space-x-3">
                                                    {item.avatars.map((av, i) => (
                                                        <img key={i} src={`https://i.pravatar.cc/150?img=${av}`} className="w-10 h-10 rounded-full border-2 border-[#1a1a1c]" alt="User"/>
                                                    ))}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-gray-400 font-bold ml-2">+2.4k joined</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center border-t border-white/10 pt-6">
                                            <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-mint">
                                                {item.live && <span className="relative flex h-2 w-2 mr-1">
                                                  <span className="absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75 animate-ping"></span>
                                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
                                                </span>}
                                                {item.live && "Live Now"}
                                            </div>
                                            <button className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-brand-dark bg-white px-6 py-3 rounded-full hover:bg-gray-200 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] group/btn">
                                                {item.buttonText} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {item.style === 'image' && (
                            <div className="rounded-[2rem] md:rounded-[2.5rem] h-full relative overflow-hidden cursor-pointer bg-gray-900 transition-transform duration-500 hover:-translate-y-2 shadow-2xl border border-transparent dark:border-white/5">
                                <img 
                                    src={item.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    alt={item.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-1/3"></div>
                                
                                {item.stats && (
                                    <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl rounded-[2rem] p-1.5 pr-5 flex items-center gap-3 text-white border border-white/20 group-hover:rotate-3 transition-transform duration-500 shadow-lg z-20">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange flex items-center justify-center font-bold text-xs shadow-md">
                                            {item.stats.badge}
                                        </div>
                                        <div className="text-left">
                                           <div className="text-base md:text-lg font-bold leading-none">{item.stats.main}</div>
                                           <div className="text-[8px] md:text-[9px] uppercase tracking-wider opacity-80 font-bold">{item.stats.sub}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Glassmorphism Content Area */}
                                <div className="absolute bottom-6 left-6 right-6 z-20">
                                     <div className="p-6 md:p-8 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-colors">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex -space-x-3 items-center">
                                                <div className="w-10 h-10 rounded-full border border-white/30 overflow-hidden"><img src={`https://i.pravatar.cc/150?u=${item.id}`} className="w-full h-full object-cover" alt="Avatar" /></div>
                                                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-[10px] font-bold border border-white/30">
                                                    <Users size={12}/>
                                                </div>
                                            </div>
                                            <div className="text-white">
                                                <div className="text-sm md:text-base font-bold leading-tight">{item.category}</div>
                                                <div className="text-[8px] md:text-[9px] opacity-70 uppercase tracking-widest flex items-center gap-1"><MapPin size={8} /> {item.location}</div>
                                            </div>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight max-w-[90%]">{item.title}</h3>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] md:text-[10px] text-gray-200 uppercase tracking-widest flex items-center gap-2 font-bold">
                                                Explore Program
                                            </p>
                                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors shadow-lg">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
         </div>
      </div>
      </div>
    </section>
  );
};
