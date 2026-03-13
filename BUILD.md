# AI 闹钟 - APK 构建指南

## 快速构建 APK

### 步骤 1: 安装 EAS CLI

```bash
# 如果之前没安装
npm install -g eas-cli --prefix ~/.npm-global
export PATH=$HOME/.npm-global/bin:$PATH
```

### 步骤 2: 登录 Expo 账号

```bash
eas login
```

如果没有账号，访问 https://expo.dev 注册（免费）

### 步骤 3: 配置项目

```bash
cd alarm-clock-app
eas build:configure
```

### 步骤 4: 构建 APK

```bash
# 构建内部测试版 APK（免费，速度快）
eas build --platform android --profile preview

# 或构建生产版（需要 Google Play 账号）
eas build --platform android --profile production
```

### 步骤 5: 下载 APK

构建完成后，EAS 会提供一个下载链接，例如：
```
https://expo.dev/artifacts/eas/xxxxx.apk
```

---

## 方案二：本地构建（需要 Android SDK）

### 环境要求

1. **Android Studio** - https://developer.android.com/studio
2. **Java JDK 17** - https://adoptium.net/
3. **Android SDK** - 通过 Android Studio 安装

### 构建步骤

```bash
# 1. 安装依赖
npm install

# 2. 预构建 Android 项目
npx expo prebuild --platform android

# 3. 进入 Android 目录
cd android

# 4. 使用 Gradle 构建
./gradlew assembleDebug

# 5. APK 位置
# app/build/outputs/apk/debug/app-debug.apk
```

---

## 方案三：Expo Go 即时测试（最快）

无需构建 APK，直接用 Expo Go 测试：

### 步骤

1. 手机安装 **Expo Go** App
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. 启动开发服务器
   ```bash
   npm start
   ```

3. 扫码连接
   - 终端会显示二维码
   - 用 Expo Go 扫码即可运行

---

## 方案四：使用 GitHub Actions 自动构建

创建 `.github/workflows/build.yml`：

```yaml
name: Build APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Setup EAS
        run: npm install -g eas-cli
        
      - name: Build APK
        run: eas build --platform android --profile preview --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: ./*.apk
```

---

## 常见问题

### Q: 构建失败怎么办？

检查以下配置：

1. **app.json 配置**
   ```json
   {
     "expo": {
       "android": {
         "package": "com.ai.alarmclock",
         "versionCode": 1
       }
     }
   }
   ```

2. **eas.json 配置** - 已创建

3. **网络问题** - 使用代理或稍后重试

### Q: 构建需要多久？

- 首次构建：10-20 分钟
- 后续构建：5-10 分钟（有缓存）

### Q: 免费额度是多少？

EAS Build 免费额度：
- 每月 30 个构建任务
- 每个构建最长 30 分钟

---

## 获取帮助

- EAS 文档：https://docs.expo.dev/eas/
- Expo 论坛：https://forums.expo.dev/
- 项目问题：查看控制台错误日志

---

## 快速命令参考

```bash
# 查看构建状态
eas build:list

# 取消构建
eas build:cancel <BUILD_ID>

# 查看本地构建配置
eas build:configure

# 清除缓存
eas build:cancel --all
```
