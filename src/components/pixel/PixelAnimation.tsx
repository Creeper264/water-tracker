import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PixelFrame, AnimationConfig } from "../../types";
import PixelSprite from "./PixelSprite";

interface PixelAnimationProps {
  animation: AnimationConfig; // 动画配置
  palette?: any; // 调色盘
  pixelSize?: number; // 像素格大小
  scale?: number; // 缩放倍数
  flipX?: boolean; // 水平翻转
  isPlaying?: boolean; // 是否播放（默认 true）
  style?: any; // 自定义样式
  onAnimationEnd?: () => void; // 动画结束回调（仅非循环动画）
}

/**
 * 像素动画控制器
 * 
 * 核心功能：
 * - 管理帧序列的自动切换
 * - 支持循环和非循环模式
 * - 使用 setInterval 驱动帧切换
 * - 组件卸载时自动清理定时器
 */
const PixelAnimation: React.FC<PixelAnimationProps> = ({
  animation,
  palette,
  pixelSize = 8,
  scale = 1,
  flipX = false,
  isPlaying = true,
  style,
  onAnimationEnd,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取当前帧（添加安全访问）
  const currentFrame: PixelFrame = useMemo(() => {
    // 防御性检查：确保 animation 和 frames 存在且非空
    if (!animation?.frames || !Array.isArray(animation.frames) || animation.frames.length === 0) {
      return [[]]; // 返回空帧
    }
    // 安全访问：确保 frameIndex 在有效范围内
    const safeIndex = Math.min(frameIndex, animation.frames.length - 1);
    return animation.frames[safeIndex] ?? animation.frames[0] ?? [[]];
  }, [animation, frameIndex]);

  // 帧切换逻辑（添加安全访问）
  const advanceFrame = useCallback(() => {
    setFrameIndex((prevIndex) => {
      // 防御性检查：确保 frames 存在且非空
      const framesLength = animation?.frames?.length ?? 0;
      if (framesLength === 0) return 0;

      const nextIndex = prevIndex + 1;

      // 循环模式
      if (animation.loop) {
        return nextIndex % framesLength;
      }

      // 非循环模式：到达最后一帧时停止
      if (nextIndex >= framesLength) {
        return prevIndex; // 停留在最后一帧
      }

      return nextIndex;
    });
  }, [animation.loop, animation?.frames?.length]);

  // 启动/停止动画
  useEffect(() => {
    // 清理旧定时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 防御性检查：确保 frames 存在且非空
    const framesLength = animation?.frames?.length ?? 0;
    
    // 不播放或只有一帧时无需定时器
    if (!isPlaying || framesLength <= 1) {
      return;
    }

    // 启动新定时器
    timerRef.current = setInterval(() => {
      advanceFrame();
    }, animation.interval);

    // 清理函数
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, animation.interval, animation?.frames?.length, advanceFrame]);

  // 检测动画结束（非循环模式）
  useEffect(() => {
    const framesLength = animation?.frames?.length ?? 0;
    if (!animation.loop && framesLength > 0 && frameIndex === framesLength - 1) {
      onAnimationEnd?.();
    }
  }, [frameIndex, animation.loop, animation?.frames?.length, onAnimationEnd]);

  // 当动画配置变化时重置帧索引
  useEffect(() => {
    setFrameIndex(0);
  }, [animation]);

  return (
    <PixelSprite
      frame={currentFrame}
      palette={palette}
      pixelSize={pixelSize}
      scale={scale}
      flipX={flipX}
      style={style}
    />
  );
};

export default PixelAnimation;