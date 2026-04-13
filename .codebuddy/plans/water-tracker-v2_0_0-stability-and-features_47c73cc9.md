---
name: water-tracker-v2.0.0-stability-and-features
overview: 修复潜在闪退风险，实现声音反馈、主题切换、自定义按钮功能
todos:
  - id: fix-pixel-sprite-crash
    content: 修复 PixelSprite.tsx 空值检查和数组验证，防止 frame 为 undefined/null 时崩溃
    status: completed
  - id: fix-pixel-animation-crash
    content: 修复 PixelAnimation.tsx 安全访问，防止 frames 为空数组时崩溃
    status: completed
  - id: fix-pet-character-crash
    content: 修复 PetCharacter.tsx 默认值处理，防止装饰品/状态不存在时崩溃
    status: completed
  - id: fix-pixel-scene-crash
    content: 修复 PixelScene.tsx 边界检查，防止 width 为 0 时除零错误
    status: completed
  - id: add-types-v2
    content: 在 src/types/index.ts 新增 AppTheme、ThemeColors、QuickButton 类型定义
    status: completed
    dependencies:
      - fix-pixel-sprite-crash
      - fix-pixel-animation-crash
      - fix-pet-character-crash
      - fix-pixel-scene-crash
  - id: add-haptics-util
    content: 创建 src/utils/haptics.ts 振动反馈封装，支持轻触/成功/错误/警告反馈
    status: completed
    dependencies:
      - add-types-v2
  - id: add-theme-util
    content: 创建 src/utils/theme.ts 主题配置和切换逻辑，支持深色/浅色/跟随系统
    status: completed
    dependencies:
      - add-types-v2
  - id: update-storage-defaults
    content: 更新 src/utils/storage.ts DEFAULT_SETTINGS，新增主题和自定义按钮默认值
    status: completed
    dependencies:
      - add-types-v2
  - id: create-theme-context
    content: 创建 src/contexts/ThemeContext.tsx 主题上下文提供者
    status: completed
    dependencies:
      - add-theme-util
      - update-storage-defaults
  - id: integrate-haptics-home
    content: 更新 HomeScreen.tsx，集成振动反馈到快捷按钮和目标完成
    status: completed
    dependencies:
      - add-haptics-util
  - id: add-custom-buttons
    content: 更新 HomeScreen.tsx，支持自定义快捷按钮渲染和管理
    status: completed
    dependencies:
      - update-storage-defaults
  - id: add-theme-settings
    content: 更新 SettingsScreen.tsx，添加主题切换开关和自定义按钮配置入口
    status: completed
    dependencies:
      - create-theme-context
  - id: wrap-theme-provider
    content: 更新 src/index.tsx，包裹 ThemeProvider
    status: completed
    dependencies:
      - create-theme-context
  - id: update-roadmap-v2
    content: 更新 ROADMAP.md，记录 v2.0.0 完成情况
    status: completed
    dependencies:
      - integrate-haptics-home
      - add-custom-buttons
      - add-theme-settings
---

## 产品概述

WaterTracker v2.0.0 版本迭代，在 v1.4.0 像素风格重构基础上，修复潜在闪退风险并实现三大新功能。

## 核心需求

### 1. 稳定性修复（高优先级）

修复 v1.4.0 引入的潜在闪退风险点：

- PixelSprite.tsx: frame 为 undefined/null 时崩溃
- PixelAnimation.tsx: frames 为空数组或 undefined 时崩溃
- PetCharacter.tsx: 装饰品 ID 或 state 不存在时崩溃
- PixelScene.tsx: width 为 0 时除零错误

### 2. 新功能实现

**声音/振动反馈**

- 点击快捷按钮时播放振动反馈
- 完成目标时播放庆祝振动
- 使用 expo-haptics（轻量级，已内置）

**主题切换功能**

- 支持深色/浅色主题切换
- 保存用户主题偏好
- 动态切换调色盘颜色
- 状态栏颜色跟随主题

**自定义快捷按钮**

- 允许用户自定义快捷添加按钮的容量
- 支持添加/删除/排序按钮
- 保存自定义配置到 AsyncStorage

### 3. 兼容性保证

- UserSettings 新增字段提供默认值
- 旧版本数据自动迁移
- 保持向后兼容

## 技术栈

- **框架**：Expo SDK 55 + React Native 0.83.4 + TypeScript (strict mode)
- **振动反馈**：expo-haptics（Expo 内置，无需额外安装）
- **数据持久化**：AsyncStorage
- **图形渲染**：react-native-svg 15.15.3

## 实现方案

### 1. 稳定性修复方案

**PixelSprite.tsx 防御性编程**

```typescript
// 添加空值检查和默认值
const { width, height } = useMemo(() => {
  if (!frame || !Array.isArray(frame) || frame.length === 0) {
    return { width: 0, height: 0 };
  }
  return {
    height: frame.length,
    width: frame[0]?.length ?? 0,
  };
}, [frame]);
```

**PixelAnimation.tsx 安全访问**

```typescript
// 添加帧数组验证
const currentFrame: PixelFrame = useMemo(() => {
  if (!animation?.frames || animation.frames.length === 0) {
    return [[]]; // 返回空帧
  }
  return animation.frames[frameIndex] ?? animation.frames[0] ?? [[]];
}, [animation, frameIndex]);
```

