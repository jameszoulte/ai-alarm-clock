# 快速生成 APK 方案

## 方案 A：使用 EAS Cloud Build（推荐）

虽然需要 Expo 账号，但构建最简单：

```bash
cd /home/admin/.openclaw/workspace/alarm-clock-app

# 登录（用 GitHub 快捷登录）
export PATH=$HOME/.npm-global/bin:$PATH
eas login

# 构建 APK
eas build --platform android --profile preview
```

构建完成后提供下载链接，可直接分享。

---

## 方案 B：本地 Gradle 构建（无需 Expo 账号）

### 步骤 1：安装 Android Studio

下载：https://developer.android.com/studio

或使用命令行工具：
```bash
# Ubuntu/Debian
sudo apt install openjdk-17-jdk
```

### 步骤 2：预构建 Android 项目

```bash
cd /home/admin/.openclaw/workspace/alarm-clock-app
npx expo prebuild --platform android
```

### 步骤 3：使用 Gradle 构建

```bash
cd android
./gradlew assembleDebug
```

### 步骤 4：获取 APK

```
app/build/outputs/apk/debug/app-debug.apk
```

直接传到手机安装即可。

---

## 方案 C：使用 GitHub Actions（自动构建）

如果你把代码推到 GitHub，可以用 Actions 自动构建 APK。

创建 `.github/workflows/build.yml`，推送后自动构建并上传 APK。

---

## 方案 D：在线构建服务

- **Appetize.io** - 上传代码在线测试
- **Expo Snack** - https://snack.expo.dev 在线编辑运行

---

## 当前隧道连接

服务器已启动隧道模式，如果能看到隧道地址，格式应该是：
```
exp://xxx-xxx-xxx.ngrok.io
```

在 Expo Go 中输入这个地址即可连接。
