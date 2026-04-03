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
v1.0.0 (当前)
  ✓ 今日饮水记录
  ✓ 进度圆环展示
  ✓ 周/月统计图表
  ✓ 饮水定时提醒
  ✓ AsyncStorage 持久化

v1.1.0 (下一版本)
  → 久坐提醒功能

v1.2.0
  → 像素小人摸鱼空间（基础版）

v1.3.0
  → 像素小人解锁系统 + 摸鱼迷你小游戏
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

*文档最后更新：WaterTracker v1.0.0 bug 修复完成后*