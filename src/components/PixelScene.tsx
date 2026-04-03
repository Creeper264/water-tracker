import React from "react";
import Svg, { Rect, G, Defs, LinearGradient, Stop } from "react-native-svg";

interface PixelSceneProps {
  width?: number;
  height?: number;
}

// 像素风办公室背景组件
const PixelScene: React.FC<PixelSceneProps> = ({ width = 400, height = 300 }) => {
  // 基于尺寸计算缩放比例
  const scale = width / 400;
  const unit = Math.floor(4 * scale); // 像素单元大小

  // 颜色定义
  const colors = {
    background: "#1a1a2e",
    card: "#2d2d44",
    accent: "#4FC3F7",
    floor: "#3d3d5c",
    floorLine: "#4a4a6a",
    wall: "#252540",
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
    sky: "#2a4a6a",
    cloud: "#e8e8f0",
  };

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={colors.sky} />
          <Stop offset="100%" stopColor={colors.background} />
        </LinearGradient>
      </Defs>

      {/* 背景 */}
      <Rect x={0} y={0} width={width} height={height} fill={colors.background} />

      {/* 墙壁 */}
      <Rect x={0} y={0} width={width} height={height * 0.6} fill={colors.wall} />

      {/* 地板 */}
      <Rect
        x={0}
        y={height * 0.6}
        width={width}
        height={height * 0.4}
        fill={colors.floor}
      />

      {/* 地板纹理线条 */}
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

      {/* 窗户 */}
      <G transform={`translate(${width * 0.35}, ${height * 0.08})`}>
        {/* 窗框外边 */}
        <Rect
          x={-unit}
          y={-unit}
          width={unit * 42}
          height={unit * 28}
          fill={colors.windowFrame}
        />
        
        {/* 窗户玻璃 - 天空背景 */}
        <Rect x={0} y={0} width={unit * 40} height={unit * 26} fill="url(#skyGradient)" />
        
        {/* 窗户十字框 */}
        <Rect x={0} y={unit * 12} width={unit * 40} height={unit * 2} fill={colors.windowFrame} />
        <Rect x={unit * 19} y={0} width={unit * 2} height={unit * 26} fill={colors.windowFrame} />
        
        {/* 窗户反光效果 */}
        <Rect x={unit * 2} y={unit * 2} width={unit * 6} height={unit * 4} fill={colors.windowLight} opacity={0.3} />
        <Rect x={unit * 24} y={unit * 2} width={unit * 6} height={unit * 4} fill={colors.windowLight} opacity={0.3} />
        
        {/* 云朵 - 左 */}
        <G transform={`translate(${unit * 3}, ${unit * 4})`}>
          <Rect x={0} y={unit} width={unit * 3} height={unit * 2} fill={colors.cloud} opacity={0.8} />
          <Rect x={unit} y={0} width={unit * 3} height={unit * 2} fill={colors.cloud} opacity={0.8} />
          <Rect x={unit * 4} y={unit} width={unit * 2} height={unit} fill={colors.cloud} opacity={0.8} />
        </G>
        
        {/* 云朵 - 右 */}
        <G transform={`translate(${unit * 26}, ${unit * 3})`}>
          <Rect x={0} y={unit} width={unit * 4} height={unit * 2} fill={colors.cloud} opacity={0.6} />
          <Rect x={unit * 1.5} y={0} width={unit * 3} height={unit} fill={colors.cloud} opacity={0.6} />
        </G>
      </G>

      {/* 办公桌 */}
      <G transform={`translate(${width * 0.1}, ${height * 0.35})`}>
        {/* 桌面 */}
        <Rect
          x={0}
          y={0}
          width={width * 0.8}
          height={unit * 4}
          fill={colors.desk}
        />
        {/* 桌面高光 */}
        <Rect
          x={0}
          y={0}
          width={width * 0.8}
          height={unit}
          fill={colors.deskLight}
        />
        {/* 桌面边缘 */}
        <Rect
          x={0}
          y={unit * 3}
          width={width * 0.8}
          height={unit}
          fill={colors.deskDark}
        />
        
        {/* 桌腿 - 左 */}
        <Rect x={unit * 2} y={unit * 4} width={unit * 6} height={height * 0.25} fill={colors.deskDark} />
        <Rect x={unit * 3} y={unit * 4} width={unit * 4} height={height * 0.25} fill={colors.desk} />
        
        {/* 桌腿 - 右 */}
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
        
        {/* 抽屉 */}
        <G transform={`translate(${width * 0.5}, ${unit * 6})`}>
          <Rect x={0} y={0} width={unit * 16} height={unit * 10} fill={colors.desk} />
          <Rect x={unit} y={unit} width={unit * 14} height={unit * 3.5} fill={colors.deskDark} />
          <Rect x={unit * 6} y={unit * 1.5} width={unit * 4} height={unit} fill={colors.deskLight} />
          <Rect x={unit} y={unit * 5.5} width={unit * 14} height={unit * 3.5} fill={colors.deskDark} />
          <Rect x={unit * 6} y={unit * 6} width={unit * 4} height={unit} fill={colors.deskLight} />
        </G>
      </G>

      {/* 办公椅 */}
      <G transform={`translate(${width * 0.22}, ${height * 0.45})`}>
        {/* 椅背 */}
        <Rect x={0} y={0} width={unit * 12} height={unit * 16} fill={colors.chair} />
        <Rect x={unit} y={unit} width={unit * 10} height={unit * 14} fill={colors.chairDark} />
        <Rect x={unit * 2} y={unit * 2} width={unit * 8} height={unit * 3} fill={colors.chair} />
        <Rect x={unit * 2} y={unit * 7} width={unit * 8} height={unit * 3} fill={colors.chair} />
        
        {/* 椅座 */}
        <Rect x={-unit * 2} y={unit * 16} width={unit * 16} height={unit * 4} fill={colors.chair} />
        <Rect x={-unit} y={unit * 16} width={unit * 14} height={unit * 2} fill={colors.chairDark} />
        
        {/* 椅腿 */}
        <Rect x={unit * 5} y={unit * 20} width={unit * 2} height={unit * 10} fill={colors.chairDark} />
        
        {/* 椅子底座 */}
        <Rect x={unit * 2} y={unit * 28} width={unit * 8} height={unit * 2} fill={colors.chair} />
        
        {/* 椅轮 */}
        <Rect x={unit} y={unit * 30} width={unit * 2} height={unit * 2} fill={colors.card} />
        <Rect x={unit * 9} y={unit * 30} width={unit * 2} height={unit * 2} fill={colors.card} />
      </G>

      {/* 绿植 - 左侧大盆栽 */}
      <G transform={`translate(${width * 0.02}, ${height * 0.35})`}>
        {/* 花盆 */}
        <Rect x={unit * 2} y={unit * 20} width={unit * 10} height={unit * 8} fill={colors.plantPot} />
        <Rect x={0} y={unit * 18} width={unit * 14} height={unit * 4} fill={colors.plantPot} />
        <Rect x={unit} y={unit * 26} width={unit * 12} height={unit * 2} fill={colors.plantPotDark} />
        
        {/* 植物茎 */}
        <Rect x={unit * 5} y={unit * 10} width={unit * 2} height={unit * 10} fill={colors.plantDark} />
        
        {/* 叶子 */}
        <G>
          {/* 左叶 */}
          <Rect x={unit * 2} y={unit * 6} width={unit * 4} height={unit * 2} fill={colors.plant} />
          <Rect x={unit} y={unit * 8} width={unit * 5} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 2} y={unit * 10} width={unit * 3} height={unit * 2} fill={colors.plantDark} />
          
          {/* 右叶 */}
          <Rect x={unit * 8} y={unit * 4} width={unit * 4} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 7} y={unit * 6} width={unit * 5} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 8} y={unit * 8} width={unit * 3} height={unit * 2} fill={colors.plantDark} />
          
          {/* 顶叶 */}
          <Rect x={unit * 4} y={unit * 2} width={unit * 4} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 5} y={0} width={unit * 2} height={unit * 2} fill={colors.plant} />
        </G>
      </G>

      {/* 绿植 - 右侧小盆栽 */}
      <G transform={`translate(${width * 0.88}, ${height * 0.38})`}>
        {/* 花盆 */}
        <Rect x={unit} y={unit * 12} width={unit * 8} height={unit * 6} fill={colors.plantPot} />
        <Rect x={0} y={unit * 10} width={unit * 10} height={unit * 3} fill={colors.plantPot} />
        <Rect x={unit} y={unit * 16} width={unit * 8} height={unit * 2} fill={colors.plantPotDark} />
        
        {/* 植物茎 */}
        <Rect x={unit * 4} y={unit * 6} width={unit * 2} height={unit * 6} fill={colors.plantDark} />
        
        {/* 叶子 */}
        <G>
          <Rect x={unit * 2} y={unit * 2} width={unit * 3} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 5} y={unit * 3} width={unit * 3} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 4} y={0} width={unit * 2} height={unit * 2} fill={colors.plant} />
          <Rect x={unit * 2} y={unit * 4} width={unit * 2} height={unit * 2} fill={colors.plantDark} />
          <Rect x={unit * 6} y={unit * 5} width={unit * 2} height={unit} fill={colors.plantDark} />
        </G>
      </G>

      {/* 桌上装饰 - 小仙人掌 */}
      <G transform={`translate(${width * 0.68}, ${height * 0.28})`}>
        {/* 小花盆 */}
        <Rect x={0} y={unit * 6} width={unit * 6} height={unit * 4} fill={colors.plantPot} />
        <Rect x={-unit} y={unit * 5} width={unit * 8} height={unit * 2} fill={colors.plantPot} />
        <Rect x={0} y={unit * 9} width={unit * 6} height={unit} fill={colors.plantPotDark} />
        
        {/* 仙人掌 */}
        <Rect x={unit} y={unit * 2} width={unit * 4} height={unit * 4} fill={colors.plant} />
        <Rect x={0} y={unit * 3} width={unit * 2} height={unit * 2} fill={colors.plant} />
        <Rect x={unit * 4} y={unit * 2} width={unit * 2} height={unit * 2} fill={colors.plant} />
        <Rect x={unit * 2} y={unit} width={unit * 2} height={unit} fill={colors.plant} />
        <Rect x={unit} y={unit * 4} width={unit} height={unit} fill={colors.plantDark} />
        <Rect x={unit * 4} y={unit * 3} width={unit} height={unit} fill={colors.plantDark} />
      </G>

      {/* 桌上装饰 - 小杯子 */}
      <G transform={`translate(${width * 0.18}, ${height * 0.3})`}>
        <Rect x={0} y={unit * 2} width={unit * 6} height={unit * 4} fill={colors.accent} />
        <Rect x={-unit} y={unit} width={unit * 8} height={unit * 2} fill={colors.accent} />
        <Rect x={unit * 6} y={unit * 3} width={unit * 3} height={unit * 2} fill={colors.accent} opacity={0.5} />
        <Rect x={unit} y={unit * 4} width={unit * 4} height={unit * 2} fill="#3da8d6" />
      </G>

      {/* 墙上装饰 - 小画框 */}
      <G transform={`translate(${width * 0.75}, ${height * 0.12})`}>
        <Rect x={0} y={0} width={unit * 14} height={unit * 12} fill={colors.card} />
        <Rect x={unit} y={unit} width={unit * 12} height={unit * 10} fill={colors.accent} opacity={0.3} />
        <Rect x={unit * 3} y={unit * 3} width={unit * 8} height={unit * 6} fill={colors.accent} opacity={0.5} />
        <Rect x={unit * 5} y={unit * 5} width={unit * 4} height={unit * 2} fill={colors.accent} />
      </G>
    </Svg>
  );
};

export default PixelScene;
