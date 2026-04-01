import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyLog, UserSettings, WaterEntry } from '../types';

const STORAGE_KEYS = {
  DAILY_LOGS: '@watertracker:daily_logs',
  SETTINGS: '@watertracker:settings',
};

const DEFAULT_SETTINGS: UserSettings = {
  dailyGoal: 2000,
  notificationsEnabled: false,
  notificationInterval: 60,
  notificationStartHour: 8,
  notificationEndHour: 22,
};

export const getToday = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: UserSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getDailyLog = async (date: string): Promise<DailyLog> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    const logs: Record<string, DailyLog> = data ? JSON.parse(data) : {};
    return logs[date] || { date, entries: [], total: 0 };
  } catch (error) {
    console.error('Error loading daily log:', error);
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
    console.error('Error saving daily log:', error);
  }
};

export const addWaterEntry = async (date: string, amount: number): Promise<DailyLog> => {
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

export const removeWaterEntry = async (date: string, entryId: string): Promise<DailyLog> => {
  const log = await getDailyLog(date);
  log.entries = log.entries.filter(e => e.id !== entryId);
  log.total = log.entries.reduce((sum, e) => sum + e.amount, 0);
  await saveDailyLog(log);
  return log;
};

export const getWeeklyData = async (): Promise<Record<string, DailyLog>> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading weekly data:', error);
    return {};
  }
};

export const getDateRange = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
  }
  return dates;
};
