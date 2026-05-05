import { Share } from "react-native";
import { getPetData } from "./petStorage";
import { getSettings, getStreakData, getWeeklyData } from "./storage";

export const buildExportPayload = async (): Promise<string> => {
  const [dailyLogs, settings, streak, pet] = await Promise.all([
    getWeeklyData(),
    getSettings(),
    getStreakData(),
    getPetData(),
  ]);

  return JSON.stringify(
    {
      app: "WaterTracker",
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      version: "2.4.0",
      settings,
      dailyLogs,
      streak,
      pet,
    },
    null,
    2,
  );
};

export const exportDataViaShare = async (): Promise<void> => {
  try {
    const payload = await buildExportPayload();
    await Share.share({
      title: "Water Tracker Export",
      message: payload,
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
};
