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
