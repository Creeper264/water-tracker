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
  const [isInitialized, setIsInitialized] = useState(false);

  // 初始化主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const settings = await getSettings();
        // 防御性检查：确保 settings.theme 存在
        const savedTheme = settings?.theme ?? 'dark';
        setThemeState(savedTheme);
        setColors(getThemeColors(savedTheme, systemColorScheme ?? 'dark'));
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading theme:', error);
        // 使用默认值
        setThemeState('dark');
        setColors(getThemeColors('dark', 'dark'));
        setIsInitialized(true);
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
      if (settings) {
        settings.theme = newTheme;
        await saveSettings(settings);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // 在初始化完成前不渲染子组件，避免竞态条件
  if (!isInitialized) {
    return null;
  }

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
