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
  const messages: Record<PetState, string[]> = {
    dying: [
      "救命...水...水...",
      "我快变成干尸了！",
      "一滴水都没有吗？",
      "沙漠...这就是沙漠吗...",
    ],
    dehydrated: [
      "有点渴呢...",
      "能给我一口水吗？",
      "嘴唇好干...",
      "想念水的味道...",
    ],
    normal: [
      "今天还不错~",
      "继续保持哦！",
      "记得多喝水~",
      "我很好，你呢？",
    ],
    good: [
      "快达标啦！加油！",
      "感觉棒极了！",
      "继续保持！",
      "你真棒！",
    ],
    happy: [
      "目标达成！开心！",
      "我爱喝水！",
      "完美！继续加油！",
      "你是最棒的！",
    ],
    overflow: [
      "咕噜咕噜...太多了",
      "我在游泳啦~",
      "水有点多了...",
      "要溢出来啦！",
    ],
  };

  // 随机返回一条消息
  const msgs = messages[state];
  return msgs[Math.floor(Math.random() * msgs.length)];
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
