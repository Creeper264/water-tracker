import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { DailyLog, UserSettings } from '../types';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;

interface ProgressRingProps {
  current: number;
  goal: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ current, goal }) => {
  const progress = Math.min(current / goal, 1);
  const circumference = 2 * Math.PI * (CIRCLE_SIZE / 2 - 20);
  const strokeDashoffset = circumference * (1 - progress);
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressCircle}>
        <View style={[styles.progressBg, { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2 }]}>
          <View style={styles.progressInner}>
            <Text style={styles.progressAmount}>{current}</Text>
            <Text style={styles.progressUnit}>ml</Text>
            <Text style={styles.progressGoal}>Goal: {goal} ml</Text>
            <Text style={styles.progressPercent}>{percentage}%</Text>
          </View>
        </View>
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
  const presets = [250, 500, 750, 1000];
  const total = todayLog?.total || 0;
  const goal = settings?.dailyGoal || 2000;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.title}>Hydration Status</Text>

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
      {todayLog?.entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries yet. Start tracking!</Text>
      ) : (
        todayLog?.entries.map((entry) => (
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
              <Text style={styles.removeButtonText}>X</Text>
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
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#8b8b8b',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginBottom: 20,
  },
  progressContainer: {
    marginVertical: 20,
  },
  progressCircle: {
    position: 'relative',
  },
  progressBg: {
    backgroundColor: '#2d2d44',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#4FC3F7',
  },
  progressInner: {
    alignItems: 'center',
  },
  progressAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressUnit: {
    fontSize: 18,
    color: '#8b8b8b',
  },
  progressGoal: {
    fontSize: 14,
    color: '#8b8b8b',
    marginTop: 5,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4FC3F7',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  waterButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    margin: 5,
  },
  waterButtonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#8b8b8b',
    fontSize: 16,
    marginTop: 10,
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d44',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  entryInfo: {
    flex: 1,
  },
  entryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  entryTime: {
    fontSize: 14,
    color: '#8b8b8b',
    marginTop: 3,
  },
  removeButton: {
    backgroundColor: '#ff4757',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default HomeScreen;
