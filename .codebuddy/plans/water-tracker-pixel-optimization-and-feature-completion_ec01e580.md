---
name: water-tracker-pixel-optimization-and-feature-completion
overview: 对 WaterTracker 项目进行像素风格优化和功能补全，包括：重构像素精灵渲染系统、实现真正的帧动画、补全缺失功能模块、增强用户体验
design:
  styleKeywords:
    - Pixel Art
    - 8-bit
    - Retro Game
    - Hard Edge
    - Limited Palette
  fontSystem:
    fontFamily: PingFang SC
    heading:
      size: 24px
      weight: 700
    subheading:
      size: 18px
      weight: 600
    body:
      size: 16px
      weight: 400
  colorSystem:
    primary:
      - "#4FC3F7"
      - "#2ed573"
      - "#00e676"
    background:
      - "#1a1a2e"
      - "#2d2d44"
      - "#252540"
    text:
      - "#ffffff"
      - "#8b8b8b"
      - "#1a1a2e"
    functional:
      - "#ff4757"
      - "#ffa502"
      - "#a55eea"
todos:
  - id: create-pixel-types
    content: 在 src/types/index.ts 中新增 PixelFrame、Palette、AnimationConfig 等类型定义
    status: completed
  - id: create-sprite-frames
    content: 创建 src/utils/spriteFrames.ts，定义调色盘和小人各状态的帧动画数据
    status: completed
    dependencies:
      - create-pixel-types
  - id: create-pixel-sprite
    content: 创建 src/components/pixel/PixelSprite.tsx 像素精灵渲染器组件
    status: completed
    dependencies:
      - create-sprite-frames
  - id: create-pixel-animation
    content: 创建 src/components/pixel/PixelAnimation.tsx 帧动画控制器
    status: completed
    dependencies:
      - create-pixel-sprite
  - id: create-decoration-sprites
    content: 创建 src/utils/decorationSprites.ts，为所有装饰品设计像素版本
    status: completed
    dependencies:
      - create-sprite-frames
  - id: create-pixel-decoration
    content: 创建 src/components/pixel/PixelDecoration.tsx 像素装饰品组件
    status: completed
    dependencies:
      - create-decoration-sprites
  - id: refactor-pet-character
    content: 重构 PetCharacter.tsx，使用 PixelSprite 替代 Circle，集成帧动画和像素装饰品
    status: completed
    dependencies:
      - create-pixel-animation
      - create-pixel-decoration
  - id: create-interactive-element
    content: 创建 src/components/pixel/InteractiveElement.tsx 可交互场景元素组件
    status: completed
    dependencies:
      - create-pixel-sprite
  - id: enhance-pixel-scene
    content: 增强 PixelScene.tsx，添加窗户、绿植、杯子等可交互元素
    status: completed
    dependencies:
      - create-interactive-element
  - id: integrate-pet-screen
    content: 更新 PetScreen.tsx，集成重构后的像素组件系统
    status: completed
    dependencies:
      - refactor-pet-character
      - enhance-pixel-scene
  - id: update-roadmap
    content: 更新 ROADMAP.md，记录 v1.4.0 像素风格重构完成，规划后续版本
    status: completed
    dependencies:
      - integrate-pet-screen
---

## 产品概述

WaterTracker 是一款移动端饮水追踪应用，采用 Expo + React Native + TypeScript 技术栈。当前版本已实现基础饮水追踪、久坐提醒、宠物成长系统和装饰品解锁功能。

## 核心需求

1. **像素风格重构**：当前 PetCharacter 组件使用 Circle + RadialGradient 绘制主体，动画使用平滑的 sin easing，装饰品直接使用 emoji，均不符合真正的像素风格。需要重构为基于二维像素数组的帧动画系统。

2. **功能缺失补全**：

- 像素精灵帧动画系统（ROADMAP 规划但未实现）
- 场景互动元素（当前 PixelScene 仅静态背景）
- 成就徽章系统（当前仅有装饰品解锁）
- 年度统计与趋势分析
- 新手引导流程
- 声音/振动反馈
- 主题切换功能
- 自定义快捷按钮

