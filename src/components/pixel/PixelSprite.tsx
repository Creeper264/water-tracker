import React, { memo, useMemo } from "react";
import Svg, { Rect } from "react-native-svg";
import { PixelFrame, Palette } from "../../types";

interface PixelSpriteProps {
  frame: PixelFrame; // 当前帧像素数据
  palette?: Palette; // 调色盘（默认使用 spriteFrames.ts 中的 PALETTE）
  pixelSize?: number; // 每格像素点大小（默认 8）
  scale?: number; // 整体缩放倍数（默认 1）
  flipX?: boolean; // 水平翻转（默认 false）
  style?: any; // 自定义样式
}

// 默认调色盘（从 spriteFrames.ts 导入）
import { PALETTE } from "../../utils/spriteFrames";

/**
 * 像素精灵渲染器组件
 * 
 * 核心原理：
 * - 使用 SVG Rect 批量渲染像素格
 * - 每个像素格对应调色盘中的一个颜色
 * - 支持缩放、翻转等变换
 * - 使用 React.memo 和 useMemo 进行性能优化
 */
const PixelSprite: React.FC<PixelSpriteProps> = memo(
  ({
    frame,
    palette = PALETTE,
    pixelSize = 8,
    scale = 1,
    flipX = false,
    style,
  }) => {
    // 计算帧尺寸（添加空值检查和数组验证）
    const { width, height } = useMemo(() => {
      // 防御性检查：frame 必须是非空数组
      if (!frame || !Array.isArray(frame) || frame.length === 0) {
        return { width: 0, height: 0 };
      }
      return {
        height: frame.length,
        width: frame[0]?.length ?? 0,
      };
    }, [frame]);

    // 计算实际渲染尺寸
    const actualPixelSize = pixelSize * scale;
    const actualWidth = width * actualPixelSize;
    const actualHeight = height * actualPixelSize;

    // 渲染像素格（添加数组验证）
    const renderPixels = useMemo(() => {
      const pixels: JSX.Element[] = [];

      // 防御性检查：确保 frame 是有效数组
      if (!frame || !Array.isArray(frame) || frame.length === 0) {
        return pixels;
      }

      frame.forEach((row, y) => {
        // 防御性检查：确保 row 是有效数组
        if (!row || !Array.isArray(row)) return;
        
        row.forEach((code, x) => {
          const color = palette[code];
          if (!color) return; // 透明像素不渲染

          // 计算实际位置（考虑翻转）
          const actualX = flipX ? (width - 1 - x) * actualPixelSize : x * actualPixelSize;

          pixels.push(
            <Rect
              key={`${y}-${x}`}
              x={actualX}
              y={y * actualPixelSize}
              width={actualPixelSize}
              height={actualPixelSize}
              fill={color}
              // 像素风格：硬边界，无圆角
              rx={0}
              ry={0}
            />
          );
        });
      });

      return pixels;
    }, [frame, palette, actualPixelSize, flipX, width]);

    return (
      <Svg
        width={actualWidth}
        height={actualHeight}
        viewBox={`0 0 ${actualWidth} ${actualHeight}`}
        style={style}
      >
        {renderPixels}
      </Svg>
    );
  }
);

// 设置组件显示名称（用于调试）
PixelSprite.displayName = "PixelSprite";

export default PixelSprite;