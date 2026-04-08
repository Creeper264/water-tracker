import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import LottieView from "lottie-react-native";
import { PetState } from "../types";
import { getPetStateMessage, getPetStateColor } from "../utils/petState";

interface PetLottieProps {
  state: PetState;
  size?: number;
  unlockedItems?: string[];
  onPress?: () => void;
}

// 简单的 Lottie 动画占位符
// 实际使用时需要替换为真实的 Lottie JSON 动画文件
const PetLottie: React.FC<PetLottieProps> = ({
  state,
  size = 120,
  unlockedItems = [],
  onPress,
}) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // 弹跳动画
  useEffect(() => {
    let bounce: Animated.CompositeAnimation;

    if (state === "happy" || state === "overflow") {
      bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
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
          Animated.delay(300),
        ])
      );
    } else {
      bounce = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -5,
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

  // 发光动画
  useEffect(() => {
    if (state === "happy" || state === "overflow") {
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      glow.start();
      return () => glow.stop();
    }
  }, [state]);

  // Lottie 动画源映射
  // 注意：需要实际的 Lottie JSON 文件才能使用
  // 当前使用 emoji 占位符代替，避免 require 不存在的文件导致闪退
  // const getAnimationSource = () => { ... }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: bounceAnim }],
        },
      ]}
    >
      {/* 发光效果 */}
      {(state === "happy" || state === "overflow") && (
        <Animated.View
          style={[
            styles.glow,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              backgroundColor: getPetStateColor(state),
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 0.3],
              }),
              transform: [
                {
                  scale: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        />
      )}

      {/* Lottie 动画 */}
      {/* 注意：需要实际的 Lottie JSON 文件才能使用 */}
      {/* <LottieView
        source={getAnimationSource()}
        autoPlay
        loop
        style={{ width: size, height: size }}
      /> */}

      {/* 占位符 - 使用 SVG 版本 */}
      <View style={[styles.placeholder, { width: size, height: size }]}>
        <Animated.Text
          style={[
            styles.emoji,
            {
              transform: [{ scale: bounceAnim.interpolate({
                inputRange: [-10, 0],
                outputRange: [0.9, 1],
              })}],
            },
          ]}
        >
          {state === "dying" && "😵"}
          {state === "dehydrated" && "😬"}
          {state === "normal" && "💧"}
          {state === "good" && "😊"}
          {state === "happy" && "🥳"}
          {state === "overflow" && "🏊"}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 60,
  },
});

export default PetLottie;
