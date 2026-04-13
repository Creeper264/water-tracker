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
import { PetState } from "../types";
import { getPetStateMessage, getPetStateColor } from "../utils/petState";
import { getDecorationById, Decoration } from "../utils/decorations";
import { PixelAnimation } from "./pixel/PixelAnimation";
import { PixelDecoration } from "./pixel/PixelDecoration";
import { PET_ANIMATIONS } from "../utils/spriteFrames";
import { DECORATION_SPRITES } from "../utils/decorationSprites";

interface PetCharacterProps {
  state: PetState;
  size?: number;
  unlockedItems?: string[];
  showSpeech?: boolean;
  onPress?: () => void;
  selectedDecorations?: Record<string, string | null>;
}

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

  const activeDecorations = useMemo(() => {
    const result: Record<string, Decoration | null> = {
      hat: null,
      trail: null,
      aura: null,
      outfit: null,
      accessory: null,
    };

    if (selectedDecorations) {
      Object.entries(selectedDecorations).forEach(([category, id]) => {
        if (id && unlockedItems.includes(id)) {
          result[category] = getDecorationById(id) || null;
        }
      });
    } else {
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

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const speechAnim = useRef(new Animated.Value(0)).current;
  const wanderAnimX = useRef(new Animated.Value(0)).current;
  const facingDirection = useRef(new Animated.Value(1)).current;

  const [isPressed, setIsPressed] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const wanderBounds = {
    left: -(screenWidth / 2 - size / 2 - 60),
    right: screenWidth / 2 - size / 2 - 60,
  };
  const currentXRef = useRef(0);

  const pixelSize = Math.floor(size / 12);

  useEffect(() => {
    let bounce: Animated.CompositeAnimation;

    if (state === "happy" || state === "overflow") {
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

  useEffect(() => {
    Animated.timing(speechAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [message]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let currentAnimation: Animated.CompositeAnimation | null = null;

    const animate = () => {
      if (!isMounted) return;

      const currentX = currentXRef.current;
      const targetX = wanderBounds.left + Math.random() * (wanderBounds.right - wanderBounds.left);

      currentXRef.current = targetX;

      const direction = targetX > currentX ? 1 : -1;
      Animated.timing(facingDirection, {
        toValue: direction,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const distance = Math.abs(targetX - currentX);
      const duration = Math.max(2000, distance * 8);

      currentAnimation = Animated.timing(wanderAnimX, {
        toValue: targetX,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      });

      currentAnimation.start(({ finished }) => {
        currentAnimation = null;
        if (finished && isMounted) {
          const waitTime = 1500 + Math.random() * 3000;
          timeoutId = setTimeout(animate, waitTime);
        }
      });
    };

    timeoutId = setTimeout(animate, 1000);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (currentAnimation) {
        currentAnimation.stop();
        currentAnimation = null;
      }
    };
  }, [size]);

  const handlePress = () => {
    setIsPressed(true);
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
      setIsPressed(false);
    }, 800);

    onPress?.();
  };

  const scaleX = facingDirection;

  // 防御性检查：确保动画存在，使用空帧作为最终默认值
  const currentAnimation = PET_ANIMATIONS[state] ?? PET_ANIMATIONS.normal ?? { frames: [[]], fps: 1, loop: true };

  const glowColor = state === "happy" || state === "overflow" ? getPetStateColor(state) : "transparent";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={styles.touchable}
    >
      <View style={[styles.container, { width: size + 40 }]}>
        {(state === "happy" || state === "overflow") && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                width: size + 20,
                height: size + 20,
                borderRadius: (size + 20) / 2,
                backgroundColor: glowColor,
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.1, 0.4],
                }),
                transform: [
                  {
                    scale: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.15],
                    }),
                  },
                ],
              },
            ]}
          />
        )}

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

        <Animated.View
          style={{
            position: "absolute",
            top: -22,
            left: "50%",
            marginLeft: -pixelSize * 8,
            transform: [{ translateX: wanderAnimX }, { translateY: bounceAnim }],
            zIndex: 10,
          }}
        >
          {activeDecorations.hat && DECORATION_SPRITES[activeDecorations.hat.id] && (
            <PixelDecoration
              decoration={{
                id: activeDecorations.hat.id,
                frames: DECORATION_SPRITES[activeDecorations.hat.id] ?? [[]],
                offset: { x: 0, y: 0 },
                anchor: "head",
              }}
              pixelSize={pixelSize}
              scale={1}
            />
          )}
        </Animated.View>

        {activeDecorations.aura && DECORATION_SPRITES[activeDecorations.aura.id] && (
          <Animated.View
            style={[
              styles.aura,
              { transform: [{ translateX: wanderAnimX }, { translateY: bounceAnim }] },
            ]}
          >
            <PixelDecoration
              decoration={{
                id: activeDecorations.aura.id,
                frames: DECORATION_SPRITES[activeDecorations.aura.id] ?? [[]],
                offset: { x: 0, y: -pixelSize * 2 },
                anchor: "head",
              }}
              pixelSize={pixelSize}
              scale={1}
            />
          </Animated.View>
        )}

        {activeDecorations.trail && DECORATION_SPRITES[activeDecorations.trail.id] && (
          <Animated.View
            style={[
              styles.stars,
              {
                transform: [{ translateX: wanderAnimX }, { translateY: bounceAnim }],
                opacity: glowAnim,
              },
            ]}
          >
            <PixelDecoration
              decoration={{
                id: activeDecorations.trail.id,
                frames: DECORATION_SPRITES[activeDecorations.trail.id] ?? [[]],
                offset: { x: pixelSize * 6, y: pixelSize * 2 },
                anchor: "body",
              }}
              pixelSize={pixelSize}
              scale={0.8}
            />
          </Animated.View>
        )}

        <Animated.View
          style={{
            transform: [
              { translateX: wanderAnimX },
              { scaleX },
              { translateY: bounceAnim },
            ],
          }}
        >
          <PixelAnimation
            animation={currentAnimation}
            isPlaying={true}
            pixelSize={pixelSize}
            scale={1}
            flipX={false}
          />
        </Animated.View>

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
  aura: {
    position: "absolute",
    top: -22,
    zIndex: 5,
  },
  stars: {
    position: "absolute",
    right: -8,
    top: 8,
    zIndex: 5,
  },
  tapHint: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    opacity: 0.6,
  },
});

export default PetCharacter;