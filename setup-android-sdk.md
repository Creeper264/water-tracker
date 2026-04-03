# Android SDK 本地打包配置指南

## 方案一：安装 Android Studio（推荐）

### 1. 下载安装
- 下载地址: https://developer.android.com/studio
- 安装时选择 **Standard** 类型
- 安装路径建议默认

### 2. 配置环境变量

**Windows 环境变量设置：**

1. 右键"此电脑" → "属性" → "高级系统设置" → "环境变量"

2. 新建系统变量：
   ```
   变量名: ANDROID_HOME
   变量值: C:\Users\26406\AppData\Local\Android\Sdk
   ```

3. 编辑 Path 变量，添加：
   ```
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\emulator
   %ANDROID_HOME%\tools
   %ANDROID_HOME%\tools\bin
   ```

### 3. 安装必要组件

打开 Android Studio → Settings → Appearance & Behavior → System Settings → Android SDK

安装以下组件：
- Android SDK Platform 34 (或最新版本)
- Android SDK Build-Tools 34
- Android SDK Command-line Tools
- Android Emulator (可选)

### 4. 验证安装

打开新的终端窗口：
```bash
# 检查环境变量
echo $ANDROID_HOME

# 检查 adb
adb version

# 检查 SDK 版本
sdkmanager --list
```

---

## 方案二：仅安装命令行工具（轻量）

### 1. 下载 SDK 命令行工具
https://developer.android.com/studio#command-line-tools-only

### 2. 解压到固定目录
```
C:\android-sdk\cmdline-tools
```

### 3. 安装必要组件
```bash
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### 4. 设置环境变量
```
ANDROID_HOME=C:\android-sdk
```

---

## 打包 APK 命令

配置完成后，在项目目录执行：

```bash
# 生成 debug APK
cd android
./gradlew assembleDebug

# 生成 release APK (需要签名)
./gradlew assembleRelease

# APK 输出位置
# android/app/build/outputs/apk/debug/app-debug.apk
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 当前云构建状态

云构建失败可能是代码问题，请检查：
- https://expo.dev/accounts/0verwhe1med/projects/WaterTracker/builds

常见问题：
1. 依赖版本不兼容
2. 原生模块配置错误
3. Gradle 构建失败
