import { NativeModules, Platform } from "react-native";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────
//  Locale system
// ─────────────────────────────────────────────

export type Locale = "en" | "zh";
export type LocalePreference = Locale | "system";

// Detect device locale once at module load.
const detectSystemLocale = (): Locale => {
  try {
    let raw: string | undefined;
    if (Platform.OS === "ios") {
      const sm = NativeModules.SettingsManager;
      raw =
        sm?.settings?.AppleLocale ||
        sm?.settings?.AppleLanguages?.[0];
    } else if (Platform.OS === "android") {
      raw = NativeModules.I18nManager?.localeIdentifier;
    }
    if (typeof raw === "string" && raw.toLowerCase().startsWith("zh")) {
      return "zh";
    }
  } catch {
    // fall through
  }
  return "en";
};

const SYSTEM_LOCALE: Locale = detectSystemLocale();

let currentLocale: Locale = SYSTEM_LOCALE;
const listeners = new Set<(l: Locale) => void>();

export const getSystemLocale = (): Locale => SYSTEM_LOCALE;

export const getLocale = (): Locale => currentLocale;

export const resolveLocale = (pref: LocalePreference): Locale =>
  pref === "system" ? SYSTEM_LOCALE : pref;

export const setLocale = (pref: LocalePreference): void => {
  const next = resolveLocale(pref);
  if (next === currentLocale) return;
  currentLocale = next;
  listeners.forEach((cb) => cb(next));
};

