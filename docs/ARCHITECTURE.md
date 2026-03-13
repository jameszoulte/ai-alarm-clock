# 系统架构设计

## 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户设备                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  React Native App                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │   首页      │  │  闹钟列表   │  │  添加闹钟   │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  │  ┌─────────────┐  ┌─────────────┐                       │   │
│  │  │  音色克隆   │  │   设置      │                       │   │
│  │  └─────────────┘  └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ HTTP/REST                        │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      后端服务 (Node.js)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Express Server                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │  声音克隆   │  │  语音生成   │  │  节假日 API  │      │   │
│  │  │  /clone     │  │  /generate  │  │  /holidays   │      │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ API Call                         │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI 语音服务                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ ElevenLabs  │  │ Azure TTS   │  │  本地模型   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## 技术栈

### 前端 (React Native)
| 技术 | 用途 |
|------|------|
| React Native | 跨平台 UI 框架 |
| Expo | 开发和构建工具 |
| AsyncStorage | 本地数据存储 |
| expo-av | 音频播放 |
| expo-notifications | 本地通知/闹钟 |
| expo-document-picker | 文件选择 |
| React Navigation | 页面导航 |
| date-fns | 日期处理 |

### 后端 (Node.js)
| 技术 | 用途 |
|------|------|
| Express | Web 服务器 |
| Multer | 文件上传 |
| Axios | HTTP 请求 |
| UUID | 唯一标识符 |

### AI 服务
| 服务 | 用途 | 备注 |
|------|------|------|
| ElevenLabs | 语音克隆和生成 | 推荐，质量高 |
| Azure Speech | 语音合成 | 备选方案 |
| Coqui TTS | 本地部署 | 免费，需自建 |

## 数据流

### 1. 设置闹钟
```
用户输入 → 验证 → 保存到 AsyncStorage → 调度通知 → 完成
```

### 2. 克隆声音
```
用户上传音频 → 后端接收 → 调用 AI 服务 → 获取 voiceId → 保存到本地 → 完成
```

### 3. 生成铃声
```
用户输入文字 → 选择克隆声音 → 调用 AI 服务 → 获取音频 URL → 下载/缓存 → 设置为铃声
```

### 4. 闹钟响铃
```
系统时间到达 → 触发通知 → 播放声音 → 用户操作 (停止/贪睡) → 完成
```

## 数据库设计

### 本地存储 (AsyncStorage)

**alarms** - 闹钟列表
```json
[
  {
    "id": "uuid",
    "time": "07:30",
    "label": "起床",
    "enabled": true,
    "repeatDays": [1, 2, 3, 4, 5],
    "skipHolidays": true,
    "soundType": "cloned",
    "selectedSound": {
      "id": "uuid",
      "name": "我的声音",
      "voiceId": "elevenlabs-voice-id"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

**alarm_settings** - 应用设置
```json
{
  "volume": 80,
  "vibrate": true,
  "snoozeEnabled": true,
  "snoozeDuration": 5,
  "autoOffEnabled": false,
  "autoOffDuration": 5
}
```

**cloned_voices** - 克隆的声音
```json
[
  {
    "id": "uuid",
    "name": "我的声音",
    "voiceId": "elevenlabs-voice-id",
    "samplePath": "/path/to/sample.mp3",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

## API 设计

### RESTful API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/voice/clone | 克隆声音 |
| POST | /api/voice/generate | 生成语音 |
| GET | /api/holidays | 获取节假日 |
| GET | /api/holidays/check | 检查日期 |

### 请求/响应示例

**克隆声音**
```http
POST /api/voice/clone
Content-Type: multipart/form-data

[audio file]
```

```json
{
  "success": true,
  "voiceId": "xxx",
  "message": "克隆成功"
}
```

**生成语音**
```http
POST /api/voice/generate
Content-Type: application/json

{
  "voiceId": "xxx",
  "text": "你好"
}
```

```json
{
  "success": true,
  "audioUrl": "http://localhost:3000/uploads/xxx.mp3"
}
```

## 安全考虑

1. **本地存储加密** - 敏感数据使用 AsyncStorage + 加密
2. **API 认证** - 后端 API 需要 token 验证（可选）
3. **文件上传限制** - 限制文件大小和类型
4. **HTTPS** - 生产环境使用 HTTPS
5. **隐私保护** - 不上传用户个人信息

## 性能优化

1. **节假日数据缓存** - 24 小时缓存，减少 API 调用
2. **音频文件缓存** - 生成的音频本地缓存
3. **懒加载** - 按需加载组件和资源
4. **后台任务优化** - 使用 Expo TaskManager 处理后台任务

## 扩展性

### 未来功能
- [ ] 睡眠监测和智能唤醒
- [ ] 天气集成
- [ ] 音乐平台集成
- [ ] 多人共享闹钟
- [ ] 云端备份和同步
- [ ] 小组件支持

### 可扩展的 AI 服务
```javascript
// 服务适配器模式
class VoiceService {
  async clone(audio) { /* ... */ }
  async generate(voiceId, text) { /* ... */ }
}

// 支持多种后端
class ElevenLabsService extends VoiceService { /* ... */ }
class AzureService extends VoiceService { /* ... */ }
class LocalService extends VoiceService { /* ... */ }
```
