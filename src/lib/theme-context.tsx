import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';

type Theme = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    // Load theme preference from localStorage first (for immediate UI response)
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    }

    // Then try to load from database if user is authenticated
    const loadThemeFromDB = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('theme')
          .eq('user_id', session.user.id)
          .single();
          
        if (!error && data?.theme) {
          setThemeState(data.theme as Theme);
          applyTheme(data.theme as Theme);
          localStorage.setItem('theme', data.theme);
        }
      }
    };
    
    loadThemeFromDB();
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Save to database if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: session.user.id,
          theme: newTheme,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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