
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { EventItem } from '../types';
import { ArrowUpRight, Zap, MapPin, Ticket, ArrowRight, Trophy } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Extended Event Interface for this component
interface ExtendedEventItem extends EventItem {
  date: string;
  time: string;
  location: string;
  spotsLeft: number;
  totalSpots: number;
  price: string;
}

const events: ExtendedEventItem[] = [
  { 
      id: 1, 
      title: 'Online Fitness Challenge', 
      category: 'Virtual', 
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
      tags: ['Global Access', 'Free Entry'],
      date: 'OCT 24',
      time: '10:00 AM',
      location: 'Zoom / App',
      spotsLeft: 450,
      totalSpots: 1000,
      price: "Free"
  },
  { 
      id: 2, 
      title: 'Youth Sports Camp - 20yo', 
      category: 'Community', 
      image: 'https://images.unsplash.com/photo-1530915518997-64662adc2471?q=80&w=1000&auto=format&fit=crop',
      tags: ['Coach & Trainer', 'Solid Community', 'Team Uniform'],
      date: 'NOV 02',
      time: '08:00 AM',
      location: 'San Diego, CA',
      spotsLeft: 12,
      totalSpots: 50,
      price: "$45.00"
  },
  { 
      id: 3, 
      title: 'Obstacle Course Race', 
      category: 'Physical', 
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1000&auto=format&fit=crop',
      tags: ['Outdoor', 'High Intensity'],
      date: 'NOV 15',
      time: '07:30 AM',
      location: 'Mud Creek Park',
      spotsLeft: 85,
      totalSpots: 200,
      price: "$89.00"
  },
  { 
      id: 4, 
      title: 'Sport x Game Day', 
      category: 'Hybrid', 
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop',
      tags: ['Fun', 'Family'],
      date: 'DEC 10',
      time: '01:00 PM',
      location: 'City Stadium',
      spotsLeft: 20,
      totalSpots: 500,
      price: "$25.00"
  },
  { 
      id: 5, 
      title: 'Trainer Meet & Greet', 
      category: 'Social', 
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
      tags: ['Networking', 'Pro Tips'],
      date: 'JAN 05',
      time: '06:00 PM',
      location: 'The Grand Hall',
      spotsLeft: 5,
      totalSpots: 30,
      price: "$150.00"
  },
];

