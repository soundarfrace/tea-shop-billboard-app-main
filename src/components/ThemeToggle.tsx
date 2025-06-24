
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isToggling, setIsToggling] = useState(false);

  const toggleTheme = async () => {
    if (isToggling) return; // Prevent rapid toggling on slow devices
    
    setIsToggling(true);
    
    // Use setTimeout to ensure smooth transition on low-spec devices
    setTimeout(() => {
      if (theme === 'light') {
        setTheme('dark');
      } else if (theme === 'dark') {
        setTheme('light');
      } else {
        // If system theme, switch to opposite of current system preference
        try {
          const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setTheme(isDarkSystem ? 'light' : 'dark');
        } catch {
          setTheme('light'); // Fallback
        }
      }
      
      // Reset toggling state after a short delay
      setTimeout(() => setIsToggling(false), 300);
    }, 50);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isToggling}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