export const subscribeLocale = (cb: (l: Locale) => void): (() => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

// ─────────────────────────────────────────────
//  String tables
// ─────────────────────────────────────────────

type Dict = Record<string, string>;

const en: Dict = {
  // App
  "app.loading": "Loading hydration data...",
  "app.title": "Water Tracker",
  "app.about": "Stay hydrated, stay healthy!\n\nKeep your streak to unlock pixel pet outfits.",

  // Tabs
  "tab.home": "Home",
  "tab.pet": "Pet",
  "tab.stats": "Stats",
  "tab.settings": "Settings",

  // Headers
  "header.home": "Water Tracker",
  "header.pet": "Pet Space",
  "header.stats": "Statistics",
  "header.settings": "Settings",

  // Greetings
  "greeting.morning": "Good Morning!",
  "greeting.afternoon": "Good Afternoon!",
  "greeting.evening": "Good Evening!",

  // Home
  "home.statusTitle": "Hydration Status",
  "home.streak": "{n}-day streak",
  "home.goalLabel": "Goal: {n} ml",
  "home.quickAdd": "Quick Add",
  "home.todayLog": "Today's Log",
  "home.empty": "No entries yet. Start tracking!",

  // Stats
  "stats.title": "Hydration Stats",
  "stats.week": "Week",
  "stats.month": "Month",
  "stats.today": "Today",
  "stats.avg": "Avg ml/day",
  "stats.total": "Total ml",
  "stats.goalsMet": "Goals Met",
  "stats.totalToday": "Total today",
  "stats.entries": "Entries",
  "stats.peakHour": "Peak hour",
  "stats.none": "—",
  "stats.weekly": "Weekly Progress",
  "stats.monthly": "Monthly Progress",
  "stats.todayTitle": "Hourly Distribution",
  "stats.empty": "No data for this period",
  "stats.emptyHint": "Start drinking water to see your stats!",
  "stats.dailyGoal": "Daily Goal: {n} ml",
  "stats.loading": "Loading...",

  // Days of week (short)
  "day.sun": "Sun",
  "day.mon": "Mon",
  "day.tue": "Tue",
  "day.wed": "Wed",
  "day.thu": "Thu",
  "day.fri": "Fri",
  "day.sat": "Sat",

  // Settings
  "settings.title": "Settings",
  "settings.dailyGoal": "Daily Water Goal",
  "settings.saveGoal": "Save Goal",
  "settings.invalidGoalTitle": "Invalid Goal",
  "settings.invalidGoalMsg": "Please enter a value between 100 and 10000 ml",
  "settings.savedTitle": "Saved",
  "settings.savedGoalMsg": "Daily water goal updated!",

  "settings.waterReminders": "💧 Water Reminders",
  "settings.enableWaterReminders": "Enable water reminders",
  "settings.intervalMinutes": "Reminder interval (minutes)",
  "settings.activeWindow": "Active hours",
  "settings.saveWaterReminders": "Save water reminder settings",
  "settings.savedWaterMsg": "Water reminder settings updated!",

  "settings.sedentaryReminders": "🧍 Sedentary Reminders",
  "settings.enableSedentaryReminders": "Enable sedentary reminders",
  "settings.sedentaryIntervalHint": "Interval (minutes, 30~60 recommended)",
  "settings.sedentaryWindow": "Active hours (work time)",
  "settings.saveSedentaryReminders": "Save sedentary reminder settings",
  "settings.savedSedentaryMsg": "Sedentary reminder settings updated!",

  "settings.invalidIntervalTitle": "Invalid Interval",
  "settings.invalidIntervalWaterMsg": "Please enter a value between 15 and 240 minutes",
  "settings.invalidIntervalSedentaryMsg": "Please enter a value between 15 and 120 minutes",
  "settings.invalidTimeTitle": "Invalid Time",
  "settings.invalidStartHour": "Start hour must be between 0 and 23",
  "settings.invalidEndHour": "End hour must be between 0 and 23",
  "settings.invalidWindowTitle": "Invalid Window",
  "settings.invalidWindowMsg": "Start hour must be earlier than end hour",
  "settings.permissionDenied": "Permission Denied",
  "settings.permissionDeniedMsg": "Please enable notifications in your device settings",

  "settings.toRange": "to",

  "settings.themeTitle": "🎨 Theme & Personalization",
  "settings.themeMode": "Theme Mode",
  "settings.themeLight": "Light",
  "settings.themeDark": "Dark",
  "settings.themeSystem": "System",
  "settings.haptics": "Haptic feedback",
  "settings.customQuickHint": "💡 Custom quick-add buttons coming soon!",

  "settings.languageTitle": "🌐 Language",
  "settings.langEn": "English",
  "settings.langZh": "中文",
  "settings.langSystem": "System",

  // v2.3.0 Smart goal calculator
  "settings.smartGoalTitle": "🎯 Smart Goal",
  "settings.smartGoalWeight": "Body weight (kg)",
  "settings.smartGoalWeightPlaceholder": "e.g. 65",
  "settings.smartGoalActivity": "Activity level",
  "settings.smartGoalClimate": "Climate",
  "settings.activitySedentary": "Sedentary",
  "settings.activityLight": "Light",
  "settings.activityModerate": "Moderate",
  "settings.activityHigh": "High",
  "settings.climateCool": "Cool",
  "settings.climateTemperate": "Temperate",
  "settings.climateHot": "Hot",
  "settings.smartGoalPreview": "Recommended: {n} ml/day",
  "settings.smartGoalApply": "Apply recommendation",
  "settings.smartGoalAppliedMsg": "Daily goal updated to {n} ml.",

  // v2.4.0 Data export
  "settings.dataTitle": "📦 Data",
  "settings.exportButton": "Export data",
  "settings.exportSuccessTitle": "Export ready",
  "settings.exportSuccessMsg": "Your data has been shared.",
  "settings.exportErrorTitle": "Export failed",
  "settings.exportErrorMsg": "Could not export data. Please try again.",

  "settings.about": "About",

  // v2.6.0 Achievements
  "settings.achievements": "🏆 Achievements",
  "achieve.title": "Achievements",
  "achieve.currentStreak": "Day streak",
  "achieve.currentLevel": "Level",
  "achieve.currentTitle": "Title",
  "achieve.streakBadges": "Streak Badges",
  "achieve.levelBadges": "Level Badges",
  "achieve.howToUnlock": "How to unlock?",
  "achieve.streakTip": "• Meet daily goal to extend streak",
  "achieve.levelTip": "• Drink water to gain XP and level up",
  "achieve.streak3": "3-Day Cap",
  "achieve.streak5": "5-Day Stars",
  "achieve.streak7": "7-Day Party",
  "achieve.streak10": "10-Day Sparkle",
  "achieve.streak14": "14-Day Crown",
  "achieve.streak15": "15-Day Heart",
  "achieve.streak21": "21-Day Wizard",
  "achieve.streak28": "28-Day Wings",
  "achieve.streak30": "30-Day Rainbow",
  "achieve.streak35": "35-Day Diamond",
  "achieve.streak45": "45-Day Angel",
  "achieve.streak60": "60-Day Cosmic",
  "achieve.level5": "Little Droplet",
  "achieve.level10": "Spring Spirit",
  "achieve.level15": "Stream Guardian",
  "achieve.level20": "River Messenger",
  "achieve.level25": "Lake Lord",
  "achieve.level30": "Ocean Child",
  "achieve.level35": "Water Master",
  "achieve.level40": "God Messenger",
  "achieve.level45": "Water God",
  "achieve.level50": "Water Supreme",

  // v3.0.0: Updates
  "updates.title": "Check for Updates",
  "updates.checking": "Checking for updates...",
  "updates.found": "Update Available",
  "updates.foundMessage": "A new version is available. Update now?",
  "updates.update": "Update",
  "updates.later": "Later",
  "updates.downloaded": "Download Complete",
  "updates.downloadedMessage": "Update downloaded. Restart app now?",
  "updates.restart": "Restart",
  "updates.failed": "Update Failed",
  "updates.failedMessage": "Failed to download update. Please try again.",
  "updates.latest": "Up to Date",
  "updates.latestMessage": "You're running the latest version.",
  "updates.error": "Update Error",
  "updates.errorMessage": "Could not check for updates. Please check your connection.",
  "updates.devMode": "Development Mode",
  "updates.devModeHint": "OTA updates are not available in development mode.",
};

const zh: Dict = {
  // App
  "app.loading": "正在加载水分数据...",
  "app.title": "Water Tracker",
  "app.about": "保持水分，保持健康！\n\n连续打卡可以解锁像素小人的专属装扮 ✨",

  // Tabs
  "tab.home": "主页",
  "tab.pet": "宠物",
  "tab.stats": "统计",
  "tab.settings": "设置",

  // Headers
  "header.home": "Water Tracker",
  "header.pet": "宠物空间",
  "header.stats": "数据统计",
  "header.settings": "设置",

  // Greetings
  "greeting.morning": "早上好！",
  "greeting.afternoon": "下午好！",
  "greeting.evening": "晚上好！",

  // Home
  "home.statusTitle": "水分状态",
  "home.streak": "连续打卡 {n} 天",
  "home.goalLabel": "目标: {n} ml",
  "home.quickAdd": "快速添加",
  "home.todayLog": "今日记录",
  "home.empty": "还没有记录，开始喝水吧！",

  // Stats
  "stats.title": "水分统计",
  "stats.week": "周",
  "stats.month": "月",
  "stats.today": "今日",
  "stats.avg": "日均 ml",
  "stats.total": "总计 ml",
  "stats.goalsMet": "达标天数",
  "stats.totalToday": "今日总量",
  "stats.entries": "记录数",
  "stats.peakHour": "高峰时段",
  "stats.none": "—",
  "stats.weekly": "本周进度",
  "stats.monthly": "本月进度",
  "stats.todayTitle": "小时分布",
  "stats.empty": "本周期暂无数据",
  "stats.emptyHint": "开始喝水来记录你的水分摄入吧！",
  "stats.dailyGoal": "每日目标: {n} ml",
  "stats.loading": "加载中...",

  // Days of week (short)
  "day.sun": "日",
  "day.mon": "一",
  "day.tue": "二",
  "day.wed": "三",
  "day.thu": "四",
  "day.fri": "五",
  "day.sat": "六",

  // Settings
  "settings.title": "设置",
  "settings.dailyGoal": "每日饮水目标",
  "settings.saveGoal": "保存目标",
  "settings.invalidGoalTitle": "无效目标",
  "settings.invalidGoalMsg": "请输入 100 ~ 10000 ml 之间的数值",
  "settings.savedTitle": "保存成功",
  "settings.savedGoalMsg": "每日饮水目标已更新！",

  "settings.waterReminders": "💧 饮水提醒",
  "settings.enableWaterReminders": "启用饮水提醒",
  "settings.intervalMinutes": "提醒间隔（分钟）",
  "settings.activeWindow": "生效时段",
  "settings.saveWaterReminders": "保存饮水提醒设置",
  "settings.savedWaterMsg": "饮水提醒设置已更新！",

  "settings.sedentaryReminders": "🧍 久坐提醒",
  "settings.enableSedentaryReminders": "启用久坐提醒",
  "settings.sedentaryIntervalHint": "提醒间隔（分钟，建议 30~60）",
  "settings.sedentaryWindow": "生效时段（工作时间）",
  "settings.saveSedentaryReminders": "保存久坐提醒设置",
  "settings.savedSedentaryMsg": "久坐提醒设置已更新！",

  "settings.invalidIntervalTitle": "无效间隔",
  "settings.invalidIntervalWaterMsg": "请输入 15 ~ 240 分钟之间的数值",
  "settings.invalidIntervalSedentaryMsg": "请输入 15 ~ 120 分钟之间的数值",
  "settings.invalidTimeTitle": "无效时间",
  "settings.invalidStartHour": "开始时间请输入 0 ~ 23",
  "settings.invalidEndHour": "结束时间请输入 0 ~ 23",
  "settings.invalidWindowTitle": "时间段无效",
  "settings.invalidWindowMsg": "开始时间必须早于结束时间",
  "settings.permissionDenied": "权限被拒绝",
  "settings.permissionDeniedMsg": "请在设备设置中开启通知权限",

  "settings.toRange": "到",

  "settings.themeTitle": "🎨 主题与个性化",
  "settings.themeMode": "主题模式",
  "settings.themeLight": "浅色",
  "settings.themeDark": "深色",
  "settings.themeSystem": "跟随系统",
  "settings.haptics": "振动反馈",
  "settings.customQuickHint": "💡 自定义快捷按钮功能即将推出，敬请期待！",

  "settings.languageTitle": "🌐 语言",
  "settings.langEn": "English",
  "settings.langZh": "中文",
  "settings.langSystem": "跟随系统",

  // v2.3.0 智能目标
  "settings.smartGoalTitle": "🎯 智能目标",
  "settings.smartGoalWeight": "体重（公斤）",
  "settings.smartGoalWeightPlaceholder": "例如 65",
  "settings.smartGoalActivity": "活动水平",
  "settings.smartGoalClimate": "气候",
  "settings.activitySedentary": "久坐",
  "settings.activityLight": "轻度",
  "settings.activityModerate": "中度",
  "settings.activityHigh": "高强度",
  "settings.climateCool": "凉爽",
  "settings.climateTemperate": "温和",
  "settings.climateHot": "炎热",
  "settings.smartGoalPreview": "推荐：每日 {n} ml",
  "settings.smartGoalApply": "应用推荐值",
  "settings.smartGoalAppliedMsg": "每日饮水目标已更新为 {n} ml。",

  // v2.4.0 数据导出
  "settings.dataTitle": "📦 数据",
  "settings.exportButton": "导出数据",
  "settings.exportSuccessTitle": "导出已准备",
  "settings.exportSuccessMsg": "已通过分享导出。",
  "settings.exportErrorTitle": "导出失败",
  "settings.exportErrorMsg": "无法导出数据，请重试。",

  "settings.about": "关于",

  // v2.6.0 成就系统
  "settings.achievements": "🏆 成就",
  "achieve.title": "成就",
  "achieve.currentStreak": "连续天数",
  "achieve.currentLevel": "等级",
  "achieve.currentTitle": "称号",
  "achieve.streakBadges": "连续打卡徽章",
  "achieve.levelBadges": "等级徽章",
  "achieve.howToUnlock": "如何解锁？",
  "achieve.streakTip": "• 每日达成目标可延续连续天数",
  "achieve.levelTip": "• 喝水获得经验值升级",
  "achieve.streak3": "3天鸭舌帽",
  "achieve.streak5": "5天星光",
  "achieve.streak7": "7天派对帽",
  "achieve.streak10": "10天闪耀",
  "achieve.streak14": "14天皇冠",
  "achieve.streak15": "15天爱心",
  "achieve.streak21": "21天魔法帽",
  "achieve.streak28": "28天翅膀",
  "achieve.streak30": "30天彩虹",
  "achieve.streak35": "35天钻石",
  "achieve.streak45": "45天天使",
  "achieve.streak60": "60天宇宙",
  "achieve.level5": "小水珠",
  "achieve.level10": "清泉精灵",
  "achieve.level15": "溪流守护者",
  "achieve.level20": "河流使者",
  "achieve.level25": "湖泊领主",
  "achieve.level30": "海洋之子",
  "achieve.level35": "水系大师",
  "achieve.level40": "水神使者",
  "achieve.level45": "水神",
  "achieve.level50": "水之至尊",

  // v3.0.0: 更新
  "updates.title": "检查更新",
  "updates.checking": "正在检查更新...",
  "updates.found": "发现新版本",
  "updates.foundMessage": "有新版本可用，是否立即更新？",
  "updates.update": "更新",
  "updates.later": "稍后",
  "updates.downloaded": "下载完成",
  "updates.downloadedMessage": "更新已下载完成，是否立即重启应用？",
  "updates.restart": "重启",
  "updates.failed": "更新失败",
  "updates.failedMessage": "下载更新失败，请稍后重试。",
  "updates.latest": "已是最新",
  "updates.latestMessage": "当前已是最新版本。",
  "updates.error": "更新出错",
  "updates.errorMessage": "无法检查更新，请检查网络连接。",
  "updates.devMode": "开发模式",
  "updates.devModeHint": "开发模式下不支持 OTA 更新。",
};

const TABLES: Record<Locale, Dict> = { en, zh };

// ─────────────────────────────────────────────
//  t() — simple template substitution `{name}`
// ─────────────────────────────────────────────

export const t = (
  key: string,
  vars?: Record<string, string | number>,
): string => {
  const dict = TABLES[currentLocale] ?? en;
  const raw = dict[key] ?? en[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
};

// ─────────────────────────────────────────────
//  React hook — forces re-render on locale change
// ─────────────────────────────────────────────

export const useLocale = (): Locale => {
  const [locale, setLocaleState] = useState<Locale>(currentLocale);
  useEffect(() => subscribeLocale(setLocaleState), []);
  return locale;
};
