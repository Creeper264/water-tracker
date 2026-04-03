# APK 构建指南

本文档记录 Water Tracker 应用的本地 APK 打包流程。

## 环境要求

### 必需环境变量
- `JAVA_HOME` - JDK 17 或更高版本
- `ANDROID_HOME` - Android SDK 路径
- `PATH` - 包含 JDK/bin 和 Android SDK/platform-tools

### 验证环境
```bash
echo $JAVA_HOME
echo $ANDROID_HOME
java -version
```

## 构建命令

### 本地构建 Release APK
```bash
npm run apk:release
```

或直接执行：
```bash
cd android && gradlew.bat assembleRelease
```

### 构建输出
APK 文件位置：
```
android/app/build/outputs/apk/release/app-release.apk
```

## 项目配置

### 应用信息
| 配置项 | 值 |
|-------|-----|
| 包名 | `com.watertracker.app` |
| 版本 | versionCode: 2, versionName: 1.3.0 |
| 架构 | React Native 新架构 + Hermes 引擎 |

### EAS 构建配置 (eas.json)
- **development**: 开发调试客户端
- **preview**: 预览版本，输出 APK 格式
- **production**: 生产版本，默认 AAB 格式

## Expo SDK 55 新架构迁移说明

### 问题背景
Expo SDK 55 强制使用 React Native 新架构（New Architecture），旧的 API 已被弃用。

### MainApplication.kt 变更

**旧代码（SDK 54 及之前）：**
```kotlin
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import expo.modules.ExpoReactHostFactory

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost by lazy {
    ExpoReactHostFactory.getDefaultReactNativeHost(
      context = applicationContext,
      packageList = PackageList(this).packages
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    // ...
  }
}
```

**新代码（SDK 55）：**
```kotlin
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import expo.modules.ExpoReactHostFactory

class MainApplication : Application(), ReactApplication {

  @Deprecated("Use reactHost instead")
  override val reactNativeHost: ReactNativeHost by lazy {
    object : ReactNativeHost(this) {
      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
      override fun getPackages(): List<ReactPackage> = PackageList(this@MainApplication).packages
      override fun getJSMainModuleName(): String = "index"
    }
  }

  override val reactHost: ReactHost by lazy {
    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages
    )
  }

  override fun onCreate() {
    super.onCreate()
    // 不再需要 loadReactNative(this)
    // ...
  }
}
```

### 关键变化总结

| 变化项 | 旧 API | 新 API |
|-------|--------|--------|
| 主机类型 | `ReactNativeHost` | `ReactHost` |
| 工厂方法 | `getDefaultReactNativeHost()` | `getDefaultReactHost()` |
| 初始化 | `loadReactNative(this)` | 不再需要 |
| 接口实现 | 仅 `reactNativeHost` | 需同时实现 `reactNativeHost`（已弃用）和 `reactHost` |

### 常见编译错误

1. **Unresolved reference 'getDefaultReactNativeHost'**
   - 原因：SDK 55 中方法已更名
   - 解决：使用 `getDefaultReactHost()` 替代

2. **Class 'MainApplication' is not abstract and does not implement abstract member: val reactNativeHost**
   - 原因：`ReactApplication` 接口仍要求实现 `reactNativeHost`
   - 解决：添加 `@Deprecated` 标注的 `reactNativeHost` 实现

## 签名配置

### 当前状态
- Release 构建使用 debug 签名
- 可用于测试分发
- **不适用于应用商店发布**

### 生产签名配置（如需）
1. 生成正式 keystore：
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore watertracker.keystore -alias watertracker -keyalg RSA -keysize 2048 -validity 10000
   ```

2. 在 `android/app/build.gradle` 中配置：
   ```gradle
   android {
     signingConfigs {
       release {
         storeFile file('watertracker.keystore')
         storePassword 'your-store-password'
         keyAlias 'watertracker'
         keyPassword 'your-key-password'
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
       }
     }
   }
   ```

## 参考资源

- [Expo SDK 55 升级指南](https://expo.dev/blog/upgrading-to-sdk-55)
- [React Native 新架构文档](https://docs.expo.dev/guides/new-architecture/)
- [Expo Changelog](https://expo.dev/changelog/sdk-55)
