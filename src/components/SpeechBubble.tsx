import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";

interface SpeechBubbleProps {
  text: string;
  visible: boolean;
  onHide: () => void;
  backgroundColor?: string;
  duration?: number;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  visible,
  onHide,
  backgroundColor = "#4FC3F7",
  duration = 2500,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, scaleAnim]);

  const animateOut = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  }, [opacityAnim, scaleAnim, onHide]);

  useEffect(() => {
    if (visible) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset animations
      opacityAnim.setValue(0);
      scaleAnim.setValue(0.8);

      // Animate in
      animateIn();

      // Auto hide after duration
      timeoutRef.current = setTimeout(() => {
        animateOut();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration, animateIn, animateOut, opacityAnim, scaleAnim]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.speechBubble,
        {
          backgroundColor,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.speechArrow, { borderTopColor: backgroundColor }]} />
      <Text style={styles.speechText}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});

export default SpeechBubble;
