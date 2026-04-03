import AsyncStorage from "@react-native-async-storage/async-storage";
import { PetData, PET_LEVELS, LEVEL_TITLES } from "../types";

const STORAGE_KEY = "@watertracker:pet";

const DEFAULT_PET: PetData = {
  level: 1,
  experience: 0,
  totalWaterDrank: 0,
  name: "小水滴",
  createdAt: Date.now(),
  lastFedAt: Date.now(),
};

// 获取宠物数据
export const getPetData = async (): Promise<PetData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_PET;
    return { ...DEFAULT_PET, ...JSON.parse(data) };
  } catch (error) {
    console.error("Error loading pet data:", error);
    return DEFAULT_PET;
  }
};

// 保存宠物数据
export const savePetData = async (pet: PetData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
  } catch (error) {
    console.error("Error saving pet data:", error);
  }
};

// 计算升级所需经验
export const getExpRequiredForLevel = (level: number): number => {
  return Math.floor(
    PET_LEVELS.BASE_EXP * Math.pow(PET_LEVELS.EXP_MULTIPLIER, level - 1)
  );
};

// 计算当前等级进度
export const getLevelProgress = (pet: PetData): number => {
  const currentExp = pet.experience;
  const required = getExpRequiredForLevel(pet.level);
  return Math.min((currentExp / required) * 100, 100);
};

// 获取等级称号
export const getLevelTitle = (level: number): string => {
  // 找到小于等于当前等级的最高称号
  const titles = Object.entries(LEVEL_TITLES)
    .filter(([l]) => Number(l) <= level)
    .sort((a, b) => Number(b[0]) - Number(a[0]));
  return titles[0]?.[1] || "水滴宝宝";
};

// 喂水给宠物（增加经验和总量）
export const feedPet = async (
  amountMl: number
): Promise<{ pet: PetData; leveledUp: boolean; newLevel?: number }> => {
  const pet = await getPetData();
  let leveledUp = false;
  let newLevel = pet.level;

  // 增加喝水量
  pet.totalWaterDrank += amountMl;
  pet.lastFedAt = Date.now();

  // 每 100ml 获得 10 经验
  const expGain = Math.floor((amountMl / 100) * 10);
  pet.experience += expGain;

  // 检查升级
  while (pet.level < PET_LEVELS.MAX_LEVEL) {
    const required = getExpRequiredForLevel(pet.level);
    if (pet.experience >= required) {
      pet.experience -= required;
      pet.level++;
      leveledUp = true;
      newLevel = pet.level;
    } else {
      break;
    }
  }

  await savePetData(pet);
  return { pet, leveledUp, newLevel: leveledUp ? newLevel : undefined };
};

// 重命名宠物
export const renamePet = async (name: string): Promise<PetData> => {
  const pet = await getPetData();
  pet.name = name;
  await savePetData(pet);
  return pet;
};

// 获取宠物统计信息
export const getPetStats = async (): Promise<{
  daysSinceCreation: number;
  avgDailyWater: number;
}> => {
  const pet = await getPetData();
  const daysSinceCreation = Math.max(
    1,
    Math.floor((Date.now() - pet.createdAt) / (1000 * 60 * 60 * 24))
  );
  const avgDailyWater = Math.floor(pet.totalWaterDrank / daysSinceCreation);

  return { daysSinceCreation, avgDailyWater };
};
