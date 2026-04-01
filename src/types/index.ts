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
}

export interface WeeklyStats {
  labels: string[];
  data: number[];
  goal: number;
}
