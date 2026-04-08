import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { UserSettings } from "../types";
import {
  requestNotificationPermissions,
  rescheduleAllActiveReminders,
} from "../utils/notifications";

interface SettingsScreenProps {
  settings: UserSettings | null;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  // ── Water goal ──
  const [dailyGoal, setDailyGoal] = useState(
    settings?.dailyGoal?.toString() || "2000",
  );

  // ── Water reminders ──
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    settings?.notificationsEnabled || false,
  );
  const [interval, setInterval] = useState(
    settings?.notificationInterval?.toString() || "60",
  );
  const [startHour, setStartHour] = useState(
    settings?.notificationStartHour?.toString() || "8",
  );
  const [endHour, setEndHour] = useState(
    settings?.notificationEndHour?.toString() || "22",
  );

  // ── Sedentary reminders ──
  const [sedentaryEnabled, setSedentaryEnabled] = useState(
    settings?.sedentaryReminderEnabled || false,
  );
  const [sedentaryInterval, setSedentaryInterval] = useState(
    settings?.sedentaryIntervalMinutes?.toString() || "45",
  );
  const [sedentaryStart, setSedentaryStart] = useState(
    settings?.sedentaryStartHour?.toString() || "9",
  );
  const [sedentaryEnd, setSedentaryEnd] = useState(
    settings?.sedentaryEndHour?.toString() || "18",
  );

  // Sync local form state whenever settings prop changes (async load)
  useEffect(() => {
    if (settings) {
      setDailyGoal(settings.dailyGoal.toString());
      setNotificationsEnabled(settings.notificationsEnabled);
      setInterval(settings.notificationInterval.toString());
      setStartHour(settings.notificationStartHour.toString());
      setEndHour(settings.notificationEndHour.toString());
      setSedentaryEnabled(settings.sedentaryReminderEnabled);
      setSedentaryInterval(settings.sedentaryIntervalMinutes.toString());
      setSedentaryStart(settings.sedentaryStartHour.toString());
      setSedentaryEnd(settings.sedentaryEndHour.toString());
    }
  }, [settings]);

  // ────────────────────────────────────────────
  //  Helpers
  // ────────────────────────────────────────────

  /** Build a full UserSettings object from current local state + incoming partial. */
  const buildFullSettings = (partial: Partial<UserSettings>): UserSettings => ({
    dailyGoal: parseInt(dailyGoal, 10) || 2000,
    notificationsEnabled,
    notificationInterval: parseInt(interval, 10) || 60,
    notificationStartHour: parseInt(startHour, 10) || 8,
    notificationEndHour: parseInt(endHour, 10) || 22,
    sedentaryReminderEnabled: sedentaryEnabled,
    sedentaryIntervalMinutes: parseInt(sedentaryInterval, 10) || 45,
    sedentaryStartHour: parseInt(sedentaryStart, 10) || 9,
    sedentaryEndHour: parseInt(sedentaryEnd, 10) || 18,
    ...partial,
  });

  // ────────────────────────────────────────────
  //  Daily goal
  // ────────────────────────────────────────────

  const handleSaveGoal = () => {
    const goal = parseInt(dailyGoal, 10);
    if (isNaN(goal) || goal < 100 || goal > 10000) {
      Alert.alert("无效目标", "请输入 100 ~ 10000 ml 之间的数值");
      return;
    }
    onUpdateSettings({ dailyGoal: goal });
    Alert.alert("保存成功", "每日饮水目标已更新！");
  };

  // ────────────────────────────────────────────
  //  Water reminder handlers
  // ────────────────────────────────────────────

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert("权限被拒绝", "请在设备设置中开启通知权限");
        return;
      }
    }
    const newPartial: Partial<UserSettings> = { notificationsEnabled: value };
    const full = buildFullSettings(newPartial);
    await rescheduleAllActiveReminders(full);
    setNotificationsEnabled(value);
    onUpdateSettings(newPartial);
  };

  const handleSaveWaterSettings = async () => {
    if (!notificationsEnabled) return;

    const intervalMin = parseInt(interval, 10);
    const start = parseInt(startHour, 10);
    const end = parseInt(endHour, 10);

    if (isNaN(intervalMin) || intervalMin < 15 || intervalMin > 240) {
      Alert.alert("无效间隔", "请输入 15 ~ 240 分钟之间的数值");
      return;
    }
    if (isNaN(start) || start < 0 || start > 23) {
      Alert.alert("无效时间", "开始时间请输入 0 ~ 23");
      return;
    }
    if (isNaN(end) || end < 0 || end > 23) {
      Alert.alert("无效时间", "结束时间请输入 0 ~ 23");
      return;
    }
    if (start >= end) {
      Alert.alert("时间段无效", "开始时间必须早于结束时间");
      return;
    }

    const newPartial: Partial<UserSettings> = {
      notificationInterval: intervalMin,
      notificationStartHour: start,
      notificationEndHour: end,
    };
    const full = buildFullSettings(newPartial);
    await rescheduleAllActiveReminders(full);
    onUpdateSettings(newPartial);
    Alert.alert("保存成功", "饮水提醒设置已更新！");
  };

  // ────────────────────────────────────────────
  //  Sedentary reminder handlers
  // ────────────────────────────────────────────

  const handleSedentaryToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert("权限被拒绝", "请在设备设置中开启通知权限");
        return;
      }
    }
    const newPartial: Partial<UserSettings> = {
      sedentaryReminderEnabled: value,
    };
    const full = buildFullSettings(newPartial);
    await rescheduleAllActiveReminders(full);
    setSedentaryEnabled(value);
    onUpdateSettings(newPartial);
  };

  const handleSaveSedentarySettings = async () => {
    if (!sedentaryEnabled) return;

    const intervalMin = parseInt(sedentaryInterval, 10);
    const start = parseInt(sedentaryStart, 10);
    const end = parseInt(sedentaryEnd, 10);

    if (isNaN(intervalMin) || intervalMin < 15 || intervalMin > 120) {
      Alert.alert("无效间隔", "请输入 15 ~ 120 分钟之间的数值");
      return;
    }
    if (isNaN(start) || start < 0 || start > 23) {
      Alert.alert("无效时间", "开始时间请输入 0 ~ 23");
      return;
    }
    if (isNaN(end) || end < 0 || end > 23) {
      Alert.alert("无效时间", "结束时间请输入 0 ~ 23");
      return;
    }
    if (start >= end) {
      Alert.alert("时间段无效", "开始时间必须早于结束时间");
      return;
    }

    const newPartial: Partial<UserSettings> = {
      sedentaryIntervalMinutes: intervalMin,
      sedentaryStartHour: start,
      sedentaryEndHour: end,
    };
    const full = buildFullSettings(newPartial);
    await rescheduleAllActiveReminders(full);
    onUpdateSettings(newPartial);
    Alert.alert("保存成功", "久坐提醒设置已更新！");
  };

  // ────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* ── Daily Goal ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>每日饮水目标</Text>
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
          <Text style={styles.saveButtonText}>保存目标</Text>
        </TouchableOpacity>
      </View>

      {/* ── Water Reminders ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💧 饮水提醒</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>启用饮水提醒</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: "#2d2d44", true: "#4FC3F7" }}
            thumbColor={notificationsEnabled ? "#ffffff" : "#8b8b8b"}
          />
        </View>

        {notificationsEnabled && (
          <>
            <Text style={styles.inputTitle}>提醒间隔（分钟）</Text>
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

            <Text style={styles.inputTitle}>生效时段</Text>
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
              <Text style={styles.timeSeparator}>到</Text>
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
              onPress={handleSaveWaterSettings}
            >
              <Text style={styles.saveButtonText}>保存饮水提醒设置</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ── Sedentary Reminders ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧍 久坐提醒</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>启用久坐提醒</Text>
          <Switch
            value={sedentaryEnabled}
            onValueChange={handleSedentaryToggle}
            trackColor={{ false: "#2d2d44", true: "#FF8C00" }}
            thumbColor={sedentaryEnabled ? "#ffffff" : "#8b8b8b"}
          />
        </View>

        {sedentaryEnabled && (
          <>
            <Text style={styles.inputTitle}>提醒间隔（分钟，建议 30~60）</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={sedentaryInterval}
                onChangeText={setSedentaryInterval}
                keyboardType="numeric"
                placeholder="45"
                placeholderTextColor="#8b8b8b"
              />
              <Text style={styles.inputLabel}>min</Text>
            </View>

            <Text style={styles.inputTitle}>生效时段（工作时间）</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.input}
                  value={sedentaryStart}
                  onChangeText={setSedentaryStart}
                  keyboardType="numeric"
                  placeholder="9"
                  placeholderTextColor="#8b8b8b"
                />
              </View>
              <Text style={styles.timeSeparator}>到</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={styles.input}
                  value={sedentaryEnd}
                  onChangeText={setSedentaryEnd}
                  keyboardType="numeric"
                  placeholder="18"
                  placeholderTextColor="#8b8b8b"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSedentarySettings}
            >
              <Text style={styles.saveButtonText}>保存久坐提醒设置</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ── About ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <Text style={styles.aboutText}>
          Water Tracker v1.3.1{"\n"}
          保持水分，保持健康！{"\n\n"}
          连续打卡可以解锁像素小人的专属装扮 ✨
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4FC3F7",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#2d2d44",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ffffff",
  },
  inputLabel: {
    color: "#8b8b8b",
    fontSize: 16,
    marginLeft: 10,
  },
  inputTitle: {
    color: "#8b8b8b",
    fontSize: 14,
    marginBottom: 8,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4FC3F7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  saveButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  switchLabel: {
    color: "#ffffff",
    fontSize: 16,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    color: "#8b8b8b",
    marginHorizontal: 15,
  },
  aboutText: {
    color: "#8b8b8b",
    fontSize: 14,
    lineHeight: 22,
  },
});

export default SettingsScreen;
