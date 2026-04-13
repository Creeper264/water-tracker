import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { AppTheme, ThemeColors } from '../types';
import { getThemeColors } from '../utils/theme';
import { getSettings, saveSettings } from '../utils/storage';

interface ThemeContextType {
  theme: AppTheme;
  colors: ThemeColors;
  setTheme: (theme: AppTheme) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<AppTheme>('dark');
  const [colors, setColors] = useState<ThemeColors>(getThemeColors('dark'));

  // 初始化主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await getSettings();
        setThemeState(settings.theme);
        setColors(getThemeColors(settings.theme, systemColorScheme ?? 'dark'));
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  // 切换主题
  const setTheme = async (newTheme: AppTheme) => {
    try {
      setThemeState(newTheme);
      setColors(getThemeColors(newTheme, systemColorScheme ?? 'dark'));
      
      // 持久化主题设置
      const settings = await getSettings();
      settings.theme = newTheme;
      await saveSettings(settings);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
