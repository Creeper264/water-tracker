import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { DailyLog, UserSettings, StreakData } from "../types";
import PetCharacter from "../components/PetCharacter";
import { calculatePetState } from "../utils/petState";
import { getStreakData } from "../utils/storage";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.7;

interface ProgressRingProps {
  current: number;
  goal: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ current, goal }) => {
  const progress = Math.min(current / goal, 1);
  const radius = (CIRCLE_SIZE - 48) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const percentage = Math.round(progress * 100);
  const center = CIRCLE_SIZE / 2;
  const progressColor = progress >= 1 ? "#00e676" : "#4FC3F7";

  return (
    <View
      style={[
        styles.progressContainer,
        { width: CIRCLE_SIZE, height: CIRCLE_SIZE },
      ]}
    >
      <Svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        style={{ position: "absolute" }}
      >
        {/* Background track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2d2d44"
          strokeWidth={16}
          fill="none"
        />
        {/* Progress arc — starts from top (rotated -90°) */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={16}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      <View style={styles.progressInner}>
        <Text style={styles.progressAmount}>{current}</Text>
        <Text style={styles.progressUnit}>ml</Text>
        <Text style={styles.progressGoal}>Goal: {goal} ml</Text>
        <Text style={[styles.progressPercent, { color: progressColor }]}>
          {percentage}%
        </Text>
      </View>
    </View>
  );
};

interface WaterButtonProps {
  amount: number;
  onPress: () => void;
}

const WaterButton: React.FC<WaterButtonProps> = ({ amount, onPress }) => (
  <TouchableOpacity style={styles.waterButton} onPress={onPress}>
    <Text style={styles.waterButtonText}>{amount} ml</Text>
  </TouchableOpacity>
);

interface HomeScreenProps {
  todayLog: DailyLog | null;
  settings: UserSettings | null;
  onAddWater: (amount: number) => void;
  onRemoveEntry: (id: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  todayLog,
  settings,
  onAddWater,
  onRemoveEntry,
}) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  const presets = [250, 500, 750, 1000];
  const total = todayLog?.total || 0;
  const goal = settings?.dailyGoal || 2000;

  // 计算小人状态
  const petState = calculatePetState(total, goal);

  // 加载 streak 数据
  useEffect(() => {
    const loadStreak = async () => {
      const data = await getStreakData();
      setStreakData(data);
    };
    loadStreak();
  }, [todayLog]); // 当 todayLog 变化时重新加载

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning!";
    if (hour < 17) return "Good Afternoon!";
    return "Good Evening!";
  };

  // Show newest entries at the top
  const entries = todayLog?.entries ? [...todayLog.entries].reverse() : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.title}>Hydration Status</Text>

      {/* 像素小人 */}
      <PetCharacter
        state={petState}
        size={100}
        unlockedItems={streakData?.unlockedItems || []}
      />

      <ProgressRing current={total} goal={goal} />

      <Text style={styles.sectionTitle}>Quick Add</Text>
      <View style={styles.buttonRow}>
        {presets.map((amount) => (
          <WaterButton
            key={amount}
            amount={amount}
            onPress={() => onAddWater(amount)}
          />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Today's Log</Text>
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries yet. Start tracking!</Text>
      ) : (
        entries.map((entry) => (
          <View key={entry.id} style={styles.entryItem}>
            <View style={styles.entryInfo}>
              <Text style={styles.entryAmount}>{entry.amount} ml</Text>
              <Text style={styles.entryTime}>
                {new Date(entry.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveEntry(entry.id)}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
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
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "#8b8b8b",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4FC3F7",
    marginBottom: 20,
  },
  progressContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  progressInner: {
    alignItems: "center",
  },
  progressAmount: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressUnit: {
    fontSize: 18,
    color: "#8b8b8b",
  },
  progressGoal: {
    fontSize: 14,
    color: "#8b8b8b",
    marginTop: 5,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  waterButton: {
    backgroundColor: "#4FC3F7",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    margin: 5,
  },
  waterButtonText: {
    color: "#1a1a2e",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    color: "#8b8b8b",
    fontSize: 16,
    marginTop: 10,
  },
  entryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d2d44",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  entryInfo: {
    flex: 1,
  },
  entryAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  entryTime: {
    fontSize: 14,
    color: "#8b8b8b",
    marginTop: 3,
  },
  removeButton: {
    backgroundColor: "#ff4757",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default HomeScreen;
