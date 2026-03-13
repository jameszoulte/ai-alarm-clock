# 中国用户专属指南 🇨🇳

## 📱 Expo Go 国内下载方式

### 方式 1：直接下载 APK（推荐）

**Expo Go Android APK 直链：**

```
https://dl.expo.dev/expo-sdk/expo-go-apk/latest/expo-go.apk
```

或访问官方下载页：
```
https://expo.dev/go
```

用手机浏览器打开，直接下载 APK 安装即可。

### 方式 2：通过国内应用商店

部分应用商店有收录：
- **酷安**：搜索 "Expo Go"
- **豌豆荚**：搜索 "Expo Go"
- **应用宝**：搜索 "Expo Go"

> ⚠️ 注意：应用商店版本可能更新不及时，建议用官方 APK

### 方式 3：iOS 用户

iOS 用户需要 Apple ID（美区/港区）：
- App Store 搜索 "Expo Go"
- 或直接访问：https://apps.apple.com/app/expo-go/id982107779

---

## 🌐 Expo 官网访问问题

如果访问 https://expo.dev 慢或打不开：

### 解决方案 1：使用 GitHub 账号快捷登录

1. 访问：https://github.com/login
2. 登录 GitHub（国内可访问）
3. 然后访问：https://expo.dev/login/github
4. 授权后即可登录 Expo

### 解决方案 2：使用加速工具

- **Watt Toolkit** (原 Steam++): https://steampp.net/
- **Clash** 等代理工具

### 解决方案 3：等待网络好转

Expo 官网有时能直接访问，多试几次。

---

## 🚀 国内构建 APK 的替代方案

如果 Expo 官网实在无法访问，可以用以下方案：

### 方案 A：本地构建（无需 Expo 账号）

```bash
# 1. 安装依赖
cd /home/admin/.openclaw/workspace/alarm-clock-app
npm install

# 2. 预构建 Android 项目
npx expo prebuild --platform android

# 3. 进入 Android 目录
cd android

# 4. 使用 Gradle 构建 Debug APK
./gradlew assembleDebug

# 5. APK 输出位置
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

**要求：**
- 安装 Android Studio
- 配置 JAVA_HOME
- 配置 ANDROID_HOME

### 方案 B：使用国内云构建服务

- **App Center** (微软): https://appcenter.ms/
- **蒲公英**: https://www.pgyer.com/
- **fir.im**: https://fir.im/

这些服务支持上传源码自动构建。

### 方案 C：手动打包（最简单）

如果你只是想测试应用：

1. 用 Expo Go 扫码运行（无需账号）
2. 截图/录屏分享
3. 等网络好时再构建 APK

---

## 📦 国内 Node.js 镜像加速

如果 npm install 慢，使用淘宝镜像：

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 然后安装依赖
npm install

# 验证
npm config get registry
# 应输出：https://registry.npmmirror.com/
```

---

## 🔧 完整本地开发流程（无需 Expo 账号）

### 1. 配置 npm 镜像

```bash
npm config set registry https://registry.npmmirror.com
```

### 2. 安装依赖

```bash
cd /home/admin/.openclaw/workspace/alarm-clock-app
npm install
```

### 3. 启动开发服务器

```bash
npm start
```

### 4. 手机安装 Expo Go

下载：https://dl.expo.dev/expo-sdk/expo-go-apk/latest/expo-go.apk

### 5. 扫码运行

- 终端显示二维码
- 用 Expo Go 扫描
- 应用立即运行！

**全程无需 Expo 账号！**

---

## 📞 国内开发者资源

- **Expo 中文文档**: https://docs.expo.dev/ (部分翻译)
- **React Native 中文网**: https://reactnative.cn/
- **Expo 知乎专栏**: 搜索 "Expo"
- **B 站教程**: 搜索 "Expo React Native"

---

## ⚡ 快速命令参考

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 安装依赖
npm install

# 启动开发服务器
npm start

# 查看本机 IP（用于手动输入地址连接）
ifconfig | grep "inet "

# 手动连接（如果扫码失败）
# 在 Expo Go 中输入：http://你的IP:8081
```

---

## 🆘 常见问题

### Q: Expo Go 扫码没反应？
1. 确保手机和电脑在同一 WiFi
2. 关闭防火墙或添加例外
3. 尝试手动输入地址：`http://电脑IP:8081`

### Q: 构建时下载 Gradle 很慢？
配置国内镜像，编辑 `android/build.gradle`：
```gradle
repositories {
    maven { url 'https://maven.aliyun.com/repository/google' }
    maven { url 'https://maven.aliyun.com/repository/public' }
}
```

### Q: 无法访问 expo.dev？
用 GitHub 快捷登录，或等网络好转再试。

---

## 📝 总结

**最快速的测试方式（推荐）：**

1. 下载 Expo Go APK: https://dl.expo.dev/expo-sdk/expo-go-apk/latest/expo-go.apk
2. 终端运行：`npm start`
3. 扫码运行

**无需 Expo 账号！无需 Google！无需等待！**
