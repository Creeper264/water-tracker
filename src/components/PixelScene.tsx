import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, G, Defs, LinearGradient, Stop } from "react-native-svg";
import InteractiveElement, { InteractiveElementProps } from "./pixel/InteractiveElement";
import {
  SCENE_PALETTE,
  WINDOW_DAY,
  WINDOW_NIGHT,
  PLANT_NORMAL,
  PLANT_GROW_1,
  PLANT_GROW_2,
  PLANT_GROW_3,
  CUP_NORMAL,
  CUP_DRINK_1,
  CUP_DRINK_2,
  COMPUTER_NORMAL,
  COMPUTER_WORK_1,
  COMPUTER_WORK_2,
  FRAME_1,
  FRAME_2,
  FRAME_3,
} from "../utils/sceneElements";

export interface SceneInteractionCallbacks {
  onWindowToggle?: (isNight: boolean) => void;
  onPlantGrow?: () => void;
  onCupDrink?: () => void;
  onComputerWork?: () => void;
  onFrameChange?: (frameIndex: number) => void;
}

interface PixelSceneProps {
  width?: number;
  height?: number;
  interactions?: SceneInteractionCallbacks;
  showInteractiveElements?: boolean;
}

const PixelScene: React.FC<PixelSceneProps> = ({
  width = 400,
  height = 300,
  interactions = {},
  showInteractiveElements = true,
}) => {
  // 防御性检查:防止 width 为 0 时除零错误
  const scale = Math.max(width, 1) / 400;
  const unit = Math.max(1, Math.floor(4 * scale));
  const pixelSize = Math.max(2, Math.floor(unit / 2));

  const [isNight, setIsNight] = useState(false);
  const [isPlantGrowing, setIsPlantGrowing] = useState(false);
  const [isCupDrinking, setIsCupDrinking] = useState(false);
  const [isComputerWorking, setIsComputerWorking] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);

  const colors = useMemo(
    () => ({
      background: isNight ? "#0d0d1a" : "#1a1a2e",
      card: "#2d2d44",
      accent: "#4FC3F7",
      floor: isNight ? "#2a2a3a" : "#3d3d5c",
      floorLine: isNight ? "#3a3a4a" : "#4a4a6a",
      wall: isNight ? "#1a1a2a" : "#252540",
      desk: "#8b7355",
      deskDark: "#6b5344",
      deskLight: "#a08060",
      chair: "#5c5c7a",
      chairDark: "#4a4a6a",
      window: "#4FC3F7",
      windowFrame: "#5a5a7a",
      windowLight: "#7dd8fc",
      plant: "#2ed573",
      plantDark: "#1e9c56",
      plantPot: "#a0522d",
      plantPotDark: "#8b4513",
      sky: isNight ? "#1a2a3a" : "#2a4a6a",
      cloud: isNight ? "#4a4a5a" : "#e8e8f0",
    }),
    [isNight]
  );

  const handleWindowToggle = useCallback(() => {
    setIsNight((prev) => {
      const newValue = !prev;
      interactions.onWindowToggle?.(newValue);
      return newValue;
    });
  }, [interactions]);

  const handlePlantGrow = useCallback(() => {
    if (isPlantGrowing) return;
    setIsPlantGrowing(true);
    interactions.onPlantGrow?.();
    setTimeout(() => setIsPlantGrowing(false), 1200);
  }, [isPlantGrowing, interactions]);

  const handleCupDrink = useCallback(() => {
    if (isCupDrinking) return;
    setIsCupDrinking(true);
    interactions.onCupDrink?.();
    setTimeout(() => setIsCupDrinking(false), 1000);
  }, [isCupDrinking, interactions]);

  const handleComputerWork = useCallback(() => {
    setIsComputerWorking((prev) => {
      const newValue = !prev;
      interactions.onComputerWork?.();
      return newValue;
    });
  }, [interactions]);

  const handleFrameChange = useCallback(() => {
    setFrameIndex((prev) => {
      const newIndex = (prev + 1) % 3;
      interactions.onFrameChange?.(newIndex);
      return newIndex;
    });
  }, [interactions]);

  const interactiveElements: InteractiveElementProps[] = useMemo(
    () =>
      showInteractiveElements
        ? [
            {
              id: "window",
              frames: isNight ? [WINDOW_NIGHT] : [WINDOW_DAY],
              palette: SCENE_PALETTE,
              pixelSize,
              scale: 2,
              x: width * 0.35,
              y: height * 0.08,
              onPress: handleWindowToggle,
              animationType: "pulse" as const,
            },
            {
              id: "plant",
              frames: isPlantGrowing
                ? [PLANT_GROW_1, PLANT_GROW_2, PLANT_GROW_3, PLANT_NORMAL]
                : [PLANT_NORMAL],
              palette: SCENE_PALETTE,
              pixelSize,
              scale: 1.5,
              x: width * 0.02,
              y: height * 0.35,
              onPress: handlePlantGrow,
              animationType: "bounce" as const,
            },
            {
              id: "cup",
              frames: isCupDrinking
                ? [CUP_NORMAL, CUP_DRINK_1, CUP_DRINK_2, CUP_DRINK_1, CUP_NORMAL]
                : [CUP_NORMAL],
              palette: SCENE_PALETTE,
              pixelSize,
              scale: 1.2,
              x: width * 0.18,
              y: height * 0.3,
              onPress: handleCupDrink,
              animationType: "shake" as const,
            },
            {
              id: "computer",
              frames: isComputerWorking
                ? [COMPUTER_WORK_1, COMPUTER_WORK_2]
                : [COMPUTER_NORMAL],
              palette: SCENE_PALETTE,
              pixelSize,
              scale: 1,
              x: width * 0.5,
              y: height * 0.28,
              onPress: handleComputerWork,
              animationType: "pulse" as const,
            },
            {
              id: "frame",
              frames: [[FRAME_1, FRAME_2, FRAME_3][frameIndex]],
              palette: SCENE_PALETTE,
              pixelSize,
              scale: 1.5,
              x: width * 0.75,
              y: height * 0.12,
              onPress: handleFrameChange,
              animationType: "bounce" as const,
            },
          ]
        : [],
    [
      showInteractiveElements,
      isNight,
      isPlantGrowing,
      isCupDrinking,
      isComputerWorking,
      frameIndex,
      pixelSize,
      width,
      height,
      handleWindowToggle,
      handlePlantGrow,
      handleCupDrink,
      handleComputerWork,
      handleFrameChange,
    ]
  );

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.sky} />
            <Stop offset="100%" stopColor={colors.background} />
          </LinearGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill={colors.background} />
        <Rect x={0} y={0} width={width} height={height * 0.6} fill={colors.wall} />
        <Rect
          x={0}
          y={height * 0.6}
          width={width}
          height={height * 0.4}
          fill={colors.floor}
        />

        <G>
          {Array.from({ length: Math.floor(width / (unit * 10)) + 1 }).map((_, i) => (
            <Rect
              key={`floor-line-v-${i}`}
              x={i * unit * 10}
              y={height * 0.6}
              width={unit * 0.5}
              height={height * 0.4}
              fill={colors.floorLine}
            />
          ))}
          {Array.from({ length: 3 }).map((_, i) => (
            <Rect
              key={`floor-line-h-${i}`}
              x={0}
              y={height * 0.6 + i * unit * 8}
              width={width}
              height={unit * 0.5}
              fill={colors.floorLine}
            />
          ))}
        </G>

        <G transform={`translate(${width * 0.1}, ${height * 0.35})`}>
          <Rect
            x={0}
            y={0}
            width={width * 0.8}
            height={unit * 4}
            fill={colors.desk}
          />
          <Rect
            x={0}
            y={0}
            width={width * 0.8}
            height={unit}
            fill={colors.deskLight}
          />
          <Rect
            x={0}
            y={unit * 3}
            width={width * 0.8}
            height={unit}
            fill={colors.deskDark}
          />
          <Rect x={unit * 2} y={unit * 4} width={unit * 6} height={height * 0.25} fill={colors.deskDark} />
          <Rect x={unit * 3} y={unit * 4} width={unit * 4} height={height * 0.25} fill={colors.desk} />
          <Rect
            x={width * 0.8 - unit * 8}
            y={unit * 4}
            width={unit * 6}
            height={height * 0.25}
            fill={colors.deskDark}
          />
          <Rect
            x={width * 0.8 - unit * 7}
            y={unit * 4}
            width={unit * 4}
            height={height * 0.25}
            fill={colors.desk}
          />
          <G transform={`translate(${width * 0.5}, ${unit * 6})`}>
            <Rect x={0} y={0} width={unit * 16} height={unit * 10} fill={colors.desk} />
            <Rect x={unit} y={unit} width={unit * 14} height={unit * 3.5} fill={colors.deskDark} />
            <Rect x={unit * 6} y={unit * 1.5} width={unit * 4} height={unit} fill={colors.deskLight} />
            <Rect x={unit} y={unit * 5.5} width={unit * 14} height={unit * 3.5} fill={colors.deskDark} />
            <Rect x={unit * 6} y={unit * 6} width={unit * 4} height={unit} fill={colors.deskLight} />
          </G>
        </G>

        <G transform={`translate(${width * 0.22}, ${height * 0.45})`}>
          <Rect x={0} y={0} width={unit * 12} height={unit * 16} fill={colors.chair} />
          <Rect x={unit} y={unit} width={unit * 10} height={unit * 14} fill={colors.chairDark} />
          <Rect x={unit * 2} y={unit * 2} width={unit * 8} height={unit * 3} fill={colors.chair} />
          <Rect x={unit * 2} y={unit * 7} width={unit * 8} height={unit * 3} fill={colors.chair} />
          <Rect x={-unit * 2} y={unit * 16} width={unit * 16} height={unit * 4} fill={colors.chair} />
          <Rect x={-unit} y={unit * 16} width={unit * 14} height={unit * 2} fill={colors.chairDark} />
          <Rect x={unit * 5} y={unit * 20} width={unit * 2} height={unit * 10} fill={colors.chairDark} />
          <Rect x={unit * 2} y={unit * 28} width={unit * 8} height={unit * 2} fill={colors.chair} />
          <Rect x={unit} y={unit * 30} width={unit * 2} height={unit * 2} fill={colors.card} />
          <Rect x={unit * 9} y={unit * 30} width={unit * 2} height={unit * 2} fill={colors.card} />
        </G>

        <G transform={`translate(${width * 0.88}, ${height * 0.38})`}>
          <Rect x={unit} y={unit * 12} width={unit * 8} height={unit * 6} fill={colors.plantPot} />
          <Rect x={0} y={unit * 10} width={unit * 10} height={unit * 3} fill={colors.plantPot} />
          <Rect x={unit} y={unit * 16} width={unit * 8} height={unit * 2} fill={colors.plantPotDark} />
          <Rect x={unit * 4} y={unit * 6} width={unit * 2} height={unit * 6} fill={colors.plantDark} />
          <G>
            <Rect x={unit * 2} y={unit * 2} width={unit * 3} height={unit * 2} fill={colors.plant} />
            <Rect x={unit * 5} y={unit * 3} width={unit * 3} height={unit * 2} fill={colors.plant} />
            <Rect x={unit * 4} y={0} width={unit * 2} height={unit * 2} fill={colors.plant} />
            <Rect x={unit * 2} y={unit * 4} width={unit * 2} height={unit * 2} fill={colors.plantDark} />
            <Rect x={unit * 6} y={unit * 5} width={unit * 2} height={unit} fill={colors.plantDark} />
          </G>
        </G>

        <G transform={`translate(${width * 0.68}, ${height * 0.28})`}>
          <Rect x={0} y={unit * 6} width={unit * 6} height={unit * 4} fill={colors.plantPot} />
          <Rect x={-unit} y={unit * 5} width={unit * 8} height={unit * 2} fill={colors.plantPot} />
          <Rect x={0} y={unit * 9} width={unit * 6} height={unit} fill={colors.plantPotDark} />
          <Rect x={unit} y={unit * 2} width={unit * 4} height={unit * 4} fill={colors.plant} />
          <Rect x={0} y={unit * 3} width={unit * 2} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 4} y={unit * 2} width={unit * 2} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 2} y={unit} width={unit * 2} height={unit} fill={colors.plant} />
          <Rect x={unit} y={unit * 4} width={unit} height={unit} fill={colors.plantDark} />
          <Rect x={unit * 4} y={unit * 3} width={unit} height={unit} fill={colors.plantDark} />
        </G>
      </Svg>

      {interactiveElements.map((element) => (
        <InteractiveElement key={element.id} {...element} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
});

export default PixelScene;