## 视觉效果

重构后的像素小人应具备：清晰的像素网格边界、逐帧跳跃式动画、像素风格的装饰品图形、与场景元素的互动反馈。

## 技术栈

- **框架**：Expo SDK 55 + React Native 0.83.4 + TypeScript (strict mode)
- **图形渲染**：react-native-svg 15.15.3
- **动画**：React Native Animated API + 自定义帧动画系统
- **数据持久化**：AsyncStorage
- **通知**：expo-notifications
- **图表**：react-native-chart-kit

## 实现方案

### 1. 像素精灵系统架构

**核心原理**：使用二维字符串数组描述像素帧，每个字符映射调色盘颜色，通过 SVG Rect 批量渲染。

```typescript
// 像素帧数据结构
type PixelFrame = string[][];  // 每个元素是调色盘索引
type Palette = Record<string, string | null>;  // 索引 -> 颜色

// 动画帧序列
interface Animation {
  frames: PixelFrame[];
  interval: number;  // 帧间隔(ms)
  loop: boolean;
}
```

**渲染优化**：

- 使用 `React.memo` 缓存静态帧
- 帧切换时仅更新变化的像素点
- 预渲染常用帧到内存

### 2. 帧动画驱动

**像素风格动画特点**：

- 逐帧切换，无插值过渡
- 固定帧率（通常 8-12 FPS）
- 位置移动采用整数像素跳跃

**实现方式**：

```typescript
// 使用 setInterval 驱动帧切换
useEffect(() => {
  const timer = setInterval(() => {
    setFrameIndex(i => (i + 1) % frames.length);
  }, frameInterval);
  return () => clearInterval(timer);
}, [frames.length, frameInterval]);
```

### 3. 装饰品像素化

**当前问题**：装饰品直接使用 emoji（如 "🧢", "👑"），与像素风格不协调。

**解决方案**：

- 为每个装饰品设计像素版本（16x16 或 24x24 像素网格）
- 装饰品作为独立像素层叠加到小人身上
- 支持装饰品的独立动画（如帽子晃动）

### 4. 场景互动系统

**互动元素设计**：

- 点击窗户：切换白天/黑夜场景
- 点击绿植：触发生长动画
- 点击杯子：小人喝水动作
- 点击电脑：小人工作动画

**技术实现**：

- 场景元素作为独立组件，支持 onPress 事件
- 使用状态机管理场景状态
- 动画反馈使用 Animated.timing

## 架构设计

```
src/
├── components/
│   ├── pixel/
│   │   ├── PixelSprite.tsx      # [NEW] 像素精灵渲染器
│   │   ├── PixelAnimation.tsx   # [NEW] 帧动画控制器
│   │   ├── PixelDecoration.tsx  # [NEW] 像素装饰品组件
│   │   └── InteractiveElement.tsx # [NEW] 可交互场景元素
│   ├── PetCharacter.tsx         # [MODIFY] 重构为使用 PixelSprite
│   └── PixelScene.tsx           # [MODIFY] 添加互动元素
├── utils/
│   ├── spriteFrames.ts          # [NEW] 所有精灵帧数据
│   ├── decorationSprites.ts     # [NEW] 装饰品像素数据
│   ├── animations.ts            # [NEW] 动画配置与状态机
│   └── petState.ts              # [MODIFY] 扩展状态定义
├── types/
│   └── index.ts                 # [MODIFY] 新增像素相关类型
└── screens/
    └── PetScreen.tsx            # [MODIFY] 集成新组件
```

## 目录结构