export const Events: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<ExtendedEventItem>(events[1]);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(".events-header", {
            y: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%"
            }
        });

        gsap.from(".event-item", {
            x: -30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: listRef.current,
                start: "top 80%"
            }
        });
        
        gsap.from(".event-card", {
            scale: 0.95,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: listRef.current,
                start: "top 70%"
            }
        });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (imageRef.current) {
        gsap.fromTo(imageRef.current,
            { scale: 1.1, filter: "brightness(0.8)" },
            { scale: 1, filter: "brightness(1)", duration: 1.2, ease: "power2.out" }
        );
    }
  }, [activeEvent]);

  return (
    <section ref={containerRef} className="px-4 md:px-10 mb-8 max-w-[1800px] mx-auto">
      <div className="bg-[#0f0f11] text-white py-16 md:py-24 px-6 md:px-16 rounded-[2.5rem] overflow-hidden relative min-h-[auto] md:min-h-[900px]">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 md:mb-24 relative z-10 events-header gap-10">
           <div className="max-w-5xl">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(74,165,214,0.6)] animate-pulse"></div>
                  <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase">Current Events</span>
               </div>
               <h2 className="text-4xl md:text-6xl lg:text-[5.5rem] xl:text-[6.5rem] font-medium leading-[0.95] tracking-tight">
                  To win over <span className="inline-block mx-2 relative top-2 md:top-4"><img src="https://images.unsplash.com/photo-1519861531473-92002639313cc?q=80&w=100" className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover border-[3px] border-white/10" alt="Ball"/></span> sports-minded consumers with <span className="text-brand-blue italic font-serif">technology</span> and excellent.
               </h2>
           </div>
           
           <div className="hidden lg:block pb-4">
              <button className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group">
                  <ArrowUpRight size={32} strokeWidth={1.5} className="group-hover:rotate-45 transition-transform duration-300"/>
              </button>
           </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-10">
           
           {/* Left Column: List */}
           <div ref={listRef} className="lg:col-span-6 flex flex-col order-2 lg:order-1">
              {events.map((event, index) => {
                  const isActive = activeEvent.id === event.id;
                  return (
                    <div 
                        key={event.id}
                        title={event.title}
                        onMouseEnter={() => setActiveEvent(event)}
                        className={`event-item group relative cursor-pointer border-t border-white/10 transition-all duration-500 overflow-hidden ${isActive ? 'py-8 md:py-10 bg-brand-orange -mx-6 px-6 rounded-3xl border-transparent shadow-2xl' : 'py-6 md:py-8 opacity-60 hover:opacity-100'}`}
                    >
                        <div className="flex items-start gap-6 md:gap-8 relative z-10">
                            <span className={`text-sm md:text-xl font-bold tracking-tighter transition-colors mt-1.5 ${isActive ? 'text-white/60' : 'text-gray-600'}`}>
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <div className="flex-1">
                                <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 transition-colors duration-300 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                                   {event.category}
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`text-2xl md:text-4xl font-medium tracking-tight transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {event.title}
                                    </h3>
                                    <ArrowUpRight 
                                        size={20} 
                                        className={`transition-all duration-300 ${isActive ? 'rotate-45 text-white opacity-100' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}
                                    />
                                </div>
                                
                                {isActive && (
                                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {event.tags?.map((tag, i) => (
                                                <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 border border-white/10 text-[10px] font-bold uppercase tracking-wide text-white">
                                                    {i === 0 ? <Zap size={10} fill="currentColor" /> : 
                                                    i === 1 ? <Trophy size={10} fill="currentColor" /> :
                                                    <MapPin size={10} fill="currentColor" />} 
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                            <div className="flex items-center gap-4">
                                                 <div className="flex flex-col">
                                                     <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 mb-1">Spots Left</span>
                                                     <div className="flex items-center gap-2">
                                                         <span className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                                                            <span className="block h-full bg-white rounded-full" style={{ width: `${(event.spotsLeft / event.totalSpots) * 100}%` }}></span>
                                                         </span>
                                                         <span className="text-xs font-bold text-white">{event.spotsLeft}</span>
                                                     </div>
                                                 </div>
                                            </div>
                                            <button className="bg-white text-brand-orange px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-colors flex items-center gap-2 shadow-lg">
                                                Book Now <Ticket size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                  );
              })}
              <div className="border-t border-white/10 w-full"></div>
           </div>

           {/* Right Column: Image Card */}
           <div className="lg:col-span-6 h-[400px] md:h-[600px] lg:h-auto sticky top-24 order-1 lg:order-2">
               <div className="event-card w-full h-full rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-black/50 bg-[#1a1a1c]" title={activeEvent.title}>
                   <img 
                      ref={imageRef}
                      src={activeEvent.image}
                      alt={activeEvent.title}
                      className="absolute inset-0 w-full h-full object-cover"
                   />
                   
                   {/* Cinematic Gradient Overlays */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                   <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                   
                   {/* Top Card Info */}
                   <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                       <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white">{activeEvent.category}</span>
                       </div>
                       
                       <div className="flex flex-col items-end bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                           <span className="text-3xl font-black text-white leading-none">{activeEvent.date.split(' ')[1]}</span>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{activeEvent.date.split(' ')[0]}</span>
                       </div>
                   </div>

                   {/* Bottom Card Info */}
                   <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20">
                       <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                           <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[0.95] tracking-tight max-w-md">
                               {activeEvent.title}
                           </h3>
                           
                           <div className="flex items-center gap-4 border-t border-white/20 pt-6 justify-between">
                                <div className="flex flex-col items-start">
                                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</span>
                                   <span className="text-sm font-bold text-white flex items-center gap-1"><MapPin size={12}/> {activeEvent.location}</span>
                               </div>
                               <div className="flex items-center gap-4">
                                   <div className="flex flex-col items-end text-right">
                                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Entry</span>
                                       <span className="text-sm font-bold text-white flex items-center gap-1">{activeEvent.price}</span>
                                   </div>
                                   <button className="w-14 h-14 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-orange/30 hover:scale-110 transition-transform hover:bg-white hover:text-brand-orange">
                                       <ArrowRight size={24} />
                                   </button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

        </div>
      </div>
    </section>
  );
};
