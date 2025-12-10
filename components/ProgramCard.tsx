
import React from 'react';
import { ProgramItem } from '../types';
import { ArrowRight, Trophy, Zap, Sparkles, Users, MapPin } from 'lucide-react';

interface ProgramCardProps {
  item: ProgramItem;
  className?: string;
}

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

export const ProgramCard: React.FC<ProgramCardProps> = ({ item, className = "" }) => {
  
  const renderIcon = (type?: string) => {
    switch(type) {
      case 'trophy': return <Trophy size={20} className="text-yellow-400" />;
      case 'zap': return <Zap size={20} className="text-purple-400" />;
      case 'sparkles': return <Sparkles size={20} className="text-blue-400" />;
      default: return <Zap size={16} className="text-white" />;
    }
  };

  return (
    <div className={`program-card relative group perspective-1000 ${className}`}>
      {item.style === "dark" && (
        <div className="bg-[#1a1a1c] text-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 lg:p-12 h-full flex flex-col justify-between relative overflow-hidden border border-white/5 transition-transform duration-500 hover:-translate-y-2 shadow-2xl">
          {/* Gradient Mesh Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 via-[#1a1a1c] to-black z-0"></div>
          {/* Noise Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none"
            style={{ backgroundImage: `url("${NOISE_SVG}")` }}
          ></div>

          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2 z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/10 blur-[80px] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2 z-0"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6 md:mb-10">
              <div className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 bg-brand-orange rounded-full shadow-[0_0_8px_#ea580c]"></span>{" "}
                {item.subtitle || 'Program'}
              </div>
              {item.iconType && item.iconType !== 'none' ? renderIcon(item.iconType) : (
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  {renderIcon('default')}
                </div>
              )}
            </div>

            <h3 className="text-3xl md:text-4xl lg:text-[3rem] leading-[1.05] font-medium tracking-tight mb-4 md:mb-6">
              {item.title}
            </h3>

            <div className="mt-auto">
              {item.avatars && (
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <span className="flex -space-x-3">
                    {item.avatars.map((av, i) => (
                      <img
                        key={i}
                        src={`https://i.pravatar.cc/150?img=${av}`}
                        className="w-10 h-10 rounded-full border-2 border-[#1a1a1c]"
                        alt="User"
                      />
                    ))}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 font-bold ml-2">
                    +2.4k joined
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-brand-mint">
                  {item.live && (
                    <span className="relative flex h-2 w-2 mr-1">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
                    </span>
                  )}
                  {item.live && "Live Now"}
                </div>
                <button className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-brand-dark bg-white px-5 py-2.5 md:px-6 md:py-3 rounded-full hover:bg-gray-200 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] group/btn">
                  {item.buttonText || 'Explore'}{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {item.style === "image" && (
        <div className="rounded-[2rem] md:rounded-[2.5rem] h-full relative overflow-hidden cursor-pointer bg-gray-900 transition-transform duration-500 hover:-translate-y-2 shadow-2xl border border-transparent dark:border-white/5">
          <img
            src={item.image}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            alt={item.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent h-1/3"></div>

          {item.stats && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/10 backdrop-blur-xl rounded-[2rem] p-1.5 pr-4 md:pr-5 flex items-center gap-2 md:gap-3 text-white border border-white/20 group-hover:rotate-3 transition-transform duration-500 shadow-lg z-20">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-orange flex items-center justify-center font-bold text-xs shadow-md">
                {item.stats.badge}
              </div>
              <div className="text-left">
                <div className="text-base md:text-lg font-bold leading-none">
                  {item.stats.main}
                </div>
                <div className="text-[8px] md:text-[9px] uppercase tracking-wider opacity-80 font-bold">
                  {item.stats.sub}
                </div>
              </div>
            </div>
          )}

          {/* Glassmorphism Content Area */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-20">
            <div className="p-5 md:p-8 bg-white/10 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div className="flex -space-x-3 items-center">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/30 overflow-hidden">
                    <img
                      src={`https://i.pravatar.cc/150?u=${item.id}`}
                      className="w-full h-full object-cover"
                      alt="Avatar"
                    />
                  </div>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center text-[10px] font-bold border border-white/30">
                    <Users size={12} />
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-sm md:text-base font-bold leading-tight">
                    {item.category}
                  </div>
                  <div className="text-[8px] md:text-[9px] opacity-70 uppercase tracking-widest flex items-center gap-1">
                    <MapPin size={8} /> {item.location || 'Online'}
                  </div>
                </div>
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-4 md:mb-6 leading-tight max-w-[95%]">
                {item.title}
              </h3>
              <div className="flex justify-between items-center">
                <p className="text-[9px] md:text-[10px] text-gray-200 uppercase tracking-widest flex items-center gap-2 font-bold">
                  Explore Program
                </p>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors shadow-lg">
                  <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
