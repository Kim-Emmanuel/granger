
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Program } from './components/Program';
import { Tracking } from './components/Tracking';
import { Events } from './components/Events';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroStart, setHeroStart] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleSplashComplete = () => {
    setLoading(false);
    setHeroStart(true);
  };

  return (
    <div className="w-full min-h-screen relative bg-gray-50 dark:bg-brand-dark text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-brand-orange selection:text-white">
      {loading && <SplashScreen onComplete={handleSplashComplete} />}
      
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <main>
        <Hero startAnimation={heroStart} />
        <Features />
        <Program />
        <Tracking />
        <Events />
        <Testimonials />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
