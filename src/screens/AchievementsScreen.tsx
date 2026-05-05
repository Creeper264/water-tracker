import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { getStreakData } from "../utils/storage";
import { getPetData, getLevelTitle } from "../utils/petStorage";
import { StreakData, PetData, ThemeColors } from "../types";
import { t, useLocale } from "../utils/i18n";
import { useTheme } from "../contexts/ThemeContext";

// Achievement definitions
const STREAK_ACHIEVEMENTS = [
  { days: 3, id: "hat_cap", icon: "🧢", nameKey: "achieve.streak3" },
  { days: 5, id: "trail_stars", icon: "✨", nameKey: "achieve.streak5" },
  { days: 7, id: "hat_party", icon: "🎉", nameKey: "achieve.streak7" },
  { days: 10, id: "trail_sparkle", icon: "💫", nameKey: "achieve.streak10" },
  { days: 14, id: "hat_crown", icon: "👑", nameKey: "achieve.streak14" },
  { days: 15, id: "trail_heart", icon: "💖", nameKey: "achieve.streak15" },
  { days: 21, id: "hat_wizard", icon: "🧙", nameKey: "achieve.streak21" },
  { days: 28, id: "outfit_wings", icon: "🦋", nameKey: "achieve.streak28" },
  { days: 30, id: "aura_rainbow", icon: "🌈", nameKey: "achieve.streak30" },
  { days: 35, id: "accessory_necklace", icon: "💎", nameKey: "achieve.streak35" },
  { days: 45, id: "aura_angel", icon: "👼", nameKey: "achieve.streak45" },
  { days: 60, id: "aura_cosmic", icon: "🌌", nameKey: "achieve.streak60" },
];

const LEVEL_ACHIEVEMENTS = [
  { level: 5, icon: "💧", nameKey: "achieve.level5" },
  { level: 10, icon: "🌊", nameKey: "achieve.level10" },
  { level: 15, icon: "🏞️", nameKey: "achieve.level15" },
  { level: 20, icon: "🌊", nameKey: "achieve.level20" },
  { level: 25, icon: "🏝️", nameKey: "achieve.level25" },
  { level: 30, icon: "🐙", nameKey: "achieve.level30" },
  { level: 35, icon: "🎯", nameKey: "achieve.level35" },
  { level: 40, icon: "⚡", nameKey: "achieve.level40" },
  { level: 45, icon: "🌟", nameKey: "achieve.level45" },
  { level: 50, icon: "👑", nameKey: "achieve.level50" },
];

