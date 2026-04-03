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
