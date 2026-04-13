export interface WaterEntry {
  id: string;
  amount: number;
  timestamp: number;
  date: string;
}

export interface DailyLog {
  date: string;
  entries: WaterEntry[];
  total: number;
}

export interface UserSettings {
  dailyGoal: number;
  notificationsEnabled: boolean;
  notificationInterval: number;
  notificationStartHour: number;
  notificationEndHour: number;
  // v1.1.0: Sedentary reminder
  sedentaryReminderEnabled: boolean;
  sedentaryIntervalMinutes: number;
  sedentaryStartHour: number;
  sedentaryEndHour: number;
  // v2.0.0: Theme & Customization
  theme: AppTheme;
  hapticFeedbackEnabled: boolean;
  customQuickButtons: QuickButton[];
}

export interface WeeklyStats {
  labels: string[];
  data: number[];
  goal: number;
}

// v1.2.0: Streak & Pet system
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastGoalDate: string; // 'YYYY-MM-DD', or '' if never achieved
  unlockedItems: string[];
}

export type PetState =
  | "dying"
  | "dehydrated"
  | "normal"
  | "good"
  | "happy"
  | "overflow";

// v1.4.0: Pet growth system
export interface PetData {
  level: number;
  experience: number;
  totalWaterDrank: number; // 总共喝的水（毫升）
  name: string;
  createdAt: number;
  lastFedAt: number;
}

// 等级配置
export const PET_LEVELS = {
  MAX_LEVEL: 50,
  BASE_EXP: 100, // 升级所需基础经验
  EXP_MULTIPLIER: 1.5, // 每级经验倍率
};

// 等级对应的称号
export const LEVEL_TITLES: Record<number, string> = {
  1: "水滴宝宝",
  5: "小水珠",
  10: "清泉精灵",
  15: "溪流守护者",
  20: "河流使者",
  25: "湖泊领主",
  30: "海洋之子",
  35: "水系大师",
  40: "水神使者",
  45: "水神",
  50: "水之至尊",
};

// v1.4.0: Pixel Art System
export type PixelCode = string; // 调色盘索引（如 'S' 代表皮肤色）
export type PixelFrame = PixelCode[][]; // 单帧像素数据（二维数组）
export type Palette = Record<PixelCode, string | null>; // 调色盘映射（索引 -> 颜色）

// 动画配置
export interface AnimationConfig {
  frames: PixelFrame[]; // 帧序列
  interval: number; // 帧间隔（毫秒）
  loop: boolean; // 是否循环
}

// 宠物动画状态
export interface PetAnimationState {
  state: PetState;
  animation: AnimationConfig;
  decorations: PixelDecoration[];
}

// 像素装饰品
export interface PixelDecoration {
  id: string;
  frames: PixelFrame[];
  offset: { x: number; y: number }; // 相对于小人的偏移
  anchor: "head" | "body" | "feet"; // 锚点位置
}

// 场景互动元素
export interface InteractiveSceneElement {
  id: string;
  type: "window" | "plant" | "cup" | "computer" | "frame";
  position: { x: number; y: number };
  size: { width: number; height: number };
  frames: PixelFrame[];
  onInteract?: () => void;
}

// v2.0.0: Theme System
export type AppTheme = 'dark' | 'light' | 'system';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
}

// v2.0.0: Custom Quick Buttons
export interface QuickButton {
  id: string;
  amount: number;
  order: number;
}
