# Expo 账号注册和登录指南

## ✅ EAS CLI 已降级到稳定版本

已安装：`eas-cli/14.2.0`（稳定版）

---

## 📝 方式 1：网页注册（推荐）

### 步骤 1：访问 Expo 官网

打开浏览器访问：**https://expo.dev**

### 步骤 2：注册账号

1. 点击右上角 **"Sign Up"**
2. 选择注册方式：
   - **GitHub**（推荐，最快）
   - **Google**
   - **Email**

### 步骤 3：获取 Token（用于自动构建）

1. 登录后访问：https://expo.dev/settings/access-tokens
2. 点击 **"Create Access Token"**
3. 输入描述（如：EAS Build）
4. 复制 Token（只显示一次！）

### 步骤 4：使用 Token 登录

```bash
export PATH=$HOME/.npm-global/bin:$PATH
export EXPO_TOKEN=你的 token

cd /home/admin/.openclaw/workspace/alarm-clock-app
eas whoami
```

如果显示你的用户名，说明登录成功！

---

## 📝 方式 2：CLI 交互式登录

```bash
export PATH=$HOME/.npm-global/bin:$PATH

cd /home/admin/.openclaw/workspace/alarm-clock-app
eas login
```

然后按提示操作：
1. 输入邮箱或用户名
2. 输入密码
3. 完成登录

---

## 🚀 登录后构建 APK

```bash
# 配置项目
eas build:configure

# 构建 APK（约 10-20 分钟）
eas build --platform android --profile preview

# 查看构建状态
eas build:list
```

构建完成后，你会收到：
- 邮件通知
- 下载链接（类似：https://expo.dev/artifacts/eas/xxx.apk）

---

## ❌ 如果网页注册也失败

如果访问 expo.dev 也报错，可能是：

### 1. 网络问题
尝试使用代理或稍后重试

### 2. 浏览器缓存
清除缓存或使用无痕模式

### 3. 使用 GitHub 账号直接登录
如果有 GitHub 账号，直接点 "Sign in with GitHub" 最快

---

## 📱 临时方案：使用 Expo Go 测试

如果暂时无法注册，可以用 Expo Go 立即测试：

### 1. 手机安装 Expo Go
- Android: https://play.google.com/store/apps/details?id=host.exp.exponent
- iOS: https://apps.apple.com/app/expo-go/id982107779

### 2. 启动开发服务器
```bash
cd /home/admin/.openclaw/workspace/alarm-clock-app
npm install
npm start
```

### 3. 扫码运行
用 Expo Go 扫描终端的二维码

**无需注册即可测试！**

---

## 💡 常见问题

### Q: 注册时提示 "l is not a function"
这是 Expo 网站的已知问题，尝试：
1. 清除浏览器缓存
2. 使用无痕模式
3. 换个浏览器（Chrome/Edge/Firefox）
4. 使用 GitHub 快捷登录

### Q: 需要付费吗？
EAS Build 有免费额度：
- 每月 30 个构建
- 每个构建最长 30 分钟
- 对开发测试完全够用

### Q: 构建的 APK 能直接用吗？
可以！`preview` 模式构建的 APK：
- 可直接安装到 Android 手机
- 无需 Google Play
- 适合内部分发测试

---

## 📞 需要帮助？

- Expo 文档：https://docs.expo.dev/
- 社区论坛：https://forums.expo.dev/
- 状态页面：https://status.expo.dev/
