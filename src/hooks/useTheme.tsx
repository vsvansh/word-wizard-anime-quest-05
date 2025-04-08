
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  ThemeIcon: React.FC;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  
  // Initialize theme on component mount
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Check for system preference if no stored theme
    if (!storedTheme) {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDarkMode ? 'dark' : 'light');
    } else {
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Theme icon component
  const ThemeIcon: React.FC = () => {
    return (
      <div className="relative w-[1.2rem] h-[1.2rem]">
        <Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      </div>
    );
  };

  useEffect(() => {
    if (!theme) return;
    
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Update the document class list
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Add a cool transition effect when changing themes
    document.body.style.transition = 'background-color 0.5s ease-in-out, color 0.5s ease-in-out';
    
    // Create sparkle effect on theme change
    const sparkle = document.createElement('div');
    sparkle.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center';
    sparkle.innerHTML = `
      <div class="opacity-0 scale-0 transition-all duration-500 transform ease-out animate-sparkle">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5L61.5 38.5L95 50L61.5 61.5L50 95L38.5 61.5L5 50L38.5 38.5L50 5Z" fill="${theme === 'dark' ? '#8B5CF6' : '#FCD34D'}" />
        </svg>
      </div>
    `;
    document.body.appendChild(sparkle);
    
    // Trigger animation
    setTimeout(() => {
      const sparkleElement = sparkle.firstElementChild as HTMLElement;
      if (sparkleElement) {
        sparkleElement.classList.add('opacity-100', 'scale-100');
      }
    }, 100);
    
    // Remove sparkle
    setTimeout(() => {
      sparkle.remove();
    }, 1000);
    
    // Add beautiful dark mode specific styles 
    if (theme === 'dark') {
      document.body.classList.add('dark-theme-active');
      document.body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, #2d1b69 0%, #1a103e 100%)';
    } else {
      document.body.classList.remove('dark-theme-active');
      document.body.style.backgroundImage = 'radial-gradient(circle at 50% 50%, #f5f7fa 0%, #e8eaed 100%)';
    }
    
    // Add anime-inspired theme music based on theme
    const playThemeSound = () => {
      const audio = new Audio();
      audio.volume = 0.2;
      audio.src = theme === 'dark' 
        ? 'https://assets.mixkit.co/sfx/preview/mixkit-magical-spell-sketch-2596.mp3' 
        : 'https://assets.mixkit.co/sfx/preview/mixkit-fairy-magic-sparkle-875.mp3';
      audio.play().catch(e => console.log('Audio play prevented by browser policy', e));
    };

    // Play theme sound on user interaction
    const handleUserInteraction = () => {
      playThemeSound();
      document.removeEventListener('click', handleUserInteraction);
    };
    document.addEventListener('click', handleUserInteraction);
    
  }, [theme]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    ThemeIcon
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
