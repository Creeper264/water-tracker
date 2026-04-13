import AsyncStorage from "@react-native-async-storage/async-storage";
import { DailyLog, UserSettings, WaterEntry, StreakData } from "../types";

const STORAGE_KEYS = {
  DAILY_LOGS: "@watertracker:daily_logs",
  SETTINGS: "@watertracker:settings",
  STREAK: "@watertracker:streak",
};

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 2000,
  notificationsEnabled: false,
  notificationInterval: 60,
  notificationStartHour: 8,
  notificationEndHour: 22,
  // v1.1.0 sedentary reminder defaults
  sedentaryReminderEnabled: false,
  sedentaryIntervalMinutes: 45,
  sedentaryStartHour: 9,
  sedentaryEndHour: 18,
  // v2.0.0 theme & customization defaults
  theme: 'dark',
  hapticFeedbackEnabled: true,
  customQuickButtons: [],
};

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastGoalDate: "",
  unlockedItems: [],
};

// Streak milestones: days → unlocked item ID
const UNLOCK_MILESTONES: Record<number, string> = {
  3: "hat_cap",
  5: "trail_stars",
  7: "hat_party",
  10: "trail_sparkle",
  14: "hat_crown",
  15: "trail_heart",
  21: "hat_wizard",
  28: "outfit_wings",
  30: "aura_rainbow",
  35: "accessory_necklace",
  45: "aura_angel",
  60: "aura_cosmic",
};

// ─────────────────────────────────────────────
//  Date helpers
// ─────────────────────────────────────────────

export const getToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

const getYesterday = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    );
  }
  return dates;
};

// ─────────────────────────────────────────────
//  Settings
// ─────────────────────────────────────────────

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    // Merge with defaults so old installs without new fields get sensible values
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// ─────────────────────────────────────────────
//  Daily logs
// ─────────────────────────────────────────────

export const getDailyLog = async (date: string): Promise<DailyLog> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const logs: Record<string, DailyLog> = data ? JSON.parse(data) : {};
    return logs[date] || { date, entries: [], total: 0 };
  } catch (error) {
    console.error("Error loading daily log:", error);
    return { date, entries: [], total: 0 };
  }
};

export const saveDailyLog = async (log: DailyLog): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const logs: Record<string, DailyLog> = data ? JSON.parse(data) : {};
    logs[log.date] = log;
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving daily log:", error);
  }
};

export const addWaterEntry = async (
  date: string,
  amount: number,
): Promise<DailyLog> => {
  const log = await getDailyLog(date);
  const entry: WaterEntry = {
    id: generateId(),
    amount,
    timestamp: Date.now(),
    date,
  };
  log.entries.push(entry);
  log.total = log.entries.reduce((sum, e) => sum + e.amount, 0);
  await saveDailyLog(log);
  return log;
};

export const removeWaterEntry = async (
  date: string,
  entryId: string,
): Promise<DailyLog> => {
  const log = await getDailyLog(date);
  log.entries = log.entries.filter((e) => e.id !== entryId);
  log.total = log.entries.reduce((sum, e) => sum + e.amount, 0);
  await saveDailyLog(log);
  return log;
};

export const getWeeklyData = async (): Promise<Record<string, DailyLog>> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error loading weekly data:", error);
    return {};
  }
};

// ─────────────────────────────────────────────
//  Streak
// ─────────────────────────────────────────────

export const getStreakData = async (): Promise<StreakData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STREAK);
    if (!data) return DEFAULT_STREAK;
    return { ...DEFAULT_STREAK, ...JSON.parse(data) };
  } catch (error) {
    console.error("Error loading streak:", error);
    return DEFAULT_STREAK;
  }
};

export const saveStreakData = async (streak: StreakData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  } catch (error) {
    console.error("Error saving streak:", error);
  }
};

/**
 * Call this whenever today's water total changes.
 * Accepts the current total to avoid a redundant getDailyLog fetch.
 * Returns the updated StreakData (or unchanged data if goal not yet met).
 */
export const updateStreak = async (
  dailyGoal: number,
  todayTotal: number,
): Promise<StreakData> => {
  // Goal not met yet today — nothing to update
  if (todayTotal < dailyGoal) {
    return getStreakData();
  }

  const today = getToday();
  const streak = await getStreakData();

  // Already recorded today's success — idempotent
  if (streak.lastGoalDate === today) {
    return streak;
  }

  const yesterday = getYesterday();
  const isConsecutive = streak.lastGoalDate === yesterday;
  const newStreak = isConsecutive ? streak.currentStreak + 1 : 1;
  const newLongest = Math.max(newStreak, streak.longestStreak);

  // Check for newly earned unlocks
  const newUnlocked = [...streak.unlockedItems];
  for (const [daysStr, itemId] of Object.entries(UNLOCK_MILESTONES)) {
    const days = Number(daysStr);
    if (newStreak >= days && !newUnlocked.includes(itemId)) {
      newUnlocked.push(itemId);
    }
  }

  const updated: StreakData = {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastGoalDate: today,
    unlockedItems: newUnlocked,
  };

  await saveStreakData(updated);
  return updated;
};
