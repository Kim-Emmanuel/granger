
import React, { useState, useEffect } from 'react';
import { NavLink } from '../types';
import { Sun, Moon, Menu, ShoppingBag, X, User } from 'lucide-react';
import { gsap } from 'gsap';

const links: NavLink[] = [
  { label: 'Program', href: '#' },
  { label: 'Product', href: '#', isNew: true },
  { label: 'Events', href: '#' },
  { label: 'About', href: '#' },
];

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(".mobile-menu", { x: 0, duration: 0.5, ease: "power3.out" });
      gsap.from(".mobile-link", { y: 20, opacity: 0, stagger: 0.1, delay: 0.2 });
    } else {
      gsap.to(".mobile-menu", { x: "100%", duration: 0.5, ease: "power3.in" });
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/5 backdrop-blur-sm dark:bg-black/5 py-4' : 'bg-transparent py-6 md:py-8'} text-white mix-blend-difference pointer-events-none`}>
        <div className="max-w-[1800px] mx-auto px-6 md:px-10 w-full flex justify-between items-center">
            <div className="pointer-events-auto flex items-center gap-12 md:gap-16">
            <div className="text-2xl md:text-3xl font-black tracking-tighter uppercase cursor-pointer select-none font-sans hover:scale-105 transition-transform origin-left">Granger</div>
            <ul className="hidden md:flex gap-8 text-[11px] font-bold tracking-widest uppercase">
                {links.map((link) => (
                <li key={link.label} className="relative group cursor-pointer flex items-center">
                    <span className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {link.label}
                    </span>
                    {link.isNew && (
                    <div className="relative ml-2 flex items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75 animate-ping"></span>
                        <span className="relative inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-brand-orange text-[8px] font-black text-white leading-none shadow-[0_0_10px_rgba(234,88,12,0.8)]">
                        NEW
                        </span>
                    </div>
                    )}
                    <span className="absolute -bottom-2 left-0 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </li>
                ))}
            </ul>
            </div>

            <div className="pointer-events-auto flex items-center gap-4 md:gap-8 text-[10px] font-bold uppercase tracking-widest">
            <span className="hidden lg:block cursor-pointer hover:bg-white/10 transition-colors border border-white/20 px-6 py-3 rounded-full backdrop-blur-md bg-white/5 whitespace-nowrap">Custom Wellness</span>
            <span className="hidden md:block lg:hidden cursor-pointer hover:text-brand-orange transition-colors whitespace-nowrap">Get in Touch</span>
            
            <div className="flex items-center gap-4 md:pl-8 md:border-l border-white/20 h-8">
                <button className="hidden md:flex hover:opacity-70 transition-opacity hover:scale-110 duration-200" aria-label="Shopping Bag">
                    <ShoppingBag size={20} />
                </button>
                
                <button className="hidden md:flex hover:opacity-70 transition-opacity hover:scale-110 duration-200" aria-label="Login">
                    <User size={20} />
                </button>

                <button 
                    onClick={toggleTheme}
                    className="w-14 h-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 relative flex items-center p-1 transition-all duration-300 hover:bg-white/20 shadow-inner group overflow-hidden"
                    aria-label="Toggle Dark Mode"
                >
                    <div className={`absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div 
                        className={`w-6 h-6 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) transform relative z-10 ${isDark ? 'translate-x-6' : 'translate-x-0'}`}
                    >
                        {isDark ? 
                            <Moon size={12} className="text-brand-dark fill-brand-dark" /> : 
                            <Sun size={12} className="text-brand-orange fill-brand-orange" />
                        }
                    </div>
                </button>
                
                <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors" onClick={() => setIsMenuOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>
            </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className="mobile-menu fixed inset-0 z-[60] bg-brand-dark text-white transform translate-x-full md:hidden flex flex-col pointer-events-auto">
         <div className="flex justify-between items-center p-6 border-b border-white/10">
            <div className="text-2xl font-black uppercase tracking-tighter">Granger</div>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
               <X size={24} />
            </button>
         </div>
         <div className="flex-1 flex flex-col justify-center items-center gap-8 p-10">
            {links.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setIsMenuOpen(false)} className="mobile-link text-3xl font-bold uppercase tracking-wide hover:text-brand-orange transition-colors flex items-center gap-3">
                 {link.label}
                 {link.isNew && <span className="bg-brand-orange text-xs px-2 py-1 rounded text-white font-black tracking-wider animate-pulse">NEW</span>}
              </a>
            ))}
            <a href="#" className="mobile-link mt-8 px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Custom Wellness
            </a>
         </div>
      </div>
    </>
  );
};