interface AchievementsScreenProps {
  navigation: any;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  navigation,
}) => {
  useLocale();
  const { colors } = useTheme();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);

  const dynamicStyles = useMemo(() => ({
    container: { backgroundColor: colors.background },
    loading: { color: colors.textSecondary },
    title: { color: colors.accent },
    statCard: { backgroundColor: colors.card },
    statValue: { color: colors.accent },
    statValueSmall: { color: colors.accent },
    statLabel: { color: colors.textSecondary },
    sectionTitle: { color: colors.text },
    badge: { backgroundColor: colors.card },
    badgeLocked: { backgroundColor: colors.background, borderColor: colors.border },
    badgeName: { color: colors.text },
    badgeNameLocked: { color: colors.textSecondary },
    badgeProgress: { color: colors.accent },
    tipsCard: { backgroundColor: colors.card },
    tipsTitle: { color: colors.accent },
    tipsText: { color: colors.textSecondary },
  }), [colors]);

  useEffect(() => {
    const loadData = async () => {
      const streakData = await getStreakData();
      const petData = await getPetData();
      setStreak(streakData);
      setPet(petData);
      setLoading(false);
    };
    loadData();
  }, []);

  const renderBadge = (
    item: { icon: string; nameKey: string },
    unlocked: boolean,
    progress?: string
  ) => (
    <View
      key={item.nameKey}
      style={[styles.badge, !unlocked && styles.badgeLocked, !unlocked && dynamicStyles.badgeLocked, dynamicStyles.badge]}
    >
      <Text style={styles.badgeIcon}>{item.icon}</Text>
      <Text style={[styles.badgeName, !unlocked && styles.badgeNameLocked, !unlocked && dynamicStyles.badgeNameLocked, dynamicStyles.badgeName]}>
        {t(item.nameKey)}
      </Text>
      {!unlocked && progress && (
        <Text style={[styles.badgeProgress, dynamicStyles.badgeProgress]}>{progress}</Text>
      )}
      {unlocked && <Text style={styles.badgeCheck}>✓</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, dynamicStyles.container]}>
        <Text style={[styles.loading, dynamicStyles.loading]}>{t("stats.loading")}</Text>
      </View>
    );
  }

  const currentStreak = streak?.currentStreak || 0;
  const currentLevel = pet?.level || 1;
  const unlockedItems = streak?.unlockedItems || [];

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, dynamicStyles.title]}>{t("achieve.title")}</Text>

      {/* Current stats summary */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, dynamicStyles.statCard]}>
          <Text style={[styles.statValue, dynamicStyles.statValue]}>{currentStreak}</Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t("achieve.currentStreak")}</Text>
        </View>
        <View style={[styles.statCard, dynamicStyles.statCard]}>
          <Text style={[styles.statValue, dynamicStyles.statValue]}>{currentLevel}</Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t("achieve.currentLevel")}</Text>
        </View>
        <View style={[styles.statCard, dynamicStyles.statCard]}>
          <Text style={[styles.statValueSmall, dynamicStyles.statValueSmall]}>
            {getLevelTitle(currentLevel)}
          </Text>
          <Text style={[styles.statLabel, dynamicStyles.statLabel]}>{t("achieve.currentTitle")}</Text>
        </View>
      </View>

      {/* Streak achievements section */}
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("achieve.streakBadges")}</Text>
      <View style={styles.badgesGrid}>
        {STREAK_ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedItems.includes(ach.id);
          const progress = unlocked
            ? undefined
            : `${currentStreak}/${ach.days}`;
          return renderBadge(ach, unlocked, progress);
        })}
      </View>

      {/* Level achievements section */}
      <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{t("achieve.levelBadges")}</Text>
      <View style={styles.badgesGrid}>
        {LEVEL_ACHIEVEMENTS.map((ach) => {
          const unlocked = currentLevel >= ach.level;
          const progress = unlocked ? undefined : `${currentLevel}/${ach.level}`;
          return renderBadge(ach, unlocked, progress);
        })}
      </View>

      {/* Tips section */}
      <View style={[styles.tipsCard, dynamicStyles.tipsCard]}>
        <Text style={[styles.tipsTitle, dynamicStyles.tipsTitle]}>{t("achieve.howToUnlock")}</Text>
        <Text style={[styles.tipsText, dynamicStyles.tipsText]}>{t("achieve.streakTip")}</Text>
        <Text style={[styles.tipsText, dynamicStyles.tipsText]}>{t("achieve.levelTip")}</Text>
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
    paddingBottom: 40,
  },
  loading: {
    color: "#8b8b8b",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4FC3F7",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2d2d44",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4FC3F7",
  },
  statValueSmall: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4FC3F7",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#8b8b8b",
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 20,
  },
  badge: {
    width: "30%",
    marginHorizontal: "1.66%",
    marginBottom: 12,
    backgroundColor: "#2d2d44",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    minHeight: 100,
  },
  badgeLocked: {
    backgroundColor: "#1f1f2e",
    borderWidth: 1,
    borderColor: "#3a3a4a",
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  badgeName: {
    fontSize: 11,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  badgeNameLocked: {
    color: "#666",
  },
  badgeProgress: {
    fontSize: 10,
    color: "#4FC3F7",
    marginTop: 4,
  },
  badgeCheck: {
    fontSize: 12,
    color: "#2ed573",
    marginTop: 4,
    fontWeight: "bold",
  },
  tipsCard: {
    backgroundColor: "#2d2d44",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4FC3F7",
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 4,
    lineHeight: 18,
  },
});

export default AchievementsScreen;