**PetCharacter.tsx 默认值处理**

```typescript
// 装饰品和动画默认值
const decorationSprites = DECORATION_SPRITES[decoration.id] ?? [];
const currentAnimation = PET_ANIMATIONS[state] ?? PET_ANIMATIONS.normal;
```

**PixelScene.tsx 边界检查**

```typescript
// 防止除零错误
const scale = Math.max(width, 1) / 400;
const pixelSize = Math.max(2, Math.floor(unit / 2));
```

### 2. 声音/振动反馈方案

使用 expo-haptics（轻量级，已内置在 Expo SDK 中）：

- 点击按钮：`Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)`
- 完成目标：`Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)`
- 错误提示：`Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)`

### 3. 主题切换方案

**主题配置结构**

```typescript
type AppTheme = 'dark' | 'light' | 'system';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  accent: string;
  border: string;
}

const THEMES: Record<AppTheme, ThemeColors> = {
  dark: { background: '#1a1a2e', card: '#2d2d44', ... },
  light: { background: '#f5f5f5', card: '#ffffff', ... },
  system: null, // 跟随系统
};
```

### 4. 自定义快捷按钮方案

**数据结构**

```typescript
interface QuickButton {
  id: string;
  amount: number;
  order: number;
}

// UserSettings 新增字段
customQuickButtons: QuickButton[];
```

## 架构设计

```
src/
├── types/
│   └── index.ts                 # [MODIFY] 新增 Theme、QuickButton 类型
├── utils/
│   ├── storage.ts               # [MODIFY] 新增默认主题和按钮配置
│   ├── theme.ts                 # [NEW] 主题配置和切换逻辑
│   ├── haptics.ts               # [NEW] 振动反馈封装
│   └── spriteFrames.ts          # [MODIFY] 支持主题调色盘
├── components/
│   ├── pixel/
│   │   ├── PixelSprite.tsx      # [MODIFY] 添加防御性检查
│   │   └── PixelAnimation.tsx   # [MODIFY] 添加安全访问
│   ├── PetCharacter.tsx         # [MODIFY] 添加默认值处理
│   └── PixelScene.tsx           # [MODIFY] 添加边界检查
├── contexts/
│   └── ThemeContext.tsx         # [NEW] 主题上下文
├── screens/
│   ├── HomeScreen.tsx           # [MODIFY] 自定义按钮 + 振动反馈
│   └── SettingsScreen.tsx       # [MODIFY] 主题切换 + 按钮配置
└── hooks/
    └── useWaterTracker.ts       # [KEEP] 核心状态管理
```

## 目录结构

```
d:\vibeCoding\water-tracker\src\
├── types/
│   └── index.ts                 # [MODIFY] 新增 AppTheme、ThemeColors、QuickButton 类型定义
├── utils/
│   ├── storage.ts               # [MODIFY] DEFAULT_SETTINGS 新增 theme、hapticFeedbackEnabled、customQuickButtons
│   ├── theme.ts                 # [NEW] 主题配置（深色/浅色调色盘）、主题切换函数、useTheme hook
│   ├── haptics.ts               # [NEW] 振动反馈封装（轻触、成功、错误、警告）
│   ├── spriteFrames.ts          # [MODIFY] 支持主题调色盘切换
│   └── sceneElements.ts         # [MODIFY] 场景元素调色盘支持主题
├── components/
│   ├── pixel/
│   │   ├── PixelSprite.tsx      # [MODIFY] 添加 frame 空值检查、数组验证
│   │   └── PixelAnimation.tsx   # [MODIFY] 添加 frames 安全访问、空数组保护
│   ├── PetCharacter.tsx         # [MODIFY] DECORATION_SPRITES/PET_ANIMATIONS 默认值处理
│   └── PixelScene.tsx           # [MODIFY] width/height 边界检查、除零保护
├── contexts/
│   └── ThemeContext.tsx         # [NEW] 主题上下文提供者、主题状态管理
├── screens/
│   ├── HomeScreen.tsx           # [MODIFY] 自定义快捷按钮渲染、振动反馈集成
│   └── SettingsScreen.tsx       # [MODIFY] 主题切换开关、自定义按钮配置入口
└── index.tsx                    # [MODIFY] 包裹 ThemeProvider
```

## 实现注意事项

1. **防御性编程**：所有像素组件添加空值检查和默认值
2. **性能优化**：振动反馈使用原生驱动，不阻塞 UI
3. **向后兼容**：新字段提供默认值，旧数据自动合并
4. **内存管理**：主题切换时释放旧调色盘引用
5. **测试策略**：边界值测试（空数组、undefined、0 值）

## Agent Extensions

### Skill

- **ui-ux-pro-max**
- Purpose: 优化主题切换 UI 设计，确保深色/浅色主题的视觉一致性
- Expected outcome: 生成主题调色盘规范和切换动画设计

### SubAgent

- **code-explorer**
- Purpose: 深入分析现有组件的边界情况，识别更多潜在闪退点
- Expected outcome: 输出完整的边界情况清单和修复建议