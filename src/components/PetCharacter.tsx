import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  Dimensions,
} from "react-native";
import Svg, { Rect, Circle, G, Defs, RadialGradient, Stop } from "react-native-svg";
import { PetState } from "../types";
import { getPetStateMessage, getPetStateColor } from "../utils/petState";
import { getDecorationById, Decoration } from "../utils/decorations";

interface PetCharacterProps {
  state: PetState;
  size?: number;
  unlockedItems?: string[];
  showSpeech?: boolean;
  onPress?: () => void;
  selectedDecorations?: Record<string, string | null>; // category -> decorationId
}

// 动画值组件
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// 复古像素风格小人组件
const PetCharacter: React.FC<PetCharacterProps> = ({
  state,
  size = 120,
  unlockedItems = [],
  showSpeech = true,
  onPress,
  selectedDecorations,
}) => {
  const color = getPetStateColor(state);
  const message = getPetStateMessage(state);

  // 获取要显示的装饰品
  const activeDecorations = useMemo(() => {
    const result: Record<string, Decoration | null> = {
      hat: null,
      trail: null,
      aura: null,
      outfit: null,
      accessory: null,
    };

    // 如果有选中的装饰品，优先使用
    if (selectedDecorations) {
      Object.entries(selectedDecorations).forEach(([category, id]) => {
        if (id && unlockedItems.includes(id)) {
          result[category] = getDecorationById(id) || null;
        }
      });
    } else {
      // 否则显示第一个解锁的每个类别的装饰品
      const categories = ["hat", "trail", "aura", "outfit", "accessory"] as const;
      categories.forEach((category) => {
        const categoryItems = unlockedItems
          .map((id) => getDecorationById(id))
          .filter((d): d is Decoration => d?.category === category)
          .sort((a, b) => b.requiredDays - a.requiredDays);
        result[category] = categoryItems[0] || null;
      });
    }

    return result;
  }, [unlockedItems, selectedDecorations]);

  // 动画引用
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const speechAnim = useRef(new Animated.Value(0)).current;
  const wanderAnimX = useRef(new Animated.Value(0)).current;
  const facingDirection = useRef(new Animated.Value(1)).current;

  // 点击反馈状态
  const [isPressed, setIsPressed] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  // 游走动画参数
  const screenWidth = Dimensions.get("window").width;
  const wanderBounds = {
    left: -(screenWidth / 2 - size / 2 - 60),
    right: screenWidth / 2 - size / 2 - 60,
  };
  const currentXRef = useRef(0);

  // 呼吸动画 - 持续循环
  useEffect(() => {
    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    breathe.start();
    return () => breathe.stop();
  }, []);

  // 弹跳动画 - 根据状态
  useEffect(() => {
    let bounce: Animated.CompositeAnimation;

    if (state === "happy" || state === "overflow") {
      // 快乐时快速弹跳
      bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -8,
            duration: 200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(400),
        ])
      );
    } else if (state === "dying" || state === "dehydrated") {
      // 虚弱时微微颤抖
      bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -2,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ])
      );
    } else {
      // 正常状态轻微浮动
      bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -3,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    }

    bounce.start();
    return () => bounce.stop();
  }, [state]);

  // 发光动画 - happy 状态
  useEffect(() => {
    if (state === "happy" || state === "overflow") {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    } else {
      glowAnim.setValue(0);
    }
  }, [state]);

  // 对话框淡入动画
  useEffect(() => {
    Animated.timing(speechAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [message]);

  // 随机游走动画
  useEffect(() => {
    let isMounted = true;
    const animate = () => {
      if (!isMounted) return;

      // 随机选择目标位置
      const currentX = currentXRef.current;
      const targetX = wanderBounds.left + Math.random() * (wanderBounds.right - wanderBounds.left);

      // 更新当前位置引用
      currentXRef.current = targetX;

      // 根据移动方向更新朝向
      const direction = targetX > currentX ? 1 : -1;
      Animated.timing(facingDirection, {
        toValue: direction,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // 计算移动时间（基于距离）
      const distance = Math.abs(targetX - currentX);
      const duration = Math.max(2000, distance * 8); // 最少2秒

      Animated.timing(wanderAnimX, {
        toValue: targetX,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }).start(() => {
        // 等待随机时间后继续移动
        const waitTime = 1500 + Math.random() * 3000;
        setTimeout(animate, waitTime);
      });
    };

    // 初始延迟后开始游走
    const initialDelay = setTimeout(animate, 1000);

    return () => {
      isMounted = false;
      clearTimeout(initialDelay);
    };
  }, [size]);

  // 点击处理
  const handlePress = () => {
    setIsPressed(true);

    // 点击时旋转动画
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // 显示爱心
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
      setIsPressed(false);
    }, 800);

    onPress?.();
  };

  // 旋转插值
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"],
  });

  // 水平翻转（用于朝向）
  const scaleX = facingDirection;

  // 根据状态返回不同的眼睛样式
  const getEyes = () => {
    switch (state) {
      case "dying":
        return (
          <G>
            <Rect x={8} y={14} width={3} height={1} fill="#1a1a2e" />
            <Rect x={10} y={12} width={1} height={3} fill="#1a1a2e" />
            <Rect x={29} y={14} width={3} height={1} fill="#1a1a2e" />
            <Rect x={31} y={12} width={1} height={3} fill="#1a1a2e" />
          </G>
        );
      case "dehydrated":
        return (
          <G>
            <Rect x={8} y={13} width={5} height={2} fill="#1a1a2e" />
            <Rect x={27} y={13} width={5} height={2} fill="#1a1a2e" />
          </G>
        );
      case "happy":
      case "overflow":
        return (
          <G>
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
            <Rect x={9} y={12} width={3} height={3} fill="#1a1a2e" />
            <Rect x={28} y={12} width={3} height={3} fill="#1a1a2e" />
            {/* 眼睛高光 */}
            <Rect x={10} y={12} width={1} height={1} fill="#ffffff" />
            <Rect x={29} y={12} width={1} height={1} fill="#ffffff" />
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

  // 获取阴影颜色
  const getShadowColor = () => {
    switch (state) {
      case "happy":
      case "overflow":
        return "#00e676";
      default:
        return "transparent";
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={styles.touchable}
    >
      <View style={[styles.container, { width: size + 40 }]}>
        {/* 发光效果 */}
        {(state === "happy" || state === "overflow") && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                width: size + 20,
                height: size + 20,
                borderRadius: (size + 20) / 2,
                backgroundColor: getBodyColor(),
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.4],
                }),
                transform: [{ scale: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.15],
                })}],
              },
            ]}
          />
        )}

        {/* 点击时显示爱心 */}
        {showHeart && (
          <Animated.View
            style={[
              styles.heartContainer,
              {
                opacity: speechAnim,
                transform: [
                  {
                    translateY: speechAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -30],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.heartEmoji}>❤️</Text>
          </Animated.View>
        )}

        {/* 装饰品 - 帽子 */}
        {activeDecorations.hat && (
          <Animated.View
            style={[
              styles.hat,
              { transform: [{ translateX: wanderAnimX }, { translateY: bounceAnim }] },
            ]}
          >
            <Text style={styles.hatEmoji}>{activeDecorations.hat.emoji}</Text>
          </Animated.View>
        )}

        {/* 装饰品 - 光环 */}
        {activeDecorations.aura && (
          <Animated.View
            style={[
              styles.aura,
              { transform: [{ translateX: wanderAnimX }, { translateY: bounceAnim }] },
            ]}
          >
            <Text style={styles.auraEmoji}>{activeDecorations.aura.emoji}</Text>
          </Animated.View>
        )}

        {/* 装饰品 - 特效轨迹 */}
        {activeDecorations.trail && (
          <Animated.View
            style={[
              styles.stars,
              {
                transform: [{ translateX: wanderAnimX }, { translateY: bounceAnim }],
                opacity: glowAnim,
              },
            ]}
          >
            <Text style={styles.starEmoji}>{activeDecorations.trail.emoji}</Text>
          </Animated.View>
        )}

        {/* 像素小人 SVG */}
        <Animated.View
          style={{
            transform: [
              { translateX: wanderAnimX },
              { scaleX },
              { scale: breatheAnim },
              { translateY: bounceAnim },
              { rotate },
            ],
          }}
        >
          <Svg width={size} height={size} viewBox="0 0 40 40">
            <Defs>
              <RadialGradient id="bodyGradient" cx="30%" cy="30%">
                <Stop offset="0%" stopColor={getBodyColor()} stopOpacity="1" />
                <Stop offset="100%" stopColor={getBodyColor()} stopOpacity="0.7" />
              </RadialGradient>
            </Defs>

            {/* 阴影 */}
            <Circle cx={20} cy={38} r={10} fill="rgba(0,0,0,0.2)" />

            {/* 身体 - 圆形水滴形状 */}
            <Circle cx={20} cy={20} r={16} fill="url(#bodyGradient)" />

            {/* 身体边框 - 像素感 */}
            <Circle
              cx={20}
              cy={20}
              r={15.5}
              fill="none"
              stroke={getBodyColor()}
              strokeWidth={1}
              strokeOpacity={0.5}
            />

            {/* 高光 */}
            <Rect x={6} y={10} width={2} height={4} fill="rgba(255,255,255,0.5)" />
            <Rect x={7} y={9} width={1} height={2} fill="rgba(255,255,255,0.3)" />

            {/* 眼睛 */}
            {getEyes()}

            {/* 嘴巴 */}
            {getMouth()}

            {/* 腮红 */}
            {(state === "happy" || state === "good") && (
              <G>
                <Rect x={4} y={18} width={3} height={2} fill="rgba(255,150,150,0.6)" />
                <Rect x={33} y={18} width={3} height={2} fill="rgba(255,150,150,0.6)" />
              </G>
            )}

            {/* 水滴效果 - overflow 状态 */}
            {state === "overflow" && (
              <G>
                <Rect x={2} y={5} width={2} height={3} fill="#4FC3F7" rx={1} />
                <Rect x={35} y={8} width={2} height={3} fill="#4FC3F7" rx={1} />
                <Rect x={18} y={1} width={2} height={3} fill="#4FC3F7" rx={1} />
                <Rect x={1} y={12} width={2} height={3} fill="#4FC3F7" rx={1} />
                <Rect x={36} y={15} width={2} height={3} fill="#4FC3F7" rx={1} />
              </G>
            )}

            {/* 星星效果 - happy 状态 */}
            {state === "happy" && (
              <G>
                <Rect x={1} y={15} width={2} height={2} fill="#ffd700" />
                <Rect x={37} y={12} width={2} height={2} fill="#ffd700" />
                <Rect x={3} y={5} width={1} height={1} fill="#ffd700" />
                <Rect x={36} y={4} width={1} height={1} fill="#ffd700" />
              </G>
            )}

            {/* 汗水 - dehydrated 状态 */}
            {state === "dehydrated" && (
              <G>
                <Rect x={35} y={12} width={2} height={3} fill="#87CEEB" />
              </G>
            )}

            {/* 死亡气息 - dying 状态 */}
            {state === "dying" && (
              <G>
                <Rect x={1} y={8} width={1} height={1} fill="#888" />
                <Rect x={38} y={6} width={1} height={1} fill="#888" />
                <Rect x={3} y={3} width={1} height={1} fill="#666" />
              </G>
            )}
          </Svg>
        </Animated.View>

        {/* 对话气泡 */}
        {showSpeech && (
          <Animated.View
            style={[
              styles.speechBubble,
              { backgroundColor: color, opacity: speechAnim },
            ]}
          >
            <View style={[styles.speechArrow, { borderTopColor: color }]} />
            <Text style={styles.speechText}>{message}</Text>
          </Animated.View>
        )}

        {/* 点击提示 */}
        <Text style={styles.tapHint}>点击互动</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingVertical: 10,
  },
  glowEffect: {
    position: "absolute",
    zIndex: -1,
  },
  heartContainer: {
    position: "absolute",
    top: -10,
    zIndex: 20,
  },
  heartEmoji: {
    fontSize: 24,
  },
  speechBubble: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: 180,
    position: "relative",
  },
  speechArrow: {
    position: "absolute",
    top: -6,
    left: "50%",
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  speechText: {
    color: "#1a1a2e",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  hat: {
    position: "absolute",
    top: -12,
    zIndex: 10,
  },
  hatEmoji: {
    fontSize: 26,
  },
  aura: {
    position: "absolute",
    top: -22,
    zIndex: 5,
  },
  auraEmoji: {
    fontSize: 22,
  },
  stars: {
    position: "absolute",
    right: -8,
    top: 8,
    zIndex: 5,
  },
  starEmoji: {
    fontSize: 18,
  },
  tapHint: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    opacity: 0.6,
  },
});

export default PetCharacter;
