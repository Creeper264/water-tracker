import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import { StreakData, PetData, DailyLog, UserSettings } from "../types";
import { getStreakData } from "../utils/storage";
import {
  getPetData,
  getLevelProgress,
  getLevelTitle,
  renamePet,
} from "../utils/petStorage";
import { getNextUnlock, getUnlockProgress, DECORATIONS } from "../utils/decorations";

interface PetScreenProps {
  streakData: StreakData | null;
  todayLog: DailyLog | null;
  settings: UserSettings | null;
}

// 特殊台词配置
const SEDENTARY_SPECIAL_LINES = [
  "提醒你起来活动！顺便去喝点水，我都要渴死了！",
  "别坐着啦！快去喝杯水，我的喉咙都冒烟了！",
  "久坐伤身！补水时间到，带我一起喝水吧~",
  "站起来活动活动！顺便把今天的喝水任务补上！",
  "已经坐好久了哦！记得喝水，不然我要枯萎了！",
];

const PetScreen: React.FC<PetScreenProps> = ({ streakData, todayLog, settings }) => {
  const [petData, setPetData] = useState<PetData | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [specialLine, setSpecialLine] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    loadPetData();
  }, []);

  // 监听久坐提醒通知
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        // 检测久坐提醒通知
        if (data?.type === "sedentary") {
          // 检查饮水进度是否 < 50%
          const progress = getWaterProgress();
          if (progress < 50) {
            // 随机选择一条特殊台词
            const randomIndex = Math.floor(Math.random() * SEDENTARY_SPECIAL_LINES.length);
            setSpecialLine(SEDENTARY_SPECIAL_LINES[randomIndex]);
          }
        }
      }
    );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [todayLog, settings]);

  // 计算饮水进度百分比
  const getWaterProgress = (): number => {
    if (!todayLog || !settings) return 0;
    return (todayLog.total / settings.dailyGoal) * 100;
  };

  // 关闭特殊台词
  const dismissSpecialLine = () => {
    setSpecialLine(null);
  };

  const loadPetData = async () => {
    const data = await getPetData();
    setPetData(data);
  };

  const handleRename = async () => {
    Alert.prompt(
      "给宠物起个名字吧",
      "输入新名字",
      [
        { text: "取消", style: "cancel" },
        {
          text: "确定",
          onPress: async (name?: string) => {
            if (name && name.trim()) {
              await renamePet(name.trim());
              loadPetData();
            }
          },
        },
      ],
      "plain-text"
    );
  };

  if (!petData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  const levelProgress = getLevelProgress(petData);
  const levelTitle = getLevelTitle(petData.level);
  const nextUnlock = streakData ? getNextUnlock(streakData.currentStreak) : null;
  const unlockProgress = streakData ? getUnlockProgress(streakData.currentStreak) : { progress: 0 };

  return (
    <ScrollView style={styles.container}>
      {/* 特殊台词提示 */}
      {specialLine && (
        <View style={styles.specialLineContainer}>
          <View style={styles.specialLineCard}>
            <Text style={styles.specialLineEmoji}>💬</Text>
            <Text style={styles.specialLineText}>{specialLine}</Text>
            <TouchableOpacity onPress={dismissSpecialLine} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 宠物信息卡片 */}
      <View style={styles.petCard}>
        <TouchableOpacity onPress={handleRename}>
          <Text style={styles.petName}>{petData.name}</Text>
          <Text style={styles.renameHint}>点击改名</Text>
        </TouchableOpacity>
        <Text style={styles.levelTitle}>{levelTitle}</Text>
      </View>

      {/* 等级进度 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>等级进度</Text>
        <View style={styles.levelRow}>
          <Text style={styles.levelText}>Lv.{petData.level}</Text>
          <Text style={styles.expText}>
            {petData.experience}/{getExpRequired(petData.level)} EXP
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${levelProgress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{levelProgress.toFixed(1)}%</Text>
      </View>

      {/* 统计数据 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>统计数据</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {petData.totalWaterDrank.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>总喝水 (ml)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {streakData?.currentStreak || 0}
            </Text>
            <Text style={styles.statLabel}>连续打卡</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {streakData?.longestStreak || 0}
            </Text>
            <Text style={styles.statLabel}>最长连续</Text>
          </View>
        </View>
      </View>

      {/* 解锁进度 */}
      {nextUnlock && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>下一个解锁</Text>
          <View style={styles.unlockCard}>
            <Text style={styles.unlockEmoji}>{nextUnlock.emoji}</Text>
            <View style={styles.unlockInfo}>
              <Text style={styles.unlockName}>{nextUnlock.name}</Text>
              <Text style={styles.unlockDesc}>{nextUnlock.description}</Text>
              <View style={styles.unlockProgress}>
                <View style={styles.unlockProgressBar}>
                  <View
                    style={[
                      styles.unlockProgressFill,
                      { width: `${unlockProgress.progress}%` },
                    ]}
                  />
                </View>
                <Text style={styles.unlockProgressText}>
                  {streakData?.currentStreak || 0}/{nextUnlock.requiredDays} 天
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 已解锁装饰品 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          已解锁装饰品 ({streakData?.unlockedItems?.length || 0})
        </Text>
        <View style={styles.decorationsGrid}>
          {(streakData?.unlockedItems || []).map((itemId) => {
            const decoration = DECORATIONS.find((d) => d.id === itemId);
            if (!decoration) return null;
            return (
              <View key={itemId} style={styles.decorationItem}>
                <Text style={styles.decorationEmoji}>{decoration.emoji}</Text>
                <Text style={styles.decorationName}>{decoration.name}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

// Helper function
const getExpRequired = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  loadingText: {
    color: "#4FC3F7",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  specialLineContainer: {
    margin: 16,
    marginBottom: 0,
  },
  specialLineCard: {
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  specialLineEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  specialLineText: {
    flex: 1,
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "500",
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#ffffff",
    opacity: 0.8,
  },
  petCard: {
    backgroundColor: "#2d2d44",
    borderRadius: 16,
    padding: 20,
    margin: 16,
    alignItems: "center",
  },
  petName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4FC3F7",
  },
  renameHint: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 4,
  },
  levelTitle: {
    fontSize: 18,
    color: "#ffd700",
    marginTop: 8,
  },
  section: {
    backgroundColor: "#2d2d44",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  levelText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffd700",
  },
  expText: {
    fontSize: 14,
    color: "#8b8b8b",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#1a1a2e",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4FC3F7",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#8b8b8b",
    textAlign: "right",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4FC3F7",
  },
  statLabel: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 4,
    textAlign: "center",
  },
  unlockCard: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  unlockEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  unlockInfo: {
    flex: 1,
  },
  unlockName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  unlockDesc: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 2,
  },
  unlockProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  unlockProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#2d2d44",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  unlockProgressFill: {
    height: "100%",
    backgroundColor: "#ffd700",
    borderRadius: 3,
  },
  unlockProgressText: {
    fontSize: 12,
    color: "#ffd700",
  },
  decorationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  decorationItem: {
    backgroundColor: "#1a1a2e",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    width: "30%",
  },
  decorationEmoji: {
    fontSize: 24,
  },
  decorationName: {
    fontSize: 10,
    color: "#8b8b8b",
    marginTop: 4,
    textAlign: "center",
  },
});

export default PetScreen;
