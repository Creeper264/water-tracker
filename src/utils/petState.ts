import { PetState } from "../types";

/**
 * 根据当前喝水量与目标的比例计算小人状态
 * @param currentMl 当前喝水量（毫升）
 * @param goalMl 每日目标（毫升）
 * @returns PetState 状态
 */
export const calculatePetState = (
  currentMl: number,
  goalMl: number
): PetState => {
  // 防止除零
  if (goalMl <= 0) return "normal";

  const ratio = currentMl / goalMl;

  if (ratio === 0) return "dying";
  if (ratio < 0.3) return "dehydrated";
  if (ratio < 0.7) return "normal";
  if (ratio < 1.0) return "good";
  if (ratio >= 1.0 && ratio < 1.5) return "happy";
  return "overflow"; // 喝太多啦
};

/**
 * 获取状态对应的提示文字
 */
export const getPetStateMessage = (state: PetState): string => {
  const messages: Record<PetState, string> = {
    dying: "快喝水！我快渴死了...",
    dehydrated: "有点渴，能给口水吗？",
    normal: "感觉还不错~",
    good: "今天状态很好！",
    happy: "太棒了！已达成目标！",
    overflow: "喝太多了...游泳中",
  };
  return messages[state];
};

/**
 * 获取状态对应的颜色
 */
export const getPetStateColor = (state: PetState): string => {
  const colors: Record<PetState, string> = {
    dying: "#ff4757",
    dehydrated: "#ffa502",
    normal: "#4FC3F7",
    good: "#2ed573",
    happy: "#00e676",
    overflow: "#a55eea",
  };
  return colors[state];
};
