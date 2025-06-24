
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme;
      return stored || defaultTheme;
    } catch {
      // Fallback for devices with localStorage issues
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;

    // Clear existing theme classes
    root.classList.remove('light', 'dark');

    let appliedTheme: 'light' | 'dark' = 'light';

    if (theme === 'system') {
      try {
        // More robust system theme detection
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        appliedTheme = mediaQuery.matches ? 'dark' : 'light';
        
        // Add listener for system theme changes (with error handling)
        const handleChange = () => {
          if (theme === 'system') {
            const newTheme = mediaQuery.matches ? 'dark' : 'light';
            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
          }
        };

        try {
          mediaQuery.addEventListener('change', handleChange);
          return () => mediaQuery.removeEventListener('change', handleChange);
        } catch {
          // Fallback for older browsers or low-spec devices
          try {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
          } catch {
            // If all else fails, just apply the theme once
          }
        }
      } catch {
        // Fallback to light theme if system detection fails
        appliedTheme = 'light';
      }
    } else {
      appliedTheme = theme;
    }

    // Apply the theme with a small delay for low-spec devices
    requestAnimationFrame(() => {
      root.classList.add(appliedTheme);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch {
        // Continue even if localStorage fails
        console.warn('localStorage not available for theme storage');
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
