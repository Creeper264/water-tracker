import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart, BarChart } from "react-native-chart-kit";
import { UserSettings } from "../types";
import { getWeeklyData, getDateRange } from "../utils/storage";

const screenWidth = Dimensions.get("window").width;

interface StatsScreenProps {
  settings: UserSettings | null;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ settings }) => {
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [chartData, setChartData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const goal = settings?.dailyGoal || 2000;

  // Reload stats every time the screen is focused OR viewMode changes
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadStats = async () => {
        setLoading(true);
        const days = viewMode === "week" ? 7 : 30;
        const dates = getDateRange(days);
        const allLogs = await getWeeklyData();

        const data: number[] = [];
        const chartLabels: string[] = [];

        dates.forEach((date, index) => {
          const log = allLogs[date];
          data.push(log?.total || 0);

          // Fix: parse date parts to avoid UTC timezone offset on day labels
          const [y, m, d] = date.split("-").map(Number);
          const dateObj = new Date(y, m - 1, d);

          if (viewMode === "week") {
            chartLabels.push(
              ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                dateObj.getDay()
              ],
            );
          } else if (index % 5 === 0) {
            chartLabels.push(`${dateObj.getMonth() + 1}/${dateObj.getDate()}`);
          } else {
            chartLabels.push("");
          }
        });

        if (!isActive) return;

        setChartData(data);
        setLabels(chartLabels);

        const validData = data.filter((d) => d > 0);
        if (validData.length > 0) {
          setAverage(
            Math.round(validData.reduce((a, b) => a + b, 0) / validData.length),
          );
          setTotal(validData.reduce((a, b) => a + b, 0));
        } else {
          setAverage(0);
          setTotal(0);
        }
        setLoading(false);
      };

      loadStats();
      return () => {
        isActive = false;
      };
    }, [viewMode]),
  );

  // Count days that actually met the daily goal
  const goalsMet = chartData.filter((d) => d >= goal).length;

  const hasData = chartData.some((d) => d > 0);

  const chartConfig = {
    backgroundColor: "#1a1a2e",
    backgroundGradientFrom: "#1a1a2e",
    backgroundGradientTo: "#1a1a2e",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(79, 195, 247, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#4FC3F7",
    },
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Hydration Stats</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "week" && styles.toggleActive,
          ]}
          onPress={() => setViewMode("week")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "week" && styles.toggleTextActive,
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === "month" && styles.toggleActive,
          ]}
          onPress={() => setViewMode("month")}
        >
          <Text
            style={[
              styles.toggleText,
              viewMode === "month" && styles.toggleTextActive,
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{average}</Text>
          <Text style={styles.statLabel}>Avg ml/day</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{total}</Text>
          <Text style={styles.statLabel}>Total ml</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{goalsMet}</Text>
          <Text style={styles.statLabel}>Goals Met</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {viewMode === "week" ? "Weekly Progress" : "Monthly Progress"}
        </Text>
        {loading ? (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>Loading...</Text>
          </View>
        ) : !hasData ? (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>No data for this period</Text>
            <Text style={styles.emptyChartSubText}>
              Start drinking water to see your stats!
            </Text>
          </View>
        ) : viewMode === "week" ? (
          <BarChart
            data={{
              labels,
              datasets: [{ data: chartData }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            yAxisLabel=""
            yAxisSuffix=" ml"
          />
        ) : (
          <LineChart
            data={{
              labels,
              datasets: [{ data: chartData }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            yAxisSuffix=" ml"
          />
        )}
      </View>

      <View style={styles.goalLine}>
        <View style={styles.goalIndicator} />
        <Text style={styles.goalText}>Daily Goal: {goal} ml</Text>
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
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#2d2d44",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  toggleActive: {
    backgroundColor: "#4FC3F7",
  },
  toggleText: {
    color: "#8b8b8b",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggleTextActive: {
    color: "#1a1a2e",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#2d2d44",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4FC3F7",
  },
  statLabel: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 5,
  },
  chartContainer: {
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  emptyChart: {
    height: 160,
    backgroundColor: "#2d2d44",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyChartText: {
    color: "#8b8b8b",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyChartSubText: {
    color: "#666",
    fontSize: 13,
    marginTop: 6,
  },
  goalLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2d2d44",
    borderRadius: 10,
  },
  goalIndicator: {
    width: 12,
    height: 12,
    backgroundColor: "#4FC3F7",
    borderRadius: 6,
    marginRight: 10,
  },
  goalText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default StatsScreen;
