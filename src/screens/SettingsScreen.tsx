import React, { useState, useEffect, useMemo } from "react";
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
import { UserSettings, AppTheme, LanguagePreference } from "../types";
import {
  requestNotificationPermissions,
  rescheduleAllActiveReminders,
} from "../utils/notifications";
import { useTheme } from "../contexts/ThemeContext";
import { HapticsService } from "../utils/haptics";
import { t, useLocale, setLocale } from "../utils/i18n";
import {
  ACTIVITY_LEVELS,
  CLIMATE_LEVELS,
  ActivityLevel,
  ClimateLevel,
  recommendDailyGoalMl,
} from "../utils/goalCalculator";
import { exportDataViaShare } from "../utils/dataExport";
import AchievementsScreen from "./AchievementsScreen";

interface SettingsScreenProps {
  settings: UserSettings | null;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
}) => {
  useLocale();
  const { theme, colors, setTheme } = useTheme();
  const [showAchievements, setShowAchievements] = useState(false);

  // Dynamic styles based on theme colors
  const dynamicStyles = useMemo(() => ({
    container: { backgroundColor: colors.background },
    title: { color: colors.accent },
    section: { backgroundColor: colors.card },
    sectionTitle: { color: colors.text },
    input: { backgroundColor: colors.background, color: colors.text },
    inputLabel: { color: colors.textSecondary },
    inputTitle: { color: colors.textSecondary },
    switchLabel: { color: colors.text },
    timeSeparator: { color: colors.textSecondary },
    hintText: { color: colors.textSecondary },
    aboutText: { color: colors.textSecondary },
    recommendPreview: { color: colors.accent },
    backHeader: { backgroundColor: colors.background, borderBottomColor: colors.card },
    backButtonText: { color: colors.accent },
    themeButton: { backgroundColor: colors.background, borderColor: colors.border },
    themeButtonActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    themeButtonText: { color: colors.textSecondary },
    themeButtonTextActive: { color: colors.background },
  }), [colors]);

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

  // ── v2.0.0: Theme & Haptics ──
  const [hapticEnabled, setHapticEnabled] = useState(
    settings?.hapticFeedbackEnabled ?? true,
  );

  // ── v2.3.0: Smart goal recommender ──
  const [bodyWeight, setBodyWeight] = useState(
    settings?.bodyWeightKg !== undefined ? String(settings.bodyWeightKg) : "",
  );
  const [activity, setActivity] = useState<ActivityLevel>(
    settings?.activityLevel ?? "light",
  );
  const [climate, setClimate] = useState<ClimateLevel>(
    settings?.climate ?? "temperate",
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
      setHapticEnabled(settings.hapticFeedbackEnabled ?? true);
      if (settings.bodyWeightKg !== undefined) {
        setBodyWeight(String(settings.bodyWeightKg));
      }
      if (settings.activityLevel) setActivity(settings.activityLevel);
      if (settings.climate) setClimate(settings.climate);
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
    theme,
    hapticFeedbackEnabled: hapticEnabled,
    customQuickButtons: settings?.customQuickButtons ?? [],
    language: settings?.language ?? "system",
    ...partial,
  });

  // ────────────────────────────────────────────
  //  Daily goal
  // ────────────────────────────────────────────

  const handleSaveGoal = () => {
    const goal = parseInt(dailyGoal, 10);
    if (isNaN(goal) || goal < 100 || goal > 10000) {
      Alert.alert(t("settings.invalidGoalTitle"), t("settings.invalidGoalMsg"));
      return;
    }
    onUpdateSettings({ dailyGoal: goal });
    Alert.alert(t("settings.savedTitle"), t("settings.savedGoalMsg"));
  };

  // ────────────────────────────────────────────
  //  Water reminder handlers
  // ────────────────────────────────────────────

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(t("settings.permissionDenied"), t("settings.permissionDeniedMsg"));
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
      Alert.alert(t("settings.invalidIntervalTitle"), t("settings.invalidIntervalWaterMsg"));
      return;
    }
    if (isNaN(start) || start < 0 || start > 23) {
      Alert.alert(t("settings.invalidTimeTitle"), t("settings.invalidStartHour"));
      return;
    }
    if (isNaN(end) || end < 0 || end > 23) {
      Alert.alert(t("settings.invalidTimeTitle"), t("settings.invalidEndHour"));
      return;
    }
    if (start >= end) {
      Alert.alert(t("settings.invalidWindowTitle"), t("settings.invalidWindowMsg"));
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
    Alert.alert(t("settings.savedTitle"), t("settings.savedWaterMsg"));
  };

  // ────────────────────────────────────────────
  //  Sedentary reminder handlers
  // ────────────────────────────────────────────

  const handleSedentaryToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(t("settings.permissionDenied"), t("settings.permissionDeniedMsg"));
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
      Alert.alert(t("settings.invalidIntervalTitle"), t("settings.invalidIntervalSedentaryMsg"));
      return;
    }
    if (isNaN(start) || start < 0 || start > 23) {
      Alert.alert(t("settings.invalidTimeTitle"), t("settings.invalidStartHour"));
      return;
    }
    if (isNaN(end) || end < 0 || end > 23) {
      Alert.alert(t("settings.invalidTimeTitle"), t("settings.invalidEndHour"));
      return;
    }
    if (start >= end) {
      Alert.alert(t("settings.invalidWindowTitle"), t("settings.invalidWindowMsg"));
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
    Alert.alert(t("settings.savedTitle"), t("settings.savedSedentaryMsg"));
  };

  // ────────────────────────────────────────────
  //  v2.0.0: Theme & Haptics handlers
  // ────────────────────────────────────────────

  const handleThemeChange = async (newTheme: AppTheme) => {
    await setTheme(newTheme);
    HapticsService.light();
    onUpdateSettings({ theme: newTheme });
  };

  const handleHapticToggle = (value: boolean) => {
    setHapticEnabled(value);
    onUpdateSettings({ hapticFeedbackEnabled: value });
    if (value) {
      HapticsService.light();
    }
  };

  const handleLanguageChange = (lang: LanguagePreference) => {
    setLocale(lang);
    HapticsService.light();
    onUpdateSettings({ language: lang });
  };

  const currentLanguage: LanguagePreference = settings?.language ?? "system";

  // ── v2.3.0: Smart goal handlers ──
  const parsedWeight = (() => {
    const n = parseFloat(bodyWeight);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();

  const recommendedGoal =
    parsedWeight !== null
      ? recommendDailyGoalMl(parsedWeight, activity, climate)
      : null;

  const handleApplyRecommendation = () => {
    if (recommendedGoal === null || parsedWeight === null) return;
    setDailyGoal(String(recommendedGoal));
    HapticsService.success();
    onUpdateSettings({
      dailyGoal: recommendedGoal,
      bodyWeightKg: parsedWeight,
      activityLevel: activity,
      climate,
    });
    Alert.alert(
      t("settings.savedTitle"),
      t("settings.smartGoalAppliedMsg", { n: recommendedGoal }),
    );
  };

  const handleExportData = async () => {
    try {
      await exportDataViaShare();
      Alert.alert(t("settings.exportSuccessTitle"), t("settings.exportSuccessMsg"));
    } catch {
      Alert.alert(t("settings.exportErrorTitle"), t("settings.exportErrorMsg"));
    }
  };

  const ACTIVITY_LABEL_KEY: Record<ActivityLevel, string> = {
    sedentary: "settings.activitySedentary",
    light: "settings.activityLight",
    moderate: "settings.activityModerate",
    high: "settings.activityHigh",
  };
  const CLIMATE_LABEL_KEY: Record<ClimateLevel, string> = {
    cool: "settings.climateCool",
    temperate: "settings.climateTemperate",
    hot: "settings.climateHot",
  };

  // ────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────

  // Show Achievements screen if toggled
  if (showAchievements) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.backHeader, dynamicStyles.backHeader]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setShowAchievements(false)}
          >
            <Text style={[styles.backButtonText, dynamicStyles.backButtonText]}>← {t("settings.title")}</Text>
          </TouchableOpacity>
        </View>
        <AchievementsScreen navigation={null} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[styles.title, dynamicStyles.title]}>{t("settings.title")}</Text>

      {/* ── Daily Goal ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.dailyGoal")}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={dailyGoal}
            onChangeText={setDailyGoal}
            keyboardType="numeric"
            placeholder="2000"
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>ml</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
          <Text style={styles.saveButtonText}>{t("settings.saveGoal")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Water Reminders ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.waterReminders")}</Text>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, dynamicStyles.switchLabel]}>{t("settings.enableWaterReminders")}</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: "#2d2d44", true: "#4FC3F7" }}
            thumbColor={notificationsEnabled ? "#ffffff" : "#8b8b8b"}
          />
        </View>

        {notificationsEnabled && (
          <>
            <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.intervalMinutes")}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                value={interval}
                onChangeText={setInterval}
                keyboardType="numeric"
                placeholder="60"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>min</Text>
            </View>

            <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.activeWindow")}</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  value={startHour}
                  onChangeText={setStartHour}
                  keyboardType="numeric"
                  placeholder="8"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <Text style={[styles.timeSeparator, dynamicStyles.timeSeparator]}>{t("settings.toRange")}</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  value={endHour}
                  onChangeText={setEndHour}
                  keyboardType="numeric"
                  placeholder="22"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveWaterSettings}
            >
              <Text style={styles.saveButtonText}>{t("settings.saveWaterReminders")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ── Sedentary Reminders ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.sedentaryReminders")}</Text>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, dynamicStyles.switchLabel]}>{t("settings.enableSedentaryReminders")}</Text>
          <Switch
            value={sedentaryEnabled}
            onValueChange={handleSedentaryToggle}
            trackColor={{ false: "#2d2d44", true: "#FF8C00" }}
            thumbColor={sedentaryEnabled ? "#ffffff" : "#8b8b8b"}
          />
        </View>

        {sedentaryEnabled && (
          <>
            <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.sedentaryIntervalHint")}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, dynamicStyles.input]}
                value={sedentaryInterval}
                onChangeText={setSedentaryInterval}
                keyboardType="numeric"
                placeholder="45"
                placeholderTextColor={colors.textSecondary}
              />
              <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>min</Text>
            </View>

            <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.sedentaryWindow")}</Text>
            <View style={styles.timeRow}>
              <View style={styles.timeInput}>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  value={sedentaryStart}
                  onChangeText={setSedentaryStart}
                  keyboardType="numeric"
                  placeholder="9"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <Text style={[styles.timeSeparator, dynamicStyles.timeSeparator]}>{t("settings.toRange")}</Text>
              <View style={styles.timeInput}>
                <TextInput
                  style={[styles.input, dynamicStyles.input]}
                  value={sedentaryEnd}
                  onChangeText={setSedentaryEnd}
                  keyboardType="numeric"
                  placeholder="18"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveSedentarySettings}
            >
              <Text style={styles.saveButtonText}>{t("settings.saveSedentaryReminders")}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* ── Language ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.languageTitle")}</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity
            style={[styles.themeButton, dynamicStyles.themeButton, currentLanguage === "en" && styles.themeButtonActive, currentLanguage === "en" && dynamicStyles.themeButtonActive]}
            onPress={() => handleLanguageChange("en")}
          >
            <Text
              style={[
                styles.themeButtonText,
                dynamicStyles.themeButtonText,
                currentLanguage === "en" && styles.themeButtonTextActive,
                currentLanguage === "en" && dynamicStyles.themeButtonTextActive,
              ]}
            >
              {t("settings.langEn")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, dynamicStyles.themeButton, currentLanguage === "zh" && styles.themeButtonActive, currentLanguage === "zh" && dynamicStyles.themeButtonActive]}
            onPress={() => handleLanguageChange("zh")}
          >
            <Text
              style={[
                styles.themeButtonText,
                dynamicStyles.themeButtonText,
                currentLanguage === "zh" && styles.themeButtonTextActive,
                currentLanguage === "zh" && dynamicStyles.themeButtonTextActive,
              ]}
            >
              {t("settings.langZh")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, dynamicStyles.themeButton, currentLanguage === "system" && styles.themeButtonActive, currentLanguage === "system" && dynamicStyles.themeButtonActive]}
            onPress={() => handleLanguageChange("system")}
          >
            <Text
              style={[
                styles.themeButtonText,
                dynamicStyles.themeButtonText,
                currentLanguage === "system" && styles.themeButtonTextActive,
                currentLanguage === "system" && dynamicStyles.themeButtonTextActive,
              ]}
            >
              {t("settings.langSystem")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── v2.3.0: Smart Goal ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.smartGoalTitle")}</Text>

        <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.smartGoalWeight")}</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, dynamicStyles.input]}
            value={bodyWeight}
            onChangeText={setBodyWeight}
            keyboardType="numeric"
            placeholder={t("settings.smartGoalWeightPlaceholder")}
            placeholderTextColor={colors.textSecondary}
          />
          <Text style={[styles.inputLabel, dynamicStyles.inputLabel]}>kg</Text>
        </View>

        <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.smartGoalActivity")}</Text>
        <View style={styles.themeRow}>
          {ACTIVITY_LEVELS.map((lvl) => (
            <TouchableOpacity
              key={lvl}
              style={[styles.themeButton, dynamicStyles.themeButton, activity === lvl && styles.themeButtonActive, activity === lvl && dynamicStyles.themeButtonActive]}
              onPress={() => setActivity(lvl)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  dynamicStyles.themeButtonText,
                  activity === lvl && styles.themeButtonTextActive,
                  activity === lvl && dynamicStyles.themeButtonTextActive,
                ]}
              >
                {t(ACTIVITY_LABEL_KEY[lvl])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.smartGoalClimate")}</Text>
        <View style={styles.themeRow}>
          {CLIMATE_LEVELS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.themeButton, dynamicStyles.themeButton, climate === c && styles.themeButtonActive, climate === c && dynamicStyles.themeButtonActive]}
              onPress={() => setClimate(c)}
            >
              <Text
                style={[
                  styles.themeButtonText,
                  dynamicStyles.themeButtonText,
                  climate === c && styles.themeButtonTextActive,
                  climate === c && dynamicStyles.themeButtonTextActive,
                ]}
              >
                {t(CLIMATE_LABEL_KEY[c])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {recommendedGoal !== null && (
          <Text style={[styles.recommendPreview, dynamicStyles.recommendPreview]}>
            {t("settings.smartGoalPreview", { n: recommendedGoal })}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.saveButton,
            recommendedGoal === null && styles.saveButtonDisabled,
          ]}
          onPress={handleApplyRecommendation}
          disabled={recommendedGoal === null}
        >
          <Text style={styles.saveButtonText}>
            {t("settings.smartGoalApply")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── v2.0.0: Theme & Customization ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.themeTitle")}</Text>

        <Text style={[styles.inputTitle, dynamicStyles.inputTitle]}>{t("settings.themeMode")}</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity
            style={[styles.themeButton, dynamicStyles.themeButton, theme === 'light' && styles.themeButtonActive, theme === 'light' && dynamicStyles.themeButtonActive]}
            onPress={() => handleThemeChange('light')}
          >
            <Text style={[styles.themeButtonText, dynamicStyles.themeButtonText, theme === 'light' && styles.themeButtonTextActive, theme === 'light' && dynamicStyles.themeButtonTextActive]}>
              {t("settings.themeLight")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, dynamicStyles.themeButton, theme === 'dark' && styles.themeButtonActive, theme === 'dark' && dynamicStyles.themeButtonActive]}
            onPress={() => handleThemeChange('dark')}
          >
            <Text style={[styles.themeButtonText, dynamicStyles.themeButtonText, theme === 'dark' && styles.themeButtonTextActive, theme === 'dark' && dynamicStyles.themeButtonTextActive]}>
              {t("settings.themeDark")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.themeButton, dynamicStyles.themeButton, theme === 'system' && styles.themeButtonActive, theme === 'system' && dynamicStyles.themeButtonActive]}
            onPress={() => handleThemeChange('system')}
          >
            <Text style={[styles.themeButtonText, dynamicStyles.themeButtonText, theme === 'system' && styles.themeButtonTextActive, theme === 'system' && dynamicStyles.themeButtonTextActive]}>
              {t("settings.themeSystem")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, dynamicStyles.switchLabel]}>{t("settings.haptics")}</Text>
          <Switch
            value={hapticEnabled}
            onValueChange={handleHapticToggle}
            trackColor={{ false: "#2d2d44", true: "#4FC3F7" }}
            thumbColor={hapticEnabled ? "#ffffff" : "#8b8b8b"}
          />
        </View>

        <Text style={[styles.hintText, dynamicStyles.hintText]}>
          {t("settings.customQuickHint")}
        </Text>
      </View>

      {/* ── Achievements ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.achievements")}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => setShowAchievements(true)}
        >
          <Text style={styles.saveButtonText}>{t("settings.achievements")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Data Export ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.dataTitle")}</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleExportData}>
          <Text style={styles.saveButtonText}>{t("settings.exportButton")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── About ── */}
      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("settings.about")}</Text>
        <Text style={[styles.aboutText, dynamicStyles.aboutText]}>
          Water Tracker v2.7.0{"\n"}
          {t("app.about")}
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
  saveButtonDisabled: {
    backgroundColor: "#3d3d54",
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
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10,
  },
  themeButton: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3d3d5c",
  },
  themeButtonActive: {
    backgroundColor: "#4FC3F7",
    borderColor: "#4FC3F7",
  },
  themeButtonText: {
    color: "#8b8b8b",
    fontSize: 14,
    fontWeight: "600",
  },
  themeButtonTextActive: {
    color: "#1a1a2e",
  },
  hintText: {
    color: "#8b8b8b",
    fontSize: 13,
    marginTop: 10,
    textAlign: "center",
  },
  aboutText: {
    color: "#8b8b8b",
    fontSize: 14,
    lineHeight: 22,
  },
  recommendPreview: {
    color: "#4FC3F7",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 12,
  },
  backHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d44",
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 20,
  },
  backButtonText: {
    color: "#4FC3F7",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
