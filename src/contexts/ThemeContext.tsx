'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Theme {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
}

interface ThemeContextType {
  currentTheme: Theme;
  themeMode: ThemeMode;
  availableThemes: Theme[];
  setTheme: (themeId: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Temas pré-definidos
const lightTheme: Theme = {
  id: 'light',
  name: 'Claro',
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#8b5cf6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#06b6d4'
  }
};

const darkTheme: Theme = {
  id: 'dark',
  name: 'Escuro',
  mode: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#a78bfa',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#22d3ee'
  }
};

const blueTheme: Theme = {
  id: 'blue',
  name: 'Azul Profissional',
  mode: 'light',
  colors: {
    primary: '#1e40af',
    secondary: '#475569',
    accent: '#0ea5e9',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#475569',
    border: '#cbd5e1',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0284c7'
  }
};

const greenTheme: Theme = {
  id: 'green',
  name: 'Verde Sustentável',
  mode: 'light',
  colors: {
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#10b981',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#d1d5db',
    success: '#047857',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0891b2'
  }
};

const purpleTheme: Theme = {
  id: 'purple',
  name: 'Roxo Criativo',
  mode: 'light',
  colors: {
    primary: '#7c3aed',
    secondary: '#6b7280',
    accent: '#a855f7',
    background: '#fafaf9',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0284c7'
  }
};

const availableThemes = [lightTheme, darkTheme, blueTheme, greenTheme, purpleTheme];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(lightTheme);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');

  // Detectar preferência do sistema
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Aplicar tema ao documento
  const applyTheme = (theme: Theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Aplicar classes do Tailwind
      root.classList.remove('light', 'dark');
      root.classList.add(theme.mode);
      
      // Aplicar variáveis CSS customizadas
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  };

  // Carregar tema salvo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedThemeId = localStorage.getItem('theme-id');
      const savedThemeMode = localStorage.getItem('theme-mode') as ThemeMode;
      
      if (savedThemeMode) {
        setThemeModeState(savedThemeMode);
      }
      
      if (savedThemeId) {
        const theme = availableThemes.find(t => t.id === savedThemeId);
        if (theme) {
          setCurrentTheme(theme);
          applyTheme(theme);
          return;
        }
      }
      
      // Aplicar tema baseado no modo
      const effectiveMode = savedThemeMode === 'auto' ? getSystemTheme() : savedThemeMode || 'light';
      const defaultTheme = effectiveMode === 'dark' ? darkTheme : lightTheme;
      setCurrentTheme(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, []);

  // Escutar mudanças na preferência do sistema
  useEffect(() => {
    if (typeof window !== 'undefined' && themeMode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const systemTheme = getSystemTheme();
        const newTheme = systemTheme === 'dark' ? darkTheme : lightTheme;
        setCurrentTheme(newTheme);
        applyTheme(newTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const setTheme = (themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      applyTheme(theme);
      localStorage.setItem('theme-id', themeId);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('theme-mode', mode);
    
    if (mode === 'auto') {
      const systemTheme = getSystemTheme();
      const newTheme = systemTheme === 'dark' ? darkTheme : lightTheme;
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
    } else {
      const newTheme = mode === 'dark' ? darkTheme : lightTheme;
      setCurrentTheme(newTheme);
      applyTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    const newMode = currentTheme.mode === 'light' ? 'dark' : 'light';
    const newTheme = newMode === 'dark' ? darkTheme : lightTheme;
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    setThemeModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
    localStorage.setItem('theme-id', newTheme.id);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeMode,
        availableThemes,
        setTheme,
        setThemeMode,
        toggleTheme
      }}
    >
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