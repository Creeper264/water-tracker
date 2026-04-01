import { useState, useEffect, useCallback } from 'react';
import { DailyLog, UserSettings } from '../types';
import {
  getToday,
  getDailyLog,
  addWaterEntry,
  removeWaterEntry,
  getSettings,
  saveSettings,
} from '../utils/storage';

export const useWaterTracker = () => {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const today = getToday();
    const [log, userSettings] = await Promise.all([
      getDailyLog(today),
      getSettings(),
    ]);
    setTodayLog(log);
    setSettings(userSettings);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addWater = useCallback(async (amount: number) => {
    const today = getToday();
    const updatedLog = await addWaterEntry(today, amount);
    setTodayLog(updatedLog);
  }, []);

  const removeEntry = useCallback(async (entryId: string) => {
    const today = getToday();
    const updatedLog = await removeWaterEntry(today, entryId);
    setTodayLog(updatedLog);
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    const updated = { ...settings, ...newSettings };
    await saveSettings(updated);
    setSettings(updated);
  }, [settings]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return {
    todayLog,
    settings,
    loading,
    addWater,
    removeEntry,
    updateSettings,
    refresh,
  };
};
