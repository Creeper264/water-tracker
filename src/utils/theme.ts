import { AppTheme, ThemeColors } from '../types';

/**
 * 深色主题调色盘
 */
export const DARK_THEME: ThemeColors = {
  background: '#1a1a2e',
  card: '#2d2d44',
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  accent: '#4FC3F7',
  border: '#3d3d5c',
};

/**
 * 浅色主题调色盘
 */
export const LIGHT_THEME: ThemeColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#1a1a2e',
  textSecondary: '#666666',
  accent: '#0288d1',
  border: '#e0e0e0',
};

/**
 * 主题配置映射
 */
export const THEMES: Record<Exclude<AppTheme, 'system'>, ThemeColors> = {
  dark: DARK_THEME,
  light: LIGHT_THEME,
};

/**
 * 获取主题颜色配置
 * @param theme 主题类型
 * @param systemColorScheme 系统颜色方案（'dark' 或 'light'）
 */
export const getThemeColors = (
  theme: AppTheme,
  systemColorScheme: 'dark' | 'light' = 'dark'
): ThemeColors => {
  if (theme === 'system') {
    return systemColorScheme === 'dark' ? DARK_THEME : LIGHT_THEME;
  }
  return THEMES[theme] ?? DARK_THEME;
};
