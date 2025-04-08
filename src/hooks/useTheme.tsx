
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
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Check for system preference if no stored theme
    if (!storedTheme) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    return storedTheme || 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  // Theme icon component
  const ThemeIcon: React.FC = () => {
    return theme === 'light' ? (
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
    ) : (
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    );
  };

  useEffect(() => {
    // Store theme preference
    localStorage.setItem('theme', theme);
    
    // Update the document class list
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Add a cool transition effect when changing themes
    if (theme === 'dark') {
      document.body.style.transition = 'background-color 0.5s ease-in-out';
    } else {
      document.body.style.transition = 'background-color 0.5s ease-in-out';
    }
    
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
