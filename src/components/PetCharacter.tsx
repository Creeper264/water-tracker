import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Rect, Circle, G } from "react-native-svg";
import { PetState } from "../types";
import { getPetStateMessage, getPetStateColor } from "../utils/petState";

interface PetCharacterProps {
  state: PetState;
  size?: number;
  unlockedItems?: string[];
  showSpeech?: boolean;
}

// 复古像素风格小人组件
const PetCharacter: React.FC<PetCharacterProps> = ({
  state,
  size = 120,
  unlockedItems = [],
  showSpeech = true,
}) => {
  const color = getPetStateColor(state);
  const message = getPetStateMessage(state);

  // 根据状态返回不同的眼睛样式
  const getEyes = () => {
    switch (state) {
      case "dying":
        return (
          <G>
            {/* X X 眼睛 */}
            <Rect x={8} y={14} width={3} height={1} fill="#1a1a2e" />
            <Rect x={10} y={12} width={1} height={3} fill="#1a1a2e" />
            <Rect x={29} y={14} width={3} height={1} fill="#1a1a2e" />
            <Rect x={31} y={12} width={1} height={3} fill="#1a1a2e" />
          </G>
        );
      case "dehydrated":
        return (
          <G>
            {/* 半闭眼睛 */}
            <Rect x={8} y={13} width={5} height={2} fill="#1a1a2e" />
            <Rect x={27} y={13} width={5} height={2} fill="#1a1a2e" />
          </G>
        );
      case "happy":
      case "overflow":
        return (
          <G>
            {/* 开心弧线眼 */}
            <Rect x={8} y={11} width={1} height={1} fill="#1a1a2e" />
            <Rect x={9} y={12} width={1} height={1} fill="#1a1a2e" />
            <Rect x={10} y={13} width={1} height={1} fill="#1a1a2e" />
            <Rect x={11} y={12} width={1} height={1} fill="#1a1a2e" />
            <Rect x={12} y={11} width={1} height={1} fill="#1a1a2e" />
            <Rect x={27} y={11} width={1} height={1} fill="#1a1a2e" />
            <Rect x={28} y={12} width={1} height={1} fill="#1a1a2e" />
            <Rect x={29} y={13} width={1} height={1} fill="#1a1a2e" />
            <Rect x={30} y={12} width={1} height={1} fill="#1a1a2e" />
            <Rect x={31} y={11} width={1} height={1} fill="#1a1a2e" />
          </G>
        );
      default:
        return (
          <G>
            {/* 普通圆眼睛 */}
            <Rect x={9} y={12} width={3} height={3} fill="#1a1a2e" />
            <Rect x={28} y={12} width={3} height={3} fill="#1a1a2e" />
          </G>
        );
    }
  };

  // 根据状态返回嘴巴样式
  const getMouth = () => {
    switch (state) {
      case "dying":
        return <Rect x={16} y={24} width={8} height={1} fill="#1a1a2e" />;
      case "dehydrated":
        return (
          <G>
            <Rect x={16} y={23} width={8} height={1} fill="#1a1a2e" />
            <Rect x={17} y={22} width={6} height={1} fill="#1a1a2e" />
          </G>
        );
      case "happy":
      case "overflow":
        return (
          <G>
            <Rect x={14} y={22} width={12} height={1} fill="#1a1a2e" />
            <Rect x={15} y={23} width={10} height={1} fill="#1a1a2e" />
            <Rect x={16} y={24} width={8} height={1} fill="#1a1a2e" />
          </G>
        );
      case "good":
        return (
          <G>
            <Rect x={17} y={23} width={6} height={1} fill="#1a1a2e" />
            <Rect x={18} y={22} width={4} height={1} fill="#1a1a2e" />
          </G>
        );
      default:
        return <Rect x={18} y={23} width={4} height={1} fill="#1a1a2e" />;
    }
  };

  // 获取身体颜色
  const getBodyColor = () => {
    switch (state) {
      case "dying":
        return "#747d8c";
      case "dehydrated":
        return "#ffa502";
      case "normal":
        return "#4FC3F7";
      case "good":
        return "#2ed573";
      case "happy":
        return "#00e676";
      case "overflow":
        return "#a55eea";
      default:
        return "#4FC3F7";
    }
  };

  return (
    <View style={[styles.container, { width: size + 20 }]}>
      {/* 装饰品 - 帽子 */}
      {unlockedItems.includes("hat_cap") && (
        <View style={styles.hat}>
          <Text style={styles.hatEmoji}>🧢</Text>
        </View>
      )}
      {unlockedItems.includes("hat_party") && (
        <View style={styles.hat}>
          <Text style={styles.hatEmoji}>🎉</Text>
        </View>
      )}

      {/* 像素小人 SVG */}
      <Svg width={size} height={size} viewBox="0 0 40 40">
        {/* 身体 - 圆形水滴形状 */}
        <Circle cx={20} cy={20} r={16} fill={getBodyColor()} />

        {/* 高光 */}
        <Rect x={6} y={10} width={2} height={4} fill="rgba(255,255,255,0.4)" />

        {/* 眼睛 */}
        {getEyes()}

        {/* 嘴巴 */}
        {getMouth()}

        {/* 腮红 - 快心状态 */}
        {(state === "happy" || state === "good") && (
          <G>
            <Rect x={5} y={18} width={2} height={2} fill="rgba(255,150,150,0.5)" />
            <Rect x={33} y={18} width={2} height={2} fill="rgba(255,150,150,0.5)" />
          </G>
        )}

        {/* 水滴效果 - overflow 状态 */}
        {state === "overflow" && (
          <G>
            <Rect x={2} y={5} width={1} height={2} fill="#4FC3F7" />
            <Rect x={36} y={8} width={1} height={2} fill="#4FC3F7" />
            <Rect x={18} y={2} width={1} height={2} fill="#4FC3F7" />
          </G>
        )}

        {/* 星星效果 - happy 状态 */}
        {state === "happy" && (
          <G>
            <Rect x={1} y={15} width={1} height={1} fill="#ffd700" />
            <Rect x={38} y={12} width={1} height={1} fill="#ffd700" />
          </G>
        )}
      </Svg>

      {/* 装饰品 - 光环 */}
      {unlockedItems.includes("aura_rainbow") && (
        <View style={styles.aura}>
          <Text style={styles.auraEmoji}>🌈</Text>
        </View>
      )}

      {/* 星星轨迹 */}
      {unlockedItems.includes("trail_stars") && (
        <View style={styles.stars}>
          <Text style={styles.starEmoji}>✨</Text>
        </View>
      )}

      {/* 对话气泡 */}
      {showSpeech && (
        <View style={[styles.speechBubble, { backgroundColor: color }]}>
          <Text style={styles.speechText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  speechBubble: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    maxWidth: 160,
  },
  speechText: {
    color: "#1a1a2e",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  hat: {
    position: "absolute",
    top: -15,
    zIndex: 10,
  },
  hatEmoji: {
    fontSize: 24,
  },
  aura: {
    position: "absolute",
    top: -25,
    zIndex: 5,
  },
  auraEmoji: {
    fontSize: 20,
  },
  stars: {
    position: "absolute",
    right: -10,
    top: 10,
    zIndex: 5,
  },
  starEmoji: {
    fontSize: 16,
  },
});

export default PetCharacter;
