import React from "react";
import { View, Text, StyleSheet, ProgressBarAndroid } from "react-native";
import { PetData } from "../types";
import { getExpRequiredForLevel, getLevelProgress, getLevelTitle } from "../utils/petStorage";

interface PetGrowthInfoProps {
  pet: PetData;
}

const PetGrowthInfo: React.FC<PetGrowthInfoProps> = ({ pet }) => {
  const progress = getLevelProgress(pet);
  const title = getLevelTitle(pet.level);
  const expRequired = getExpRequiredForLevel(pet.level);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.level}>Lv.{pet.level}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.progressContainer}>
        <ProgressBarAndroid
          styleAttr="Horizontal"
          indeterminate={false}
          progress={progress}
          color="#4FC3F7"
          style={styles.progressBar}
        />
        <Text style={styles.expText}>
          {pet.experience} / {expRequired} EXP
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pet.totalWaterDrank.toLocaleString()}</Text>
          <Text style={styles.statLabel}>总喝水 (ml)</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.floor((Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24))}
          </Text>
          <Text style={styles.statLabel}>陪伴天数</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2d2d44",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4FC3F7",
  },
  level: {
    fontSize: 16,
    color: "#ffd700",
    fontWeight: "600",
  },
  title: {
    fontSize: 14,
    color: "#8b8b8b",
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  expText: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 4,
    textAlign: "right",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "#8b8b8b",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#3d3d54",
  },
});

export default PetGrowthInfo;
