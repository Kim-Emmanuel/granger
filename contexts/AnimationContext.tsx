
import React, { createContext, useContext, useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface AnimationContextType {
  isPaused: boolean;
  togglePause: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPaused, setIsPaused] = useState(false);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Optional: Global GSAP timeScale control (use with caution as it affects scroll triggers)
  // For this app, we will control specific components to keep scroll smoothing active.
  
  return (
    <AnimationContext.Provider value={{ isPaused, togglePause }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};