```
d:\vibeCoding\water-tracker\src\
├── components/
│   ├── pixel/
│   │   ├── PixelSprite.tsx          # [NEW] 像素精灵渲染器。接收帧数据和调色盘，批量渲染 SVG Rect，支持缩放和翻转
│   │   ├── PixelAnimation.tsx       # [NEW] 帧动画控制器。管理帧序列、切换间隔、循环模式，提供帧索引状态
│   │   ├── PixelDecoration.tsx      # [NEW] 像素装饰品组件。将装饰品数据转换为像素帧，支持位置偏移和独立动画
│   │   └── InteractiveElement.tsx   # [NEW] 可交互场景元素。封装 TouchableOpacity + 像素图形，提供点击反馈动画
│   ├── PetCharacter.tsx             # [MODIFY] 重构为像素风格。使用 PixelSprite 替代 Circle，使用帧动画替代渐变动画
│   ├── PixelScene.tsx               # [MODIFY] 添加互动元素。窗户、绿植、杯子等可点击，触发场景状态变化
│   ├── PetGrowthInfo.tsx            # [KEEP] 宠物成长信息展示
│   ├── PetLottie.tsx                # [DEPRECATE] 被 PixelSprite 替代
│   └── SpeechBubble.tsx             # [KEEP] 对话气泡组件
├── utils/
│   ├── spriteFrames.ts              # [NEW] 精灵帧数据。定义小人各状态的帧序列（dying/dehydrated/normal/good/happy/overflow）
│   ├── decorationSprites.ts         # [NEW] 装饰品像素数据。为每个装饰品设计 16x16 像素版本
│   ├── animations.ts                # [NEW] 动画配置。定义各状态的帧率、循环模式、状态转换规则
│   ├── petState.ts                  # [MODIFY] 扩展状态定义，添加场景互动状态
│   ├── petStorage.ts                # [KEEP] 宠物数据存储
│   ├── decorations.ts               # [KEEP] 装饰品定义
│   ├── storage.ts                   # [KEEP] 数据持久化
│   └── notifications.ts             # [KEEP] 通知系统
├── types/
│   └── index.ts                     # [MODIFY] 新增 PixelFrame、Palette、Animation 等类型定义
├── screens/
│   ├── PetScreen.tsx                # [MODIFY] 集成新的像素组件系统
│   ├── HomeScreen.tsx               # [KEEP] 首页
│   ├── StatsScreen.tsx              # [KEEP] 统计页
│   └── SettingsScreen.tsx           # [KEEP] 设置页
└── hooks/
    └── useWaterTracker.ts           # [KEEP] 核心状态管理
```

## 关键代码结构

```typescript
// src/types/index.ts - 新增类型定义

export type PixelCode = string;  // 调色盘索引
export type PixelFrame = PixelCode[][];  // 单帧像素数据
export type Palette = Record<PixelCode, string | null>;  // 调色盘

export interface AnimationConfig {
  frames: PixelFrame[];
  interval: number;  // 帧间隔(ms)
  loop: boolean;
}

export interface PetAnimationState {
  state: PetState;
  animation: AnimationConfig;
  decorations: PixelDecoration[];
}

export interface PixelDecoration {
  id: string;
  frames: PixelFrame[];
  offset: { x: number; y: number };
  anchor: 'head' | 'body' | 'feet';
}

// src/utils/spriteFrames.ts - 调色盘与帧数据

export const PALETTE: Palette = {
  'S': '#F4C2A1',  // 皮肤
  'H': '#5C3D2E',  // 头发
  'C': '#4FC3F7',  // 衣服（主题蓝）
  'P': '#2d2d44',  // 裤子
  'E': '#333333',  // 眼睛
  'M': '#E57373',  // 嘴巴
  'W': '#ffffff',  // 白色
  '.': null,       // 透明
};

// 小人站立帧（16x24 像素）
export const FRAME_STAND: PixelFrame = [
  ['.','.','.','H','H','.','.','.'],
  ['.','.','H','H','H','H','.','.'],
  ['.','.','.','S','S','.','.','.'],
  ['.','.','S','E','S','E','S','.'],
  ['.','.','S','S','M','S','S','.'],
  ['.','.','.','C','C','.','.','.'],
  ['.','.','C','C','C','C','.','.'],
  ['.','.','C','C','C','C','.','.'],
  ['.','.','P','.','.','P','.','.'],
  ['.','.','P','.','.','P','.','.'],
];

// 各状态帧序列
export const PET_ANIMATIONS: Record<PetState, AnimationConfig> = {
  dying: { frames: [FRAME_DYING_1, FRAME_DYING_2], interval: 400, loop: true },
  dehydrated: { frames: [FRAME_WEAK_1, FRAME_WEAK_2], interval: 350, loop: true },
  normal: { frames: [FRAME_IDLE_1, FRAME_IDLE_2], interval: 500, loop: true },
  good: { frames: [FRAME_GOOD_1, FRAME_GOOD_2], interval: 400, loop: true },
  happy: { frames: [FRAME_HAPPY_1, FRAME_HAPPY_2, FRAME_HAPPY_3, FRAME_HAPPY_4], interval: 200, loop: true },
  overflow: { frames: [FRAME_OVERFLOW_1, FRAME_OVERFLOW_2], interval: 300, loop: true },
};
```

