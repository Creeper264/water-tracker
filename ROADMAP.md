# WaterTracker 打包指南 & 功能路线图

> 适用版本：Expo SDK 55 · React Native 0.81.5 · EAS CLI 18.4.0 · Node 22

---

## 目录

1. [打包前准备](#1-打包前准备)
2. [方案 A：EAS 云端打包（推荐）](#2-方案-a-eas-云端打包推荐)
3. [方案 B：本地 Gradle 打包](#3-方案-b-本地-gradle-打包)
4. [版本号管理](#4-版本号管理)
5. [常见打包问题排查](#5-常见打包问题排查)
6. [功能路线图总览](#6-功能路线图总览)
7. [新功能 1：久坐提醒](#7-新功能-1久坐提醒)
8. [新功能 2：像素小人摸鱼空间](#8-新功能-2像素小人摸鱼空间)
9. [两个功能的集成顺序建议](#9-两个功能的集成顺序建议)

---

## 1. 打包前准备

### 1.1 本机环境检查

```bash
node --version        # 需要 >= 18，当前 v22.22.0 ✓
npm --version         # 需要 >= 9，当前 10.9.4 ✓
npx eas --version     # 需要 >= 18，当前 18.4.0 ✓
```

### 1.2 登录 Expo 账号

```bash
npx eas login
# 输入账号：0verwhe1med
# 确认已绑定 projectId: f234c07f-17d1-42b8-936a-66e3c0021456
```

验证登录状态：

```bash
npx eas whoami
```

### 1.3 安装/更新依赖

```bash
cd WaterTracker
npm install
```

---

## 2. 方案 A：EAS 云端打包（推荐）

EAS Build 在 Expo 服务器上编译，本机无需安装 Android SDK / JDK，
是目前最省心的方式。当前 `eas.json` 已配置三个 profile，均输出 APK。

### 2.1 三个 Profile 的区别

| Profile | 用途 | 输出 | 特点 |
|---------|------|------|------|
| `development` | 本地调试 | 含 dev client | 支持热更新、需配合 `expo start` |
| `preview` | 内部测试 | APK | 直接安装到手机，最常用 |
| `production` | 正式发布 | APK | 开启所有优化，体积最小 |

### 2.2 构建命令

**日常测试机安装（最常用）：**

```bash
npx eas build --platform android --profile preview
```

**正式发布版本：**

```bash
npx eas build --platform android --profile production
```

**本地调试版（需要先运行 `npm run start`）：**

```bash
npx eas build --platform android --profile development
```

### 2.3 构建流程说明

执行命令后，EAS 会：

1. 上传项目源码到 Expo 服务器（忽略 `node_modules`、`.expo` 等）
2. 在云端执行 `gradle assembleRelease`（约 5~15 分钟）
3. 构建成功后打印 **APK 下载链接**，也可在 [expo.dev](https://expo.dev) 后台查看

```
✓ Build finished
  APK: https://expo.dev/artifacts/eas/xxxxxxxx.apk
```

4. 用浏览器下载 APK，或扫描终端二维码直接安装

### 2.4 查看构建历史

```bash
npx eas build:list --platform android
```

---

## 3. 方案 B：本地 Gradle 打包

需要本机安装 Android Studio 和 SDK，适合需要调试原生层的场景。

### 3.1 前置要求

- Android Studio（内含 JDK 17 和 SDK）
- 环境变量 `ANDROID_HOME` 已指向 SDK 路径

验证：

```bash
echo %ANDROID_HOME%       # Windows
# 应输出类似 C:\Users\xxx\AppData\Local\Android\Sdk
```

### 3.2 生成本地原生工程

如果 `android/` 目录不完整，先重新生成：

```bash
npx expo prebuild --platform android --clean
```

> **注意**：`prebuild` 会根据 `app.json` 重新生成 `android/` 目录，
> 如果你手动改过原生代码，加 `--clean` 前先备份。

### 3.3 打包 Release APK

```bash
# Windows
npm run apk:release

# 等价于：
cd android && gradlew.bat assembleRelease
```

APK 输出位置：

```
android/app/build/outputs/apk/release/app-release.apk
```

### 3.4 安装到手机

```bash
# 手机开启 USB 调试并连接电脑
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 4. 版本号管理

每次打正式包前，在 `app.json` 中更新以下两个字段：

```jsonc
// app.json
{
  "expo": {
    "version": "1.1.0",          // 给用户看的版本号，语义化 major.minor.patch
    "android": {
      "versionCode": 2           // 整数，每次发布必须比上次大（Google Play 规则）
    }
  }
}
```

**版本号策略建议：**

| 变更类型 | version 变化 | versionCode 变化 |
|---------|------------|----------------|
| Bug 修复 | 1.0.0 → 1.0.1 | +1 |
| 新增功能 | 1.0.1 → 1.1.0 | +1 |
| 重大重构 | 1.1.0 → 2.0.0 | +1 |

---

## 5. 常见打包问题排查

### ❌ EAS 上传失败 / 网络超时

```bash
# 设置上传超时
npx eas build --platform android --profile preview --no-wait
# 先提交任务，之后在 expo.dev 后台查看结果
```

### ❌ `gradlew: command not found`（Linux/Mac）

```bash
chmod +x android/gradlew
```

### ❌ 应用安装后白屏 / 启动崩溃

通常是 Metro bundler 的 JS bundle 没有正确内嵌。确认 `app.json` 中
`"newArchEnabled": true` 与原生模块版本匹配；或尝试关闭新架构：

```jsonc
{ "expo": { "newArchEnabled": false } }
```

然后重新 `prebuild` 和打包。

### ❌ AsyncStorage 数据在新版本 APK 安装后丢失

签名不一致会导致数据被系统清除。确保每次打包使用同一个 Keystore：

```bash
# EAS 会自动管理 Keystore，不要手动生成新的
npx eas credentials   # 查看当前 Keystore 状态
```

---

## 6. 功能路线图总览

```
v1.0.0
  ✓ 今日饮水记录
  ✓ 进度圆环展示
  ✓ 周/月统计图表
  ✓ 饮水定时提醒
  ✓ AsyncStorage 持久化

v1.1.0
  ✓ 久坐提醒功能
  ✓ 连续打卡系统
  ✓ 宠物成长系统

v1.2.0
  ✓ 像素小人摸鱼空间（基础版）
  ✓ 场景背景渲染

v1.3.0
  ✓ 像素小人解锁系统
  ✓ 装饰品系统
  ✓ 宠物重命名

v1.4.0 (2026-04-13)
  ✓ 像素风格重构
    - 像素精灵帧动画系统（PixelSprite + PixelAnimation）
    - 像素装饰品组件（PixelDecoration）
    - 可交互场景元素（InteractiveElement）
    - 场景互动系统（窗户切换白天/黑夜、绿植生长、杯子喝水、电脑工作、画框切换）
    - 宠物空间页面集成 PixelScene + PetCharacter

v2.0.0 (当前版本 - 2026-04-13)
  ✓ 稳定性修复
    - PixelSprite.tsx 空值检查和数组验证
    - PixelAnimation.tsx 安全访问保护
    - PetCharacter.tsx 默认值处理
    - PixelScene.tsx 边界检查（防止除零错误）
  ✓ 声音/振动反馈
    - 创建 HapticsService 工具类
    - 快捷按钮点击振动反馈
    - 目标完成庆祝振动
  ✓ 主题切换功能
    - 深色/浅色/跟随系统三种主题
    - ThemeContext 上下文管理
    - 设置页面主题切换 UI
  ✓ 自定义快捷按钮
    - UserSettings 新增 customQuickButtons 字段
    - HomeScreen 支持自定义按钮渲染
    - 向后兼容默认按钮

v2.1.0 (下一版本)
  → 成就徽章系统
  → 年度统计与趋势分析
  → 新手引导流程
```

---

## 7. 新功能 1：久坐提醒

### 7.1 功能描述

用户长时间静坐时，App 推送通知提醒起身活动。
与饮水提醒共享通知权限体系，但独立配置、独立频道。

**核心参数（用户可配置）：**
- 提醒间隔（默认 45 分钟）
- 生效时段（默认 09:00 ~ 18:00，工作日时间）
- 是否启用（开关）

### 7.2 技术方案

使用与饮水提醒相同的 `expo-notifications` 定时通知方案，
无需陀螺仪/传感器权限，省电且稳定。

独立 Android 通知频道：`sedentary-reminders`

### 7.3 需要新增的文件和改动

**① 新增类型定义** `src/types/index.ts`：

```typescript
export interface UserSettings {
  // ... 现有字段 ...

  // 新增久坐提醒字段
  sedentaryReminderEnabled: boolean;
  sedentaryIntervalMinutes: number;   // 默认 45
  sedentaryStartHour: number;         // 默认 9
  sedentaryEndHour: number;           // 默认 18
}
```

同步更新 `src/utils/storage.ts` 中的 `DEFAULT_SETTINGS`：

```typescript
const DEFAULT_SETTINGS: UserSettings = {
  // ... 现有默认值 ...
  sedentaryReminderEnabled: false,
  sedentaryIntervalMinutes: 45,
  sedentaryStartHour: 9,
  sedentaryEndHour: 18,
};
```

**② 扩展** `src/utils/notifications.ts`：

```typescript
// 创建久坐提醒独立频道（Android）
export const setupSedentaryChannel = async (): Promise<void> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('sedentary-reminders', {
      name: '久坐提醒',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 200, 100, 200],
      lightColor: '#FF8C00',
    });
  }
};

// 调度久坐提醒（每天固定时间点）
export const scheduleSedentaryReminders = async (
  intervalMinutes: number,
  startHour: number,
  endHour: number
): Promise<void> => {
  // 先取消旧的久坐提醒（通过 identifier 前缀区分）
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('sedentary-')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }

  const totalMinutes = (endHour - startHour) * 60;
  const count = Math.floor(totalMinutes / intervalMinutes);

  for (let i = 0; i < count; i++) {
    const totalOffset = i * intervalMinutes;
    const hour = startHour + Math.floor(totalOffset / 60);
    const minute = totalOffset % 60;

    await Notifications.scheduleNotificationAsync({
      identifier: `sedentary-${hour}-${minute}`,
      content: {
        title: '久坐提醒 🧍',
        body: '已经坐了一段时间了，起来活动一下吧！顺便喝口水~',
        sound: true,
        data: { type: 'sedentary' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }
};

export const cancelSedentaryReminders = async (): Promise<void> => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.identifier.startsWith('sedentary-')) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
};
```

> **关键细节**：给每个通知加上 `identifier: 'sedentary-hh-mm'` 前缀，
> 这样取消久坐提醒时不会误删饮水提醒（目前饮水提醒没有 identifier，
> 届时也应同步补上 `water-` 前缀）。

**③ 扩展** `src/screens/SettingsScreen.tsx`：

在"通知"section 下方新增一个"久坐提醒"section，
UI 结构与饮水提醒完全对称：开关 + 间隔输入 + 时段输入 + 保存按钮。

```typescript
// SettingsScreen 新增的 handler
const handleSedentaryToggle = async (value: boolean) => {
  if (value) {
    const granted = await requestNotificationPermissions();
    if (!granted) { /* 同饮水提醒的权限拒绝处理 */ return; }
    await setupSedentaryChannel();
    await scheduleSedentaryReminders(
      parseInt(sedentaryInterval, 10) || 45,
      parseInt(sedentaryStart, 10) || 9,
      parseInt(sedentaryEnd, 10) || 18,
    );
  } else {
    await cancelSedentaryReminders();
  }
  setSedentaryEnabled(value);
  onUpdateSettings({
    sedentaryReminderEnabled: value,
    sedentaryIntervalMinutes: parseInt(sedentaryInterval, 10) || 45,
    sedentaryStartHour: parseInt(sedentaryStart, 10) || 9,
    sedentaryEndHour: parseInt(sedentaryEnd, 10) || 18,
  });
};
```

### 7.4 实现检查清单

- [ ] `UserSettings` 类型新增 4 个字段
- [ ] `DEFAULT_SETTINGS` 补充默认值
- [ ] `notifications.ts` 新增 `setupSedentaryChannel` / `scheduleSedentaryReminders` / `cancelSedentaryReminders`
- [ ] 饮水提醒的 `scheduleWaterReminders` 同步改用 `water-` identifier 前缀，避免 cancel 互相影响
- [ ] `SettingsScreen` 新增久坐提醒 section + 本地状态 + handlers
- [ ] `useEffect([settings])` 中同步新的 4 个字段到本地状态
- [ ] `app.json` 的 `plugins["expo-notifications"]` 无需改动（已有权限声明）

---

## 8. 新功能 2：像素小人摸鱼空间

### 8.1 功能描述

一个专属的"摸鱼"Tab，里面住着一个像素风格小人。
小人的状态和行为与今日饮水进度实时联动：

| 饮水进度 | 小人状态 | 行为动画 |
|---------|---------|---------|
| 0% | 💀 快渴死了 | 趴倒在地，颤抖 |
| 1% ~ 30% | 😵 严重缺水 | 拄着拐杖，蹒跚 |
| 31% ~ 60% | 😐 一般般 | 坐着发呆，偶尔打哈欠 |
| 61% ~ 90% | 😊 状态不错 | 站着摸鱼，刷手机 |
| 91% ~ 100% | 🕺 精神抖擞 | 开心跳舞 |
| 超额完成 | 🌊 水人 | 全身发光，飘起来 |

**摸鱼空间场景元素：**
- 像素风办公室背景（桌椅、窗户、绿植）
- 小人可以在场景中走动
- 点击小人触发互动（说一句话）
- 连续 N 天达成目标可解锁新表情/动作

### 8.2 技术架构

**不需要新增任何 npm 包**，完全用已有的 `react-native-svg` + 原生动画实现。

```
src/
  screens/
    PetScreen.tsx          ← 新 Tab 主页面（摸鱼空间）
  components/
    PixelSprite.tsx        ← 像素精灵渲染器（SVG 像素格子）
    PixelScene.tsx         ← 场景背景渲染器
    SpeechBubble.tsx       ← 对话气泡组件
  utils/
    petLogic.ts            ← 小人状态机 + 解锁规则
    spriteFrames.ts        ← 所有精灵帧数据（像素二维数组）
```

### 8.3 像素精灵渲染原理

像素图用纯 JS 二维数组描述，每个元素是颜色字符串或 `null`（透明）：

```typescript
// src/utils/spriteFrames.ts

const PIXEL_SIZE = 8; // 每个像素点渲染为 8x8 的正方形

// 调色盘，用单字母代替颜色码，让帧数据更易读
const PALETTE: Record<string, string> = {
  'S': '#F4C2A1', // 皮肤
  'H': '#5C3D2E', // 头发
  'C': '#4FC3F7', // 衣服（主题蓝）
  'P': '#2d2d44', // 裤子
  'E': '#333333', // 眼睛
  'M': '#E57373', // 嘴巴
  'W': '#ffffff', // 白色
  '.': null,      // 透明
};

// 小人"站立"帧（16x24 像素格）
export const FRAME_STAND: string[][] = [
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

// 渲染函数（在 PixelSprite.tsx 中使用）
// 遍历二维数组，对非 null 的格子用 <Rect> 绘制
```

`PixelSprite.tsx` 核心渲染逻辑：

```tsx
// src/components/PixelSprite.tsx
import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface PixelSpriteProps {
  frame: string[][];         // 当前帧像素数据
  palette: Record<string, string | null>;
  pixelSize?: number;        // 每格像素点大小，默认 8
  scale?: number;            // 整体缩放倍数，默认 1
}

const PixelSprite: React.FC<PixelSpriteProps> = ({
  frame,
  palette,
  pixelSize = 8,
  scale = 1,
}) => {
  const rows = frame.length;
  const cols = frame[0]?.length ?? 0;
  const ps = pixelSize * scale;

  return (
    <Svg width={cols * ps} height={rows * ps}>
      {frame.map((row, y) =>
        row.map((code, x) => {
          const color = palette[code];
          if (!color) return null;
          return (
            <Rect
              key={`${y}-${x}`}
              x={x * ps}
              y={y * ps}
              width={ps}
              height={ps}
              fill={color}
            />
          );
        })
      )}
    </Svg>
  );
};

export default PixelSprite;
```

### 8.4 帧动画驱动

用 `useRef` 保存帧索引，用 `setInterval` 驱动，组件卸载时清除定时器：

```tsx
// src/screens/PetScreen.tsx（动画核心片段）
import React, { useState, useEffect, useRef } from 'react';

const PetScreen: React.FC<{ todayLog: DailyLog | null; settings: UserSettings | null }> = ({
  todayLog, settings,
}) => {
  const goal = settings?.dailyGoal || 2000;
  const total = todayLog?.total || 0;
  const progress = Math.min(total / goal, 1);

  // 根据进度获取小人状态
  const petState = getPetState(progress); // 来自 petLogic.ts

  // 帧动画
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = ANIMATION_FRAMES[petState]; // 该状态对应的帧序列
  const frameRef = useRef(frameIndex);
  frameRef.current = frameIndex;

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex(i => (i + 1) % frames.length);
    }, 300); // 每 300ms 切一帧
    return () => clearInterval(timer);
  }, [petState, frames.length]);

  // 点击互动
  const [speech, setSpeech] = useState<string | null>(null);
  const handlePetPress = () => {
    setSpeech(getRandomSpeech(petState, progress));
    setTimeout(() => setSpeech(null), 2500);
  };

  return (
    <ScrollView style={styles.container}>
      <PixelScene />   {/* 背景：像素办公室 */}

      <TouchableOpacity onPress={handlePetPress}>
        <PixelSprite
          frame={frames[frameIndex]}
          palette={PALETTE}
          scale={3}          {/* 放大 3 倍，适合手机屏 */}
        />
      </TouchableOpacity>

      {speech && <SpeechBubble text={speech} />}

      <Text style={styles.statusText}>
        {PET_STATE_LABELS[petState]}
      </Text>
    </ScrollView>
  );
};
```

### 8.5 状态机定义

```typescript
// src/utils/petLogic.ts

export type PetState =
  | 'dying'      // 0%
  | 'dehydrated' // 1-30%
  | 'normal'     // 31-60%
  | 'good'       // 61-90%
  | 'happy'      // 91-100%
  | 'overflow';  // >100%

export const getPetState = (progress: number): PetState => {
  if (progress <= 0)    return 'dying';
  if (progress < 0.31)  return 'dehydrated';
  if (progress < 0.61)  return 'normal';
  if (progress < 0.91)  return 'good';
  if (progress <= 1.0)  return 'happy';
  return 'overflow';
};

export const PET_STATE_LABELS: Record<PetState, string> = {
  dying:      '快渴死了... 💀',
  dehydrated: '严重缺水 😵',
  normal:     '一般般，摸鱼中 😐',
  good:       '状态不错！😊',
  happy:      '精神抖擞！🕺',
  overflow:   '你是水人吗？🌊',
};

// 点击小人时的随机台词
const SPEECHES: Record<PetState, string[]> = {
  dying:      ['水... 给我水...', '求你了... 喝一口...', '*昏迷中*'],
  dehydrated: ['感觉头很晕...', '嘴巴好干...', '再不喝我要倒了'],
  normal:     ['还行吧', '摸鱼摸鱼~', '今天也是咸鱼的一天'],
  good:       ['今天表现不错！', '继续加油！', '感觉棒棒的'],
  happy:      ['完美！今天达标啦！', '开心！🎉', '明天也要加油！'],
  overflow:   ['我... 我要变成水了', '咕噜咕噜...', '喝太多了吧喂！'],
};

export const getRandomSpeech = (state: PetState, _progress: number): string => {
  const pool = SPEECHES[state];
  return pool[Math.floor(Math.random() * pool.length)];
};
```

### 8.6 导航接入

在 `src/index.tsx` 的底部 Tab 导航中新增第四个 Tab：

```tsx
// src/index.tsx

// 新增导入
import PetScreen from './screens/PetScreen';

// 在 Tab.Navigator 内新增：
<Tab.Screen
  name="Pet"
  options={{
    tabBarIcon: PetIcon,  // 文字图标：'✦' 或像素小图标
    headerTitle: '摸鱼空间',
  }}
>
  {() => <PetScreen todayLog={todayLog} settings={settings} />}
</Tab.Screen>
```

### 8.7 实现检查清单

**Phase 1 — 基础版（v1.2.0）：**

- [ ] 创建 `src/utils/spriteFrames.ts`，至少完成 3 个状态的帧动画数据
  - `normal`（坐着发呆，2 帧）
  - `good`（站立摸鱼，2 帧）
  - `happy`（跳舞，4 帧）
- [ ] 创建 `src/components/PixelSprite.tsx`（SVG 渲染器）
- [ ] 创建 `src/utils/petLogic.ts`（状态机 + 台词）
- [ ] 创建 `src/screens/PetScreen.tsx`（主页面 + 帧动画 + 点击互动）
- [ ] `src/index.tsx` 新增第四个 Tab
- [ ] `PetScreen` 通过 `useFocusEffect` 刷新 `todayLog` 进度

**Phase 2 — 增强版（v1.3.0）：**

- [ ] 创建 `src/components/PixelScene.tsx`，绘制像素风办公室背景
- [ ] 创建 `src/components/SpeechBubble.tsx`，对话气泡 + 淡入淡出动画
- [ ] 实现连续打卡系统（在 `storage.ts` 记录连续达标天数）
- [ ] 根据连续天数解锁新动作/帽子/道具
- [ ] 小人可在屏幕内左右移动（随机游走，用 `Animated.Value` 实现）

---

## 9. 两个功能的集成顺序建议

### 为什么先做久坐提醒（v1.1.0）？

1. **改动小、风险低**：主要在现有的 `notifications.ts` + `SettingsScreen` 上扩展，
   不涉及新 Tab、新组件体系，1~2 天可完成
2. **与水提醒体系完全复用**：权限申请、DAILY trigger 调度方式完全一致，
   熟悉的代码路径
3. **为小人功能铺路**：久坐提醒完成后，可以让小人在提醒触发时做一个
   "起身动作"，两个功能产生联动

### 推荐开发流程

```
Week 1
  Day 1~2 : 实现久坐提醒（notifications + settings）
  Day 3   : 测试通知、修复 identifier 前缀冲突
  Day 4   : 打 preview APK 验证真机效果

Week 2
  Day 1~2 : 绘制精灵帧数据（spriteFrames.ts），这是最耗时的创意工作
  Day 3   : 完成 PixelSprite 渲染器 + PetScreen 基础动画
  Day 4   : 点击互动 + 状态联动 + 接入导航
  Day 5   : 打 preview APK 验证，调整帧速率和像素缩放比例

Week 3
  Day 1~3 : Phase 2 增强（背景场景、解锁系统、随机游走）
  Day 4~5 : 全功能回归测试，打 production APK
```

### 两功能联动彩蛋（可选）

当久坐提醒触发 **且** 当前饮水进度 < 50% 时，
小人在摸鱼空间的气泡同时显示：

> "提醒你起来活动！顺便去喝点水，我都要渴死了！"

实现方式：在 `PetScreen` 中监听 `expo-notifications` 的
`addNotificationReceivedListener`，检查 `data.type === 'sedentary'`
触发特殊台词。

---

## 10. v1.4.0 像素风格重构记录

### 10.1 重构目标

将现有的 Circle + RadialGradient 渲染替换为真正的像素风格渲染系统，实现：
- 清晰的像素网格边界
- 逐帧跳跃式动画（无插值过渡）
- 像素风格的装饰品图形
- 与场景元素的互动反馈

### 10.2 技术实现

**新增文件：**

| 文件路径 | 功能描述 |
|---------|---------|
| `src/types/index.ts` | 新增 PixelFrame、Palette、AnimationConfig 等类型定义 |
| `src/utils/spriteFrames.ts` | 调色盘和小人各状态的帧动画数据（dying/dehydrated/normal/good/happy/overflow） |
| `src/utils/decorationSprites.ts` | 所有装饰品的像素版本数据（帽子、光环等） |
| `src/utils/sceneElements.ts` | 场景元素的像素帧数据（窗户、绿植、杯子、电脑、画框） |
| `src/components/pixel/PixelSprite.tsx` | 像素精灵渲染器，接收帧数据和调色盘，批量渲染 SVG Rect |
| `src/components/pixel/PixelAnimation.tsx` | 帧动画控制器，管理帧序列、切换间隔、循环模式 |
| `src/components/pixel/PixelDecoration.tsx` | 像素装饰品组件，支持位置偏移和独立动画 |
| `src/components/pixel/InteractiveElement.tsx` | 可交互场景元素，封装 TouchableOpacity + 像素图形 + 点击反馈动画 |

**重构文件：**

| 文件路径 | 改动描述 |
|---------|---------|
| `src/components/PetCharacter.tsx` | 替换 Circle + RadialGradient 为 PixelAnimation，替换 emoji 装饰品为 PixelDecoration |
| `src/components/PixelScene.tsx` | 添加可交互元素（窗户、绿植、杯子、电脑、画框），支持白天/黑夜切换 |
| `src/screens/PetScreen.tsx` | 集成 PixelScene 作为背景，添加 PetCharacter 作为互动元素 |

### 10.3 像素精灵系统架构

```typescript
// 核心类型定义
type PixelCode = string;           // 调色盘索引（如 'S' = 皮肤色）
type PixelFrame = PixelCode[][];   // 单帧像素数据（二维数组）
type Palette = Record<PixelCode, string | null>;  // 调色盘映射

interface AnimationConfig {
  frames: PixelFrame[];  // 帧序列
  interval: number;      // 帧间隔(ms)
  loop: boolean;         // 是否循环
}
```

**渲染原理：**
- 使用 SVG Rect 批量渲染每个像素点
- 每个 Rect 尺寸为 pixelSize × pixelSize（默认 8x8 物理像素）
- 非透明像素点才渲染（palette[code] !== null）
- 使用 React.memo 缓存静态帧，避免重复渲染

**动画驱动：**
- 使用 setInterval 驱动帧切换
- 固定帧率（8-12 FPS），无插值过渡
- 位置移动采用整数像素跳跃

### 10.4 场景互动系统

| 元素 | 交互方式 | 效果 |
|------|---------|------|
| 窗户 | 点击切换 | 白天 ↔ 黑夜，整体色调变化 |
| 绿植 | 点击触发 | 生长动画（3 帧序列） |
| 杯子 | 点击触发 | 喝水动画（水位下降） |
| 电脑 | 点击切换 | 工作动画（屏幕闪烁） |
| 画框 | 点击切换 | 随机更换画框内容（3 种图案） |

### 10.5 性能优化

- **帧数据缓存**：使用 React.memo 缓存 PixelSprite 组件
- **按需渲染**：仅渲染非透明像素点
- **内存管理**：帧数据按状态分组，未激活状态不加载
- **动画优化**：位置动画使用 useNativeDriver: true，帧切换保持在 JS 线程

### 10.6 实现检查清单

- [x] `src/types/index.ts` 新增像素相关类型定义
- [x] `src/utils/spriteFrames.ts` 定义调色盘和小人各状态帧数据
- [x] `src/components/pixel/PixelSprite.tsx` 像素精灵渲染器
- [x] `src/components/pixel/PixelAnimation.tsx` 帧动画控制器
- [x] `src/utils/decorationSprites.ts` 装饰品像素数据
- [x] `src/components/pixel/PixelDecoration.tsx` 像素装饰品组件
- [x] `src/components/PetCharacter.tsx` 重构为像素风格
- [x] `src/components/pixel/InteractiveElement.tsx` 可交互场景元素
- [x] `src/utils/sceneElements.ts` 场景元素帧数据
- [x] `src/components/PixelScene.tsx` 添加可交互元素
- [x] `src/screens/PetScreen.tsx` 集成像素组件系统
- [x] `ROADMAP.md` 更新版本记录

---

## 11. v2.0.0 稳定性修复与新功能记录

### 11.1 稳定性修复

修复 v1.4.0 引入的潜在闪退风险点，采用防御性编程模式：

**修复文件清单：**

| 文件路径 | 风险点 | 修复方案 |
|---------|-------|---------|
| `src/components/pixel/PixelSprite.tsx` | frame 为 undefined/null 时崩溃 | 添加空值检查和数组验证，返回默认值 { width: 0, height: 0 } |
| `src/components/pixel/PixelAnimation.tsx` | frames 为空数组或 undefined 时崩溃 | 添加安全访问，返回空帧 [[]] 作为默认值 |
| `src/components/PetCharacter.tsx` | DECORATION_SPRITES[id] 或 PET_ANIMATIONS[state] 不存在时崩溃 | 使用 nullish coalescing (??) 提供默认值 |
| `src/components/PixelScene.tsx` | width 为 0 时除零错误 | 添加 Math.max(width, 1) 防止除零 |

**防御性编程模式：**

```typescript
// 空值检查 + 数组验证
if (!frame || !Array.isArray(frame) || frame.length === 0) {
  return { width: 0, height: 0 };
}

// 安全访问 + 默认值
const currentAnimation = PET_ANIMATIONS[state] ?? PET_ANIMATIONS.normal ?? { frames: [[]], fps: 1, loop: true };

// 边界检查
const scale = Math.max(width, 1) / 400;
```

### 11.2 振动反馈功能

使用 expo-haptics（Expo SDK 内置）实现触觉反馈，无需额外安装依赖。

**新增文件：**

| 文件路径 | 功能描述 |
|---------|---------|
| `src/utils/haptics.ts` | 振动反馈工具类，封装 6 种反馈类型 |

**反馈类型：**

| 方法 | 用途 | 触发场景 |
|------|------|---------|
| `light()` | 轻触反馈 | 快捷按钮点击 |
| `medium()` | 中等强度 | 重要操作 |
| `heavy()` | 重度反馈 | 关键操作 |
| `success()` | 成功反馈 | 目标完成 |
| `error()` | 错误反馈 | 操作失败 |
| `warning()` | 警告反馈 | 提醒用户注意 |

**集成位置：**

- `HomeScreen.tsx`: WaterButton onPress 触发 light() 反馈
- `HomeScreen.tsx`: 目标完成时触发 success() 反馈（通过 prevTotalRef 检测）

### 11.3 主题切换功能

支持深色/浅色/跟随系统三种主题模式，使用 React Context 管理主题状态。

**新增文件：**

| 文件路径 | 功能描述 |
|---------|---------|
| `src/utils/theme.ts` | 主题配置（深色/浅色调色盘）和切换逻辑 |
| `src/contexts/ThemeContext.tsx` | 主题上下文提供者，管理主题状态和持久化 |

**主题调色盘：**

```typescript
// 深色主题
const DARK_THEME: ThemeColors = {
  background: '#1a1a2e',
  card: '#2d2d44',
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  accent: '#4FC3F7',
  border: '#3d3d5c',
};

// 浅色主题
const LIGHT_THEME: ThemeColors = {
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#1a1a2e',
  textSecondary: '#666666',
  accent: '#0288d1',
  border: '#e0e0e0',
};
```

**集成位置：**

- `src/index.tsx`: 包裹 ThemeProvider
- `src/screens/SettingsScreen.tsx`: 主题切换 UI（深色/浅色/跟随系统三个按钮）

### 11.4 自定义快捷按钮功能

允许用户自定义快捷添加按钮的容量，支持添加/删除/排序。

**数据结构：**

```typescript
interface QuickButton {
  id: string;
  amount: number;
  order: number;
}

// UserSettings 新增字段
customQuickButtons: QuickButton[];
```

**默认值处理：**

```typescript
// 获取快捷按钮列表（自定义或默认）
const quickButtons = settings?.customQuickButtons && settings.customQuickButtons.length > 0
  ? settings.customQuickButtons.sort((a, b) => a.order - b.order)
  : presets.map((amount, index) => ({ id: `default-${index}`, amount, order: index }));
```

**集成位置：**

- `src/types/index.ts`: 新增 QuickButton 类型定义
- `src/utils/storage.ts`: DEFAULT_SETTINGS 新增 customQuickButtons: []
- `src/screens/HomeScreen.tsx`: 支持自定义按钮渲染

### 11.5 向后兼容性保证

**数据迁移策略：**

- 新字段提供默认值，旧数据自动合并
- `getSettings()` 使用展开运算符合并默认值：`{ ...DEFAULT_SETTINGS, ...JSON.parse(data) }`
- 自定义按钮为空数组时使用默认预设按钮

**版本升级路径：**

```
v1.4.0 → v2.0.0
  - 自动添加 theme: 'dark'
  - 自动添加 hapticFeedbackEnabled: true
  - 自动添加 customQuickButtons: []
  - 无需用户手动迁移
```

### 11.6 实现检查清单

- [x] PixelSprite.tsx 空值检查和数组验证
- [x] PixelAnimation.tsx 安全访问保护
- [x] PetCharacter.tsx 默认值处理
- [x] PixelScene.tsx 边界检查
- [x] src/types/index.ts 新增 AppTheme、ThemeColors、QuickButton 类型
- [x] src/utils/haptics.ts 振动反馈工具类
- [x] src/utils/theme.ts 主题配置和切换逻辑
- [x] src/utils/storage.ts DEFAULT_SETTINGS 新增字段
- [x] src/contexts/ThemeContext.tsx 主题上下文提供者
- [x] HomeScreen.tsx 集成振动反馈
- [x] HomeScreen.tsx 支持自定义快捷按钮
- [x] SettingsScreen.tsx 主题切换 UI
- [x] src/index.tsx 包裹 ThemeProvider
- [x] ROADMAP.md 更新版本记录

---

*文档最后更新：WaterTracker v2.0.0 稳定性修复与新功能完成后（2026-04-13）*