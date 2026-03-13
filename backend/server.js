const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads');
const voicesDir = path.join(__dirname, 'voices');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(voicesDir)) fs.mkdirSync(voicesDir, { recursive: true });

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 限制
  fileFilter: (req, file, cb) => {
    const allowedTypes = /audio|mpeg|mp3|wav|ogg|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('仅支持音频文件'));
  },
});

// 存储克隆的声音（内存存储，生产环境应使用数据库）
const clonedVoices = new Map();

/**
 * API: 克隆声音
 * POST /api/voice/clone
 */
app.post('/api/voice/clone', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传音频文件',
      });
    }

    const voiceId = uuidv4();
    const audioPath = req.file.path;

    // TODO: 调用 AI 语音克隆服务
    // 这里可以集成 ElevenLabs、Azure Speech、或本地模型
    // 示例：使用 ElevenLabs API
    
    /*
    const elevenLabsResponse = await fetch(
      'https://api.elevenlabs.io/v1/voices/add',
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Voice ${voiceId}`,
          files: [fs.createReadStream(audioPath)],
        }),
      }
    );
    */

    // 模拟克隆过程（实际应调用 AI 服务）
    console.log(`🎤 开始克隆声音：${voiceId}`);
    console.log(`📁 音频文件：${audioPath}`);

    // 存储声音信息
    clonedVoices.set(voiceId, {
      voiceId,
      audioPath,
      createdAt: new Date().toISOString(),
      status: 'ready',
    });

    res.json({
      success: true,
      voiceId,
      message: '声音克隆成功',
    });
  } catch (error) {
    console.error('克隆失败:', error);
    res.status(500).json({
      success: false,
      message: '克隆失败：' + error.message,
    });
  }
});

/**
 * API: 生成语音
 * POST /api/voice/generate
 */
app.post('/api/voice/generate', async (req, res) => {
  try {
    const { voiceId, text } = req.body;

    if (!voiceId || !text) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：voiceId, text',
      });
    }

    const voice = clonedVoices.get(voiceId);
    if (!voice) {
      return res.status(404).json({
        success: false,
        message: '声音不存在',
      });
    }

    // TODO: 调用 AI 语音生成服务
    // 使用克隆的声音生成指定文字的音频
    
    /*
    const elevenLabsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );
    */

    // 模拟生成（实际应调用 AI 服务）
    console.log(`🔊 生成语音：${text}`);
    console.log(`🎤 使用声音：${voiceId}`);

    // 返回模拟的音频 URL
    const audioFileName = `${uuidv4()}.mp3`;
    const audioPath = path.join(voicesDir, audioFileName);
    
    // 实际应该生成音频文件，这里创建空文件作为占位
    fs.writeFileSync(audioPath, '');

    const audioUrl = `http://localhost:${PORT}/uploads/${audioFileName}`;

    res.json({
      success: true,
      audioUrl,
      message: '语音生成成功',
    });
  } catch (error) {
    console.error('生成失败:', error);
    res.status(500).json({
      success: false,
      message: '生成失败：' + error.message,
    });
  }
});

/**
 * API: 获取节假日信息
 * GET /api/holidays?year=2024
 */
app.get('/api/holidays', async (req, res) => {
  try {
    const year = req.query.year || new Date().getFullYear();

    // TODO: 调用中国政府网节假日 API 或本地缓存
    // 这里返回模拟数据
    
    const holidays = {
      year: parseInt(year),
      holidays: [
        { date: '2024-01-01', name: '元旦', type: 'holiday' },
        { date: '2024-02-10', name: '春节', type: 'holiday' },
        { date: '2024-02-11', name: '春节', type: 'holiday' },
        { date: '2024-02-12', name: '春节', type: 'holiday' },
        { date: '2024-02-13', name: '春节', type: 'holiday' },
        { date: '2024-02-14', name: '春节', type: 'holiday' },
        { date: '2024-02-15', name: '春节', type: 'holiday' },
        { date: '2024-02-16', name: '春节', type: 'holiday' },
        { date: '2024-02-17', name: '春节', type: 'holiday' },
        { date: '2024-04-04', name: '清明节', type: 'holiday' },
        { date: '2024-04-05', name: '清明节', type: 'holiday' },
        { date: '2024-04-06', name: '清明节', type: 'holiday' },
        { date: '2024-05-01', name: '劳动节', type: 'holiday' },
        { date: '2024-05-02', name: '劳动节', type: 'holiday' },
        { date: '2024-05-03', name: '劳动节', type: 'holiday' },
        { date: '2024-05-04', name: '劳动节', type: 'holiday' },
        { date: '2024-05-05', name: '劳动节', type: 'holiday' },
        { date: '2024-06-10', name: '端午节', type: 'holiday' },
        { date: '2024-09-17', name: '中秋节', type: 'holiday' },
        { date: '2024-10-01', name: '国庆节', type: 'holiday' },
        { date: '2024-10-02', name: '国庆节', type: 'holiday' },
        { date: '2024-10-03', name: '国庆节', type: 'holiday' },
        { date: '2024-10-04', name: '国庆节', type: 'holiday' },
        { date: '2024-10-05', name: '国庆节', type: 'holiday' },
        { date: '2024-10-06', name: '国庆节', type: 'holiday' },
        { date: '2024-10-07', name: '国庆节', type: 'holiday' },
      ],
      // 调休工作日
      workdays: [
        { date: '2024-02-04', name: '春节调休' },
        { date: '2024-02-18', name: '春节调休' },
        { date: '2024-04-07', name: '清明调休' },
        { date: '2024-04-28', name: '劳动节调休' },
        { date: '2024-05-11', name: '劳动节调休' },
        { date: '2024-09-14', name: '中秋调休' },
        { date: '2024-09-29', name: '国庆调休' },
        { date: '2024-10-12', name: '国庆调休' },
      ],
    };

    res.json({
      success: true,
      data: holidays,
    });
  } catch (error) {
    console.error('获取节假日失败:', error);
    res.status(500).json({
      success: false,
      message: '获取失败：' + error.message,
    });
  }
});

/**
 * API: 检查是否为节假日
 * GET /api/holidays/check?date=2024-01-01
 */
app.get('/api/holidays/check', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: '缺少日期参数',
      });
    }

    // 获取节假日数据并检查
    const year = new Date(date).getFullYear();
    const holidaysResponse = await fetch(`http://localhost:${PORT}/api/holidays?year=${year}`);
    const holidaysData = await holidaysResponse.json();
    
    const isHoliday = holidaysData.data.holidays.some(h => h.date === date);
    const isWorkday = holidaysData.data.workdays.some(w => w.date === date);

    res.json({
      success: true,
      date,
      isHoliday,
      isWorkday,
      message: isHoliday ? '今天是节假日' : isWorkday ? '今天是调休工作日' : '今天是普通工作日',
    });
  } catch (error) {
    console.error('检查失败:', error);
    res.status(500).json({
      success: false,
      message: '检查失败：' + error.message,
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`);
  console.log(`📁 上传目录：${uploadsDir}`);
  console.log(`🎤 声音目录：${voicesDir}`);
});
