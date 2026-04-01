import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('water-reminders', {
      name: 'Water Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4FC3F7',
    });
  }
  
  return true;
};

export const scheduleWaterReminders = async (
  intervalMinutes: number,
  startHour: number,
  endHour: number
): Promise<void> => {
  await cancelAllReminders();
  
  const now = new Date();
  const startDate = new Date();
  startDate.setHours(startHour, 0, 0, 0);
  
  if (now > startDate) {
    startDate.setDate(startDate.getDate() + 1);
  }
  
  const totalMinutes = (endHour - startHour) * 60;
  const reminderCount = Math.floor(totalMinutes / intervalMinutes);
  
  for (let i = 0; i < reminderCount; i++) {
    const scheduleTime = new Date(startDate);
    scheduleTime.setMinutes(scheduleTime.getMinutes() + (i * intervalMinutes));
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hydration Check!',
        body: "Time to drink some water! Stay hydrated for optimal performance.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: scheduleTime.getHours(),
        minute: scheduleTime.getMinutes(),
      },
    });
  }
};

export const cancelAllReminders = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledReminders = async (): Promise<Notifications.NotificationRequest[]> => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
