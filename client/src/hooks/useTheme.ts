import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function useTheme() {
  const { user } = useAuth();

  useEffect(() => {
    const applyTheme = () => {
      const theme = user?.theme || 'light';
      const root = document.documentElement;

      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else if (theme === 'auto') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes if theme is 'auto'
    if (user?.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [user?.theme]);
}
