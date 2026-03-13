# AI 闹钟应用 🎤⏰

一款支持 AI 音色克隆的智能闹钟应用，无需登录，保护隐私。

## 功能特性

### ✅ 核心功能
- **闹钟设置** - 支持多个闹钟，自定义时间、标签、重复规则
- **节假日智能跳过** - 自动识别中国法定节假日，节假日不响铃
- **自定义循环** - 支持工作日、周末、自定义日期循环
- **无需登录** - 所有数据本地存储，保护隐私

### 🎤 AI 音色克隆
- **上传声音样本** - 上传 30 秒以上清晰录音
- **AI 克隆音色** - 使用 AI 学习并克隆声音特征
- **文字转语音** - 用克隆的声音生成任意文字的铃声
- **自定义铃声** - 支持上传本地音频文件

### 📱 跨平台支持
- **Android** - 支持 Android 8.0+
- **iOS** - 支持 iOS 13.0+
- **一套代码** - 使用 React Native + Expo 开发

## 技术架构

```
alarm-clock-app/
├── App.js                 # 应用入口
├── package.json           # 前端依赖
├── src/
│   ├── screens/          # 页面组件
│   │   ├── HomeScreen.js
│   │   ├── AlarmListScreen.js
│   │   ├── AddAlarmScreen.js
│   │   ├── VoiceCloneScreen.js
│   │   └── SettingsScreen.js
│   ├── components/       # 可复用组件
│   ├── services/         # API 服务
│   ├── store/           # 状态管理
│   └── utils/           # 工具函数
└── backend/             # 后端服务
    ├── server.js        # Express 服务器
    ├── package.json     # 后端依赖
    ├── routes/          # API 路由
    └── services/        # AI 服务集成
```

## 快速开始

### 1. 环境要求
- Node.js 18+
- npm 或 yarn
- Expo CLI
- Android Studio / Xcode（可选，用于真机测试）

### 2. 安装依赖

```bash
# 安装前端依赖
cd alarm-clock-app
npm install

# 安装后端依赖
cd backend
npm install
```

### 3. 配置 AI 服务（可选）

编辑 `backend/server.js`，配置你的 AI 语音服务：

```javascript
// ElevenLabs（推荐）
const ELEVENLABS_API_KEY = 'your-api-key';

// 或使用 Azure Speech、Google TTS 等
```

### 4. 启动应用

```bash
# 启动后端服务（终端 1）
cd backend
npm start

# 启动前端应用（终端 2）
cd ..
npm start
```

### 5. 运行

- **开发模式**: 扫描二维码在 Expo Go 中运行
- **Android**: `npm run android`
- **iOS**: `npm run ios`

## API 接口

### 声音克隆

```http
POST /api/voice/clone
Content-Type: multipart/form-data

{
  "audio": <audio file>
}

Response:
{
  "success": true,
  "voiceId": "uuid",
  "message": "声音克隆成功"
}
```

### 语音生成

```http
POST /api/voice/generate
Content-Type: application/json

{
  "voiceId": "uuid",
  "text": "你好，起床了"
}

Response:
{
  "success": true,
  "audioUrl": "http://localhost:3000/uploads/xxx.mp3"
}
```

### 节假日查询

```http
GET /api/holidays?year=2024

Response:
{
  "success": true,
  "data": {
    "year": 2024,
    "holidays": [...],
    "workdays": [...]
  }
}
```

## AI 服务集成

### ElevenLabs（推荐）

1. 注册账号：https://elevenlabs.io
2. 获取 API Key
3. 在 `backend/.env` 中配置：

```
ELEVENLABS_API_KEY=your-api-key
```

### 本地部署方案

如需本地部署 AI 模型，可参考：
- [Coqui TTS](https://github.com/coqui-ai/TTS)
- [VITS](https://github.com/jaywalnut310/vits)
- [Bark](https://github.com/suno-ai/bark)

## 节假日数据

节假日数据来源于中国政府网，也可使用以下 API：
- https://api.apihubs.com/holiday/
- https://github.com/LateDefine/calendar-china

## 构建发布

### Android

```bash
eas build --platform android
```

### iOS

```bash
eas build --platform ios
```

需要配置 Apple Developer 账号和证书。

## 注意事项

⚠️ **隐私说明**
- 所有闹钟数据本地存储
- 声音样本仅用于 AI 克隆
- 不上传任何个人信息到云端

⚠️ **AI 服务费用**
- ElevenLabs 免费版每月 10,000 字符
- 超出后需付费或切换服务

⚠️ **后台运行**
- Android 需要配置后台服务权限
- iOS 需要配置后台音频权限

## 开发计划

- [ ] 睡眠分析
- [ ] 智能唤醒（浅睡期唤醒）
- [ ] 天气集成
- [ ] 更多 AI 声音模型
- [ ] 小组件支持
- [ ] Apple Watch / Wear OS

## 许可证

MIT License

---

**开发者**: AI Assistant  
**版本**: 1.0.0  
**更新日期**: 2026-03-05
