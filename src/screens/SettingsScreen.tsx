import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { UserSettings } from '../types';
import {
  requestNotificationPermissions,
  scheduleWaterReminders,
  cancelAllReminders,
} from '../utils/notifications';

interface SettingsScreenProps {
  settings: UserSettings | null;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [dailyGoal, setDailyGoal] = useState(settings?.dailyGoal?.toString() || '2000');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settings?.notificationsEnabled || false
  );
  const [interval, setInterval] = useState(
    settings?.notificationInterval?.toString() || '60'
  );
  const [startHour, setStartHour] = useState(
    settings?.notificationStartHour?.toString() || '8'
  );
  const [endHour, setEndHour] = useState(
    settings?.notificationEndHour?.toString() || '22'
  );

  const handleSaveGoal = () => {
    const goal = parseInt(dailyGoal, 10);
    if (isNaN(goal) || goal < 100 || goal > 10000) {
      Alert.alert('Invalid Goal', 'Please enter a goal between 100 and 10000 ml');
      return;
    }
    onUpdateSettings({ dailyGoal: goal });
    Alert.alert('Success', 'Daily goal updated!');
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings'
        );
        return;
      }
      const intervalMin = parseInt(interval, 10) || 60;
      const start = parseInt(startHour, 10) || 8;
      const end = parseInt(endHour, 10) || 22;
      await scheduleWaterReminders(intervalMin, start, end);
    } else {
      await cancelAllReminders();
    }
    setNotificationsEnabled(value);
    onUpdateSettings({
      notificationsEnabled: value,
      notificationInterval: parseInt(interval, 10) || 60,
      notificationStartHour: parseInt(startHour, 10) || 8,
      notificationEndHour: parseInt(endHour, 10) || 22,
    });
  };

  const handleSaveNotificationSettings = async () => {
    if (!notificationsEnabled) return;

    const intervalMin = parseInt(interval, 10);
    const start = parseInt(startHour, 10);
    const end = parseInt(endHour, 10);

    if (isNaN(intervalMin) || intervalMin < 15 || intervalMin > 240) {
      Alert.alert('Invalid Interval', 'Please enter an interval between 15 and 240 minutes');
      return;
    }

    if (isNaN(start) || start < 0 || start > 23) {
      Alert.alert('Invalid Start Hour', 'Please enter an hour between 0 and 23');
      return;
    }

    if (isNaN(end) || end < 0 || end > 23) {
      Alert.alert('Invalid End Hour', 'Please enter an hour between 0 and 23');
      return;
    }

    if (start >= end) {
      Alert.alert('Invalid Time Range', 'Start hour must be before end hour');
      return;
    }

    await scheduleWaterReminders(intervalMin, start, end);
    onUpdateSettings({
      notificationInterval: intervalMin,
      notificationStartHour: start,
      notificationEndHour: end,
    });
    Alert.alert('Success', 'Notification settings updated!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Goal</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="numeric"
            placeholder="2000"
            placeholderTextColor="#8b8b8b"
          />
          <Text style={styles.inputLabel}>ml</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
          <Text style={styles.saveButtonText}>Save Goal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Enable Reminders</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#2d2d44', true: '#4FC3F7' }}
            thumbColor={notificationsEnabled ? '#ffffff' : '#8b8b8b'}
          />
        </View>

        {notificationsEnabled && (
          <>
            <Text style={styles.inputTitle}>Reminder Interval (minutes)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={interval}
                onChangeText={setInterval}
                keyboardType="numeric"
                placeholder="60"
                placeholderTextColor="#8b8b8b"
              />
              <Text style={styles.inputLabel}>min</Text>
            </View>

            <Text style={styles.inputTitle}>Active Hours</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.input}
                  value={startHour}
                  onChangeText={setStartHour}
                  keyboardType="numeric"
                  placeholder="8"
                  placeholderTextColor="#8b8b8b"
                />
              </View>
              <Text style={styles.timeSeparator}>to</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.input}
                  value={endHour}
                  onChangeText={setEndHour}
                  keyboardType="numeric"
                  placeholder="22"
                  placeholderTextColor="#8b8b8b"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveNotificationSettings}
            >
              <Text style={styles.saveButtonText}>Save Notification Settings</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Water Tracker v1.0.0{'\n'}
          Stay hydrated for optimal performance!{'\n'}{'\n'}
          Vault-Tec Industries is not responsible for any dehydration-related incidents.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#2d2d44',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  inputLabel: {
    color: '#8b8b8b',
    fontSize: 16,
    marginLeft: 10,
  },
  inputTitle: {
    color: '#8b8b8b',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  saveButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    color: '#ffffff',
    fontSize: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    color: '#8b8b8b',
    marginHorizontal: 15,
  },
  aboutText: {
    color: '#8b8b8b',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default SettingsScreen;
