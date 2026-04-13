import React, { memo, useState, useRef, useCallback } from "react";
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { PixelFrame, Palette } from "../../types";
import PixelSprite from "./PixelSprite";
import { PALETTE } from "../../utils/spriteFrames";

export interface InteractiveElementProps {
  id: string;
  frames: PixelFrame[];
  palette?: Palette;
  pixelSize?: number;
  scale?: number;
  x: number;
  y: number;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  hapticFeedback?: boolean;
  animationType?: "bounce" | "pulse" | "shake" | "none";
}

const InteractiveElement: React.FC<InteractiveElementProps> = memo(
  ({
    id,
    frames,
    palette = PALETTE,
    pixelSize = 8,
    scale = 1,
    x,
    y,
    onPress,
    onLongPress,
    disabled = false,
    style,
    hapticFeedback = true,
    animationType = "bounce",
  }) => {
    const [isPressed, setIsPressed] = useState(false);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    const currentFrame = frames[currentFrameIndex] || frames[0];

    const triggerHaptic = useCallback(() => {
      if (hapticFeedback && !disabled) {
        // React Native 的 Haptic 反馈需要 expo-haptics 或自定义实现
        // 这里预留接口，实际使用时可以集成
      }
    }, [hapticFeedback, disabled]);

    const playAnimation = useCallback(() => {
      switch (animationType) {
        case "bounce":
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.15,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case "pulse":
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.95,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case "shake":
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: -1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
          ]).start();
          break;

        case "none":
        default:
          break;
      }
    }, [animationType, scaleAnim, rotateAnim]);

    const handlePress = useCallback(() => {
      if (disabled) return;

      setIsPressed(true);
      triggerHaptic();
      playAnimation();

      // 如果有多帧，切换到下一帧
      if (frames.length > 1) {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
      }

      onPress?.();

      setTimeout(() => {
        setIsPressed(false);
      }, 200);
    }, [disabled, frames.length, triggerHaptic, playAnimation, onPress]);

    const handleLongPress = useCallback(() => {
      if (disabled) return;
      onLongPress?.();
    }, [disabled, onLongPress]);

    const rotate = rotateAnim.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: ["-5deg", "0deg", "5deg"],
    });

    return (
      <Animated.View
        style={[
          styles.container,
          {
            position: "absolute",
            left: x,
            top: y,
            transform: [{ scale: scaleAnim }, { rotate }],
          },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          onLongPress={handleLongPress}
          disabled={disabled}
          style={styles.touchable}
        >
          <PixelSprite
            frame={currentFrame}
            palette={palette}
            pixelSize={pixelSize}
            scale={scale}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

InteractiveElement.displayName = "InteractiveElement";

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  touchable: {
    padding: 4,
  },
});

export default InteractiveElement;