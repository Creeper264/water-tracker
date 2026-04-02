import { useState, useEffect, useCallback, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { DailyLog, UserSettings } from "../types";
import {
  getToday,
  getDailyLog,
  addWaterEntry,
  removeWaterEntry,
  getSettings,
  saveSettings,
  updateStreak,
} from "../utils/storage";

export const useWaterTracker = () => {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const loadedDateRef = useRef<string>("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const today = getToday();
    loadedDateRef.current = today;
    const [log, userSettings] = await Promise.all([
      getDailyLog(today),
      getSettings(),
    ]);
    setTodayLog(log);
    setSettings(userSettings);
    // Fire-and-forget: update streak if today's goal is already met
    // (covers the case where user re-opens the app after having drunk enough)
    if (log.total > 0) {
      updateStreak(userSettings.dailyGoal, log.total).catch(() => {});
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Detect date change when app comes back to foreground
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        const today = getToday();
        if (today !== loadedDateRef.current) {
          loadData();
        }
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [loadData]);

  const addWater = useCallback(
    async (amount: number) => {
      const today = getToday();
      const updatedLog = await addWaterEntry(today, amount);
      setTodayLog(updatedLog);
      // Update streak whenever a new entry might push us over the daily goal
      if (settings && updatedLog.total >= settings.dailyGoal) {
        updateStreak(settings.dailyGoal, updatedLog.total).catch(() => {});
      }
    },
    [settings],
  );

  const removeEntry = useCallback(async (entryId: string) => {
    const today = getToday();
    const updatedLog = await removeWaterEntry(today, entryId);
    setTodayLog(updatedLog);
  }, []);

  const updateSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      if (!settings) return;
      const updated = { ...settings, ...newSettings };
      await saveSettings(updated);
      setSettings(updated);
    },
    [settings],
  );

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
