import React, { memo, useMemo } from "react";
import PixelSprite from "./PixelSprite";
import { PixelDecoration, PixelFrame } from "../../types";
import { PALETTE } from "../../utils/spriteFrames";

interface PixelDecorationProps {
  decoration: PixelDecoration; // 装饰品配置
  palette?: any; // 调色盘（默认使用 spriteFrames.ts 中的 PALETTE）
  pixelSize?: number; // 像素格大小
  scale?: number; // 缩放倍数
  flipX?: boolean; // 水平翻转
  style?: any; // 自定义样式
}

/**
 * 像素装饰品组件
 * 
 * 功能：
 * - 将装饰品渲染为像素图形
 * - 支持位置偏移和锚点
 * - 支持独立动画（后续扩展）
 */
const PixelDecorationComponent: React.FC<PixelDecorationProps> = memo(
  ({
    decoration,
    palette = PALETTE,
    pixelSize = 8,
    scale = 1,
    flipX = false,
    style,
  }) => {
    // 获取装饰品的当前帧（目前只支持单帧，后续可扩展为动画）
    const currentFrame: PixelFrame = useMemo(() => {
      return decoration.frames[0] || [];
    }, [decoration.frames]);

    // 如果没有帧数据，返回 null
    if (!currentFrame || currentFrame.length === 0) {
      return null;
    }

    // 计算装饰品尺寸
    const { width, height } = useMemo(() => {
      return {
        height: currentFrame.length,
        width: currentFrame[0]?.length ?? 0,
      };
    }, [currentFrame]);

    // 计算实际渲染尺寸（考虑偏移）
    const actualPixelSize = pixelSize * scale;
    const offsetX = decoration.offset.x * actualPixelSize;
    const offsetY = decoration.offset.y * actualPixelSize;

    return (
      <PixelSprite
        frame={currentFrame}
        palette={palette}
        pixelSize={pixelSize}
        scale={scale}
        flipX={flipX}
        style={{
          position: "absolute",
          left: offsetX,
          top: offsetY,
          ...style,
        }}
      />
    );
  }
);

// 设置组件显示名称
PixelDecorationComponent.displayName = "PixelDecoration";

export default PixelDecorationComponent;