## 实现注意事项

1. **性能优化**：像素帧数据应预加载并缓存，避免每帧重新解析
2. **动画流畅性**：使用 `useNativeDriver: true` 驱动位置动画，帧切换保持在 JS 线程
3. **内存管理**：大量帧数据应按需加载，不使用的状态帧应释放
4. **向后兼容**：保留 PetLottie 组件作为降级方案，通过 feature flag 切换
5. **测试策略**：为像素渲染器编写单元测试，验证帧数据正确性

## 设计风格

采用复古像素艺术风格，参考 8-bit/16-bit 游戏时代的视觉语言。整体风格应呈现清晰硬朗的像素边界、有限调色盘、逐帧动画效果。

## 页面规划

本次迭代主要涉及宠物空间页面的重构，不新增页面。

## 像素小人设计

### 尺寸规格

- 基础尺寸：16x24 像素格
- 渲染尺寸：每格 8x8 物理像素（可缩放）
- 装饰品尺寸：16x16 像素格

### 状态视觉

| 状态 | 身体颜色 | 眼睛 | 嘴巴 | 特效 |
| --- | --- | --- | --- | --- |
| dying | #747d8c 灰色 | X形 | 平线 | 灰色烟雾 |
| dehydrated | #ffa502 橙色 | 横线 | 波浪 | 汗滴 |
| normal | #4FC3F7 蓝色 | 圆点 | 小弧 | 无 |
| good | #2ed573 绿色 | 圆点 | 微笑 | 无 |
| happy | #00e676 亮绿 | 弧形 | 大笑 | 星星 |
| overflow | #a55eea 紫色 | 大圆 | 张嘴 | 水滴 |


### 动画帧数

- dying: 2帧，400ms/帧，颤抖效果
- dehydrated: 2帧，350ms/帧，蹒跚效果
- normal: 2帧，500ms/帧，呼吸效果
- good: 2帧，400ms/帧，轻微摆动
- happy: 4帧，200ms/帧，跳跃舞蹈
- overflow: 2帧，300ms/帧，漂浮效果

## 场景互动设计

### 可交互元素

1. **窗户**：点击切换白天/黑夜，影响整体色调
2. **绿植**：点击触发生长动画，叶子摇摆
3. **杯子**：点击触发小人喝水动作
4. **电脑**：点击触发小人工作动画
5. **画框**：点击随机更换画框内容

### 反馈效果

- 点击时元素轻微放大
- 触发小人对应动作
- 播放简短音效（可选）

## Agent Extensions

### Skill

- **ui-ux-pro-max**
- Purpose: 优化像素风格 UI 组件设计，确保视觉一致性和用户体验
- Expected outcome: 生成像素风格的组件规范和交互设计文档

### SubAgent

- **code-explorer**
- Purpose: 深入分析现有 PetCharacter 和 PixelScene 组件的实现细节，识别重构风险点
- Expected outcome: 输出组件依赖关系图和重构影响范围分析