import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { UserSettings } from "../types";

// ─────────────────────────────────────────────
//  Global notification handler
// ─────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─────────────────────────────────────────────
//  Permission & channel setup
// ─────────────────────────────────────────────

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await _ensureWaterChannel();
    await _ensureSedentaryChannel();
  }

  return true;
};

const _ensureWaterChannel = async (): Promise<void> => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("water-reminders", {
    name: "水分补充提醒",
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#4FC3F7",
  });
};

const _ensureSedentaryChannel = async (): Promise<void> => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("sedentary-reminders", {
    name: "久坐提醒",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 100, 200],
    lightColor: "#FF8C00",
  });
};

// ─────────────────────────────────────────────
//  Internal schedulers (no cancel, pure add)
// ─────────────────────────────────────────────

/**
 * Schedule daily water-reminder notifications.
 * Identifiers use prefix "water-{hh}-{mm}" for selective cancellation.
 */
const _scheduleWaterNotifications = async (
  intervalMinutes: number,
  startHour: number,
  endHour: number,
): Promise<void> => {
  await _ensureWaterChannel();

  const totalMinutes = (endHour - startHour) * 60;
  const count = Math.floor(totalMinutes / intervalMinutes);

  for (let i = 0; i < count; i++) {
    const offsetMinutes = i * intervalMinutes;
    const hour = startHour + Math.floor(offsetMinutes / 60);
    const minute = offsetMinutes % 60;

    await Notifications.scheduleNotificationAsync({
      identifier: `water-${hour}-${minute}`,
      content: {
        title: "💧 喝水时间到！",
        body: "记得补充水分，保持最佳状态！",
        sound: true,
        data: { type: "water" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: "water-reminders",
      },
    });
  }
};

/**
 * Schedule daily sedentary-reminder notifications.
 * Identifiers use prefix "sedentary-{hh}-{mm}" for selective cancellation.
 */
const _scheduleSedentaryNotifications = async (
  intervalMinutes: number,
  startHour: number,
  endHour: number,
): Promise<void> => {
  await _ensureSedentaryChannel();

  const totalMinutes = (endHour - startHour) * 60;
  const count = Math.floor(totalMinutes / intervalMinutes);

  for (let i = 0; i < count; i++) {
    const offsetMinutes = i * intervalMinutes;
    const hour = startHour + Math.floor(offsetMinutes / 60);
    const minute = offsetMinutes % 60;

    await Notifications.scheduleNotificationAsync({
      identifier: `sedentary-${hour}-${minute}`,
      content: {
        title: "🧍 久坐提醒",
        body: "已经坐太久了，起来活动一下，顺便喝口水吧！",
        sound: true,
        data: { type: "sedentary" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: "sedentary-reminders",
      },
    });
  }
};

// ─────────────────────────────────────────────
//  Atomic rescheduler (recommended entry point)
// ─────────────────────────────────────────────

/**
 * Cancel ALL scheduled notifications, then re-schedule whichever
 * reminder types are currently enabled in settings.
 *
 * This is the single source of truth for scheduling — always call
 * this when any notification-related setting changes so the two
 * reminder types never accidentally cancel each other.
 */
export const rescheduleAllActiveReminders = async (
  settings: UserSettings,
): Promise<void> => {
  // Wipe everything first for a clean slate
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (settings.notificationsEnabled) {
    await _scheduleWaterNotifications(
      settings.notificationInterval,
      settings.notificationStartHour,
      settings.notificationEndHour,
    );
  }

  if (settings.sedentaryReminderEnabled) {
    await _scheduleSedentaryNotifications(
      settings.sedentaryIntervalMinutes,
      settings.sedentaryStartHour,
      settings.sedentaryEndHour,
    );
  }
};

// ─────────────────────────────────────────────
//  Public convenience helpers
//  (kept for backward-compatibility and direct use)
// ─────────────────────────────────────────────

/** Schedule water reminders only (cancels ALL first). */
export const scheduleWaterReminders = async (
  intervalMinutes: number,
  startHour: number,
  endHour: number,
): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await _scheduleWaterNotifications(intervalMinutes, startHour, endHour);
};

/** Cancel ALL scheduled notifications (both water and sedentary). */
export const cancelAllReminders = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Cancel only sedentary notifications (by identifier prefix).
 * Water reminders are left untouched.
 */
export const cancelSedentaryReminders = async (): Promise<void> => {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => n.identifier.startsWith("sedentary-"))
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
};

/** Return all currently scheduled notifications (useful for debugging). */
export const getScheduledReminders = async (): Promise<
  Notifications.NotificationRequest[]
> => {
  return Notifications.getAllScheduledNotificationsAsync();
};
